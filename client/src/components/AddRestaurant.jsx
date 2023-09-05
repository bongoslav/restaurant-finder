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
    <div className="container gap-3">
      <form action="" className="row g-3 align-items-center">
        <div className="col">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            type="text"
            className="form-control"
          />
        </div>
        <div className="col">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Location"
          />
        </div>
        <div className="col">
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            id="price-range"
            className="form-select my-1 mr-sm-2"
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
            className="btn btn-primary w-100"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddRestaurant;
