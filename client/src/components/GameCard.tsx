type DataType = {
  image?: string;
  name: string;
  onClick?: () => void;
};
const GameCard = ({ image, name, onClick }: DataType) => {
  return (
    <div
      onClick={onClick}
      className="relative w-full aspect-[1.3/1] rounded-xl overflow-hidden shadow-lg group cursor-pointer"
    >
      {/* Background Image */}
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-300"
      />

      {/* Overlay (optional dark layer) */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Center Text */}
      <div className="relative items-center mt-12 z-10 flex justify-center h-full">
        <h2 className="text-white text-lg font-semibold text-center px-2">
          {name}
        </h2>
      </div>
    </div>
  );
};
export default GameCard;
