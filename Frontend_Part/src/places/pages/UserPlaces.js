import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import { Spinner } from "./../../shared/components/Spinner/spinner";
import ErrorModal from "./../../shared/components/UIElements/ErrorModal";
import { apiCall } from "./../../apis/apicalls";

// const DUMMY_PLACES = [
//   {
//     id: "p1",
//     title: "Empire State Building",
//     description: "One of the most famous sky scrapers in the world!",
//     imageUrl:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
//     address: "20 W 34th St, New York, NY 10001",
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584
//     },
//     creator: "u1"
//   },
//   {
//     id: "p2",
//     title: "Empire State Building",
//     description: "One of the most famous sky scrapers in the world!",
//     imageUrl:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
//     address: "20 W 34th St, New York, NY 10001",
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584
//     },
//     creator: "u2"
//   }
// ];

const UserPlaces = () => {
  const userId = useParams().userId;
  const [loading, setLoading] = useState(false);
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);

    apiCall("get", `user/${userId}`, "", "baseUrlForPlaces")
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(res.message);
        }
        setLoading(false);
        setLoadedPlaces(res.places);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message || "something went wrong, please try again");
      });
  }, [apiCall, userId]);

  const clearErrorHandlor = () => {
    setError("");
  };

  const placeDeleteHandlor = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearErrorHandlor} />
      {loading && <Spinner />}
      {!loading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandlor} />
      )}
    </>
  );
};

export default UserPlaces;
