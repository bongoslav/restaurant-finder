import { useEffect } from "react";
import UpdateRestaurant from "../components/UpdateRestaurant";
import { useParams } from "react-router-dom";
import restaurantFinder from "../api/restaurantFinder";

function RestaurantUpdate() {
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await restaurantFinder.get(`/${id}`);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div>
      <h1 className="text-center">Update restaurant</h1>
      <UpdateRestaurant />
    </div>
  );
}

export default RestaurantUpdate;
