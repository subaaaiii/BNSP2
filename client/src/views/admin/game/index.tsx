import Api from "../../../services/api";
import { useNavigate } from "react-router";
import { useGames } from "../../../hooks/game/useGames";
import CardSkeleton from "../../../components/skeleton/Card";
import GameCard from "../../../components/GameCard";
import TopNavbar from "../../../components/top_navbar";

const GameList = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGames({page:1, limit:1000});


  return (
    <div className="max-w-6xl mx-auto px-3 md:px-0">
      <TopNavbar title={`Manage games`}/>
      <h1 className="text-2xl font-bold mb-6 text-text">Games</h1>
      <button
        type="submit"
        className="my-2 rounded-sm bg-secondary1 text-bg px-3 py-2 cursor-pointer"
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
              <GameCard image={`${Api.defaults.baseURL}/images/games/covers/${game?.image}`} name={game.name} onClick={() => {
                 navigate(`/admin/games/edit/${game.id}`);
               }}/>
            ))}
      </div>
    </div>
  );
};

export default GameList;
