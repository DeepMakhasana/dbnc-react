const Progressbar = ({ step }: { step: number }) => {
  const progress = (step / 6) * 100;
  const formTitle: Record<number, string> = {
    1: "Main Information",
    2: "Address Information",
    3: "Feedback & UPI id",
    4: "Category & Services",
    5: "Social media links",
    6: "Photos",
  };
  return (
    <div>
      <div className="h-2 bg-gray-300 rounded-full overflow-hidden mb-8">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>
      <h2 className="text-2xl font-medium pl-4 py-2 border-l-4 border-primary rounded">{formTitle[step]}</h2>
    </div>
  );
};

export default Progressbar;
