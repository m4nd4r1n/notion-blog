import localFont from 'next/font/local';

const Fonts: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className={`${suitVariable.variable} ${mesloLgsNf.variable}`}>{children}</div>;
};

const suitVariable = localFont({
  variable: '--notion-font',
  src: [
    {
      path: '../../../public/fonts/SUIT-Variable.woff2',
    },
  ],
});

const mesloLgsNf = localFont({
  variable: '--code-font',
  src: [
    {
      path: '../../../public/fonts/MesloLGS-NF-Regular.woff2',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../../../public/fonts/MesloLGS-NF-Italic.woff2',
      style: 'italic',
      weight: '400',
    },
    {
      path: '../../../public/fonts/MesloLGS-NF-Bold.woff2',
      style: 'normal',
      weight: '700',
    },
    {
      path: '../../../public/fonts/MesloLGS-NF-Bold-Italic.woff2',
      style: 'italic',
      weight: '700',
    },
  ],
});

export default Fonts;
