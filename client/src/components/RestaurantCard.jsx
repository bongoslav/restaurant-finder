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
    <div className="rounded-xl shadow-lg">
      <div className="p-5 flex flex-col">
        <div className="rounded-xl overflow-hidden">
          <img
            className="object-cover w-full h-full"
            onClick={() => handleRestaurantSelect(restaurant.id)}
            src={restaurant.photos[0]}
            alt={restaurant.name}
          />
        </div>
        <h5 className="text-2xl md:text-3xl font-medium mt-3">
          {restaurant.name}
        </h5>
        <p className="mb-3 font-normal text-gray-7000 text-sm md:text-base">{restaurant.location}</p>
        <p className="text-slate-500 text-base md:text-lg mt-3">Restaurants description</p>
        <div className="flex items-center my-2">
          <p className="text-yellow-400">
            {"$".repeat(restaurant.price_range)}
          </p>
          <span className="text-white">
            {renderRating(restaurant.price_range)}
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items:center md:justify-between md:space-x-2">
          <a
            onClick={(e) => handleUpdate(e, restaurant.id)}
            className="cursor-pointer text-center bg-blue-400 text-blue-700 py-2 px-4 rounded-lg
          font-semibold mt-4 hover:bg-blue-300 flex-shrink-0"
          >
            Update
          </a>

          <a
            onClick={(e) => handleDelete(e, restaurant.id)}
            className="cursor-pointer text-center bg-red-400 text-red-700 py-2 px-4 rounded-lg
          font-semibold mt-4 hover:bg-red-300 flex-shrink-0"
          >
            Delete
          </a>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
