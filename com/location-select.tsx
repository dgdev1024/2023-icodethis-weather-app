/**
 * @file com / location-select.tsx
 */

import { useEffect, useState } from "react";
import { useLocationContext } from "../context/location";
import { MeasureUnits } from "../lib/weather";
import Styles from "./location-select.module.css";

export type LocationSelectProps = {
  setMeasureUnits: (
    value: MeasureUnits | ((val: MeasureUnits) => MeasureUnits)
  ) => void;
};

const LocationSelect = (props: LocationSelectProps) => {
  const location = useLocationContext();
  const [shown, setShown] = useState<boolean>(false);
  const [formattedLocations, setFormattedLocations] = useState<string[]>([]);

  useEffect(() => {
    const newFormattedLocations = location.savedLocations.map(
      (savedLocation) => {
        if (savedLocation.state) {
          return `${savedLocation.name}, ${savedLocation.state}, ${savedLocation.country}`;
        } else {
          return `${savedLocation.name}, ${savedLocation.country}`;
        }
      }
    );

    setFormattedLocations(newFormattedLocations);
  }, [location.savedLocations]);

  const onLocationEntryClicked = (index: number) => {
    location.setCurrentLocationIndex(index);
    setShown(false);
  };

  const onLocationEntryDeleteClicked = (index: number) => {
    location.removeLocationIndex(index);

    if (index < location.currentLocationIndex) {
      location.setCurrentLocationIndex(location.currentLocationIndex - 1);
    }
  };

  return (
    <div
      className={`
      ${Styles.locationSelect}
      ${shown && Styles.locationSelectShown}
    `}
    >
      <button
        className={Styles.locationSelectRevealButton}
        onClick={() => setShown((s) => !s)}
      >
        {formattedLocations.length === 0
          ? ""
          : formattedLocations[location.currentLocationIndex]}
      </button>
      <div className={Styles.locationSelectContainer}>
        {formattedLocations.map((formattedLocation, index) => (
          <div className={Styles.locationSelectEntry} key={index}>
            <button
              className={Styles.locationSelectEntryButton}
              onClick={() => onLocationEntryClicked(index)}
              disabled={shown === false}
            >
              {formattedLocation}
            </button>
            <button
              className={`
                ${Styles.locationSelectEntryButton}
                ${Styles.locationSelectEntryDeleteButton}
              `}
              onClick={() => onLocationEntryDeleteClicked(index)}
              disabled={shown === false}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <div className={Styles.unitSelect}>
        <button
          className={Styles.unitSelectButton}
          onClick={() => props.setMeasureUnits("standard")}
        >
          Standard
        </button>
        <button
          className={Styles.unitSelectButton}
          onClick={() => props.setMeasureUnits("metric")}
        >
          Metric
        </button>
        <button
          className={Styles.unitSelectButton}
          onClick={() => props.setMeasureUnits("imperial")}
        >
          Imperial
        </button>
      </div>
    </div>
  );
};

export default LocationSelect;
