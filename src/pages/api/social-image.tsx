/* eslint-disable jsx-a11y/alt-text */

/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import { PageConfig } from 'next';
import { NextRequest } from 'next/server';

import { ImageResponse } from '@vercel/og';

import * as c from '@/libs/config';
import { NotionPageInfo } from '@/types/notion-page';

const suitRegular = fetch(new URL('../../../public/fonts/SUIT-Regular.otf', import.meta.url)).then(
  (res) => res.arrayBuffer(),
);
const suitBold = fetch(new URL('../../../public/fonts/SUIT-Bold.otf', import.meta.url)).then(
  (res) => res.arrayBuffer(),
);

export const config: PageConfig = {
  runtime: 'edge',
};

export default async function OGImage(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageId = searchParams.get('id') || c.rootNotionPageId;
  if (!pageId) {
    return new Response('Invalid notion page id', { status: 400 });
  }
  const pageInfoRes = await fetch(`${c.host}/api/notion-page-info`, {
    method: 'POST',
    body: JSON.stringify({ pageId }),
    headers: {
      'content-type': 'application/json',
    },
  });
  if (!pageInfoRes.ok) {
    return new Response(pageInfoRes.statusText, { status: pageInfoRes.status });
  }

  const [pageInfo, suitRegularFont, suitBoldFont] = await Promise.all([
    pageInfoRes.json() as Promise<NotionPageInfo>,
    suitRegular,
    suitBold,
  ]);

  return new ImageResponse(
    (
      <div
        style={{ fontFamily: '"SUIT", sans-serif' }}
        tw='relative w-full h-full flex flex-col bg-[#1F2027] items-center justify-center text-black'
      >
        {pageInfo.image && (
          <img src={pageInfo.image} style={{ objectFit: 'cover' }} tw='absolute w-full h-full' />
        )}
        <div tw='relative w-[900px] h-[465px] flex flex-col border-[16px] border-[rgba(0,0,0,0.3)] rounded-[8px]'>
          <div tw='w-full h-full flex flex-col justify-around bg-white p-6 items-center text-center'>
            <div style={{ fontSize: 32, opacity: 0 }}>{pageInfo.detail}</div>
            <div style={{ fontFamily: '"SUIT", sans-serif' }} tw='text-7xl font-bold'>
              {pageInfo.title}
            </div>
            <div tw='text-3xl opacity-60'>{pageInfo.detail}</div>
          </div>
        </div>
        <div tw='absolute top-12 left-28 w-32 h-32 flex'>
          {pageInfo.authorImage ? (
            <img src={pageInfo.authorImage} tw='w-full h-full rounded' />
          ) : (
            <div tw='flex items-center justify-center w-full h-full text-9xl'>
              {pageInfo.blockIcon}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'SUIT',
          data: suitRegularFont,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'SUIT',
          data: suitBoldFont,
          style: 'normal',
          weight: 700,
        },
      ],
    },
  );
}
