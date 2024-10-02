// Import PrismaClient and dotenv for environment variables
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

// Load environment variables
dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

// Universal seeder function
const seedEntities = async (entityName, data) => {
  try {
    await prisma[entityName].createMany({ data });
    console.log(`${entityName} inserted successfully.`);
  } catch (error) {
    console.error(`Error inserting ${entityName}:`, error);
  }
};

const password = "123456789";
const hashedPassword = bcrypt.hashSync(password, 10);

// Seeder for User, Restaurant, and related models
const runSeeder = async () => {
  // Connect to database
  await prisma.$connect();

  // Seed Users
  await seedEntities("user", [
    {
      name: "Test Customer",
      email: "customer@example.com",
      password: hashedPassword,
      role: "CUSTOMER",
    },
    {
      name: "Test Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
    },
    {
      name: "Test Driver",
      email: "driver@example.com",
      password: hashedPassword,
      role: "DRIVER",
    },
    {
      name: "Test Restaurant Owner",
      email: "owner@example.com",
      password: hashedPassword,
      role: "RESTAURANT_OWNER",
    },
    {
      name: "Test Restaurant Owner2",
      email: "owner2@example.com",
      password: hashedPassword,
      role: "RESTAURANT_OWNER",
    },
    {
      name: "Test Restaurant Owner3",
      email: "owner3@example.com",
      password: hashedPassword,
      role: "RESTAURANT_OWNER",
    },
    {
      name: "Test Restaurant Owner4",
      email: "owner4@example.com",
      password: hashedPassword,
      role: "RESTAURANT_OWNER",
    },
    {
      name: "Test Restaurant Owner5",
      email: "owner5@example.com",
      password: hashedPassword,
      role: "RESTAURANT_OWNER",
    },
  ]);

  // Seed Restaurants
  await seedEntities("restaurant", [
    {
      name: "Tacos Chaneb",
      description:
        "Le premier Tacos en Tunisie avec une sauce fromagère unique !",
      ownerId: 4,
      imageUrl:
        "https://www.bnina.tn/wp-content/uploads/2019/03/29541511_418021648647620_2797412707906712274_n.jpg",
    },
    {
      name: "Pizza Popolare",
      description: "Delicious italian pizzas served daily",
      ownerId: 5,
      imageUrl:
        "https://www.bnina.tn/wp-content/uploads/2018/05/Restaurant-Pizzeria-Popolare-Trattoria.jpeg",
    },
    {
      name: "Am Hbib Kafteji",
      description: "Traditionnal food ",
      ownerId: 6,
      imageUrl:
        "https://scontent.ftun10-2.fna.fbcdn.net/v/t1.6435-9/119115007_3233614170027063_479538850313669955_n.png?_nc_cat=103&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=hsmP8KIsd5YQ7kNvgE1_QHb&_nc_ht=scontent.ftun10-2.fna&_nc_gid=AZRezGSDbmP4v86OeM4g6wa&oh=00_AYDrVO37T8lbhqEz1WzSNV-uWHSjo3X3m853iXo7VDD3AA&oe=672442A9",
    },
    {
      name: "Bombay Restaurant",
      description: "The number 1 of Chawarma",
      ownerId: 7,
      imageUrl:
        "https://scontent.ftun20-1.fna.fbcdn.net/v/t1.6435-9/120468408_111846674012321_1174035007369412866_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=REXSM-d9xP0Q7kNvgGOn1v3&_nc_ht=scontent.ftun20-1.fna&oh=00_AYCq-0dsr3PFAXLEX4RvM69nD0sDxG7Dg85iPfCAU17_-A&oe=67206B86",
    },
    {
      name: "Baguette & Baguette",
      description: "Chicken and more ...",
      ownerId: 8,
      imageUrl:
        "https://scontent.ftun20-1.fna.fbcdn.net/v/t39.30808-6/316410171_5571959969561418_6148725249698738281_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=VHalWZd48XAQ7kNvgEEREIi&_nc_ht=scontent.ftun20-1.fna&_nc_gid=AmgE4FQ6Frx05aJWcRlG7AI&oh=00_AYBTJNcgmqAiGR8VJU2_KStKFNcseMYx4-Uk_mVnClTO8A&oe=66FEF3D3",
    },
  ]);

  // Seed Categories
  await seedEntities("category", [
    // Tacos Chaneb
    {
      name: "Tacos",
      restaurantId: 1,
      imageUrl:
        "https://media-cdn.tripadvisor.com/media/photo-p/1b/3e/38/dc/nuestro-tacos.jpg",
    },
    {
      name: "Burgers",
      restaurantId: 1,
      imageUrl:
        "https://www.charal.fr/wp-content/uploads/2024/01/Burger-aux-saveurs-Asiatiques-1.webp",
    },

    // Pizza Popolare
    {
      name: "Pizza",
      restaurantId: 2,
      imageUrl:
        "https://fac.img.pmdstatic.net/fit/~1~fac~2023~05~17~474f4374-13bf-4f25-bde2-77b675e6d70b.jpeg/1200x1200/quality/80/crop-from/center/margherita-julie-andrieu-revele-ses-secrets-pour-reussir-cette-pizza-napolitaine.jpeg",
    },

    // Am Hbib Kafteji
    {
      name: "Tunisian",
      restaurantId: 3,
      imageUrl:
        "https://th-thumbnailer.cdn-si-edu.com/xNIBV1_qcThhLabC4vvsiaUXGOI=/fit-in/1072x0/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/b1/c9/b1c98cf3-e91b-44ca-8354-46078c0ad26c/tunisian-fish.jpg",
    },
    {
      name: "Kafteji",
      restaurantId: 3,
      imageUrl: "https://linstant-m.tn//uploads/6959.png",
    },

    // Bombay Restaurant
    {
      name: "Indian",
      restaurantId: 4,
      imageUrl:
        "https://fgdjrynm.filerobot.com/recipes/f52067c39a3dff3caeec29c5c3bc904c7e81f596cb02bd55b8be1c41fe9f7b2b.jpg?vh=553a8c&h=800&w=800&q=60",
    },
    {
      name: "Shawarma",
      restaurantId: 4,
      imageUrl:
        "https://www.themediterraneandish.com/wp-content/uploads/2023/02/Cauliflower-Shawarma_8-500x500.jpg",
    },

    // Baguette & Baguette
    {
      name: "Sandwiches",
      restaurantId: 5,
      imageUrl:
        "https://unpeeledjournal.com/wp-content/uploads/2020/09/50371473232_3b952086a0_b-500x500.jpg",
    },
    {
      name: "Chicken",
      restaurantId: 5,
      imageUrl:
        "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2012/11/2/0/DV1510H_fried-chicken-recipe-10_s4x3.jpg.rend.hgtvcom.1280.1280.suffix/1568222255998.webp",
    },
  ]);

  // Seed MenuItems
  await seedEntities("menuItem", [
    // Tacos Chaneb
    {
      name: "Tacos Poulet",
      price: 8.5,
      categoryId: 1, // Tacos
      restaurantId: 1, // Tacos Chaneb
      imageUrl:
        "https://img.cuisineaz.com/1024x576/2019/04/17/i146583-tacos-poulet-curry.jpeg",
    },
    {
      name: "Tacos Viande Hachée",
      price: 9.0,
      categoryId: 1, // Tacos
      restaurantId: 1, // Tacos Chaneb
      imageUrl:
        "https://www.all-clad.fr/wp-content/uploads/2022/09/335-fr-TObqZchlyw.jpg",
    },
    {
      name: "Burger Fromage",
      price: 11.5,
      categoryId: 2, // Burgers
      restaurantId: 1, // Tacos Chaneb
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdp20o9NY1dVAsKfKqNUZs9XAIk5A0_ndo0A&s",
    },

    // Pizza Popolare
    {
      name: "Pizza Quatre Fromages",
      price: 13.0,
      categoryId: 3, // Pizza
      restaurantId: 2, // Pizza Popolare
      imageUrl:
        "https://www.galbani.fr/wp-content/uploads/2017/07/Pizza-4-Fromages-800x600.jpg",
    },
    {
      name: "Pizza Pepperoni",
      price: 14.0,
      categoryId: 3, // Pizza
      restaurantId: 2, // Pizza Popolare
      imageUrl:
        "https://www.simplyrecipes.com/thmb/KE6iMblr3R2Db6oE8HdyVsFSj2A=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2019__09__easy-pepperoni-pizza-lead-3-1024x682-583b275444104ef189d693a64df625da.jpg",
    },
    {
      name: "Pizza Végétarienne",
      price: 12.0,
      categoryId: 3, // Pizza
      restaurantId: 2, // Pizza Popolare
      imageUrl:
        "https://i0.wp.com/pizzabelga.com/wp-content/uploads/2018/12/alice.jpg",
    },

    // Am Hbib Kafteji
    {
      name: "Kafteji Traditionnel",
      price: 7.0,
      categoryId: 5, // Kafteji
      restaurantId: 3, // Am Hbib Kafteji
      imageUrl:
        "https://www.tunisienumerique.com/wp-content/uploads/2023/07/kafteji-1200x1200.jpg",
    },
    {
      name: "Ojja Merguez",
      price: 9.0,
      categoryId: 4, // Tunisian
      restaurantId: 3, // Am Hbib Kafteji
      imageUrl:
        "https://www.francoislambert.one/cdn/shop/articles/ojja.webp?v=1718131116",
    },
    {
      name: "Brik à l'Oeuf",
      price: 4.5,
      categoryId: 4, // Tunisian
      restaurantId: 3, // Am Hbib Kafteji
      imageUrl:
        "https://zwitafoods.com/cdn/shop/articles/Brik_4_1024x1024.png?v=1679956471",
    },

    // Bombay Restaurant
    {
      name: "Poulet Tikka",
      price: 10.0,
      categoryId: 6, // Indian
      restaurantId: 4, // Bombay Restaurant
      imageUrl:
        "https://www.letajmahal-beziers.fr/wp-content/uploads/2022/09/poulet-tikka.jpg.webp",
    },
    {
      name: "Shawarma Poulet",
      price: 7.5,
      categoryId: 7, // Shawarma
      restaurantId: 4, // Bombay Restaurant
      imageUrl:
        "https://img.passeportsante.net/1200x675/2022-11-15/shutterstock-1909114753.webp",
    },
    {
      name: "Shawarma Viande",
      price: 8.0,
      categoryId: 7, // Shawarma
      restaurantId: 4, // Bombay Restaurant
      imageUrl:
        "https://i.ytimg.com/vi/f0W3XZJH5hc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBo-MeV08g6fGvHrQJB1Q8zDfHHCA",
    },

    // Baguette & Baguette
    {
      name: "Sandwich Poulet",
      price: 6.5,
      categoryId: 8, // Sandwiches
      restaurantId: 5, // Baguette & Baguette
      imageUrl:
        "https://www.marie-hot.com/wp-content/uploads/sandwich-r%C3%A9duit.jpg",
    },
    {
      name: "Sandwich Thon",
      price: 5.5,
      categoryId: 8, // Sandwiches
      restaurantId: 5, // Baguette & Baguette
      imageUrl:
        "https://images.openfoodfacts.org/images/products/376/027/025/0143/front_fr.10.full.jpg",
    },
    {
      name: "Poulet Grillé",
      price: 9.0,
      categoryId: 9, // Chicken
      restaurantId: 5, // Baguette & Baguette
      imageUrl:
        "https://images.radio-canada.ca/v1/alimentation/recette/4x3/2881-sandwichs-poulet-asiatique.jpg",
    },
    {
      name: "Chicken Nuggets",
      price: 7.5,
      categoryId: 9, // Chicken
      restaurantId: 5, // Baguette & Baguette
      imageUrl:
        "https://www.allrecipes.com/thmb/DOhcP7hAGP_ams-a-M8A-16TeK4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/AR-161469-the-best-ever-chicken-nuggets-DDMFS-4x3-e0f5af0ce26241d888967904f66962c7.jpg",
    },
  ]);

  // Seed Orders
  await seedEntities("order", [
    {
      customerId: 1, // Test Customer
      restaurantId: 1, // Pizza Palace
      status: "PENDING",
      totalPrice: 22.5,
    },
  ]);

  // Seed OrderItems
  await seedEntities("orderItem", [
    {
      orderId: 1, // Linked to the first order
      menuItemId: 1, // Margherita Pizza
      quantity: 2,
      price: 12.5,
    },
    {
      orderId: 1, // Linked to the first order
      menuItemId: 2, // Cheeseburger
      quantity: 1,
      price: 10.0,
    },
  ]);

  // Disconnect from database
  await prisma.$disconnect();
};

// Run the seed function
runSeeder().catch((error) => {
  console.error("Error running seeder:", error);
  prisma.$disconnect();
});
