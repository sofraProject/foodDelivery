import { NextApiRequest, NextApiResponse } from "next";
import { prismaConnection } from '../../../../backend/prisma/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lat, long } = req.query;

  if (!lat || !long) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  try {
    const restaurants = await prismaConnection.location.findMany({
      where: {
        restaurantId: { not: null },
      },
    });

    const userLat = parseFloat(lat as string);
    const userLong = parseFloat(long as string);

    const nearbyRestaurants = restaurants
      .map((restaurant) => {
        const distance = Math.sqrt(
          Math.pow(restaurant.lat - userLat, 2) + Math.pow(restaurant.long - userLong, 2)
        );
        return { ...restaurant, distance };
      })
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json(nearbyRestaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
