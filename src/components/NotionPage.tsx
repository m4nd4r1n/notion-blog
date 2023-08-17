/* eslint-disable @typescript-eslint/no-explicit-any */
import dynamic from 'next/dynamic';
import ErrorComponent from 'next/error';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { formatDate, parsePageId, uuidToId } from 'notion-utils';
import { ComponentOverrideFn, NotionRenderer } from 'react-notion-x';

import * as config from '@/libs/config';
import { useTheme } from '@/hooks/useTheme';
import { getCanonicalPageId, normalizeTitle } from '@/libs/getCanonicalPageId';
import { truthy } from '@/libs/truthy';
import { NotionPageProps } from '@/types/notion-page';

import GiscusComment from './GiscusComment';
import PageHeader from './PageHeader';
import ScrollProgressBar from './ScrollProgressBar';

const NotionPage: React.FC<NotionPageProps> = ({
  recordMap,
  isPostPage = false,
  isTagPage = false,
  propertyToFilterName = '',
  error,
}) => {
  const { isDarkTheme, themeLoaded } = useTheme();
  const router = useRouter();
  const components = useMemo(
    () => ({
      nextLink: Link,
      Header: PageHeader,
      Code,
      Equation,
      Modal,
      Collection,
      propertyDateValue,
      propertyTextValue,
      propertySelectValue,
      Image: ({ alt, ...rest }: any) => <Image alt={alt} {...rest} />,
      PageLink: ({ children, href, ...rest }: any) => (
        <Link href={href} {...rest}>
          {children}
        </Link>
      ),
    }),
    [],
  );

  if (error || !recordMap)
    return <ErrorComponent statusCode={error?.statusCode ?? 404} title={error?.message} />;

  const siteMapPageUrl = (pageId: string) => {
    const searchParams = new URLSearchParams();
    const id = parsePageId(pageId, { uuid: true });
    return uuidToId(id) === process.env.NEXT_PUBLIC_ROOT_NOTION_PAGE_ID
      ? createUrl('/', searchParams)
      : createUrl(`/posts/${getCanonicalPageId(id, recordMap, { uuid: false })}`, searchParams);
  };

  const createUrl = (path: string, searchParams: URLSearchParams) => {
    return [path, searchParams.toString()].filter(truthy).join('?');
  };

  const title = isTagPage && propertyToFilterName ? `${propertyToFilterName} Posts` : undefined;

  if (router.isFallback || !themeLoaded) {
    return null;
  }

  return (
    <>
      {isPostPage && <ScrollProgressBar />}
      <NotionRenderer
        recordMap={recordMap}
        fullPage
        darkMode={isDarkTheme}
        mapPageUrl={siteMapPageUrl}
        isImageZoomable
        components={components}
        showTableOfContents
        pageTitle={title}
        bodyClassName={isTagPage ? 'tags-page' : undefined}
        pageFooter={isPostPage && !!config.giscusConfig.repo && <GiscusComment />}
        previewImages
      />
    </>
  );
};

const propertyDateValue: ComponentOverrideFn = ({ data, schema, pageHeader }, defaultFn) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'published') {
    const publishDate = data?.[0]?.[1]?.[0]?.[1]?.start_date;

    if (publishDate) {
      return `${formatDate(publishDate, {
        month: 'long',
      })}`;
    }
  }

  return defaultFn();
};

const propertyTextValue: ComponentOverrideFn = ({ schema, pageHeader }, defaultFn) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'author') {
    return (
      <a
        className='notion-link'
        href='https://github.com/m4nd4r1n'
        target='_blank'
        rel='noopener noreferrer'
      >
        <b>{defaultFn()}</b>
      </a>
    );
  }

  return defaultFn();
};

const propertySelectValue: ComponentOverrideFn = (
  { schema, pageHeader, key, value },
  defaultFn,
) => {
  value = normalizeTitle(value);
  if (pageHeader && schema.type === 'multi_select' && value) {
    return (
      <Link key={key} href={`/tags/${value}`}>
        {defaultFn()}
      </Link>
    );
  }
  return defaultFn();
};

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then(async (m) => {
    await Promise.allSettled([
      require('prismjs/components/prism-markup-templating.js'),
      require('prismjs/components/prism-markup.js'),
      require('prismjs/components/prism-bash.js'),
      require('prismjs/components/prism-c.js'),
      require('prismjs/components/prism-cpp.js'),
      require('prismjs/components/prism-docker.js'),
      require('prismjs/components/prism-java.js'),
      require('prismjs/components/prism-js-templates.js'),
      require('prismjs/components/prism-diff.js'),
      require('prismjs/components/prism-git.js'),
      require('prismjs/components/prism-graphql.js'),
      require('prismjs/components/prism-handlebars.js'),
      require('prismjs/components/prism-less.js'),
      require('prismjs/components/prism-makefile.js'),
      require('prismjs/components/prism-markdown.js'),
      require('prismjs/components/prism-python.js'),
      require('prismjs/components/prism-rust.js'),
      require('prismjs/components/prism-sass.js'),
      require('prismjs/components/prism-scss.js'),
      require('prismjs/components/prism-sql.js'),
      require('prismjs/components/prism-stylus.js'),
      require('prismjs/components/prism-yaml.js'),
    ]);
    return m.Code;
  }),
);
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation),
);
const Modal = dynamic(
  () =>
    import('react-notion-x/build/third-party/modal').then((m) => {
      m.Modal.setAppElement('.notion-viewport');
      return m.Modal;
    }),
  {
    ssr: false,
  },
);
const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then((m) => m.Collection),
);

export default NotionPage;
