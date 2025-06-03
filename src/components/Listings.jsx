import React, { use } from 'react'
import {categories} from  "../data"
import ListingCard from './ListingCard'
import Loader from './Loader'
import "../styles/Listings.scss"
import {useDispatch, useSelector} from "react-redux"
import {setListings} from "../redux/state"
import { useState,useEffect } from 'react'




export const Listings = () => {
    const dispatch = useDispatch()
    const [loading,setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const listings = useSelector((state) => state.listings);

    const getFeedListings = async () => {
        try {
            const response = await fetch(
              selectedCategory !== "All"
                ? `https://hotelserver-9wlo.onrender.com/properties?category=${selectedCategory}`
                : "https://hotelserver-9wlo.onrender.com/properties",
              {
                method: "GET",
              }
            );
      
            const data = await response.json();
            dispatch(setListings({ listings: data }));
            setLoading(false);
          } catch (err) {
            console.log("Fetch Listing Failed", err.message);
        }
    }

    useEffect(() => {
        getFeedListings();
    }, [selectedCategory]);

    console.log(listings);




  return (
   <>
   
   <div className='category-list'>
        {categories?.map((category, index) => (
            <div key={index} 
            className={`category ${category.label === selectedCategory ? "selected" : ""}`}
            onClick={() => setSelectedCategory(category.label)}
            >
               <div className='category_icon'>
                {category.icon}
               </div>
               <p>{category.label}</p>
            </div>
        ))}
    </div>
            {loading ? <Loader /> : (
             <div className="listings">
             {listings.map(
               (
                 {
                 _id,
                 creator,
                 listingPhotoPaths,
                 city,
                 province,
                 country,
                 category,
                 type,
                 price
                 
                 }) => (
                 <ListingCard
                   listingId={_id}
                   creator={creator}
                   listingPhotoPaths={listingPhotoPaths}
                   city={city}
                   province={province}
                   country={country}
                   category={category}
                   type={type}
                   price={price}
                 />
               )
             )}
           </div>
            )}
        </>
    )
}
