import { motion, useScroll, useSpring } from 'framer-motion';
import ReactDOM from 'react-dom';

const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return ReactDOM.createPortal(
    <motion.div
      className='fixed left-0 top-[50px] z-[9999] h-1 w-full bg-gradient-to-l from-orange-500 to-yellow-300'
      style={{ scaleX: scaleX, originX: 0 }}
    />,
    document.getElementById('scroll-progress-root') as HTMLElement,
  );
};

export default ScrollProgressBar;
