import React, { useState } from "react";
import "./About.css";
import myImage from "../Assets/Icons/mine.jpg";

import Button from "./../shared/components/FormElements/Button";
import Input from "./../shared/components/FormElements/Input";
import { useForm } from "./../shared/hooks/form-hook";
import { send } from "emailjs-com";

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../shared/util/validators";
import { Grid } from "@material-ui/core";
import ErrorModal from "../shared/components/UIElements/ErrorModal";
import { Spinner } from "../shared/components/Spinner/spinner";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const About = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const [formState, inputHandler, setFormData] = useForm(
    {
      from_name: {
        value: "",
        isValid: false,
      },

      message: {
        value: "",
        isValid: false,
      },

      email: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const handleResetForm = () => {
    setFormData(
      {
        from_name: {
          value: "",
          isValid: false,
        },

        message: {
          value: "",
          isValid: false,
        },

        email: {
          value: "",
          isValid: false,
        },
      },
      false
    );
  };

  const clearErrorHandlor = () => {
    setError("");
  };

  const aboutSubmitHandler = (event) => {
    event.preventDefault();
    setLoading(true);

    const data = {
      from_name: formState.inputs.from_name.value,
      to_name: "Hariom Malviya",
      message: formState.inputs.message.value,
      reply_to: formState.inputs.email.value,
    };

    send(
      "gmail",
      "template_4ihbqve",
      data,
      process.env.REACT_APP_EMAIL_JS_USER_KEY
    ) //email js keys
      .then((response) => {
        setLoading(false);

        // console.log("SUCCESS!", response.status, response.text);
        setFormData();
        if (response.status === 200) {
          setOpen(true);
          handleResetForm();
        } else {
          throw new Error(
            response.text || "something went wrong, please try again"
          );
        }
      })
      .catch((err) => {
        console.log("FAILED...", err);
        setError(err.text || "something went wrong, please try again");

        setLoading(false);
      });
  };

  return (
    <>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Mail sent successfully. Thank you for your feedback.
        </Alert>
      </Snackbar>
      <ErrorModal error={error} onClear={clearErrorHandlor} />
      {loading && <Spinner />}
      <Grid container>
        <Grid item md={6} xs={12} lg={6}>
          <div className="aboutCard">
            <div className="about-inner">
              <div className="aboutFront">
                <h2 className="aboutTitle">About me..!</h2>
                <img src={myImage} alt="myImage" />
                <div className="myInfo">
                  <h3>Hariom Malviya</h3>
                  <h4>MERN Stack Developer && IOT Automation Developer</h4>
                  <p>Contact : gurjarhariom3114@gmail.com</p>
                </div>
              </div>
              <div className="aboutBack">
                <h2 className="aboutTitle">About This Project..!</h2>

                <div className="aboutText">
                  <p>
                    Its a MERN Stack Application where user can create their
                    account and they can share the information about the places
                    they have visited and also locate the place on the map.User
                    can also Update and Delete their Places. User can get the
                    weather information about the city if they want to visit
                    again or any other user like to visit any place.so its a
                    PlaceHub where you can share the different places you have
                    traveled and good memory about it and also see other shared
                    places by different users. soon i will be adding messaging
                    and some more functionality to this project. So stay tuned.
                  </p>
                  <br />
                  <p>
                    Technologies Used in this Project are: React js, Node js,
                    Mongodb , CSS/Material ui, Map and weather APIS.
                  </p>

                  <p>
                    for more details cheak my github profile:
                    <a
                      href="https://github.com/HarsH-OhM"
                      style={{ color: "#ff0055" }}
                    >
                      {" "}
                      click here!{" "}
                    </a>
                  </p>
                  <Button>
                    <a
                      href="https://www.linkedin.com/in/hariom-malviya-614160148/"
                      style={{ color: "black" }}
                    >
                      linkedin Profile
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item md={6} xs={12} lg={6}>
          <div className="sendMessageCard">
            <h2
              className="aboutTitle"
              style={{
                margin: "0",
                marginTop: "10px",
                marginBottom: "10px",
              }}
            >
              Would love to here from you..!
            </h2>
            <form onSubmit={aboutSubmitHandler}>
              <Input
                element="input"
                id="from_name"
                type="name"
                label="Your Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter your name"
                onInput={inputHandler}
              />

              <Input
                element="textarea"
                id="message"
                label="Share your thoughts or feedback."
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText="Please write something."
                onInput={inputHandler}
              />

              <Input
                element="input"
                id="email"
                type="email"
                label="Your E-Mail ID"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Please enter a valid email address."
                onInput={inputHandler}
              />

              <Button type="submit" disabled={!formState.isValid}>
                SEND MESSAGE
              </Button>
            </form>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default About;
