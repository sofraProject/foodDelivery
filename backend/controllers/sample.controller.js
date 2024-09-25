// Import the sample model
const sampleModel = require("../models/sample.model");

//* Controller to create a new sample
// - Extracts 'name' from the request body
// - Attempts to create a new sample using the sampleModel
// - Responds with the newly created sample (201) or an error (500)
const createSample = async (req, res) => {
  const { name } = req.body;
  try {
    const newSample = await sampleModel.createSample({ name });
    res.status(201).json(newSample);
  } catch (error) {
    res.status(500).json({ error: "Failed to create sample" });
  }
};

//* Controller to get all samples
// - Fetches all samples using the sampleModel
// - Responds with the list of samples (200) or an error (500)
const getAllSamples = async (req, res) => {
  try {
    const samples = await sampleModel.getAllSamples();
    res.status(200).json(samples);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve samples" });
  }
};

//* Controller to get a sample by ID
// - Extracts 'id' from the request parameters
// - Fetches the sample with the corresponding ID using the sampleModel
// - Responds with the sample (200), or an error if not found (404) or failed (500)
const getSampleById = async (req, res) => {
  const { id } = req.params;
  try {
    const sample = await sampleModel.getSampleById(id);
    if (sample) {
      res.status(200).json(sample);
    } else {
      res.status(404).json({ error: "Sample not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve sample" });
  }
};

//* Controller to update a sample by ID
// - Extracts 'id' from the request parameters and 'name' from the body
// - Attempts to update the sample using the sampleModel
// - Responds with the updated sample (200) or an error (500)
const updateSampleById = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedSample = await sampleModel.updateSampleById(id, { name });
    res.status(200).json(updatedSample);
  } catch (error) {
    res.status(500).json({ error: "Failed to update sample" });
  }
};

//* Controller to delete a sample by ID
// - Extracts 'id' from the request parameters
// - Attempts to delete the sample using the sampleModel
// - Responds with a 204 status if successful, or an error (500)
const deleteSampleById = async (req, res) => {
  const { id } = req.params;
  try {
    await sampleModel.deleteSampleById(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete sample" });
  }
};

//* Export the controller functions
module.exports = {
  createSample,
  getAllSamples,
  getSampleById,
  updateSampleById,
  deleteSampleById,
};
