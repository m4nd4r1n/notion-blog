import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';

import * as config from '@/libs/config';
import MotionLayout from '@/components/MotionLayout';
import NotionPage from '@/components/NotionPage';
import { getPreviewImageMap } from '@/libs/getPreviewImageMap';
import { notion } from '@/libs/notion';
import { NotionPageProps } from '@/types/notion-page';

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  return (
    <>
      <MotionLayout>
        <NotionPage {...props} />
      </MotionLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps<NotionPageProps> = async () => {
  try {
    const recordMap = await notion.getPage(config.rootNotionPageId);
    const previewImageMap = await getPreviewImageMap(recordMap);
    recordMap.preview_images = previewImageMap;

    return {
      props: {
        recordMap,
        isPostPage: false,
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

    return { props: { error } };
  }
};

export default Home;
