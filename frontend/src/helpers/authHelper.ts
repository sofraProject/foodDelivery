// Importation de jsonwebtoken pour décoder le token JWT
import jwt from "jsonwebtoken";

// Helper pour récupérer l'utilisateur à partir du token stocké dans localStorage
export const getUser = () => {
  const token = localStorage.getItem("token"); // Récupération du token
  if (token) {
    try {
      const decoded = jwt.decode(token); // Décodage du token
      return decoded; // Retourne les données décodées (ex: id, email, rôle)
    } catch (err) {
      console.error("Error decoding token:", err); // Gestion des erreurs de décodage
      return null;
    }
  }
  return null; // Si aucun token n'est trouvé
};

// Vérification de l'utilisateur authentifié
const decodedUser = getUser();

// Export des données
export const authHelper = {
  decodedUser,
};
