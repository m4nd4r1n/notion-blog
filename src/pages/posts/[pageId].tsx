import { GetStaticPaths } from 'next';
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';

import { parsePageId } from 'notion-utils';

import * as config from '@/libs/config';
import MotionLayout from '@/components/MotionLayout';
import NotionPage from '@/components/NotionPage';
import { getPreviewImageMap } from '@/libs/getPreviewImageMap';
import { getSiteMap } from '@/libs/getSiteMap';
import { notion } from '@/libs/notion';
import type { NotionPageProps } from '@/types/notion-page';

const PostPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  return (
    <>
      <MotionLayout>
        <NotionPage {...props} />
      </MotionLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps<NotionPageProps, { pageId: string }> = async (
  context,
) => {
  if (!context.params) throw new Error('No params');
  const rawPageId = context.params.pageId;
  try {
    const pageId = parsePageId(rawPageId);
    let recordMap;
    if (pageId) recordMap = await notion.getPage(pageId);
    else {
      const siteMap = await getSiteMap();
      const pageId = siteMap.canonicalPageMap[rawPageId];
      if (pageId) recordMap = await notion.getPage(pageId);
      else throw new Error('No matching post');
    }
    const previewImageMap = await getPreviewImageMap(recordMap);
    recordMap.preview_images = previewImageMap;

    return {
      props: {
        recordMap,
        isPostPage: true,
      },
      revalidate: 10,
    };
  } catch (e) {
    console.error(e);

    let error;
    if (e instanceof Error) {
      error = {
        statusCode: 404,
        message: e.message,
      };
    }

    return {
      props: {
        error,
      },
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  if (config.isDev) return { paths: [], fallback: true };

  const siteMap = await getSiteMap();

  const staticPaths = {
    paths: Object.keys(siteMap.canonicalPageMap).map((pageId) => ({
      params: {
        pageId,
      },
    })),
    fallback: true,
  };

  return staticPaths;
};

export default PostPage;
