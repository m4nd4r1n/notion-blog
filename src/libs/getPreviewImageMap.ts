import got from 'got';
import lqip from 'lqip-modern';
import { ExtendedRecordMap } from 'notion-types';
import { getPageImageUrls } from 'notion-utils';
import pMap from 'p-map';
import pMemoize from 'p-memoize';
import { defaultMapImageUrl } from 'react-notion-x';

export const getPreviewImageMap = async (recordMap: ExtendedRecordMap) => {
  const urls = getPageImageUrls(recordMap, {
    mapImageUrl: defaultMapImageUrl,
  });

  const previewImagesMap = Object.fromEntries(
    await pMap(urls, async (url) => [url, await getPreviewImage(url)], {
      concurrency: 8,
    }),
  );

  return previewImagesMap;
};

const createPreviewImage = async (url: string) => {
  try {
    const { body } = await got(url, { responseType: 'buffer' });
    const result = await lqip(body);

    return {
      originalWidth: result.metadata.originalWidth,
      originalHeight: result.metadata.originalHeight,
      dataURIBase64: result.metadata.dataURIBase64,
    };
  } catch (err) {
    console.warn('failed to create preview image', url, err);
    return null;
  }
};

const getPreviewImage = pMemoize(createPreviewImage);
