import { motion } from "motion/react";
import { useNavigate, useSearchParams } from "react-router-dom";

const StoreClose = () => {
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
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-6 items-center"
    >
      <h2 className="text-xl font-bold">{decodeURI(name as string)}</h2>
      <p className="text-lg font-semibold tracking-wider bg-primary rounded text-background px-4 py-1">CLOSE</p>
      <img src="/door-closed.svg" alt="close" />
    </motion.div>
  );
};

export default StoreClose;
