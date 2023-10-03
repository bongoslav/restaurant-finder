import { Request, Response } from "express";
import Restaurant from "../models/restaurant.model";
import Review from "../models/review.model";

export const getReview = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const result = await Review.findByPk(id)

    res.status(200).json({
      status: "success",
      data: {
        review: result
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
    const restaurant = await Restaurant.findByPk(req.params.id)
    if (!restaurant) {
      return res.status(404).json({
        status: "error",
        data: {
          error: "Restaurant not found!",
        },
      })
    }

    const newReview = await Review.create({
      restaurantId: Number(req.params.id),
      name: req.body.name,
      review: req.body.review,
      rating: req.body.rating,
    })

    res.status(201).json({
      status: "Success",
      data: {
        review: newReview.dataValues
      }
    }
    )
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      data: {
        error: err,
      },
    });
  }
}

export const editReview = async (req: Request, res: Response) => {
  const id = req.params.id
  const name: string = req.body.name
  const review: string = req.body.review
  const rating: number = Number(req.body.rating)

  try {
    const result = await Review.update({
      name: name,
      review: review,
      rating: rating
    },
      { where: { id: id } })

    res.status(200).json({
      status: "success",
      data: {
        review: result[0]
      }
    })
  } catch (error) {
    console.error(error);
    res.status(404).json({
      status: "error",
      data: {
        error: error,
      },
    });
  }
}

export const deleteReview = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  try {
    await Review.destroy({ where: { id: id } })
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
}