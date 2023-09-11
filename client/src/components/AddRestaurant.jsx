import { useContext, useState } from "react";
import restaurantFinder from "../api/restaurantFinder";
import { RestaurantsContext } from "../context/restaurantsContext";

function AddRestaurant() {
  const { addRestaurant } = useContext(RestaurantsContext);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("Price range");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await restaurantFinder.post("/add-restaurant", {
        name: name,
        location: location,
        price_range: priceRange,
      });

      addRestaurant(response.data.data.restaurant);
      setName("");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
      return;
    }
  };

  return (
    <form>
      <div className="grid gap-6 lg:grid-cols-5 md:grid-cols-5 sm:grid-cols-5 xs:grid-cols-1">
        <div className="col">
          <label
            htmlFor="restaurant_name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Name
          </label>
          <input
            id="restaurant_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="McDonald`s"
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="col">
          <label
            htmlFor="location"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Location
          </label>
          <input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Sofia"
          />
        </div>
        <div className="col">
          <label
            htmlFor="price_range"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Price range
          </label>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            id="price_range"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option disabled>Price range</option>
            <option value="1">$</option>
            <option value="2">$$</option>
            <option value="3">$$$</option>
            <option value="4">$$$$</option>
            <option value="5">$$$$$</option>
          </select>
        </div>
        <div className="col">
          <button
            type="submit"
            onClick={handleSubmit}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add
          </button>
        </div>
      </div>
    </form>
  );
}

export default AddRestaurant;
