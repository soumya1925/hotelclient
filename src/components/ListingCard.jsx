import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowForwardIos, ArrowBackIosNew } from '@mui/icons-material'
import "../styles/ListingCard.scss"
import { useSelector,useDispatch } from 'react-redux'
import { setWishList } from '../redux/state'
import { Favorite } from '@mui/icons-material'

const ListingCard = ({
    listingId,
    creator,
    listingPhotoPaths,
    city,
    province,
    country,
    category,
    type,
    price,
    startDate,
    endDate,
    totalPrice,
    booking,
}) => {
    /*Slider for images */

    const[curentIndex, setCurrentIndex] = React.useState(0);
    const [popupMessage, setPopupMessage] = React.useState("");
    const gotoPrevSlide = () => {
       setCurrentIndex((prevIndex) => (prevIndex-1 +listingPhotoPaths.length) % listingPhotoPaths.length);
    }
    const gotoNextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex+1+listingPhotoPaths.length) % listingPhotoPaths.length);
     }
    

     const navigate = useNavigate();
     const dispatch = useDispatch();
     /*Add to wishList */
     const user = useSelector((state)=>state.user)
     const wishList = user?.wishList || [];
     const isLiked = wishList?.find((item) => item?._id === listingId);
     const patchWishList = async () => {
      if (!user?._id) {
        setPopupMessage("Please login or register to enable this feature.");
        return;
      }
  
      if (user?._id === creator?._id) {
        setPopupMessage("The host or owner of the property cannot add their own property to the wishlist.");
        return;
      }
        
       
  
      try {
        const response = await fetch(
          `https://hotelserver-9wlo.onrender.com/users/${user._id}/${listingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        dispatch(setWishList(data.wishList));
      } catch (err) {
        console.error("Failed to update wishlist", err.message);
      }
    };



  return (
    <div className='listing-card'
    onClick={() => {
        navigate(`/properties/${listingId}`);
      }}
    >
        <div className='slider-container'>
            <div className='slider' style={{ transform: `translateX(-${curentIndex * 100}%)`}}>
               {listingPhotoPaths.map((photo, index) => (
                   <div key={index} className='slide'>
                       <img
                           src={`https://hotelserver-9wlo.onrender.com/${photo?.replace?.("public", "") || "default.jpg"}`}
                           alt="Listing"
                       />
                       <div className="prev-button"
                       onClick={(e)=>{
                        e.stopPropagation()
                        gotoPrevSlide(e)
                    }}
                       >
                        <ArrowBackIosNew
                        sx={{ fontSize: "15px" }}
                        />

                       </div>

                       <div className="next-button"
                       onClick={(e)=>{
                        e.stopPropagation()
                        gotoNextSlide(e)
                    }}
                       >
                        <ArrowForwardIos
                        sx={{ fontSize: "15px" }}
                        />

                       </div>
                   </div>
              ) )}  
            </div>
        </div>

        

        <h3>{city},{province},{country}</h3>
        <p>{category}</p>

         {!booking ? (
        <>
          <p>{type}</p>
          <p>
            <span>${price}</span> per night
          </p>
        </>
      ) : (
        <>
          <p>
            {startDate} - {endDate}
          </p>
          <p>
            <span>${totalPrice}</span> total
          </p>
        </>
      )}

<button
        className="favorite"
        onClick={(e) => {
          e.stopPropagation();
          patchWishList();
        }}
        // disabled={!user}
      >
        {isLiked ? (
          <Favorite sx={{ color: "red" }} />
        ) : (
          <Favorite sx={{ color: "white" }} />
        )}
      </button>

      {popupMessage && (
  <div className="login-popup" onClick={(e) => e.stopPropagation()}>
    <p>{popupMessage}</p>
    <button onClick={() => setPopupMessage("")}>Close</button>
  </div>
)}

     

    </div>
  )
}


export default ListingCard