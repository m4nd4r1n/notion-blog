import type { GetServerSideProps } from 'next';

import * as config from '@/libs/config';
import { getSiteMap } from '@/libs/getSiteMap';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({ error: 'method not allowed' }));
    res.end();
    return {
      props: {},
    };
  }

  const siteMap = await getSiteMap();

  // cache for up to 8 hours
  res.setHeader('Cache-Control', 'public, max-age=28800, stale-while-revalidate=28800');
  res.setHeader('Content-Type', 'text/xml');
  res.write(createSitemap(siteMap));
  res.end();

  return {
    props: {},
  };
};

const createSitemap = (siteMap: Awaited<ReturnType<typeof getSiteMap>>) =>
  `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${config.host}</loc>
    </url>

    ${Object.keys(siteMap.canonicalPageMap)
      .map((canonicalPagePath) =>
        `
          <url>
            <loc>${config.host}/posts/${canonicalPagePath}</loc>
          </url>
        `.trim(),
      )
      .join('')}
  </urlset>
`;

const SiteMap = () => null;

export default SiteMap;
