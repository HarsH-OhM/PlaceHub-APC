import React, { useEffect, useState } from "react";
import { apiCall } from "../../apis/apicalls";

import UsersList from "../components/UsersList";
import ErrorModal from "./../../shared/components/UIElements/ErrorModal";
import { Spinner } from "./../../shared/components/Spinner/spinner";

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadedUsers, setLoadedUsers] = useState([]);

  useEffect(() => {
    setLoading(true);
    apiCall("get", "", "", "baseUrlForUsers")
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(res.message);
        }
        setLoadedUsers(res.users);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message || "something went wrong, please try again");
      });
  }, []);

  const clearErrorHandlor = () => {
    setError("");
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearErrorHandlor} />
      {loading && <Spinner />}

      {!loading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
  );
};

export default Users;
