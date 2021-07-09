import React, { useEffect, useState, useContext } from "react";
import { apiCall } from "../../apis/apicalls";
import Backdrop from "@material-ui/core/Backdrop";
import UsersList from "../components/UsersList";
import ErrorModal from "./../../shared/components/UIElements/ErrorModal";
import { Spinner } from "./../../shared/components/Spinner/spinner";

import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
// import { useDispatch } from "react-redux";
import { Alert, AlertTitle } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { AuthContext } from "./../../shared/context/auth-context";

const useStyles = makeStyles({
  action: {
    display: "block",
    paddingTop: "5px",
  },
});

const Users = () => {
  const auth = useContext(AuthContext);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadedUsers, setLoadedUsers] = useState([]);
  const [open, setOpen] = useState(false);

  let alertFlag =
    localStorage.getItem("wellcomeAlert") === "true" ? true : false;

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

  useEffect(() => {
    if (alertFlag) {
      setOpen(true);
      localStorage.setItem("wellcomeAlert", null);
    }
  }, []);

  const clearErrorHandlor = () => {
    setError("");
  };

  return (
    <>
      <Backdrop
        style={{ zIndex: "8", overflow: "hidden" }}
        open={open}
        invisible={!open}
      >
        <Alert
          className="downTimeAlertBox"
          classes={{ action: classes.action }}
          variant="filled"
          style={{ background: "green" }}
          severity="success"
          onClose={() => {
            // dispatch(setDownTimeDialog(false));
            setOpen(false);
            // localStorage.setItem("wellcomeAlert", false);
          }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                // dispatch(setDownTimeDialog(false));
                setOpen(false);
                // localStorage.setItem("wellcomeAlert", false);localStorage.setItem("wellcomeAlert", false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <AlertTitle style={{ fontSize: "20px" }}>
            Wellcome Greetings..!
          </AlertTitle>
          <p style={{ fontSize: "14px" }}>
            If you are visiting here for the very first time... i wellcome you
            here. Please signup and add some places and share your memories
            about the place. if you like the application,please give feedback to
            us.
          </p>

          <p>Thanks!!</p>
        </Alert>
      </Backdrop>

      <ErrorModal error={error} onClear={clearErrorHandlor} />
      {loading && <Spinner />}

      {!loading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
  );
};

export default Users;
