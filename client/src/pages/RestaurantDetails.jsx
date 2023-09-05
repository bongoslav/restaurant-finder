import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RestaurantsContext } from "../context/restaurantsContext";
import restaurantFinder from "../api/restaurantFinder";
import Reviews from "../components/Reviews";
import AddReview from "../components/AddReview";
import StarRating from "../components/StarRating";

function RestaurantDetails() {
  const { id } = useParams();
  const { selectedRestaurant, setSelectedRestaurant } =
    useContext(RestaurantsContext);
  console.log(selectedRestaurant);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await restaurantFinder.get(`/${id}`);
        setSelectedRestaurant(response.data.data);
      } catch (error) {
        console.error(error);
        alert("Something went wrong");
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <h1 className="">
        {selectedRestaurant && (
          <>
            <h1 className="text-center display-1">
              {selectedRestaurant.restaurant.name}
            </h1>
            <div className="text-center">
              <StarRating
                rating={selectedRestaurant.restaurant.average_rating}
              />
              <span className="text-warning m1-1">
                {selectedRestaurant.restaurant.count
                  ? `(${selectedRestaurant.restaurant.count})`
                  : "(0)"}
              </span>
            </div>
            <div className="mt-3">
              <Reviews reviews={selectedRestaurant.reviews} />
            </div>
            <AddReview />
          </>
        )}
      </h1>

      <div></div>
      <form action=""></form>
    </>
  );
}

export default RestaurantDetails;
