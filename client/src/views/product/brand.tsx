import Api from "../../services/api";
import { useNavigate } from "react-router";
import { useGames } from "../../hooks/game/useGames";
import CardSkeleton from "../../components/skeleton/Card";
import GameCard from "../../components/GameCard";
import TopNavbar from "../../components/top_navbar";
import { useSEO } from "../../hooks/helpers/useSEO";

const Brand = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGames({page:1, limit:1000});

useSEO({
  title: `Buy Game Account | SubGAME`,
  description: `Cheap game accounts with instant delivery`,
});
  return (
    <div className="max-w-6xl mx-auto px-3 md:px-0">
      <TopNavbar title={`All brand games`}/>
      <h1 className="text-2xl font-bold  text-text mt-6 mb-4">All game brands</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
          : data?.map((game: any) => (
              <GameCard image={`${Api.defaults.baseURL}/images/games/covers/${game?.image}`} name={game.name} onClick={() => {
                 navigate(`/products?brand=${game.id}`);
               }}/>
            ))}
      </div>
    </div>
  );
};

export default Brand;
