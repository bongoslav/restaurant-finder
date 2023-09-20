import { QueryTypes } from "sequelize";
import Restaurant from "../models/restaurant.model";
import Review from "../models/review.model"
import sequelize from "../util/db/sequelize";
import { IRestaurant, RestaurantWithReviewStats } from "../util/types";
import { Request, Response } from "express";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export const getAllRestaurantsWithReviews = async (req: Request, res: Response) => {
  try {
    const restaurantRatingData = await sequelize.query<RestaurantWithReviewStats>(
      `SELECT * FROM Restaurants
      LEFT JOIN (
        SELECT restaurant_id, COUNT(*), round(avg(rating)::numeric, 1) AS average_rating
        FROM Reviews
        GROUP BY restaurant_id
      ) Reviews ON restaurants.id = Reviews.restaurant_id;`,
      { type: QueryTypes.SELECT }
    );

    res.status(200).json({
      status: "success",
      data: {
        restaurants: restaurantRatingData,
      },
    });
  } catch (error) {
    console.error("getAllRestaurants error: ", error);
    res.status(404).json({
      status: "error",
      data: {
        error: error,
      },
    });
  }
};

export const getRestaurantWithReviews = async (req: Request, res: Response) => {
  try {
    const restaurant = await sequelize.query<IRestaurant>(
      `SELECT * FROM restaurants
      LEFT JOIN (
        SELECT restaurant_id, COUNT(*), round(avg(rating)::numeric, 1) AS average_rating
        FROM reviews
        GROUP BY restaurant_id
      ) reviews ON restaurants.id = reviews.restaurant_id
      WHERE id=$1;`,
      {
        bind: [req.params.id],
        type: QueryTypes.SELECT,
      }
    );

    // TODO: render an error page!!!
    if (restaurant.length === 0) {
      return res.status(404).json({
        status: "error",
        data: {
          error: "Restaurant not found!"
        }
      })
    }

    const reviews = await Review.findAll({
      where: { restaurant_id: req.params.id },
    })

    res.status(200).json({
      status: "success",
      data: {
        restaurant: restaurant[0],
        reviews: reviews,
      },
    });
  } catch (error) {
    // todo: error page!!!
    console.log(error);
    res.status(404).json({
      status: "error",
      data: {
        error: error,
      },
    });
  }
};

export const createRestaurant = async (req: Request, res: Response) => {
  const name: string = req.body.name;
  const location: string = req.body.location;
  const price_range: number = req.body.price_range;
  try {
    const result = await Restaurant.create({
      name: name,
      location: location,
      price_range: price_range
    })

    res.status(201).json({
      status: "success",
      data: {
        restaurant: result
      },
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      status: "error",
      data: {
        error: error,
      },
    });
  }
};

export const updateRestaurant = async (req: Request, res: Response) => {
  const name: string = req.body.name;
  const location: string = req.body.location;
  const price_range: number = req.body.price_range;
  const id: string = req.params.id;
  try {
    const result = await Restaurant.update({
      name: name,
      location: location,
      price_range: price_range
    },
      { where: { id: id } })

    res.status(200).json({
      status: "success",
      data: {
        restaurant: result[0],
      },
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      status: "error",
      data: {
        error: error,
      },
    });
  }
};

export const addCoverPhotoToRestaurant = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No photo uploaded." })

  try {
    const resultImage = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: req.file.filename }
    )
    await cloudinary.uploader.add_tag(`restaurant-id-${req.params.id}`, [resultImage.public_id])

    const restaurant = await Restaurant.findOne({ where: { id: req.params.id } });

    if (!restaurant) {
      return res.status(404).json({
        status: "Error",
        data: {
          message: `Restaurant with id: ${req.params.id} not found.`
        }
      });
    }

    const newPhotos = restaurant.photos[0] == "https://res.cloudinary.com/dq2l8rm9k/image/upload/v1694446356/hoytjqnw7kqdzqmr794o.png"
      ? [resultImage.url]
      : [...restaurant.photos, resultImage.url];

    await restaurant.update({ photos: newPhotos });

    return res.status(200).json({
      status: "Success",
      data: {
        message: `Successfully uploaded image for restaurant with id: ${req.params.id}`,
        newPhotos: restaurant.photos
      }
    });
  } catch (err) {
    return res.status(400).json(err)
  }
}

export const deleteRestaurant = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  try {
    await Restaurant.destroy({ where: { id: id } })
    // todo: delete the photo from cloudinary
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "error",
      data: {
        error: error,
      },
    });
  }
};

export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const result = Review.findAll()
    res.status(200).json({
      status: "success",
      data: {
        reviews: result
      }
    })
  } catch (error) {
    console.error("getAllReviews error: ", error);
    res.status(404).json({
      status: "error",
      data: {
        error: error,
      },
    });
  }
}

export const addReview = async (req: Request, res: Response) => {
  try {
    const newReview = await Review.create({
      restaurant_id: Number(req.params.id),
      name: req.body.name,
      review: req.body.review,
      rating: req.body.rating,
    })


    res.status(201).json({
      status: "Success",
      data: {
        review: newReview[0]
      }
    }
    )
  } catch (err) {
    console.error(err);
    res.status(404).json({
      status: "error",
      data: {
        error: err,
      },
    });
  }
}

export const getRestaurantPhotos = async (req: Request, res: Response) => {
  try {
    const photos = await Restaurant.findAll({
      attributes: ['photos'],
      where: {
        id: req.params.id
      }
    });

    return res.status(200).json({
      status: "success",
      data: {
        photos: photos
      }
    })
  } catch (err) {
    console.error(err);
    res.status(404).json({
      status: "error",
      data: {
        error: err,
      },
    });
  }
}