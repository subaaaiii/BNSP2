import BottomNavbar from "../../components/bottom_navbar";
import Card from "../../components/card";
import { IoSearch } from "react-icons/io5";
import { useState } from "react";
import { useGames } from "../../hooks/game/useGames";
import { useNavigate } from "react-router";
import { useGetProductsPublic } from "../../hooks/product/useGetProductPublic";
import Api from "../../services/api";
import ProductCardSkeleton from "../../components/skeleton/ProductCard";
import CardSkeleton from "../../components/skeleton/Card";
import GameCard from "../../components/GameCard";
import banner_hero from "../../assets/banner_hero2.png";
import { SiAdguard } from "react-icons/si";
import { FaCircleCheck } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { IoIosUnlock } from "react-icons/io";
import { MdOutlinePayment } from "react-icons/md";
import { LuSendHorizontal } from "react-icons/lu";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { paymentLogos } from "../../assets/payment";
import Footer from "../../components/footer";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data } = useGames({ page: 1, limit: 999 });
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
    <div className="rounded-5 -mt-20 w-full ">
      <div className="flex flex-col bg-gradient-to-b from-[#C5A16F] via-[#2d3330] to-[#1a1a19] px-3 md:px-0 ">
        <div className="pb-10">
          <div className="w-full max-w-6xl mx-auto relative pt-30 md:pt-40">
            <div className="flex w-full">
              <div className="w-full ">
                <div className="text-2xl md:text-6xl font-bold text-white">
                  Where Gamers Trade with Confidence
                </div>
                <div className="text-sm md:text-xl md:font-medium text-white mt-6">
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
                    <div className="p-2 rounded-full bg-[#2d3330]">
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
                          filtered.slice(0, 3).map((item: any) => (
                            <div
                              key={item.id}
                              className="ml-4 mb-8 mt-2 text-xs md:text-sm px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-200 cursor-pointer"
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
                <div className="text-white flex flex-wrap md:flex-row gap-3 mt-4">
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
              <div className="absolute inset-0 md:static md:w-auto pointer-events-none">
                <img
                  src={banner_hero}
                  alt="banner hero"
                  className="absolute md:static right-0 bottom-30 w-50 h-auto object-cover object-right opacity-40 md:opacity-100 md:w-120"
                />
              </div>
            </div>
          </div>
          {/* {GAME favorite} */}
          <div className="max-w-6xl mx-auto mt-8">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold mb-4 text-white">
              Favorite Games
            </div>
            <button onClick={()=>navigate("/brands")} className="text-lg mb-4 text-white hover:underline cursor-pointer ">
              See all
            </button>
            </div>
            <div className="w-full ">
              <div className=" grid grid-cols-3 md:grid-cols-6 gap-5 w-full">
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
      {/* Recent product */}
      <div className="max-w-6xl mx-auto mt-8 px-3 md:px-0 ">
        <div className="text-2xl font-semibold mb-2 text-text">
          Recent products
        </div>
        <div className="w-full  flex justify-center items-center ">
          {isLoading ? (
            <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
              {Array.from({ length: 40 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
              {products?.map((product: any) => (
                <Card
                  key={product.id}
                  product={product}
                  onClick={()=>navigate ('/products/detail/'+ product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* How it works */}
      <div className="max-w-6xl mx-auto w-full mt-8 mb-20 px-3 md:px-0 ">
        <div className="text-2xl font-semibold mb-2 text-text">
          How it works
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="w-full col-span-1 flex py-6 px-4 shadow-md bg-surface gap-2 rounded-lg items-center">
            <div className="w-11 h-11 p-3 rounded-full bg-primary2 flex items-center ">
              <IoIosUnlock className="w-5 h-5 text-primary1" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium text-text">
                Registration
              </span>
              <span className="text-sm text-text">
                Sign up for free to access all feature
              </span>
            </div>
          </div>
          <div className="w-full col-span-1 flex py-6 px-4 shadow-md bg-surface gap-2 rounded-lg items-center">
            <div className="w-11 h-11 p-3 rounded-full bg-primary2 flex items-center ">
              <MdOutlinePayment className="w-5 h-5 text-primary1" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium text-text">Payment</span>
              <span className="text-sm text-text">
                Pay with your favorite payment!
              </span>
            </div>
          </div>
          <div className="w-full col-span-1 flex py-6 px-4 shadow-md bg-surface gap-2 rounded-lg items-center">
            <div className="w-11 h-11 p-3 rounded-full bg-primary2 flex items-center ">
              <LuSendHorizontal className="w-5 h-5 text-primary1" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium text-xl text-text">
                Delivery
              </span>
              <span className="text-sm text-text">
                Wait for the order to be sent by the seller
              </span>
            </div>
          </div>
          <div className="w-full col-span-1 flex py-6 px-4 shadow-md bg-surface gap-2 rounded-lg items-center">
            <div className="w-11 h-11 p-3 rounded-full bg-primary2 flex items-center ">
              <HiOutlineBadgeCheck className="w-5 h-5 text-primary1" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium text-xl text-text">
                Confirmation
              </span>
              <span className="text-sm text-text">
                Seller will get the money after the order is confirmed by the
                buyer.
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto mb-20 md:mb-40 ">
        <div className="text-2xl font-semibold mb-2 text-text text-center mb-6">
          Payments
        </div>
        <div className="w-full flex flex-wrap justify-center gap-4">
          {paymentLogos.map((item) => (
            <div
              key={item.name}
              className="px-4 py-2 flex items-center justify-center rounded-sm shadow-sm bg-base-100"
            >
              <img src={item.logo} alt={item.name} className="w-12 h-10" />
            </div>
          ))}
        </div>
      </div>
      <div className="-mt-20 md:mb-0 ">
        <Footer />
      </div>
      <BottomNavbar />
    </div>
  );
};

export default Home;
