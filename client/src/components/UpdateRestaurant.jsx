import { useEffect, useState } from "react";
import restaurantFinder from "../api/restaurantFinder";
import { useNavigate, useParams } from "react-router-dom";

function UpdateRestaurant() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await restaurantFinder.get(`/${id}`);
      setName(response.data.data.restaurant.name);
      setLocation(response.data.data.restaurant.location);
      setPriceRange(response.data.data.restaurant.price_range);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await restaurantFinder.put(`/${id}`, {
      name: name,
      location: location,
      price_range: priceRange,
    });

    navigate(`/`);
  };

  return (
    <div>
      <form action="">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            id="name"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            onChange={(e) => setLocation(e.target.value)}
            value={location}
            type="text"
            id="location"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="price_range">Price Range</label>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            id="price-range"
            className="form-select my-1 mr-sm-2"
          >
            <option value="1">$</option>
            <option value="2">$$</option>
            <option value="3">$$$</option>
            <option value="4">$$$$</option>
            <option value="5">$$$$$</option>
          </select>
        </div>
        <button
          onClick={handleSubmit}
          type="submit"
          className="btn btn-primary"
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdateRestaurant;
