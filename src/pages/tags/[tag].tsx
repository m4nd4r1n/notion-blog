import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';

import omit from 'lodash.omit';
import { idToUuid } from 'notion-utils';

import * as config from '@/libs/config';
import MotionLayout from '@/components/MotionLayout';
import NotionPage from '@/components/NotionPage';
import { normalizeTitle } from '@/libs/getCanonicalPageId';
import { getPreviewImageMap } from '@/libs/getPreviewImageMap';
import { notion } from '@/libs/notion';
import { NotionPageProps } from '@/types/notion-page';

const TagPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  return (
    <MotionLayout>
      <NotionPage {...props} />
    </MotionLayout>
  );
};

export const getStaticProps: GetStaticProps<NotionPageProps, { tag: string }> = async (context) => {
  if (!context.params) throw new Error('No params');
  const rawTagName = context.params.tag;

  try {
    const recordMap = await notion.getPage(config.rootNotionPageId);

    const collection = Object.values(recordMap.collection)[0].value;

    const galleryView = Object.values(recordMap.collection_view).find(
      (view) => view.value.type === 'gallery',
    )?.value;
    if (!galleryView) throw new Error('The gallery is not found');

    const galleryBlock = Object.values(recordMap.block).find(
      (block) =>
        block.value.type === 'collection_view' && block.value.view_ids.includes(galleryView.id),
    );
    if (!galleryBlock?.value) throw new Error('The collection view is not found');

    recordMap.block = {
      [galleryBlock.value.id]: galleryBlock,
      ...omit(recordMap.block, [galleryBlock.value.id]),
    };

    const rootPageBlock = recordMap.block[idToUuid(config.rootNotionPageId)];
    galleryBlock.value.format = {
      ...galleryBlock.value.format,
      page_cover: rootPageBlock.value.format.page_cover,
      page_cover_position: rootPageBlock.value.format.page_cover_position,
    };

    const propertyToFilter = Object.entries(collection.schema).find(
      (property) => property[1]?.name?.toLowerCase() === 'tags',
    );
    if (!propertyToFilter) throw new Error('The property to filter is not found');

    const propertyToFilterId = propertyToFilter[0];
    const filteredValue = normalizeTitle(rawTagName);
    const propertyToFilterName = propertyToFilter[1].options?.find(
      (option) => normalizeTitle(option.value) === filteredValue,
    )?.value;
    if (!propertyToFilterName) throw new Error('No matching tags');

    const query = recordMap.collection_query[collection.id][galleryView.id];
    const queryResults = query.collection_group_results ?? query;

    queryResults.blockIds = queryResults.blockIds.filter((blockId) => {
      const block = recordMap.block[blockId]?.value;
      if (!block || !block.properties) return false;
      const property = block.properties[propertyToFilterId]?.[0]?.[0];
      if (!property) return false;
      const properties = property.split(',');
      if (!properties.find((value: string) => normalizeTitle(value) === filteredValue))
        return false;
      return true;
    });

    if (!queryResults.blockIds.length) throw new Error('No matching tags');

    const previewImageMap = await getPreviewImageMap(recordMap);
    recordMap.preview_images = previewImageMap;

    return {
      props: {
        recordMap,
        isTagPage: true,
        propertyToFilterName,
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

  const recordMap = await notion.getPage(config.rootNotionPageId);
  if (!recordMap) throw new Error('No recordMap');

  const collection = Object.values(recordMap.collection)[0].value;
  if (!collection) throw new Error('No collection');

  const propertyToFilterSchema = Object.entries(collection.schema).find(
    (property) => property[1]?.name?.toLowerCase() === 'tags',
  )?.[1];
  const paths =
    propertyToFilterSchema?.options
      ?.map((option) => normalizeTitle(option.value))
      .filter(Boolean)
      .map((slug) => `/tags/${slug}`) ?? [];

  return {
    paths,
    fallback: true,
  };
};

export default TagPage;
