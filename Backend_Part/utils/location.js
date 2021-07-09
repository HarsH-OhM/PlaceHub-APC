const axios = require("axios");

const HttpError = require("../models/http-errors");

const API_KEY = process.env.HERE_MAP_API_KEY; //added it to congig file nodemon.json

//async nd await to  make this function asynchronous(promise based)
async function getCoordsForAddress(address) {
  //for now giving indias coordinates
  // return {
  //   lat: 28.694749,
  //   lng: 76.965801,
  // };

  // const response = await axios.get(
  //   `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
  //     address
  //   )}&apiKey=${API_KEY}`
  // );

  let response = await axios.get(
    `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
      address
    )}&apiKey=${API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }

  const coordinates = data.items[0].position;

  return coordinates;
}

module.exports = getCoordsForAddress;
