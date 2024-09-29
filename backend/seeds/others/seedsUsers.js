const bcrypt = require("bcrypt");
const { prismaConnection } = require("../../prisma/prisma");
const password = "123456789";
const hashedPassword = bcrypt.hashSync(password, 10);

const seedUsers = [
  // Test customer
  {
    id: 1,
    name: "testUser",
    email: "testUser@example.com",
    password: hashedPassword,
    imagesUrl:
      "https://media.istockphoto.com/id/1389348844/fr/photo/plan-de-studio-dune-belle-jeune-femme-souriante-debout-sur-un-fond-gris.jpg?s=612x612&w=0&k=20&c=VGipX3a8xrbYuXTNm_61pFuzpGdAO9lwt2xnVUd7Khs=",
    balance: 100.0,
    location: {
      type: "Point",
      coordinates: [10.16579, 36.80611], // Tunis
    },
    role: "customer",
  },
  // Test admin
  {
    id: 2,
    name: "testAdmin",
    email: "testAdmin@example.com",
    password: hashedPassword,
    imagesUrl:
      "https://media.istockphoto.com/id/682897825/fr/photo/confident-businesswoman-over-gray-background.jpg?s=612x612&w=0&k=20&c=OcDGuIswfOhS21Fwg_uxb6O8MXEQK5IrjMqkguihdAk=",
    balance: 200.0,
    location: {
      type: "Point",
      coordinates: [9.7489, 33.5031], // Gafsa
    },
    role: "admin",
  },
  // Test driver
  {
    id: 3,
    name: "testDriver",
    email: "testDriver@example.com",
    password: hashedPassword,
    imagesUrl:
      "https://media.istockphoto.com/id/1171169099/fr/photo/homme-avec-les-bras-crois%C3%A9s-disolement-sur-le-fond-gris.jpg?s=612x612&w=0&k=20&c=csQeB3utGtrGeb3WmdSxRYXaJvUy_xqlhbOIZxclcGA=",
    balance: 150.0,
    location: {
      type: "Point",
      coordinates: [10.6347, 35.8256], // Monastir
    },
    role: "driver",
  },
  // Fictitious restaurant owner 1
  {
    id: 4,
    name: "Owner 1",
    email: "owner1@example.com",
    password: hashedPassword,
    imagesUrl:
      "https://www.restoconnection.fr/wp-content/uploads/2015/02/fa%C3%A7ade-restaurant-architecture-sake-manzo-bejing.jpg",
    balance: 300.0,
    location: {
      type: "Point",
      coordinates: [10.0971, 33.8815], // Djerba
    },
    role: "restaurant_owner",
  },
  // Fictitious restaurant owner 2
  {
    id: 5,
    name: "Owner 2",
    email: "owner2@example.com",
    password: hashedPassword,
    imagesUrl:
      "https://www.createursdinterieur.com/static/4fc8ce556e777abdb2ba81b6a1f4d368/4b190/facade-restaurant-renove-architecte.jpg",
    balance: 400.0,
    location: {
      type: "Point",
      coordinates: [10.6347, 35.8256], // Monastir
    },
    role: "restaurant_owner",
  },
  // Fictitious restaurant owner 3
  {
    id: 6,
    name: "Owner 3",
    email: "owner3@example.com",
    password: hashedPassword,
    imagesUrl:
      "https://media-cdn.tripadvisor.com/media/photo-s/0b/22/45/43/facade-du-restaurant.jpg",
    balance: 500.0,
    location: {
      type: "Point",
      coordinates: [9.7489, 33.5031], // Gafsa
    },
    role: "restaurant_owner",
  },
  // Fictitious restaurant owner 4
  {
    id: 7,
    name: "Owner 4",
    email: "owner4@example.com",
    password: hashedPassword,
    imagesUrl:
      "https://i.pinimg.com/originals/ca/01/4d/ca014dfc3a8d3b6162d9066c2ab24e2d.jpg",
    balance: 600.0,
    location: {
      type: "Point",
      coordinates: [9.4811, 35.5056], // Sbeitla
    },
    role: "restaurant_owner",
  },
];

prismaConnection.user
  .createMany({
    data: seedUsers,
  })
  .then(() => {
    console.log("Users inserted successfully.");
  })
  .catch((error) => {
    console.error("Error inserting users:", error);
  });
