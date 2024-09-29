"use client";

import React from "react";
import { useSelector } from "react-redux";
import Banner from "../components/HomePage/Banner";
import Category from "../components/HomePage/Category";
import Footer from "../components/HomePage/Footer/Footer";
import HowItWorks from "../components/HomePage/HowItWorks";
import Foods from "../components/HomePage/Restos";
import Testimonials from "../components/HomePage/Testimonials";
import RestaurantList from "../components/RestaurantList";
import SearchResults from "../components/SearchResults";
import { RootState } from "../redux/store";

export const HomePage: React.FC = () => {
  const { results } = useSelector((state: RootState) => state.search);
  const hasSearchResults =
    results.menuItems.length > 0 || results.restaurants.length > 0;

  return (
    <div className="bg-gray-50">
      <Banner />
      {hasSearchResults ? (
        <SearchResults />
      ) : (
        <>
          <Foods />
          <Category />
          <HowItWorks />
          <RestaurantList />
          <Testimonials />
        </>
      )}
    </div>
  );
};

export default HomePage;
