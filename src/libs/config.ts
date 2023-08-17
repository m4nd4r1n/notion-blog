import type { BooleanString, InputPosition, Loading, Mapping } from '@giscus/react';

export const giscusConfig = {
  repo: (process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`) ?? '',
  repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? '',
  category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? 'Announcements',
  categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? '',
  mapping: (process.env.NEXT_PUBLIC_GISCUS_GISCUS_MAPPING as Mapping) ?? 'pathname',
  strict: (process.env.NEXT_PUBLIC_GISCUS_GISCUS_STRICT as BooleanString) ?? '0',
  reactionsEnabled:
    (process.env.NEXT_PUBLIC_GISCUS_GISCUS_REACTIONS_ENABLED as BooleanString) ?? '1',
  emitMetadata: (process.env.NEXT_PUBLIC_GISCUS_GISCUS_EMIT_METADATA as BooleanString) ?? '0',
  inputPosition:
    (process.env.NEXT_PUBLIC_GISCUS_GISCUS_INPUT_POSITION as InputPosition) ?? 'bottom',
  lang: process.env.NEXT_PUBLIC_GISCUS_GISCUS_LANG ?? 'en',
  loading: process.env.NEXT_PUBLIC_GISCUS_GISCUS_LOADING as Loading,
};
export const rootNotionPageId = process.env.NEXT_PUBLIC_ROOT_NOTION_PAGE_ID ?? '';
export const rootNotionSpageId = process.env.NEXT_PUBLIC_ROOT_NOTION_SPACE_ID ?? '';
export const domain = process.env.NEXT_PUBLIC_DOMAIN ?? '';
export const isDev = process.env.NODE_ENV === 'development';
export const host = isDev ? 'http://localhost:3000' : `https://${domain}`;
