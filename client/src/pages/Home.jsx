import AddRestaurant from "../components/AddRestaurant";
import Header from "../components/Header";
import RestaurantsList from "../components/RestaurantsList";
import Map from "../components/Map";

function Home() {
  return (
    <div className="flex flex-col w-full h-screen bg-red-300">
      <Header />
      <AddRestaurant />

      <main className="flex-grow flex flex-col md:flex-row">
        {/* Left section */}
        <div className="w-full md:w-1/2 px-4">
          <RestaurantsList />
        </div>

        {/* Right section */}
        <div className="w-full md:w-1/2">
          <Map />
        </div>
      </main>
    </div>
  );
}

export default Home;
