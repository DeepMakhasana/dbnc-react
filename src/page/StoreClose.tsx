import { motion } from "motion/react";

const StoreClose = () => {
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
      <img src="/door-closed.svg" alt="close" />
      <p className="text-2xl font-bold tracking-wider">CLOSE</p>
    </motion.div>
  );
};

export default StoreClose;
