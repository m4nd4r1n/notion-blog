import Image from 'next/image';

interface HitCounterProps {
  targetUrl: string;
  border?: 'round' | 'flat';
  title?: string;
  titleBgColor?: string;
  countBgColor?: string;
}

const HitCounter: React.FC<HitCounterProps> = ({
  targetUrl,
  border = 'round',
  countBgColor = '#79C83D',
  title = 'hits',
  titleBgColor = '#555555',
}) => {
  const imageUrl = new URL('https://hits.seeyoufarm.com/api/count/incr/badge.svg');
  imageUrl.searchParams.set('url', targetUrl);
  imageUrl.searchParams.set('count_bg', countBgColor);
  imageUrl.searchParams.set('title_bg', titleBgColor);
  imageUrl.searchParams.set('title', title);
  imageUrl.searchParams.set('edge_flat', border === 'flat' ? 'true' : 'false');

  return (
    <>
      <div className='notion-hr' />
      <Image src={imageUrl.toString()} alt='hit-counter' width={84} height={19} />
    </>
  );
};

export default HitCounter;
