/**
 * @file com / add-location.tsx
 */

import { FormEvent, useState } from "react";
import { useLocationContext } from "../context/location";
import { StatusEnum, useStatus } from "../hooks/use-status";
import Styles from "./add-location.module.css";
import CountryCodeSelect from "./country-code-select";

const AddLocation = () => {
  const status = useStatus();
  const location = useLocationContext();

  const [shown, setShown] = useState<boolean>(false);
  const [zipCodeInput, setZipCodeInput] = useState<string>("");
  const [zipCountryInput, setZipCountryInput] = useState<string>("");
  const [cityNameInput, setCityNameInput] = useState<string>("");
  const [stateCodeInput, setStateCodeInput] = useState<string>("");
  const [cityCountryInput, setCityCountryInput] = useState<string>("");

  const onUseLocationClicked = async () => {
    status.setLoading("Getting Your Location...");

    if (location.geolocationAvailable === false) {
      status.setError("Geolocation is not available.");
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await location.saveCoordinates(
          position.coords.latitude,
          position.coords.longitude
        );

        if (location.status === StatusEnum.Error) {
          status.setError(location.statusMessage);
        } else {
          status.setIdle("Location saved.");
          setShown(false);
        }
      },

      (error) => {
        status.setError(`Geolocation Error ${error.code}: ${error.message}`);
      }
    );
  };

  const onZipCodeFormSubmit = async (ev: FormEvent) => {
    ev.preventDefault();

    status.setLoading("Resolving your zip code...");

    await location.saveZipCode(zipCodeInput, zipCountryInput);

    if (location.status === StatusEnum.Error) {
      status.setError(location.statusMessage);
    } else {
      status.setIdle("Location saved.");
      setShown(false);
    }
  };

  const onCityFormSubmit = async (ev: FormEvent) => {
    ev.preventDefault();

    status.setLoading("Resolving your city and state...");

    await location.saveCity(cityNameInput, stateCodeInput, cityCountryInput);

    if (location.status === StatusEnum.Error) {
      status.setError(location.statusMessage);
    } else {
      status.setIdle("Location saved.");
      setShown(false);
    }
  };

  return (
    <div
      className={`
      ${Styles.addLocation}
      ${shown && Styles.addLocationShown}
    `}
    >
      <button
        className={Styles.addLocationRevealButton}
        onClick={() => setShown((s) => !s)}
      >
        <span className={Styles.addLocationRevealButtonPlus}>+</span>
        <span className={Styles.addLocationRevealButtonText}>Add Location</span>
      </button>
      <div className={Styles.addLocationMenu}>
        {/* Current Location Button */}
        <button
          className={`
            ${Styles.addLocationButton}
            ${Styles.useCurrentLocationButton}
          `}
          onClick={onUseLocationClicked}
          disabled={shown === false || location.geolocationAvailable === false}
        >
          {location.geolocationAvailable
            ? "Use Current Location"
            : "Location Not Supported"}
        </button>

        {/* Zip Code Form */}
        <form
          onSubmit={onZipCodeFormSubmit}
          className={`
            ${Styles.addLocationForm}
            ${Styles.addZipCodeForm}
          `}
        >
          <p className={Styles.addLocationFormText}>Use Zip Code</p>
          <div className={Styles.addLocationFormContainer}>
            <input
              className={Styles.addLocationFormInput}
              placeholder="Enter The Zip Code"
              aria-label="Enter The Zip Code"
              onChange={(ev) => setZipCodeInput(ev.target.value)}
              disabled={shown === false}
            />
            <CountryCodeSelect
              className={Styles.addLocationFormSelect}
              id="zip-country"
              label="Enter Your Country"
              onChange={(ev) => setZipCountryInput(ev.target.value)}
              disabled={shown === false}
            />
            <button
              className={Styles.addLocationButton}
              type="submit"
              disabled={shown === false}
            >
              Use Zip Code
            </button>
          </div>
        </form>

        {/* Zip Code Form */}
        <form
          onSubmit={onCityFormSubmit}
          className={`
            ${Styles.addLocationForm}
            ${Styles.addCityForm}
          `}
        >
          <p className={Styles.addLocationFormText}>Use City Name</p>
          <div className={Styles.addLocationFormContainer}>
            <input
              className={Styles.addLocationFormInput}
              placeholder="Enter The City Name"
              aria-label="Enter The City Name"
              onChange={(ev) => setCityNameInput(ev.target.value)}
              disabled={shown === false}
            />
            <input
              className={Styles.addLocationFormInput}
              placeholder="Enter The State Code"
              aria-label="Enter The State Code"
              onChange={(ev) => setStateCodeInput(ev.target.value)}
              disabled={shown === false}
            />
            <CountryCodeSelect
              className={Styles.addLocationFormSelect}
              id="state-country"
              label="Enter Your Country"
              onChange={(ev) => setCityCountryInput(ev.target.value)}
              disabled={shown === false}
            />
            <button
              className={Styles.addLocationButton}
              type="submit"
              disabled={shown === false}
            >
              Use City Name
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLocation;
