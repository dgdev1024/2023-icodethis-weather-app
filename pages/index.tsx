/**
 * @file pages / index.tsx
 */

import Head from "next/head";
import Container from "../com/container";

const HomePage = () => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>DG's Weather App</title>
      </Head>
      <Container />
    </>
  );
};

export default HomePage;
