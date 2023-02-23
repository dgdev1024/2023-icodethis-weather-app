/**
 * @file pages / _app.tsx
 */

import type { AppProps } from "next/app"
import { Open_Sans } from '@next/font/google';

const openSans = Open_Sans({
  weight: [ '400', '600', '700' ],
  subsets: ['latin']
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <main className={openSans.className}>
      <Component {...pageProps} />
    </main>
  )
};

export default App;
