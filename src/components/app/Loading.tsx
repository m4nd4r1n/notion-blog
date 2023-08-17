import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Loading: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isFallback, events } = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadingStart = () => {
      setLoading(true);
    };
    const loadingEnd = () => {
      setLoading(false);
    };
    events.on('routeChangeStart', loadingStart);
    events.on('routeChangeComplete', loadingEnd);
    events.on('routeChangeError', loadingEnd);
    return () => {
      events.off('routeChangeStart', loadingStart);
      events.off('routeChangeComplete', loadingEnd);
      events.off('routeChangeError', loadingEnd);
    };
  }, [events]);

  return isFallback || loading ? (
    <div
      className={
        'fixed left-0 top-0 z-[9999] flex h-full w-full items-center justify-center bg-white dark:bg-dark'
      }
    >
      <span className='loading bg-dark dark:bg-white'></span>
    </div>
  ) : (
    children
  );
};

export default Loading;
