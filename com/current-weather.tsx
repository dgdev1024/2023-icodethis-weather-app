/**
 * @file com / current-weather.tsx
 */

import { useEffect, useState } from "react";
import { StatusEnum, useStatus } from "../hooks/use-status";
import Styles from "./current-weather.module.css";
import { MeasureUnits, Weather, ResolvedCurrentWeather } from "../lib/weather";

export type CurrentWeatherProps = {
  lat: number;
  lon: number;
  units: MeasureUnits;
};

const CurrentWeather = (props: CurrentWeatherProps) => {
  const status = useStatus();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [tick, setTick] = useState<number>(0);
  const [weather, setWeather] = useState<Weather>(null);

  const nextPage = () => setCurrentPage((page) => (page + 1) % 4);

  const update = () => setTick((tick) => (tick + 1) % 100);

  useEffect(() => {
    const timeout = setTimeout(() => nextPage(), 15000);
    return () => clearTimeout(timeout);
  }, [currentPage]);

  useEffect(() => {
    const timeout = setTimeout(() => update(), 60000 * 5);
    return () => clearTimeout(timeout);
  }, [tick]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchWeather = async () => {
      if (!props.lat || !props.lon) {
        status.setError("No location specified.");
        return;
      }

      if (weather === null) {
        status.setLoading("Fetching current weather...");
      }

      try {
        const res = await fetch(
          `/api/weather/current?lat=${props.lat}&lon=${props.lon}&units=${props.units}`,
          { signal: abortController.signal }
        );
        if (res.ok === false) {
          status.setError(
            "Could not connect to the weather API. Try again later."
          );
          return;
        }

        const data = (await res.json()) as ResolvedCurrentWeather;

        if (data.error) {
          status.setError(data.error);
        } else {
          status.setIdle("");
          setWeather(data.weather);
        }
      } catch {}
    };

    fetchWeather();

    return () => {
      abortController.abort();
    };
  }, [props, tick]);

  if (!weather || status.status === StatusEnum.Error) {
    return (
      <div className={Styles.currentWeather}>
        <div className={Styles.currentWeatherContainer}>
          <div
            className={`
            ${Styles.currentWeatherPage}
            ${Styles.currentConditions}
          `}
          >
            <p className={Styles.currentWeatherStatus}>{status.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={Styles.currentWeather}>
      <div className={Styles.currentWeatherContainer}>
        <div
          className={`
            ${Styles.currentWeatherPage}
            ${Styles.currentConditions}
          `}
          style={{
            left: `calc(0% - (100% * ${currentPage}))`,
          }}
        >
          <img
            className={Styles.currentConditionsImage}
            src={weather.condition.icon}
            alt={weather.condition.name}
          />
          <div className={Styles.currentConditionsInformation}>
            <h2 className={Styles.currentConditionsTemperature}>
              {weather.temperature.air} {weather.temperature.unit}
            </h2>
            <p className={Styles.currentConditionsName}>
              {weather.condition.name}
            </p>
          </div>
        </div>
        <div
          className={`
            ${Styles.currentWeatherPage}
            ${Styles.currentTemperature}
          `}
          style={{
            left: `calc(100% - (100% * ${currentPage}))`,
          }}
        >
          <div className={Styles.currentWeatherLine}>
            <p className={Styles.currentWeatherDescription}>Current Temp:</p>
            <p className={Styles.currentWeatherValue}>
              {weather.temperature.air} {weather.temperature.unit}
            </p>
          </div>
          <div className={Styles.currentWeatherLine}>
            <p className={Styles.currentWeatherDescription}>Feels Like:</p>
            <p className={Styles.currentWeatherValue}>
              {weather.temperature.feelsLike} {weather.temperature.unit}
            </p>
          </div>
          <div className={Styles.currentWeatherLine}>
            <p className={Styles.currentWeatherDescription}>Range:</p>
            <p className={Styles.currentWeatherValue}>
              {weather.temperature.minimum} {weather.temperature.unit}
              <br />
              {weather.temperature.maximum} {weather.temperature.unit}
            </p>
          </div>
          <div className={Styles.currentWeatherLine}>
            <p className={Styles.currentWeatherDescription}>Humidity:</p>
            <p className={Styles.currentWeatherValue}>
              {weather.temperature.humidity}%
            </p>
          </div>
        </div>
        <div
          className={`
            ${Styles.currentWeatherPage}
            ${Styles.currentWind}
          `}
          style={{
            left: `calc(200% - (100% * ${currentPage}))`,
          }}
        >
          <div className={Styles.currentWeatherLine}>
            <p className={Styles.currentWeatherDescription}>Current Wind:</p>
            <p className={Styles.currentWeatherValue}>
              {weather.wind.speed} {weather.wind.unit}
            </p>
          </div>
          {weather.wind.gust && (
            <div className={Styles.currentWeatherLine}>
              <p className={Styles.currentWeatherDescription}>Current Gust:</p>
              <p className={Styles.currentWeatherValue}>
                {weather.wind.gust} {weather.wind.unit}
              </p>
            </div>
          )}
          <div className={Styles.currentWeatherLine}>
            <p className={Styles.currentWeatherDescription}>Direction:</p>
            <p className={Styles.currentWeatherValue}>
              {weather.wind.direction} ({weather.wind.directionDegrees}°)
            </p>
          </div>
        </div>
        <div
          className={`
            ${Styles.currentWeatherPage}
            ${Styles.currentMisc}
          `}
          style={{
            left: `calc(300% - (100% * ${currentPage}))`,
          }}
        >
          <div className={Styles.currentWeatherLine}>
            <p className={Styles.currentWeatherDescription}>Visibility:</p>
            <p className={Styles.currentWeatherValue}>
              {weather.misc.visibility} m
            </p>
          </div>
          <div className={Styles.currentWeatherLine}>
            <p className={Styles.currentWeatherDescription}>Cloud Cover:</p>
            <p className={Styles.currentWeatherValue}>
              {weather.misc.cloudCover} %
            </p>
          </div>
          <div className={Styles.currentWeatherLine}>
            <p className={Styles.currentWeatherDescription}>Pressure:</p>
            <p className={Styles.currentWeatherValue}>
              {weather.temperature.pressure} mb
            </p>
          </div>
        </div>
      </div>
      <div className={Styles.currentWeatherButtonStrip}>
        <button
          className={`
            ${Styles.currentWeatherButton}
            ${currentPage === 0 && Styles.currentWeatherButtonActive}
          `}
          onClick={() => setCurrentPage(0)}
          title="Current Conditions"
          aria-label="Current Conditions"
        ></button>
        <button
          className={`
            ${Styles.currentWeatherButton}
            ${currentPage === 1 && Styles.currentWeatherButtonActive}
          `}
          onClick={() => setCurrentPage(1)}
          title="Temperature Information"
          aria-label="Temperature Information"
        ></button>
        <button
          className={`
            ${Styles.currentWeatherButton}
            ${currentPage === 2 && Styles.currentWeatherButtonActive}
          `}
          onClick={() => setCurrentPage(2)}
          title="Wind Information"
          aria-label="Wind Information"
        ></button>
        <button
          className={`
            ${Styles.currentWeatherButton}
            ${currentPage === 3 && Styles.currentWeatherButtonActive}
          `}
          onClick={() => setCurrentPage(3)}
          title="Miscalleanous Information"
          aria-label="Miscalleanous Information"
        ></button>
      </div>
    </div>
  );
};

export default CurrentWeather;
