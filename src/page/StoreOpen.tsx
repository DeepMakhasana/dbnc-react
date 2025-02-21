import { motion } from "motion/react";
import { useNavigate, useSearchParams } from "react-router-dom";

const StoreOpen = () => {
  const [queryParams] = useSearchParams();
  const navigate = useNavigate();
  const name = queryParams.get("name");

  if (!name) {
    navigate("/");
  }

  return (
    <motion.div
      initial={{
        y: 100,
        opacity: 0,
      }}
      animate={{ y: 0, opacity: 100 }}
      transition={{ duration: 1 }}
      className="flex flex-col gap-6 items-center"
    >
      <h2 className="text-2xl font-semibold">{decodeURI(name as string)}</h2>
      <img src="/door-open.svg" alt="close" />
      <p className="text-lg font-semibold tracking-wider bg-primary rounded text-background px-4 py-1">OPEN</p>
    </motion.div>
  );
};

export default StoreOpen;
