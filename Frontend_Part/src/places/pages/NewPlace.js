import React, { useState, useContext } from "react";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./PlaceForm.css";
import { apiCall } from "./../../apis/apicalls";
import { AuthContext } from "./../../shared/context/auth-context";
import { Spinner } from "./../../shared/components/Spinner/spinner";
import ErrorModal from "./../../shared/components/UIElements/ErrorModal";
import { useHistory } from "react-router";
import ImageUpload from "./../../shared/components/FormElements/ImageUpload";

const NewPlace = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
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

  const placeSubmitHandler = (event) => {
    event.preventDefault();
    setLoading(true);

    console.log(formState.inputs); // send this to the backend!

    // const data = {
    //   title: formState.inputs.title.value,
    //   description: formState.inputs.description.value,
    //   address: formState.inputs.address.value,
    //   creator: auth.userId,
    // };

    const formData = new FormData();

    formData.append("title", formState.inputs.title.value);
    formData.append("description", formState.inputs.description.value);
    formData.append("address", formState.inputs.address.value);
    // formData.append("creator", auth.userId);
    formData.append("image", formState.inputs.image.value);

    apiCall("post", "", formData, "baseUrlForPlaces")
      .then((res) => {
        if (res.status !== 201) {
          throw new Error(res.message);
        }
        setLoading(false);
        history.push("/");
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message || "something went wrong, please try again");
      });
  };

  const clearErrorHandlor = () => {
    setError("");
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearErrorHandlor} />
      {loading && <Spinner />}

      <form className="place-form" onSubmit={placeSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image."
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
