const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-white/40 rounded-[40px] p-8">

      <div className="h-12 w-60 bg-gray-300 rounded-xl mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="h-[400px] rounded-[30px] bg-gray-300" />

        <div className="space-y-4">
          <div className="h-10 bg-gray-300 rounded-xl" />
          <div className="h-10 bg-gray-300 rounded-xl" />
          <div className="h-10 bg-gray-300 rounded-xl" />
        </div>

      </div>
    </div>
  );
};

export default SkeletonCard;