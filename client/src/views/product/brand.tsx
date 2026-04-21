import { IoSearch } from "react-icons/io5";
import { useGetProductsPublic } from "../../hooks/product/useGetProductPublic";
import Api from "../../services/api";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import Card from "../../components/card";
import { useGame } from "../../hooks/game/useGame";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import ImageNoData from "./../../assets/no_data.png";
import ProductCardSkeleton from "../../components/skeleton/ProductCard";
import Skeleton from "react-loading-skeleton";
import Footer from "../../components/footer";

const BrandProducts = () => {
  const [searchParams] = useSearchParams();
  const game_id = searchParams.get("brand");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("most_recent");
  const limit = 40;

  const { data, isLoading } = useGame(game_id!);

  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500); // delay 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  const { data: productData, isLoading: ProductLoading } = useGetProductsPublic(
    {
      game_id: game_id!,
      q: debouncedValue || "",
      page,
      limit,
      sort,
    },
  );

  // const [delayedLoading, setDelayedLoading] = useState(true);
  // useEffect(() => {
  //   let timer: any;

  //   if (isLoading && ProductLoading) {
  //     setDelayedLoading(true);
  //   } else {
  //     timer = setTimeout(() => {
  //       setDelayedLoading(false);
  //     }, 3000); //delay 3 detik
  //   }

  //   return () => clearTimeout(timer);
  // }, [isLoading]);
  // const loading = delayedLoading;

  const loading = isLoading && ProductLoading;

  const products = productData?.data;
  const meta = productData?.meta;

  return (
    <div className="mt-4 md:mt-8">
      <div className="max-w-6xl mx-auto px-3 md:px-0 ">
      {loading ? (
        <Skeleton width={160} height={16} />
      ) : (
        <div className="text-2xl font-semibold text-text ">{data?.name}</div>
      )}
      <div className="flex mt-4 items-center gap-6 justify-between">
        <div className="relative items-center w-xl">
          <input
            type="text"
            className="input rounded-full w-full text-xl py-6 pl-14 text-gray-400"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type to filter"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 ">
            <IoSearch className="w-6 h-6 text-gray-400" />
          </div>
        </div>
        <div className="gap-4 text-text hidden md:flex">
          <span>Sort by:</span>
          <div className="flex gap-3 items-center">
            <div className="flex gap-1">
              <input
                type="radio"
                name="radio-3"
                className="radio radio-neutral"
                defaultChecked
                onChange={() => {
                  setSort("most_recent");
                }}
              />
              <span>Newest</span>
            </div>
            <div className="flex gap-1">
              <input
                type="radio"
                name="radio-3"
                className="radio radio-neutral "
                onChange={() => {
                  setSort("lowest_price");
                }}
              />
              <span>Lowest price</span>
            </div>
            <div className="flex gap-1">
              <input
                type="radio"
                name="radio-3"
                className="radio radio-neutral"
                onChange={() => {
                  setSort("highest_price");
                }}
              />
              <span>Highest Price</span>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="mt-6 mb-2">
          <Skeleton width={160} height={16} />
        </div>
      ) : (
        <div className="mt-6 mb-2 text-md text-gray-500">
          About {meta?.total} results
        </div>
      )}
      <div className="w-full mb-20">
        {products?.length === 0 ? (
          <div className="w-full flex flex-col justify-center items-center">
            <img
              src={ImageNoData}
              alt="no data found"
              className="w-80 h-auto flex justify-center my-6"
            />
            <span className="text-2xl font-bold">
              "We are unable to find matching offer"
            </span>
          </div>
        ) : (
          <div>
            {loading ? (
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
                {Array.from({ length: 40 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
                {products?.map((product: any) => (
                  <Card
                    key={product.id}
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
                {/* PAGINATION */}
                {meta?.total >= limit ? (
                  <div className="flex gap-2 mt-4 items-center w-full justify-center">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="border border-gray-400 text-white py-3 px-2 rounded-md flex gap-1 items-center"
                    >
                      <MdNavigateBefore className="w-6 h-6 text-gray-400" />
                    </button>

                    <span>
                      Page {meta?.page} of {meta?.total_pages}
                    </span>

                    <button
                      disabled={page === meta?.total_pages}
                      onClick={() => setPage((p) => p + 1)}
                      className="border border-gray-400 text-white py-3 px-2 rounded-md flex gap-1 items-center"
                    >
                      <MdNavigateNext className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
      <div className="-mb-20 md:mb-0 mx-auto">
        <Footer />
      </div>
    </div>
  );
};
export default BrandProducts;
