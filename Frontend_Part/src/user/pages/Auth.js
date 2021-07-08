import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./Auth.css";
import Avatar from "../../shared/components/UIElements/Avatar";
import profileIcon from "../../Assets/Icons/proIcon.jpg";
import { apiCall } from "../../apis/apicalls";
import { Spinner } from "../../shared/components/Spinner/spinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
const Auth = () => {
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const clearErrorHandlor = () => {
    setError("");
  };

  const authSubmitHandler = (event) => {
    event.preventDefault();
    setLoading(true);
    if (isLoginMode) {
      const data = {
        email: formState.inputs.email.value,
        password: formState.inputs.password.value,
      };
      apiCall("post", "login", data, "baseUrlForUsers")
        .then((res) => {
          if (res.status !== 200) {
            throw new Error(res.message);
          }
          setLoading(false);
          auth.login(res.userId, res.token);
        })
        .catch((err) => {
          setLoading(false);
          setError(err.message || "something went wrong, please try again");
        });
    } else {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("email", formState.inputs.email.value);
      formData.append("password", formState.inputs.password.value);
      formData.append("image", formState.inputs.image.value);
      // const data = {
      //   name: formState.inputs.name.value,
      //   email: formState.inputs.email.value,
      //   password: formState.inputs.password.value,
      // };
      apiCall("post", "signup", formData, "baseUrlForUsers")
        .then((res) => {
          if (res.status !== 200) {
            throw new Error(res.message);
          }
          setLoading(false);
          auth.login(res.userId, res.token);
        })
        .catch((err) => {
          setLoading(false);
          setError(err.message || "something went wrong, please try again");
        });
    }
  };

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  return (
    <>
      {loading && <Spinner />}

      <ErrorModal error={error} onClear={clearErrorHandlor} />

      <Card className="authentication">
        {/* <div>
          <Avatar image={profileIcon} alt="profile" width="50%" height="50%" />
        </div> */}
        <h2>{isLoginMode ? "Login Required!" : "SIGNUP"}</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="name"
              label="UserName"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name"
              onInput={inputHandler}
            />
          )}

          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image."
            />
          )}

          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>

        <button onClick={switchModeHandler} className="rainbow">
          SWITCH To {isLoginMode ? "SIGNUP" : "LOGIN"}
        </button>
      </Card>
    </>
  );
};

export default Auth;
