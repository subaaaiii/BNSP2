type DataType = {
  image?: string;
  brand: string;
  title: string;
  price: string;
  profile?: string;
  name_store: string;
  onClick?: () => void;
};

const Card = ({
  image,
  brand,
  title,
  price,
  profile,
  name_store,
  onClick,
}: DataType) => {
  const formattedPrice = new Intl.NumberFormat("id-ID").format(Number(price));

  return (
    <div className="card flex flex-row md:flex-col bg-bg shadow-sm rounded-md min-w-0" onClick={onClick}>
      <img
        src={image}
        alt={title}
        className="w-32 h-32 md:w-full md:h-auto 
             aspect-square md:aspect-[1.8/1] 
             object-cover rounded-md md:rounded-t-md "
      />

      <div className="flex flex-col flex-1 gap-1 px-3 md:px-6 py-1 md:py-3 cursor-pointer min-w-0">
        <span className="text-xs md:text-base text-gray-400">{brand}</span>

        <span className="text-lg md:text-2xl font-semibold hover:underline truncate text-primary1">
          {title}
        </span>

        <span className="text-sm md:text-xl font-semibold text-secondary1">
          Rp. {formattedPrice}
        </span>
        <hr className="block md:hidden border-gray-300" />

        <div className="block md:hidden flex md:gap-2 md:px-6 items-center py-1 md:py-3">
          <img
            src={profile}
            alt={name_store}
            className="w-6 md:w-8 h-6 md:h-8 rounded-full object-cover"
          />

          <span className="font-semibold text-sm md:text-lg text-primary1">
            {name_store}
          </span>
        </div>
      </div>

      <hr className="hidden md:block border-gray-300" />

      <div className="hidden md:flex gap-2 md:px-6 md:items-center py-3">
        <img
          src={profile}
          alt={name_store}
          className="w-8 h-8 rounded-full object-cover"
        />

        <span className="font-semibold text-lg text-primary1">
          {name_store}
        </span>
      </div>
    </div>
  );
};

export default Card;
