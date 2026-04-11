import Skeleton from "react-loading-skeleton";

const CardSkeleton = () => {
  return (
    <div className="relative h-48 rounded-xl overflow-hidden shadow-lg ">
      <Skeleton className="absolute inset-0 h-48 pt-4" />
    </div>
  );
};
export default CardSkeleton;
