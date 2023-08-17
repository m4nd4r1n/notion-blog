import ExpiryMap from 'expiry-map';
import { getAllPagesInSpace, parsePageId } from 'notion-utils';
import pMemoize from 'p-memoize';

import * as config from './config';
import { getCanonicalPageId } from './getCanonicalPageId';
import { notion } from './notion';

const cache = new ExpiryMap(10000);

export const getSiteMap = async () => {
  const siteMap = await getAllPages(config.rootNotionPageId, config.rootNotionSpageId);

  return siteMap;
};

const getAllPages = pMemoize(
  async (rootNotionPageId: string, rootNotionSpaceId: string) => {
    const getPage = async (pageId: string) => {
      return notion.getPage(pageId);
    };
    const pageMap = await getAllPagesInSpace(rootNotionPageId, rootNotionSpaceId, getPage);

    const canonicalPageMap = Object.keys(pageMap).reduce(
      (map, pageId) => {
        const cleanPageId = parsePageId(pageId, { uuid: false });
        if (cleanPageId === rootNotionPageId) return map;
        const recordMap = pageMap[pageId];
        if (!recordMap) {
          throw new Error(`Error loading page "${pageId}"`);
        }

        const canonicalPageId = getCanonicalPageId(pageId, recordMap, {
          uuid: false,
        });

        if (!canonicalPageId) return map;

        if (map[canonicalPageId]) {
          // you can have multiple pages in different collections that have the same id
          // TODO: we may want to error if neither entry is a collection page
          console.warn('error duplicate canonical page id', {
            canonicalPageId,
            pageId,
            existingPageId: map[canonicalPageId],
          });

          return map;
        } else {
          return {
            ...map,
            [canonicalPageId]: pageId,
          };
        }
      },
      {} as { [canonicalPageId: string]: string },
    );

    return {
      pageMap,
      canonicalPageMap,
    };
  },
  {
    cacheKey: (...args) => JSON.stringify(args),
    cache,
  },
);
