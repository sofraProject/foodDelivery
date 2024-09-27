"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface FoodItem {
  id: number;
  name: string;
  imageUrl: string;
}

interface MenuItem {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
}
const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

const Foods: React.FC = () => {
  const [categories, setCategories] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${serverDomain}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleCategoryClick = (id: number) => {
    setSelectedCategory(id);
    fetch(`${serverDomain}/api/menu-items/cat/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data?.map((item: MenuItem) => ({
          ...item,
          price:
            typeof item.price === "number"
              ? item.price
              : parseFloat(item.price) || 0,
        }));
        setMenuItems(formattedData);
      });
  };

  const handleItemClick = (itemId: number) => {
    router.push(`/OneItemdetail/${itemId}`);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-screen-xl px-6 mx-auto my-16">
      <h2 className="mb-8 text-3xl font-bold text-gray-800">
        Explore Our Menu
      </h2>
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 p-2 transition duration-300 transform -translate-y-1/2 bg-white rounded-full shadow-md top-1/2 hover:bg-gray-100"
        >
          <FaChevronLeft className="text-gray-600" />
        </button>

        <div
          ref={scrollRef}
          className="flex p-4 space-x-6 overflow-x-scroll scroll-smooth hide-scrollbar"
        >
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer min-w-[180px] flex-shrink-0 ${
                selectedCategory === category.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="object-cover w-full h-32"
              />
              <div className="p-4">
                <h3 className="mb-1 text-lg font-semibold text-gray-800 truncate">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 p-2 transition duration-300 transform -translate-y-1/2 bg-white rounded-full shadow-md top-1/2 hover:bg-gray-100"
        >
          <FaChevronRight className="text-gray-600" />
        </button>
      </div>

      {selectedCategory && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Menu Items
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:scale-105"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="object-cover w-full h-48"
                />
                <div className="p-4">
                  <h3 className="mb-2 text-xl font-semibold text-gray-800 truncate">
                    {item.name}
                  </h3>
                  <p className="text-lg font-bold text-primary">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Foods;
