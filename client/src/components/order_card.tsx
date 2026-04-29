type DataType = {
  image?: string;
  brand: string;
  title: string;
};

const OrderCard = ({
  image,
  brand,
  title,
}: DataType) => {

  return (
    <div className="card flex flex-row bg-bg min-w-0">
      <img
        src={image}
        alt={title}
        className="w-32
            aspect-[1.8/1] 
            object-cover rounded-md "
      />

      <div className="flex flex-col flex-1 px-3 md:px-6 justify-center">
        <span className="text-xs md:text-base text-gray-400">{brand}</span>
        <span className="text-lg md:text-xl font-semibold  truncate text-primary1">
          {title}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
