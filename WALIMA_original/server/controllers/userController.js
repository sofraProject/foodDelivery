const db = require("../models/index");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.status(200).json(users);
  } catch (error) {

//+
// {"conversationId":"6ca62089-fcb7-47e9-a4e8-e7093a84913a","source":"instruct"}
    res.status(500).json({ error: error.message });
  }
};
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.User.findByPk(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.createUser = async (req, res) => {
  const { name, email, password, imagesUrl, balance, location, role } =
    req.body;
  try {
    const newUser = await db.User.create({
      name,
      email,
      password,
      imagesUrl,
      balance,
      location,
      role,
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, imagesUrl, balance, location, role } =
    req.body;
  try {
    const updatedUser = await db.User.update(
      { name, email, password, imagesUrl, balance, location, role },
      { where: { id } }
    );
    if (updatedUser[0] === 1) {
      res.status(200).json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAllUsersRestaurant = async (req, res) => {
  try {
    const users = await db.User.findAll({
      where: { role: "restaurant_owner" },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// exports.getRestaurants = async (req, res) => {
//   try {
//     const restaurants = await db.User.findAll({
//       where: { role: "restaurant_owner" },
//     });
//     console.log("Fetched restaurants:", restaurants);
//     res.status(200).json(restaurants);
//   } catch (error) {
//     console.error("Error in getRestaurants:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching restaurants", error: error.message });
//   }
// };

exports.findNearbyRestaurants = async (req, res) => {
  const { userId, radius = 1000 } = req.body;

  try {
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.role !== "customer") {
      return res.status(403).json({ error: "The user is not a customer." });
    }

    const customerLocation = user.location;
    if (!customerLocation) {
      return res.status(404).json({ error: "Customer location not found." });
    }

    const customerPoint = `POINT(${customerLocation.coordinates[0]} ${customerLocation.coordinates[1]})`;

    const nearbyRestaurants = await db.User.findAll({
      attributes: [
        "id",
        "name",
        [Sequelize.literal("ST_AsText(location)"), "location"],
        [
          Sequelize.literal(
            `ST_Distance_Sphere(location, ST_GeomFromText('${customerPoint}'))`
          ),
          "distance",
        ],
      ],
      where: {
        role: "restaurant_owner",
        [Sequelize.Op.and]: Sequelize.literal(
          `ST_Distance_Sphere(location, ST_GeomFromText('${customerPoint}')) < ${radius}`
        ),
      },
    });

    res.status(200).json(nearbyRestaurants);
  } catch (error) {
    console.error("Error finding nearby restaurants:", error);
    res
      .status(500)
      .json({ error: "An error occurred while finding nearby restaurants." });
  }
};
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await db.User.destroy({ where: { id } });
    if (deletedUser === 1) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateUserLocation = async (req, res) => {
  const { id } = req.user;
  const { location } = req.body;
  console.log(req.body, "user===========================================");
  try {
    const user = await db.User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    await db.User.update(
      {
        location: {
          type: "Point",
          coordinates: location,
        },
      },
      { where: { id } }
    );
    res.status(200).json({ message: "User location updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
