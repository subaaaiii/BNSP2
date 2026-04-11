import Api from "../../../services/api";
import { useNavigate } from "react-router";
import { useGames } from "../../../hooks/game/useGames";
import CardSkeleton from "../../../components/skeleton/Card";

const GameList = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGames();


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Games</h1>
      <button
        type="submit"
        className="my-2 rounded-sm bg-neutral text-white px-3 py-2 cursor-pointer"
        onClick={() => {
          navigate("/admin/games/add");
        }}
      >
        + Add Game
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
          : data?.map((game: any) => (
              <div
                key={game.id}
                className="relative h-48 rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                onClick={() => {
                  navigate(`/admin/games/edit/${game.id}`);
                }}
              >
                {/* Background Image */}
                <img
                  src={
                    `${Api.defaults.baseURL}/images/games/covers/${game?.image}` ||
                    "https://images.unsplash.com/photo-1511512578047-dfb367046420"
                  }
                  alt={game.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition duration-300"
                />

                {/* Overlay (optional dark layer) */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Center Text */}
                <div className="relative z-10 flex items-center justify-center h-full">
                  <h2 className="text-white text-lg font-semibold text-center px-2">
                    {game.name}
                  </h2>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default GameList;
