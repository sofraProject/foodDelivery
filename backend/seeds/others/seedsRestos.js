const bcrypt = require("bcrypt");
const { prismaConnection } = require("../../prisma/prisma");
const password = "123456789";
const hashedPassword = bcrypt.hashSync(password, 10);

const seedRestaurants = [
  // Restaurant 1
  {
    id: 1,
    name: "Le Gourmet",
    address: "12 Rue des Oliviers, Tunis",
    phoneNumber: "+216 71 123 456",
    imageUrl:
      "https://www.restoconnection.fr/wp-content/uploads/2015/02/fa%C3%A7ade-restaurant-architecture-sake-manzo-bejing.jpg",
    location: {
      type: "Point",
      coordinates: [10.16579, 36.80611], // Tunis
    },
    owner_id: 4, // Correspond à Owner 1
    categories: [
      {
        id: 1,
        name: "Italien",
        imageUrl: "https://example.com/category/italien.jpg",
      },
      {
        id: 2,
        name: "Desserts",
        imageUrl: "https://example.com/category/desserts.jpg",
      },
    ],
    menuItems: [
      {
        id: 1,
        name: "Pizza Margherita",
        imageUrl: "https://example.com/menu/pizza.jpg",
        available: true,
        price: 12.5,
        category_id: 1, // Catégorie "Italien"
      },
      {
        id: 2,
        name: "Tiramisu",
        imageUrl: "https://example.com/menu/tiramisu.jpg",
        available: true,
        price: 6.0,
        category_id: 2, // Catégorie "Desserts"
      },
    ],
  },

  // Restaurant 2
  {
    id: 2,
    name: "Chez Monastir",
    address: "45 Avenue Bourguiba, Monastir",
    phoneNumber: "+216 73 123 789",
    imageUrl:
      "https://www.createursdinterieur.com/static/4fc8ce556e777abdb2ba81b6a1f4d368/4b190/facade-restaurant-renove-architecte.jpg",
    location: {
      type: "Point",
      coordinates: [10.6347, 35.8256], // Monastir
    },
    owner_id: 5, // Correspond à Owner 2
    categories: [
      {
        id: 3,
        name: "Tunisien",
        imageUrl: "https://example.com/category/tunisien.jpg",
      },
      {
        id: 4,
        name: "Boissons",
        imageUrl: "https://example.com/category/boissons.jpg",
      },
    ],
    menuItems: [
      {
        id: 3,
        name: "Couscous Royal",
        imageUrl: "https://example.com/menu/couscous.jpg",
        available: true,
        price: 15.0,
        category_id: 3, // Catégorie "Tunisien"
      },
      {
        id: 4,
        name: "Thé à la menthe",
        imageUrl: "https://example.com/menu/the.jpg",
        available: true,
        price: 3.0,
        category_id: 4, // Catégorie "Boissons"
      },
    ],
  },

  // Restaurant 3
  {
    id: 3,
    name: "Le Coin Gourmand",
    address: "78 Rue des Palmiers, Gafsa",
    phoneNumber: "+216 76 987 654",
    imageUrl:
      "https://media-cdn.tripadvisor.com/media/photo-s/0b/22/45/43/facade-du-restaurant.jpg",
    location: {
      type: "Point",
      coordinates: [9.7489, 33.5031], // Gafsa
    },
    owner_id: 6, // Correspond à Owner 3
    categories: [
      {
        id: 5,
        name: "Grillades",
        imageUrl: "https://example.com/category/grillades.jpg",
      },
      {
        id: 6,
        name: "Vins",
        imageUrl: "https://example.com/category/vins.jpg",
      },
    ],
    menuItems: [
      {
        id: 5,
        name: "Brochette de Poulet",
        imageUrl: "https://example.com/menu/brochette.jpg",
        available: true,
        price: 18.0,
        category_id: 5, // Catégorie "Grillades"
      },
      {
        id: 6,
        name: "Vin rouge",
        imageUrl: "https://example.com/menu/vin.jpg",
        available: true,
        price: 25.0,
        category_id: 6, // Catégorie "Vins"
      },
    ],
  },

  // Restaurant 4
  {
    id: 4,
    name: "La Table d'Or",
    address: "23 Boulevard de la Liberté, Sfax",
    phoneNumber: "+216 74 654 321",
    imageUrl:
      "https://i.pinimg.com/originals/ca/01/4d/ca014dfc3a8d3b6162d9066c2ab24e2d.jpg",
    location: {
      type: "Point",
      coordinates: [9.4811, 35.5056], // Sfax
    },
    owner_id: 7, // Correspond à Owner 4
    categories: [
      {
        id: 7,
        name: "Français",
        imageUrl: "https://example.com/category/francais.jpg",
      },
      {
        id: 8,
        name: "Pâtisseries",
        imageUrl: "https://example.com/category/patisseries.jpg",
      },
    ],
    menuItems: [
      {
        id: 7,
        name: "Coq au Vin",
        imageUrl: "https://example.com/menu/coq-au-vin.jpg",
        available: true,
        price: 22.0,
        category_id: 7, // Catégorie "Français"
      },
      {
        id: 8,
        name: "Éclair au Chocolat",
        imageUrl: "https://example.com/menu/eclair.jpg",
        available: true,
        price: 5.0,
        category_id: 8, // Catégorie "Pâtisseries"
      },
    ],
  },
];

const getRandomRestaurants = (items, count) => {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const addRandomDetails = (items) => {
  return items.map((item) => {
    // Randomize price and likes slightly
    const randomPriceAdjustment = (Math.random() * 2).toFixed(2); // Random value between 0 and 2
    const randomLikesAdjustment = Math.floor(Math.random() * 5); // Random value between 0 and 5

    return {
      ...item,
      price: (item.price + parseFloat(randomPriceAdjustment)).toFixed(2),
      likes: item.likes + randomLikesAdjustment,
    };
  });
};

// Get 4 random menu items and adjust details
const randomMenuItems = getRandomRestaurants(menuItems, 4);
const updatedMenuItems = addRandomDetails(randomMenuItems);

console.log("Randomly selected items:", updatedMenuItems);

prismaConnection.menuItem
  .createMany({
    data: updatedMenuItems,
  })
  .then(() => {
    console.log("Random menu items inserted successfully.");
  })
  .catch((error) => {
    console.error("Error inserting random menu items:", error);
  });
