"use client"; // Ensure this runs on the client side

import Image from "next/image"; // Using Next.js Image component for better optimization
import React, { ChangeEvent, FormEvent, useState } from "react";
import swal from "sweetalert";
import logo2 from "../../assets/logo2.png"; // Import the logo (make sure the image is in the public folder or next asset directory)
import Button from "../Form/Button";
import Label from "../Form/Label";
import TextField from "../Form/TextField";
import Heading from "./Heading";

interface NewFood {
  name: string;
  price: number;
  imageUrl: string;
  category_Id: string;
}

const AddProductForm: React.FC = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Function to handle the selection of the food category
  const handleFoodType = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const categoryMap: { [key: string]: string } = {
      Pizza: "1",
      Burger: "2",
      Tunisian: "3",
      Salad: "4",
      Desserts: "5",
      Pasta: "6",
      Chicken: "7",
      Sandwich: "8",
    };
    setCategoryId(categoryMap[value]);
  };

  // Function to handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newFood: NewFood = {
      name,
      price: parseFloat(price),
      imageUrl,
      category_Id: categoryId,
    };

    fetch("/api/menu-items/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFood),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledged) {
          swal("Food Added!", "Food is added to the store!", "success");
        } else {
          swal("Unsuccessful!", "Food is not added to the store!", "error");
        }
      })
      .catch((error) => {
        swal(
          "Error!",
          "Something went wrong. Please try again later.",
          "error"
        );
      });
  };

  return (
    <div className="container w-3/4 p-4 mx-auto mt-10 bg-gray-100 rounded-lg shadow-md mr-9">
      <Heading text="Add New Product" />
      <form
        className="grid grid-cols-1 gap-6 mt-4 lg:grid-cols-2"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col space-y-3">
          <Label htmlFor="title" text="Food Title" />
          <TextField
            id="title"
            type="text"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            required
            className="px-3 py-2"
          />
          <div className="flex items-center justify-center mt-8">
            <Image
              src={logo2}
              alt="Logo"
              width={128}
              height={128}
              className="w-32 h-auto"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <Label htmlFor="price" text="Food Price" />
          <TextField
            id="price"
            type="number"
            value={price}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPrice(e.target.value)
            }
            required
            className="px-3 py-2"
          />
          <Label htmlFor="image" text="Food Image URL" />
          <TextField
            id="image"
            type="text"
            value={imageUrl}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setImageUrl(e.target.value)
            }
            required
            className="px-3 py-2"
          />
          <Label htmlFor="type" text="Select the type of food" />
          <select
            id="type"
            className="w-full px-3 py-2 transition duration-500 border border-gray-300 rounded-lg focus:outline-none ring-teal-200 focus:ring-4"
            value={categoryId}
            onChange={handleFoodType}
            title="Select the type of food"
          >
            <option value="Pizza">Pizza</option>
            <option value="Burger">Burger</option>
            <option value="Tunisian">Tunisian</option>
            <option value="Salad">Salad</option>
            <option value="Desserts">Desserts</option>
            <option value="Pasta">Pasta</option>
            <option value="Chicken">Chicken</option>
            <option value="Sandwich">Sandwich</option>
          </select>

          <div className="mt-6">
            <Button text="Add Product" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
