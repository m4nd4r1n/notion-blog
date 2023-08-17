import { motion, useIsPresent } from 'framer-motion';

const MotionLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const isPresent = useIsPresent();

  return (
    <>
      {children}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{
          opacity: 0,
          transition: { duration: 0.5, ease: 'easeInOut' },
        }}
        exit={{ opacity: 1, transition: { duration: 0.5, ease: 'easeInOut' } }}
        style={{ opacity: isPresent ? 1 : 0 }}
        className='pointer-events-none fixed bottom-0 left-0 right-0 top-0 z-[9999] bg-white dark:bg-dark'
      />
    </>
  );
};

export default MotionLayout;
