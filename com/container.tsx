/**
 * @file com / container.tsx
 */

import { useLocationContext } from "../context/location";
import { useLocalStorage } from "../hooks/use-local-storage";
import { MeasureUnits } from "../lib/weather";
import AddLocation from "./add-location";
import LocationSelect from "./location-select";
import CurrentWeather from "./current-weather";
import ExtendedForecast from "./extended-forecast";
import Styles from "./container.module.css";

const Container = () => {
  const [measureUnits, setMeasureUnits] = useLocalStorage<MeasureUnits>(
    "-ict-weather-measure-units",
    "imperial"
  );
  const location = useLocationContext();

  return (
    <>
      <div className={Styles.container}>
        <CurrentWeather
          lat={location.currentLocation?.coord?.lat}
          lon={location.currentLocation?.coord?.lon}
          units={measureUnits}
        />
        <ExtendedForecast
          lat={location.currentLocation?.coord?.lat}
          lon={location.currentLocation?.coord?.lon}
          units={measureUnits}
        />
      </div>
      <LocationSelect />
      <AddLocation />
    </>
  );
};

export default Container;
