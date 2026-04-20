import BottomNavbar from "../../components/bottom_navbar";
import Card from "../../components/card";
import { IoSearch } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useGames } from "../../hooks/game/useGames";
import { useNavigate } from "react-router";
import { useGetProductsPublic } from "../../hooks/product/useGetProductPublic";
import Api from "../../services/api";
import ProductCardSkeleton from "../../components/skeleton/ProductCard";
import CardSkeleton from "../../components/skeleton/Card";
import GameCard from "../../components/GameCard";
import banner_hero from "../../assets/banner_hero.png";
import { SiAdguard } from "react-icons/si";
import { FaCircleCheck } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data } = useGames({ page: 1, limit: 3 });
  const { data: favoriteGames } = useGames({ page: 1, limit: 6 });
  const navigate = useNavigate();
  const { data: productData, isLoading } = useGetProductsPublic({
    game_id: "",
    q: "",
    page: 1,
    limit: 8,
    sort: "most_recent",
  });
  // const [delayedLoading, setDelayedLoading] = useState(true);

  // useEffect(() => {
  //   let timer: any;

  //   if (isLoading) {
  //     setDelayedLoading(true);
  //   } else {
  //     timer = setTimeout(() => {
  //       setDelayedLoading(false);
  //     }, 3000); // delay 500ms
  //   }

  //   return () => clearTimeout(timer);
  // }, [isLoading]);
  // const loading = delayedLoading;
  const products = productData?.data;

  const filtered = data?.filter((item: any) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="mb-2 bg-light rounded-5 -mt-20 w-full">
      <div className="flex flex-col bg-gradient-to-b from-[#C5A16F] via-[#2d3330] to-[#27282d]">
        <div className="pb-10">
          <div className="w-full max-w-6xl mx-auto relative pt-40">
            <div className="flex w-full">
              <div className="w-full ">
                <div className="text-6xl font-bold text-white">
                  Where Gamers Trade with Confidence
                </div>
                <div className="text-xl font-medium text-white mt-6">
                  Buy. Sell. Level up. <br /> All-in-one gaming marketplace with
                  built-in protection.
                </div>
                <div
                  className="relative w-full max-w-xl mt-6"
                  tabIndex={0}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      setOpen(false);
                    }
                  }}
                >
                  <input
                    type="text"
                    className="input input-xl w-full rounded-full px-5 pr-12"
                    placeholder="Search in SubGame"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                  />
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setOpen(true)}
                  >
                    <div className="p-2 rounded-full bg-primary1">
                      <IoSearch className="w-6 h-6 text-white " />
                    </div>
                  </div>

                  {open && (
                    <div className="absolute mt-2 w-full bg-white shadow-lg rounded-xl z-50">
                      <div className="px-4 text-gray-500 mt-6">
                        {query ? "Search result" : "Recent added Game"}
                      </div>
                      <div className="flex">
                        {filtered.length > 0 ? (
                          filtered.map((item: any) => (
                            <div
                              key={item.id}
                              className="ml-4 mb-8 mt-2 text-sm px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-200 cursor-pointer"
                              onClick={() => {
                                setQuery(item.name);
                                setOpen(false);
                                navigate("/products?brand=" + item.id);
                              }}
                            >
                              {item.name}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500">
                            No results
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-white flex gap-3 mt-4">
                  <div className="flex gap-1">
                    <SiAdguard className="w-5 h-5" />{" "}
                    <span className="text-sm">Full protect</span>
                  </div>
                  <div className="flex gap-1">
                    <FaCircleCheck className="w-5 h-5" />{" "}
                    <span className="text-sm">
                      50 Million+ successful trades
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <BiSupport className="w-5 h-5" />{" "}
                    <span className="text-sm">24/7 Support</span>
                  </div>
                </div>
              </div>
              <div>
                <img
                  src={banner_hero}
                  alt="banner hero"
                  className="w-90 h-auto"
                />
              </div>
            </div>
          </div>
          {/* here */}
          {/* {GAME favorite} */}
          <div className="max-w-6xl mx-auto mt-8">
            <div className="text-2xl font-bold mb-4 text-white">
              Favorite Games
            </div>
            <div className="w-full">
              <div className="flex gap-5 w-full">
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <CardSkeleton key={i} />
                    ))
                  : favoriteGames?.map((game: any) => (
                      <GameCard
                        key={game.id}
                        image={`${Api.defaults.baseURL}/images/games/covers/${game?.image}`}
                        name={game.name}
                        onClick={() => navigate("/products?brand=" + game.id)}
                      />
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-6xl mx-auto flex justify-center items-center ">
        {isLoading ? (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
          {Array.from({ length: 40 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
          {products?.map((product: any) => (
            <Card
              brand={product.game.name}
              image={
                product.image
                  ? `${Api.defaults.baseURL}/images/products/${product.image}`
                  : `${Api.defaults.baseURL}/images/games/covers/${product.game.image}`
              }
              title={product.title}
              price={product.price}
              profile={`${Api.defaults.baseURL}/images/users/${product.user.picture}`}
              name_store={product.user.name}
            />
          ))}
        </div>
      )}
      </div>
      <BottomNavbar />
    </div>
  );
};

export default Home;
