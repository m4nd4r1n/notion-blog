import type { ExtendedRecordMap } from 'notion-types';

export interface NotionPageError {
  statusCode: number;
  message: string;
}

export interface NotionPageProps {
  recordMap?: ExtendedRecordMap;
  isPostPage?: boolean;
  isTagPage?: boolean;
  propertyToFilterName?: string;
  error?: NotionPageError;
}

export interface NotionPageInfo {
  pageId: string;
  title: string;
  image: string | null;
  imageObjectPosition: string | null;
  author: string;
  authorImage: string | null;
  detail: string;
  description: string;
  tags: string[];
  blockIcon: string;
}
