const axios = require("axios");

const HttpError = require("../models/http-errors");

const API_KEY = process.env.GOOGLE_API_KEY; //added it to congig file nodemon.json

//async nd await to  make this function asynchronous(promise based)
async function getCoordsForAddress(address) {
  //for now giving indias coordinates
  return {
    lat: 28.694749,
    lng: 76.965801,
  };

  // const response = await axios.get(
  //   `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
  //     address
  //   )}&key=${API_KEY}`
  // );

  // const data = response.data;

  // console.log(response);

  // if (!data || data.status === "ZERO_RESULTS") {
  //   const error = new HttpError(
  //     "Could not find location for the specified address.",
  //     422
  //   );
  //   throw error;
  // }

  // const coordinates = data.results[0].geometry.location;

  // return coordinates;
}

module.exports = getCoordsForAddress;
