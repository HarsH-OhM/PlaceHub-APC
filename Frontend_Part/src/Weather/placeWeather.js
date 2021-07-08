import React, { useState } from "react";

// import "../index.css";
import "./weather.css";
import ErrorModal from "./../shared/components/UIElements/ErrorModal";
import { Spinner } from "./../shared/components/Spinner/spinner";
const api = {
  key: process.env.REACT_APP_WEATHER_API_KEY, //added in env file key nd base
  base: process.env.REACT_APP_WEATHER_API_BASE,
};

function PlaceWeather() {
  const dateBuild = (d) => {
    let date = String(new window.Date());
    date = date.slice(3, 15);
    return date;
  };

  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = (e) => {
    if (e.key === "Enter") {
      setLoading(true);
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
          if (result.cod !== 200) {
            throw new Error(result.message);
          }
          setLoading(false);
          setQuery("");
          setWeather(result);
          console.log(result);
        })
        .catch((err) => {
          setLoading(false);
          setError(err.message || "something went wrong, please try again");
        });
    }
  };

  const clearErrorHandlor = () => {
    setError("");
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearErrorHandlor} />
      {loading && <Spinner />}

      <div className="content">
        {/* <h2>Enter Place(City) Location...and get the Weather Information.</h2> */}
        <div
          className={
            typeof weather.main != "undefined"
              ? weather.main.temp > 32
                ? "App hot"
                : "App cloud"
              : "App"
          }
        >
          <div className="main-compo">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for city...."
                className="search-bar"
                onChange={(e) => setQuery(e.target.value)}
                value={query}
                onKeyPress={search}
              />
            </div>
            {typeof weather.main != "undefined" ? (
              <div>
                <div className="location-container">
                  <div className="location">
                    {weather.name}, {weather.sys.country}
                  </div>
                  <div className="date"> {dateBuild(new Date())}</div>
                </div>
                <div className="weather-container">
                  <div className="temperature">
                    {Math.round(weather.main.temp)}°C
                  </div>
                  <div className="weather">{weather.weather[0].main}</div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default PlaceWeather;
