/**
 * @file com / extended-forecast.tsx
 */

import { useEffect, useState } from "react";
import { StatusEnum, useStatus } from "../hooks/use-status";
import Styles from "./extended-forecast.module.css";
import {
  MeasureUnits,
  Weather,
  ResolvedExtendedForecast,
  getDay,
} from "../lib/weather";

export type ExtendedForecastProps = {
  lat: number;
  lon: number;
  units: MeasureUnits;
};

const ExtendedForecast = (props: ExtendedForecastProps) => {
  const today = new Date();
  const status = useStatus();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [tick, setTick] = useState<number>(0);
  const [forecast, setForecast] = useState<Weather[]>(null);

  const update = () => setTick((tick) => (tick + 1) % 10);

  const nextPage = () => setCurrentPage((page) => (page + 1) % 5);

  useEffect(() => {
    const timeout = setTimeout(() => nextPage(), 20000);
    return () => clearTimeout(timeout);
  });

  useEffect(() => {
    const timeout = setTimeout(() => update(), 60000 * 5);
    return () => clearTimeout(timeout);
  });

  useEffect(() => {
    const abortController = new AbortController();

    const fetchForecast = async () => {
      if (!props.lat || !props.lon) {
        status.setError("No location specified.");
        return;
      }

      if (forecast === null) {
        status.setLoading("Fetching extended forecast...");
      }

      try {
        const res = await fetch(
          `/api/weather/extended?lat=${props.lat}&lon=${props.lon}&units=${props.units}`,
          { signal: abortController.signal }
        );
        if (res.ok === false) {
          status.setError(
            "Could not connect to the weather API. Try again later."
          );
          return;
        }

        const data = (await res.json()) as ResolvedExtendedForecast;

        if (data.error) {
          status.setError(data.error);
        } else {
          status.setIdle("");
          setForecast(data.weather);
        }
      } catch {}
    };

    fetchForecast();

    return () => {
      abortController.abort();
    };
  }, [props, tick]);

  const renderDayPage = (day: number, index: number) => {
    day = day % 7;

    const entryCount = 8;
    const startIndex = index * entryCount;

    return (
      <div
        className={Styles.extendedForecastPage}
        style={{
          left: `calc(${index * 100}% - (100% * ${currentPage}))`,
        }}
      >
        <div className={Styles.extendedForecastEntryContainer}>
          {forecast
            .slice(startIndex, startIndex + entryCount)
            .map((entry, index) => {
              const date = new Date(entry.misc.time);

              return (
                <div key={index} className={Styles.extendedForecastEntry}>
                  <p className={Styles.extendedForecastEntryTime}>
                    {getDay(date.getDay())} {date.getHours()}:00
                  </p>
                  <p
                    className={Styles.extendedForecastEntryTemp}
                    title="Expected Temperature"
                  >
                    <span className={Styles.extendedForecastEntryTempLabel}>
                      Temperature:{" "}
                    </span>
                    <span className={Styles.extendedForecastEntryTempValue}>
                      {entry.temperature.air} {entry.temperature.unit}
                    </span>
                  </p>
                  <img
                    className={Styles.extendedForecastEntryIcon}
                    alt={entry.condition.name}
                    src={entry.condition.icon}
                    title={entry.condition.name}
                  />
                  <p
                    className={Styles.extendedForecastEntryPrecip}
                    title="Chance of Precip"
                  >
                    <span className={Styles.extendedForecastEntryPrecipLabel}>
                      Chance of Precip:{" "}
                    </span>
                    <span className={Styles.extendedForecastEntryPrecipValue}>
                      {Math.ceil((entry.condition.chanceOfPrecip || 0) * 100)}%
                    </span>
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  if (!forecast || status.status === StatusEnum.Error) {
    return (
      <div className={Styles.extendedForecast}>
        <div className={Styles.extendedForecastStatusContainer}>
          <p className={Styles.extendedForecastStatus}>{status.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={Styles.extendedForecast}>
      <div className={Styles.extendedForecastContainer}>
        {renderDayPage(today.getDay(), 0)}
        {renderDayPage(today.getDay() + 1, 1)}
        {renderDayPage(today.getDay() + 2, 2)}
        {renderDayPage(today.getDay() + 3, 3)}
        {renderDayPage(today.getDay() + 4, 4)}
      </div>
      <div className={Styles.extendedForecastButtonStrip}>
        <button
          className={`
            ${Styles.extendedForecastButton}
            ${currentPage === 0 && Styles.extendedForecastButtonActive}
          `}
          onClick={() => setCurrentPage(0)}
          title={`${getDay(today.getDay())}'s Forecast`}
          aria-label={`${getDay(today.getDay())}'s Forecast`}
        ></button>
        <button
          className={`
            ${Styles.extendedForecastButton}
            ${currentPage === 1 && Styles.extendedForecastButtonActive}
          `}
          onClick={() => setCurrentPage(1)}
          title={`${getDay(today.getDay() + 1)}'s Forecast`}
          aria-label={`${getDay(today.getDay() + 1)}'s Forecast`}
        ></button>
        <button
          className={`
            ${Styles.extendedForecastButton}
            ${currentPage === 2 && Styles.extendedForecastButtonActive}
          `}
          onClick={() => setCurrentPage(2)}
          title={`${getDay(today.getDay() + 2)}'s Forecast`}
          aria-label={`${getDay(today.getDay() + 2)}'s Forecast`}
        ></button>
        <button
          className={`
            ${Styles.extendedForecastButton}
            ${currentPage === 3 && Styles.extendedForecastButtonActive}
          `}
          onClick={() => setCurrentPage(3)}
          title={`${getDay(today.getDay() + 3)}'s Forecast`}
          aria-label={`${getDay(today.getDay() + 3)}'s Forecast`}
        ></button>
        <button
          className={`
            ${Styles.extendedForecastButton}
            ${currentPage === 4 && Styles.extendedForecastButtonActive}
          `}
          onClick={() => setCurrentPage(4)}
          title={`${getDay(today.getDay() + 4)}'s Forecast`}
          aria-label={`${getDay(today.getDay() + 4)}'s Forecast`}
        ></button>
      </div>
    </div>
  );
};

export default ExtendedForecast;
