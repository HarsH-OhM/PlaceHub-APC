import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import Card from "../../shared/components/UIElements/Card";
import { useForm } from "../../shared/hooks/form-hook";
import "./PlaceForm.css";
import ErrorModal from "./../../shared/components/UIElements/ErrorModal";
import { Spinner } from "./../../shared/components/Spinner/spinner";
import { apiCall } from "./../../apis/apicalls";
import { useHistory } from "react-router";
import { AuthContext } from "./../../shared/context/auth-context";

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [loadedPlaces, setLoadedPlaces] = useState();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    setLoading(true);
    apiCall("get", `${placeId}`, "", "baseUrlForPlaces")
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(res.message);
        }
        setLoading(false);
        setLoadedPlaces(res.place);
        setFormData(
          {
            title: {
              value: res.place && res.place.title,
              isValid: true,
            },
            description: {
              value: res.place && res.place.description,
              isValid: true,
            },
          },
          true
        );
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message || "something went wrong, please try again");
      });
  }, [apiCall, placeId]);

  const placeUpdateSubmitHandler = (event) => {
    event.preventDefault();

    setLoading(true);

    const data = {
      title: formState.inputs.title.value,
      description: formState.inputs.description.value,
    };
    apiCall("PUT", `${placeId}`, data, "baseUrlForPlaces")
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(res.message);
        }
        setLoading(false);
        history.push("/" + auth.userId + "/places");
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message || "something went wrong, please try again");
      });
  };

  if (!loadedPlaces && !loading) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  const clearErrorHandlor = () => {
    setError("");
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearErrorHandlor} />
      {loading && <Spinner />}

      {!loading && loadedPlaces && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlaces.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlaces.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
