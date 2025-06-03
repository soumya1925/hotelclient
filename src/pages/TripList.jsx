import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";

// Optional: Replace alert with a custom modal if you prefer
const TripList = () => {
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  const userId = useSelector((state) => state.user?._id);
  const tripList = useSelector((state) => state.user?.tripList || []);

  const dispatch = useDispatch();

  const getTripList = async () => {
    try {
      if (!userId) {
        setShowAlert(true);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://hotelserver-9wlo.onrender.com/users/${userId}/trips`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      dispatch(setTripList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Trip List failed!", err.message);
    }
  };

  useEffect(() => {
    getTripList();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      {showAlert ? (
        <div className="login-alert">
          <h2>Please register or log in before  booking</h2>
        </div>
      ) : (
        <>
          <h1 className="title-list">Your Trip List</h1>
          <div className="list">
            {tripList?.map(
              ({ listingId, hostId, startDate, endDate, totalPrice, booking = true }) => (
                <ListingCard
                  key={listingId._id}
                  listingId={listingId._id}
                  creator={hostId._id}
                  listingPhotoPaths={listingId.listingPhotoPaths}
                  city={listingId.city}
                  province={listingId.province}
                  country={listingId.country}
                  category={listingId.category}
                  startDate={startDate}
                  endDate={endDate}
                  totalPrice={totalPrice}
                  booking={booking}
                />
              )
            )}
          </div>
        </>
      )}
    </>
  );
};

export default TripList;
