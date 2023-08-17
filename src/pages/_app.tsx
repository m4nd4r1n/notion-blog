import type { AppProps } from 'next/app';

import { AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';
import 'prismjs/themes/prism-coy.css';
import 'react-notion-x/src/styles.css';

import Fonts from '@/components/app/Fonts';
import Loading from '@/components/app/Loading';
import '@/styles/globals.css';
import '@/styles/notion.css';
import '@/styles/prism-theme.css';

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <AnimatePresence mode='wait' initial={false}>
      <Loading>
        <Fonts>
          <Component {...pageProps} key={router.pathname} />
        </Fonts>
      </Loading>
    </AnimatePresence>
  );
}
