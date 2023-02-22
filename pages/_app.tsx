/**
 * @file pages / _app.tsx
 */

import type { AppProps } from "next/app"
import WeatherProvider from "../context/weather";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <WeatherProvider>
      <Component {...pageProps} />
    </WeatherProvider>
  )
};

export default App;
