import axios from "axios";
import { baseUrlForUsers, baseUrlForPlaces } from "./BaseUrl.js";

export const apiCall = (method, path, data, comingBaseUrl) => {
  let token = localStorage.getItem("token");

  let ContentType;
  const baseUrl =
    comingBaseUrl === "baseUrlForUsers" ? baseUrlForUsers : baseUrlForPlaces;
  if (path === "signup") {
    ContentType = "multipart/form-data";
  } else {
    ContentType = "application/json";
  }
  if (method !== "get") {
    return new Promise((resolve, reject) => {
      axios({
        method: method,
        // timeout: 2500,
        url: `${baseUrl + path}`,
        headers: {
          "Content-Type": ContentType,
          // "Content-Type": "application/x-www-form-urlencoded",
          // Authorization: checkedToken ? `Bearer ${checkedToken}` : "",
          Authorization:
            comingBaseUrl === "baseUrlForPlaces" ? `Bearer ${token}` : "",
        },
        data: data,
        responseType: "json",
        validateStatus: () => true,
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
          if (
            err &&
            err.response &&
            err.response.status &&
            err.response.status === 401
          ) {
            window.location.assign("/login");
            localStorage.clear();
          }
        });
    });
  } else if (method === "get") {
    return new Promise((resolve, reject) => {
      axios
        .get(`${baseUrl + path}`, {
          params: data,
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  return;
};
