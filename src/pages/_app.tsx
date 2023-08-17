import type { AppProps } from 'next/app';

import Fonts from '@/components/app/Fonts';
import '@/styles/globals.css';

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <Fonts>
      <Component {...pageProps} key={router.pathname} />
    </Fonts>
  );
}
