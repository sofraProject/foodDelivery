// Importation de jsonwebtoken pour décoder le token JWT
import jwt, { JwtPayload } from "jsonwebtoken";

// Helper pour récupérer l'utilisateur à partir du token stocké dans localStorage
export const getUser = (): JwtPayload | null => {
  if (typeof window === "undefined") return null; // Si le code s'exécute côté serveur
  const token = localStorage.getItem("token"); // Récupération du token depuis localStorage

  if (token) {
    try {
      const decoded = jwt.decode(token); // Décodage du token JWT
      if (typeof decoded === "object" && decoded !== null) {
        return decoded as JwtPayload; // Retourner le token décodé s'il est de type JwtPayload
      } else {
        return null; // Retourner null si le décodage ne renvoie pas un objet
      }
    } catch (err) {
      console.error("Error decoding token:", err); // Gestion des erreurs de décodage
      return null;
    }
  }
  return null; // Si aucun token n'est trouvé
};

// Utilisation du helper pour récupérer l'utilisateur décodé
const decodedUser = getUser(); // Appel de la fonction pour récupérer les données utilisateur

// Helper pour récupérer l'ID utilisateur à partir du token stocké dans localStorage
export const getUserId = (): string | null => {
  if (typeof window === "undefined") return null; // Vérification côté client
  const token = localStorage.getItem("token"); // Récupération du token

  if (token) {
    try {
      const decoded = jwt.decode(token); // Décodage du token

      // Vérification si `decoded` est de type `JwtPayload` et si l'ID est présent
      if (decoded && typeof decoded !== "string" && "id" in decoded) {
        return (decoded as JwtPayload).id as string; // Retourner l'ID si présent
      } else {
        return null; // Si l'ID n'est pas trouvé
      }
    } catch (err) {
      console.error("Error decoding token:", err); // Gestion des erreurs de décodage
      return null;
    }
  }
  return null; // Si aucun token n'est trouvé
};

// Exportation des helpers et de l'utilisateur décodé
export const authHelper = {
  getUser, // Exportation de la fonction getUser
  decodedUser, // Exportation de l'utilisateur décodé
  getUserId, // Exportation du helper pour obtenir l'ID utilisateur
};
