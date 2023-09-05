import { useContext, useEffect } from "react";
import restaurantFinder from "../api/restaurantFinder";
import { RestaurantsContext } from "../context/restaurantsContext";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";

function RestaurantsList() {
  const { restaurants, setRestaurants } = useContext(RestaurantsContext);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await restaurantFinder.get("/");
        setRestaurants(response.data.data.restaurants);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

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
      return (
        <span className="text-warning">0 reviews</span>
      )
    }
    return (
      <>
        <StarRating rating={restaurant.average_rating} />
        <span className="text-warning m1-1">({restaurant.count})</span>
      </>
    );
  };

  return (
    <div className="columns-3xs">
      <table className="border-collapse border border-slate-500">
        <thead>
          <tr className="table-secondary">
            <th className="border border-slate-600" scope="col">restaurant</th>
            <th className="border border-slate-600"scope="col">location</th>
            <th className="border border-slate-600"scope="col">price range</th>
            <th className="border border-slate-600"scope="col">ratings</th>
            <th className="border border-slate-600"scope="col">edit</th>
            <th className="border border-slate-600"scope="col">delete</th>
          </tr>
        </thead>
        <tbody>
          {restaurants &&
            restaurants.map((restaurant) => {
              return (
                <tr
                  onClick={() => handleRestaurantSelect(restaurant.id)}
                  key={restaurant.id}
                >
                  <td>{restaurant.name}</td>
                  <td>{restaurant.location}</td>
                  <td>{"$".repeat(restaurant.price_range)}</td>
                  <td>{renderRating(restaurant)}</td>
                  <td>
                    <button
                      onClick={(e) => handleUpdate(e, restaurant.id)}
                      className="btn btn-warning hover:bg-sky-700"
                    >
                      Update
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={(e) => handleDelete(e, restaurant.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default RestaurantsList;
