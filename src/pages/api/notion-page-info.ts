import { NextApiRequest, NextApiResponse } from 'next';

import got from 'got';
import { PageBlock } from 'notion-types';
import { getBlockIcon, getBlockTitle, getPageProperty, isUrl, parsePageId } from 'notion-utils';
import { defaultMapImageUrl } from 'react-notion-x';

import * as config from '@/libs/config';
import { notion } from '@/libs/notion';
import { NotionPageInfo } from '@/types/notion-page';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' });
  }

  const pageId = parsePageId(req.body.pageId);
  if (!pageId) {
    throw new Error('Invalid notion page id');
  }

  const recordMap = await notion.getPage(pageId);

  const keys = Object.keys(recordMap.block);
  const block = recordMap.block[keys[0]].value;

  if (!block) {
    throw new Error('Invalid recordMap for page');
  }

  const blockSpaceId = block.space_id;

  if (blockSpaceId && config.rootNotionSpageId && blockSpaceId !== config.rootNotionSpageId) {
    return res.status(400).send({
      error: `Notion page "${pageId}" belongs to a different workspace.`,
    });
  }

  const isBlogPost = block.type === 'page' && block.parent_table === 'collection';
  const title = getBlockTitle(block, recordMap);

  const imageCoverPosition = (block as PageBlock).format.page_cover_position;
  const imageObjectPosition = imageCoverPosition
    ? `center ${(1 - imageCoverPosition) * 100}%`
    : null;

  const imageBlockUrl = defaultMapImageUrl(
    getPageProperty<string>('Social Image', block, recordMap) ||
      (block as PageBlock).format.page_cover ||
      '',
    block,
  );

  const blockIcon = getBlockIcon(block, recordMap);

  const authorImageBlockUrl = defaultMapImageUrl(
    blockIcon && isUrl(blockIcon)
      ? blockIcon
      : blockIcon && !isUrl(blockIcon) && blockIcon.includes('/')
      ? `https://notion.so${blockIcon}`
      : '',
    block,
  );

  const [authorImage, image] = await Promise.all([
    getCompatibleImageUrl(authorImageBlockUrl, ''),
    getCompatibleImageUrl(imageBlockUrl, ''),
  ]);

  const author = getPageProperty<string>('Author', block, recordMap);
  const description = getPageProperty<string>('Description', block, recordMap);
  const publishedTime = getPageProperty<number>('Published', block, recordMap);
  const datePublished = publishedTime ? new Date(publishedTime) : undefined;
  const tags = getPageProperty<string[]>('Tags', block, recordMap).filter(Boolean);

  const date =
    isBlogPost && datePublished
      ? `${datePublished.toLocaleString('en-US', {
          month: 'long',
        })} ${datePublished.getFullYear()}`
      : undefined;
  const detail = date || author || config.domain;

  const pageInfo: NotionPageInfo = {
    pageId,
    title,
    image,
    imageObjectPosition,
    author,
    authorImage,
    detail,
    description,
    tags,
    blockIcon,
  };

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, max-age=3600, stale-while-revalidate=3600',
  );
  res.status(200).json(pageInfo);
}

async function isUrlReachable(url: string | null): Promise<boolean> {
  if (!url) {
    return false;
  }

  try {
    await got.head(url);
    return true;
  } catch (err) {
    return false;
  }
}

async function getCompatibleImageUrl(
  url: string | null,
  fallbackUrl: string | null,
): Promise<string | null> {
  const image = (await isUrlReachable(url)) ? url : fallbackUrl;

  if (image) {
    const imageUrl = new URL(image);

    if (imageUrl.host === 'images.unsplash.com') {
      if (!imageUrl.searchParams.has('w')) {
        imageUrl.searchParams.set('w', '1200');
        imageUrl.searchParams.set('fit', 'max');
        return imageUrl.toString();
      }
    }
  }

  return image;
}
