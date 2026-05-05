import Api from "../services/api";

const CardSimple = ({ product, onClick }: any) => {
  const formattedPrice = new Intl.NumberFormat("id-ID").format(
    Number(product.price),
  );

  return (
    <div
      className="card flex flex-row bg-bg  rounded-md min-w-0 items-center"
      onClick={onClick}
    >
      <img
        src={
          product.image
            ? `${Api.defaults.baseURL}/images/products/${product.image}`
            : `${Api.defaults.baseURL}/images/games/covers/${product.game.image}`
        }
        alt={product.title}
        className="w-32 aspect-[1.8/1] 
             object-cover rounded-md rounded-t-md "
      />

      <div className="flex flex-col flex-1 gap-1 px-3 md:px-6 py-1 md:py-3 cursor-pointer min-w-0">
        <span className="text-xs text-gray-400">
          {product.game.name}
        </span>

        <span className="font-semibold hover:underline truncate text-primary1">
          {product.title}
        </span>

        <span className="text-sm font-semibold text-secondary1">
          Rp. {formattedPrice}
        </span>
        <span className="text-sm">
          ({product.stock} available)
        </span>
      </div>
    </div>
  );
};

export default CardSimple;
