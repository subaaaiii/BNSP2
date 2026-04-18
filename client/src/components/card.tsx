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
    <div className="card bg-base-100 w-74 shadow-sm rounded-md">
        <img
          src={image}
          alt={title}
          className="w-full  aspect-[1.6/1]  object-cover rounded-t-md"
        />

      <div className="flex flex-col gap-1 px-6 py-3 cursor-pointer">
        <span className="text-base text-gray-400">{brand}</span>

        <span className="text-2xl font-semibold hover:underline truncate">
          {title}
        </span>

        <span className="text-xl font-semibold text-[#EF4444]">
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

        <span className="font-semibold text-lg">{name_store}</span>
      </div>
    </div>
  );
};

export default Card;