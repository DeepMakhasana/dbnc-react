import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex gap-2 w-full justify-center items-center">
      <Loader2 className="animate-spin" /> Loading...
    </div>
  );
};

export default Loader;
