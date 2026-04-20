import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductCardSkeleton = () => {
  return (
    <div className="card bg-base-100 w-full shadow-sm rounded-md overflow-hidden">
      
      {/* Image */}
      <Skeleton className="w-full aspect-[1.6/1]" />

      {/* Content */}
      <div className="flex flex-col gap-2 px-6 py-3">
        <Skeleton width="40%" height={16} /> {/* brand */}
        <Skeleton width="90%" height={20} /> {/* title */}
        <Skeleton width="60%" height={20} /> {/* price */}
      </div>

      <hr className="border-gray-300" />

      {/* Profile */}
      <div className="flex gap-2 px-6 items-center py-3">
        <Skeleton circle width={32} height={32} />
        <Skeleton width={120} height={16} />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;