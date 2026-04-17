import { Link } from "react-router";
import { useGetProducts } from "../../hooks/product/useGetProducts";
import { FaEllipsisVertical } from "react-icons/fa6";
import { useDeleteProduct } from "../../hooks/product/useDeleteProduct";
import toast from "react-hot-toast";
import TopNavbar from "../../components/top_navbar";
import { IoAddCircle } from "react-icons/io5";
import { IoEllipsisVertical } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useUpdateProductStatus } from "../../hooks/product/useUpdateStatusProduct";
import { IoSearchOutline } from "react-icons/io5";
import ImageNoData from "./../../assets/no_data.png"
import { MdNavigateNext, MdNavigateBefore  } from "react-icons/md";


const ManageOffers = () => {
  const { mutate } = useDeleteProduct();
  const { mutate: mutateStatus } = useUpdateProductStatus();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState("available");
  const [gameFilter, setGameFilter] = useState("");
  const [titleFilter, setTitleFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading  } = useGetProducts({
    status: statusFilter,
    game_id: gameFilter,
    q: titleFilter,
    page,
    limit,
  });
  
  const products = data?.data;
  const meta = data?.meta;

  const [allGames, setAllGames] = useState<any[]>([]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      mutate(id, {
        onSuccess: () => {
          toast.success("Product deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete product");
        },
      });
    }
  };

  const handleCheck = (id: number) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id) // uncheck
        : [...prev, id],
    );
  };

  const handleReviewSelected = ({
    ids,
    status,
  }: {
    ids: number[];
    status: string;
  }) => {
    mutateStatus(
      { ids, status },
      {
        onSuccess: () => {
          setSelected([]);
          toast.success(
            `Products ${status === "available" ? "published" : "archived"} successfully`,
          );
        },
        onError: (error: any) => {
          console.error("Error updating product status:", error);
        },
      },
    );
  };


  useEffect(() => {
    setSelected([]);
  }, [statusFilter]);

  const { data: productk } = useGetProducts({
  status: statusFilter,
  game_id: "",   
  q: "",
  page: 1,
  limit : 10000,         
});
const productsForGames = productk?.data

  useEffect(() => {
  if (productsForGames) {
    const games = Array.from(
      new Map(productsForGames.map((p: any) => [p.game.id, p.game])).values()
    );
    setAllGames(games);
  }
}, [productsForGames]);

  const handleStartOver = () =>{
    setStatusFilter("available")
    setTitleFilter("");
    setGameFilter("");
    setSelected([]);
  }
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="mt-8 p-3 md:p-0">
      <TopNavbar title="Manage Offer" />
      <h2 className="hidden md:block text-3xl font-semibold mb-4">
        Manage Offers
      </h2>
      <Link
        to="/offers/create"
        className="flex w-full md:w-fit btn btn-neutral mb-6"
      >
        <IoAddCircle className="w-5 h-5 mr-2" />
        Add New Offer
      </Link>
      <div className="flex gap-2 cursor-pointer">
        <div
          className={`px-6 py-3 text-lg text-gray-500 ${
            statusFilter === "available"
              ? "border-b-3 border-neutral text-neutral"
              : ""
          }`}
          onClick={() => setStatusFilter("available")}
        >
          Live
        </div>
        <div
          className={`px-6 py-3  text-lg text-gray-500 ${
            statusFilter === "archived"
              ? "border-b-3 border-neutral text-neutral"
              : ""
          }`}
          onClick={() => setStatusFilter("archived")}
        >
          Archived
        </div>
      </div>
        <div className="bg-white rounded-lg shadow p-6">
          {/* Header */}
          <div className="flex py-6 items-center gap-6">
            <div className="relative inline-block">
              <input
                type="text"
                className="input input-lg rounded-xl pr-12"
                placeholder="Search product title"
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
              />
              <IoSearchOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-6 h-6" />
            </div>
            <div>
              <select
                className="select  h-12 w-50 px-5 rounded-xl "
                value={gameFilter}
                onChange={(e) => setGameFilter(e.target.value)}
              >
                <option value="">All brands</option>
                {allGames?.map((game: any) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/**/ }
          <div className="md:grid md:grid-cols-[50px_1fr_100px_120px_120px] font-semibold border-b border-gray-300 pb-3 ">
            <div>
              <input
                type="checkbox"
                className="checkbox"
                checked={selected.length === products?.length && products?.length != 0 }
                onChange={() =>
                  setSelected(
                    selected.length === products?.length
                      ? []
                      : products?.map((p: { id: number }) => p.id) || [],
                  )
                }
              />
            </div>
            <div className="hidden md:block">Title</div>
            <div className="hidden md:block">Stock</div>
            <div className="hidden md:block">Price</div>
            <div className="text-center hidden md:block">Action</div>
          </div>
          {/*header */}

          {/* Rows */}
          {products?.length === 0 ? (
            <div className="w-full flex flex-col justify-center items-center">
              <img src={ImageNoData} alt="no data found" className="w-80 h-auto flex justify-center my-6" />
              <span className="text-2xl font-bold">{allGames.length > 1  ? "We are unable to find matching offer" : `You have no ${statusFilter === "available" ? "live" : "archived" } product` }</span>
              {allGames.length > 1 ? (
                <span className="text-sm">Please broaden your search criteria or {" "} 
                <span className="underline" onClick={handleStartOver}>start over</span>
              </span>
              ): ""}
            </div>
          ): (
            <div className="">
            {products?.map((product: any) => (
              <div key={product.id}>
                <div className="hidden md:block md:grid md:grid-cols-[50px_1fr_100px_120px_120px] items-center py-4 rounded-lg hover:bg-gray-50 border-b border-gray-100 last:border-none">
                  <div>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selected.includes(product.id)}
                      onChange={() => handleCheck(product.id)}
                    />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-lg font-medium">{product.title}</span>
                    <span className="text-sm text-gray-500">
                      Game brand - {product.game.name}
                    </span>
                  </div>
                  <div>{product.stock}</div>
                  <div>Rp {product.price.toLocaleString()}</div>

                  {/* ACTION LANGSUNG */}
                  <div className="flex justify-center gap-2">
                    <details className="dropdown">
                      <summary className="btn btn-ghost">
                        <FaEllipsisVertical />
                      </summary>
                      <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                        <li>
                          <Link to={`/offers/create?id=${product.id}`}>
                            Edit
                          </Link>
                        </li>
                        <li>
                          {statusFilter === "available" ? (
                            <a
                              onClick={() =>
                                handleReviewSelected({
                                  ids: [product.id],
                                  status: "archived",
                                })
                              }
                            >
                              Archive
                            </a>
                          ) : (
                            <a
                              onClick={() =>
                                handleReviewSelected({
                                  ids: [product.id],
                                  status: "available",
                                })
                              }
                            >
                              Publish
                            </a>
                          )}
                        </li>
                        <li>
                          <a
                            onClick={() => {
                              handleDelete(product.id);
                            }}
                          >
                            Delete
                          </a>
                        </li>
                      </ul>
                    </details>
                  </div>
                  
                </div>
                {selected.length > 0 && (
                  <div className="fixed bottom-0 left-0 w-full bg-base-100 p-6 flex justify-center gap-4 items-center z-40 shadow-[0_-6px_10px_rgba(0,0,0,0.1)]">
                    <span className="text-sm">{selected.length} selected</span>

                    <div>
                      {statusFilter=== "available" ? (
                        <button
                        className="btn btn-success btn-sm mr-2"
                        onClick={() =>
                          handleReviewSelected({
                            ids: selected,
                            status: "archived",
                          })
                        }
                      >
                        Archive Selected
                      </button>
                      ):(
                         <button
                        className="btn btn-success btn-sm mr-2"
                        onClick={() =>
                          handleReviewSelected({
                            ids: selected,
                            status: "available",
                          })
                        }
                      >
                        Publish Selected
                      </button>
                      )}
                      
                     
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() =>
                          handleReviewSelected({
                            ids: selected,
                            status: "available",
                          })
                        }
                      >
                        Delete Selected
                      </button>
                    </div>
                  </div>
                )}
                {/* MOBILE VIEW */}
                <div key={product.id} className="md:hidden">
                  <div className=" border-b border-gray-100 flex gap-2 py-4">
                    <div>
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selected.includes(product.id)}
                        onChange={() => handleCheck(product.id)}
                      />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                      <div className="font-semibold">{product.title}</div>
                      <div className="text-gray-500">
                        Stock: {product.stock}
                      </div>
                      <div className="text-lg font-bold">
                        Rp {product.price.toLocaleString()}
                      </div>
                      <div>Game brand - {product.game.name}</div>
                    </div>
                    <div onClick={() => setOpen(true)}>
                      <IoEllipsisVertical />
                    </div>
                    {/* MODAL */}
                    <div
                      className={`fixed w-full inset-0 z-50 flex items-end justify-center transition-all duration-300 ${
                        open ? "visible" : "invisible"
                      }`}
                    >
                      {/* BACKDROP */}
                      <div
                        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
                          open ? "opacity-100" : "opacity-0"
                        }`}
                        onClick={() => setOpen(false)}
                      />

                      {/* CONTENT (slide dari bawah) */}
                      <div
                        className={`relative w-full  bg-white transform transition-transform duration-300 ${
                          open ? "translate-y-0" : "translate-y-full"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-col">
                          <div className="p-5 text-xl font-semibold">
                            Action
                          </div>
                          <hr className="border border-gray-300" />
                          <div className="flex flex-col space-y-5 p-5">
                            <Link
                              className="cursor-pointer w-full"
                              to={`/offers/create?id=${product.id}`}
                            >
                              Edit
                            </Link>
                            {statusFilter === "available" ? (
                              <a
                                className="cursor-pointer"
                                onClick={() =>
                                  handleReviewSelected({
                                    ids: [product.id],
                                    status: "archived",
                                  })
                                }
                              >
                                Archive
                              </a>
                            ) : (
                              <a
                                className="cursor-pointer"
                                onClick={() =>
                                  handleReviewSelected({
                                    ids: [product.id],
                                    status: "available",
                                  })
                                }
                              >
                                Publish
                              </a>
                            )}
                            <a
                              className="cursor-pointer w-full"
                              onClick={() => {
                                handleDelete(product.id);
                              }}
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* PAGINATION */}
      <div className="flex gap-2 mt-4 items-center w-full justify-center">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="bg-neutral text-white py-1 px-3 rounded-md flex gap-1 items-center"
        >
          <MdNavigateBefore/>
          <span>Prev</span>
        </button>

        <span>
          Page {meta.page} of {meta.total_pages}
        </span>

        <button
          disabled={page === meta.total_pages}
          onClick={() => setPage((p) => p + 1)}
          className="bg-neutral text-white py-1 px-3 rounded-md flex gap-1 items-center"
        >
          <span>Next</span>
          <MdNavigateNext className="w-6 h-6"/>
        </button>
      </div>
          </div>
          
          )}
          
        </div>
      
    </div>
  );
};

export default ManageOffers;
