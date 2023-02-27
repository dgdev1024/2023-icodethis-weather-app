/**
 * @file com / extended-forecast.tsx
 */

import { useEffect } from "react";
import { useStatus } from "../hooks/use-status";
import Styles from "./extended-forecast.module.css";
import { MeasureUnits } from "../lib/weather";

export type ExtendedForecastProps = {
  lat: number;
  lon: number;
  units: MeasureUnits;
};

const ExtendedForecast = (props: ExtendedForecastProps) => {
  const status = useStatus();

  useEffect(() => {}, []);

  return <div className={Styles.extendedForecast}></div>;
};

export default ExtendedForecast;
