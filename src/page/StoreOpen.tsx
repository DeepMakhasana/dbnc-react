import { motion } from "motion/react";

const StoreOpen = () => {
  return (
    <motion.div
      initial={{
        y: 100,
        opacity: 0,
      }}
      animate={{ y: 0, opacity: 100 }}
      transition={{ duration: 1 }}
      className="flex flex-col gap-12 items-center"
    >
      <img src="/door-open.svg" alt="close" />
      <p className="text-2xl font-bold tracking-wider">OPEN</p>
    </motion.div>
  );
};

export default StoreOpen;
