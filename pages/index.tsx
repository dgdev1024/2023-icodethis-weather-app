/**
 * @file pages / index.tsx
 */

import { useEffect } from "react";
import { useWeatherContext } from "../context/weather";

const HomePage = () => {
  const weather = useWeatherContext();

  const test = async () => {
    await weather.addCoordinate(44.34, 10.99);
  };

  return (
    <>
      <h1>Welcome To Next.JS!</h1>
      <button onClick={test}>Clicky!</button>
    </>
  );
};

export default HomePage;
