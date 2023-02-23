/**
 * @file pages / index.tsx
 */

import { useEffect } from 'react';
import { resolveCoordinate } from '../lib/location';

const HomePage = () => {
  useEffect(() => {
    const test = async () => {
      // const data = await resolveCoordinate(42.1841372, -86.275828);
      // console.log(data);

      // const res = await fetch(`/api/location/coordinates?lat=${42.1841372}&lon=${-86.275828}`);
      // const res = await fetch(`/api/location/zip?zip=49098`);
      const res = await fetch(`/api/location/city?city=Watervliet`);
      const data = await res.json();

      console.log(data);
    };

    test();
  }, []);

  return <></>
};

export default HomePage;
