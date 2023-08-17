import type { CollectionViewPageBlock, PageBlock } from 'notion-types';
import { IoMoonSharp, IoSunnyOutline } from 'react-icons/io5';
import { Breadcrumbs } from 'react-notion-x';

import { useTheme } from '@/hooks/useTheme';

interface PageHeaderProps {
  block: CollectionViewPageBlock | PageBlock;
}

const PageHeader: React.FC<PageHeaderProps> = ({ block }) => {
  return (
    <header className='notion-header'>
      <div className='notion-nav-header'>
        <Breadcrumbs block={block} rootOnly />
        <div className='notion-nav-header-rhs breadcrumbs'>
          <ToggleThemeButton />
        </div>
      </div>
    </header>
  );
};

const ToggleThemeButton = () => {
  const { isDarkTheme, toggleTheme, themeLoaded } = useTheme();

  const onClickToggle: React.MouseEventHandler<HTMLDivElement> = () => {
    toggleTheme();
  };

  return themeLoaded ? (
    <div className='breadcrumb button' onClick={onClickToggle}>
      {isDarkTheme ? <IoMoonSharp /> : <IoSunnyOutline />}
    </div>
  ) : null;
};

export default PageHeader;
