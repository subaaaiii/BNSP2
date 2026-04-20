type DataType = {
  image?: string;
  brand: string;
  title: string;
  price: string;
  profile?: string;
  name_store: string;
};

const Card = ({
  image,
  brand,
  title,
  price,
  profile,
  name_store,
}: DataType) => {

  const formattedPrice = new Intl.NumberFormat("id-ID").format(Number(price));

  return (
    <div className="card bg-bg w-full shadow-sm rounded-md overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full  aspect-[1.8/1]  object-cover rounded-t-md hover:scale-110"
        />

      <div className="flex flex-col gap-1 px-6 py-3 cursor-pointer">
        <span className="text-base text-gray-400">{brand}</span>

        <span className="text-2xl font-semibold hover:underline truncate text-primary1">
          {title}
        </span>

        <span className="text-xl font-semibold text-secondary1">
          Rp. {formattedPrice}
        </span>
      </div>

      <hr className="border-gray-300" />

      <div className="flex gap-2 px-6 items-center py-3">
        <img
          src={profile}
          alt={name_store}
          className="w-8 h-8 rounded-full object-cover"
        />

        <span className="font-semibold text-lg text-primary1">{name_store}</span>
      </div>
    </div>
  );
};

export default Card;