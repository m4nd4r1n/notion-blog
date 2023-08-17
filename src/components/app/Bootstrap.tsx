import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';

import posthog, { type PostHogConfig } from 'posthog-js';

import * as gtag from '@/libs/gtag';
import { useThemeBootstrap } from '@/hooks/useTheme';

const Bootstrap: React.FC = () => {
  const { events } = useRouter();

  useEffect(() => {
    const onRouteChangeComplete = (url: URL) => {
      if (posthogId) {
        posthog.capture('$pageview');
      }
      if (gtag.GA_TRACKING_ID) {
        gtag.pageview(url);
      }
    };
    if (posthogId) {
      posthog.init(posthogId, posthogConfig);
    }
    events.on('routeChangeComplete', onRouteChangeComplete);
    return () => {
      events.off('routeChangeComplete', onRouteChangeComplete);
    };
  }, [events]);

  useEffect(() => {
    bootstrap();
  }, []);

  useThemeBootstrap();

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy='afterInteractive'
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id='gtag-init'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};

const bootstrap = () =>
  console.log(`
              ___             _    ___        __         
             /   |           | |  /   |      /  |        
 _ __ ___   / /| | _ __    __| | / /| | _ __ \`| |  _ __  
| '_ \` _ \\ / /_| || '_ \\  / _\` |/ /_| || '__| | | | '_ \\ 
| | | | | |\\___  || | | || (_| |\\___  || |   _| |_| | | |
|_| |_| |_|    |_/|_| |_| \\__,_|    |_/|_|   \\___/|_| |_|

This site is built using Notion, Next.js, and https://github.com/NotionX/react-notion-x.
`);

const posthogId = process.env.NEXT_PUBLIC_POSTHOG_ID;
const posthogConfig: Partial<PostHogConfig> = {
  api_host: 'https://app.posthog.com',
};

export default Bootstrap;
