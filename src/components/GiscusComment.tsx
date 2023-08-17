import Giscus from '@giscus/react';

import * as config from '@/libs/config';
import { useTheme } from '@/hooks/useTheme';

const GiscusComment: React.FC = () => {
  const { isDarkTheme } = useTheme();
  return (
    <>
      <div className='notion-hr' />
      <div className='w-full'>
        <Giscus
          id='comments'
          {...config.giscusConfig}
          theme={isDarkTheme ? 'dark_dimmed' : 'light'}
        />
      </div>
    </>
  );
};

export default GiscusComment;
