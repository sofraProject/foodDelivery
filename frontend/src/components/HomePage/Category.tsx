"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

const CategoryCard: React.FC<{
  category: FoodItem;
  selected: boolean;
  onClick: () => void;
}> = ({ category, selected, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer min-w-[180px] flex-shrink-0 ${
      selected ? "ring-2 ring-primary" : ""
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
);

const MenuItemCard: React.FC<{ item: MenuItem; onClick: () => void }> = ({
  item,
  onClick,
}) => (
  <div
    onClick={onClick}
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
      <p className="text-lg font-bold text-primary">${item.price.toFixed(2)}</p>
    </div>
  </div>
);

const Foods: React.FC = () => {
  const [categories, setCategories] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${serverDomain}/api/categories`);
      setCategories(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch menu items based on selected category
  const fetchMenuItems = async (id: number) => {
    try {
      const response = await axios.get(
        `${serverDomain}/api/menu-items/category/${id}`
      );
      const formattedData = response.data.map((item: MenuItem) => ({
        ...item,
        price:
          typeof item.price === "number"
            ? item.price
            : parseFloat(item.price) || 0,
      }));
      setMenuItems(formattedData);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = useCallback((id: number) => {
    setSelectedCategory(id);
    fetchMenuItems(id);
  }, []);

  const handleItemClick = useCallback(
    (itemId: number) => {
      router.push(`/OneItemDetail/${itemId}`);
    },
    [router]
  );

  const scroll = useCallback((direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  }, []);

  const categoryList = useMemo(
    () =>
      categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          selected={selectedCategory === category.id}
          onClick={() => handleCategoryClick(category.id)}
        />
      )),
    [categories, selectedCategory, handleCategoryClick]
  );

  const menuItemList = useMemo(
    () =>
      menuItems.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          onClick={() => handleItemClick(item.id)}
        />
      )),
    [menuItems, handleItemClick]
  );

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
          {categoryList}
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
            {menuItemList}
          </div>
        </div>
      )}
    </section>
  );
};

export default Foods;
