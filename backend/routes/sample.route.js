// Import Express and create a router instance
const express = require("express");
const router = express.Router();

// Import controller functions for sample operations
const {
  createSample,
  getAllSamples,
  getSampleById,
  updateSampleById,
  deleteSampleById,
} = require("../controllers/sample.controller");

//* POST /api/sample
// Route to create a new sample
// Calls the createSample controller function
router.post("/", createSample);

//* GET /api/sample
// Route to retrieve all samples
// Calls the getAllSamples controller function
router.get("/", getAllSamples);

//* GET /api/sample/:id
// Route to retrieve a sample by its ID
// Calls the getSampleById controller function
router.get("/:id", getSampleById);

//* PUT /api/sample/:id
// Route to update a sample by its ID
// Calls the updateSampleById controller function
router.put("/:id", updateSampleById);

//* DELETE /api/sample/:id
// Route to delete a sample by its ID
// Calls the deleteSampleById controller function
router.delete("/:id", deleteSampleById);

//* Export the router to use in other parts of the app
module.exports = router;
