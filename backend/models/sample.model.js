// Import the Prisma connection
const prismaConnection = require("../prisma/prisma");

//* Create a new sample
// - Takes 'data' as input to create a new sample
// - Returns the created sample
const createSample = async (data) => {
  return prismaConnection.sample.create({
    data,
  });
};

//* Get all samples
// - Fetches and returns all samples from the database
const getAllSamples = async () => {
  return prismaConnection.sample.findMany();
};

//* Get a sample by ID
// - Takes 'id' as input and fetches the corresponding sample
// - Returns the sample if found
const getSampleById = async (id) => {
  return prismaConnection.sample.findUnique({
    where: { id: parseInt(id) },
  });
};

//* Update a sample by ID
// - Takes 'id' and 'data' to update an existing sample
// - Returns the updated sample
const updateSampleById = async (id, data) => {
  return prismaConnection.sample.update({
    where: { id: parseInt(id) },
    data,
  });
};

//* Delete a sample by ID
// - Takes 'id' to delete the corresponding sample
// - Returns the result of the delete operation
const deleteSampleById = async (id) => {
  return prismaConnection.sample.delete({
    where: { id: parseInt(id) },
  });
};

//* Export all functions
module.exports = {
  createSample,
  getAllSamples,
  getSampleById,
  updateSampleById,
  deleteSampleById,
};
