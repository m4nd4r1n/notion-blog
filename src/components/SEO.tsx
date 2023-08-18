import Head from 'next/head';

import type { ExtendedRecordMap, PageBlock } from 'notion-types';
import { getBlockTitle, getPageProperty, idToUuid, uuidToId } from 'notion-utils';
import { defaultMapImageUrl } from 'react-notion-x';

import * as config from '@/libs/config';
import { getCanoicalPageUrl } from '@/libs/getCanonicalPageUrl';

interface SEOProps {
  recordMap: ExtendedRecordMap;
}

const SEO: React.FC<SEOProps> = ({ recordMap }) => {
  const keys = Object.keys(recordMap.block);
  const block = recordMap.block[keys[0]].value;
  const isRootPage = uuidToId(block.id) === config.rootNotionPageId;
  const title = getBlockTitle(block, recordMap);
  const description = getPageProperty<string>('Description', block, recordMap);
  const image = isRootPage
    ? defaultMapImageUrl((block as PageBlock).format.page_cover || '', block)
    : `${config.host}/api/social-image?id=${block.id}`;
  const canonicalPageUrl = getCanoicalPageUrl(block.id, recordMap);
  const siteName = getBlockTitle(
    recordMap.block[idToUuid(config.rootNotionPageId)].value,
    recordMap,
  );

  return (
    <Head>
      <meta charSet='utf-8' />
      <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
      <meta
        name='theme-color'
        media='(prefers-color-scheme: light)'
        content='#fefffe'
        key='theme-color-light'
      />
      <meta
        name='theme-color'
        media='(prefers-color-scheme: dark)'
        content='#2d3439'
        key='theme-color-dark'
      />
      <meta name='robots' content='index,follow' />
      <meta property='og:type' content='website' />
      <meta property='og:site_name' content={siteName} />
      <meta property='twitter:domain' content={config.domain} />
      {description && (
        <>
          <meta name='description' content={description} />
          <meta property='og:description' content={description} />
          <meta name='twitter:description' content={description} />
        </>
      )}
      {image ? (
        <>
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:image' content={image} />
          <meta property='og:image' content={image} />
        </>
      ) : (
        <meta name='twitter:card' content='summary' />
      )}
      <link rel='canonical' href={canonicalPageUrl} />
      <meta property='og:url' content={canonicalPageUrl} />
      <meta property='twitter:url' content={canonicalPageUrl} />
      <meta property='og:title' content={title} />
      <meta name='twitter:title' content={title} />
      <title>{title}</title>
    </Head>
  );
};

export default SEO;
