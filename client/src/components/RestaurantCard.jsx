import restaurantFinder from "../api/restaurantFinder";
import StarRating from "./StarRating";
import { RestaurantsContext } from "../context/restaurantsContext";
import { useContext } from "react";
import { useNavigate } from "react-router";

function RestaurantCard({ restaurant }) {
  const { restaurants, setRestaurants } = useContext(RestaurantsContext);
  let navigate = useNavigate();

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      restaurantFinder.delete(`/${id}`);
      setRestaurants(restaurants.filter((restaurant) => restaurant.id !== id));
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const handleUpdate = async (e, id) => {
    e.stopPropagation();
    try {
      navigate(`/restaurants/${id}/update`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const handleRestaurantSelect = (id) => {
    navigate(`/restaurants/${id}`);
  };

  const renderRating = (restaurant) => {
    if (!restaurant.count) {
      return <span className="text-warning">0 reviews</span>;
    }
    return (
      <>
        <StarRating rating={restaurant.average_rating} />
        <span className="text-warning m1-1">({restaurant.count})</span>
      </>
    );
  };

  return (
    // https://flowbite.com/docs/components/card/#horizontal-card -> add dark mode switch later
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow ">
      <img
        className="rounded"
        onClick={() => handleRestaurantSelect(restaurant.id)}
        src=""
        alt={restaurant.name}
      />
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
        {restaurant.name}
      </h5>
      <p className="mb-3 font-normal text-gray-7000">
        {restaurant.location}
      </p>
      <p className="mb-3 font-normal text-gray-700">
        Restaurants description
      </p>
      <div className="flex items-center my-2">
        <p className="text-yellow-400">{"$".repeat(restaurant.price_range)}</p>
        <span className="text-white">
          {renderRating(restaurant.price_range)}
        </span>
      </div>
      <div className="mx-8 space-x-2 max-w-lg">
        <button
          onClick={(e) => handleUpdate(e, restaurant.id)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300"
        >
          Update
        </button>

        <button
          onClick={(e) => handleDelete(e, restaurant.id)}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default RestaurantCard;
