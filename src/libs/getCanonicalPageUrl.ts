import type { ExtendedRecordMap } from 'notion-types';
import { uuidToId } from 'notion-utils';

import * as config from './config';
import { getCanonicalPageId } from './getCanonicalPageId';

export const getCanoicalPageUrl = (pageUuid: string, recordMap: ExtendedRecordMap) => {
  const isRootPage = uuidToId(pageUuid) === config.rootNotionPageId;
  const canonicalPageUrl = isRootPage
    ? `${config.host}`
    : `${config.host}/${getCanonicalPageId(pageUuid, recordMap, {
        uuid: false,
      })}`;

  return canonicalPageUrl;
};
