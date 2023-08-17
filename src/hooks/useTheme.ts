import { useEffect, useState } from 'react';

import { useBoundStore } from '@/stores';
import { THEME_STORAGE_KEY } from '@/stores/theme';

export const useTheme = () => {
  const { theme, setDark, setLight } = useBoundStore();
  const [themeLoaded, setThemeLoaded] = useState(false);

  const toggleTheme = () => {
    if (theme === 'dark') setLight();
    else setDark();
  };

  useEffect(() => {
    setThemeLoaded(true);
  }, []);

  return { isDarkTheme: theme === 'dark', toggleTheme, themeLoaded };
};

export const useThemeBootstrap = () => {
  const { theme, setDark, setLight } = useBoundStore();

  useEffect(() => {
    if (
      theme === 'dark' ||
      (!(THEME_STORAGE_KEY in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      if (!document.body.classList.contains('dark')) document.body.classList.add('dark');
      if (document.body.classList.contains('light')) document.body.classList.remove('light');
      setDark();
    } else {
      if (!document.body.classList.contains('light')) document.body.classList.add('light');
      if (document.body.classList.contains('dark')) document.body.classList.remove('dark');
      setLight();
    }
  }, [theme, setDark, setLight]);

  useEffect(() => {
    const onThemeChange = (e: MediaQueryListEvent) => {
      if (e.matches) setDark();
      else setLight();
    };
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', onThemeChange);
    return () => {
      mediaQuery.removeEventListener('change', onThemeChange);
    };
  }, [setDark, setLight]);
};
