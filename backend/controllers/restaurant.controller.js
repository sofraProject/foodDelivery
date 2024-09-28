import { Request, Response } from "express";
import { prismaConnection } from "../prisma/prisma"; // Ensure you have your Prisma client instance

// Function to calculate the distance between two points
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Get nearest restaurants based on user location
export const getNearestRestaurants = async (req: Request, res: Response) => {
  const { userLat, userLon } = req.body;

  try {
    const restaurants = await prismaConnection.restaurant.findMany();

    const distances = restaurants.map((restaurant) => {
      const distance = calculateDistance(
        userLat,
        userLon,
        restaurant.latitude,
        restaurant.longitude
      );
      return { ...restaurant, distance }; // Append distance to each restaurant
    });

    // Sort restaurants by distance and return the nearest ones
    distances.sort((a, b) => a.distance - b.distance);

    res.json(distances); // You can limit the number of restaurants if needed
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch nearest restaurants" });
  }
};
