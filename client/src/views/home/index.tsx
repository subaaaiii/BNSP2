import BottomNavbar from "../../components/bottom_navbar";
import Card from "../../components/card";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useGames } from "../../hooks/game/useGames";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data } = useGames();

  useEffect(() => {
    console.log("DATA:", data);
  }, [data]);

  const filtered = data?.filter((item: any) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className=" max-w-7xl mx-auto px-4 mb-2 bg-light rounded-5">
      <div className="container mt-5 ">
        <h1 className="text-xl font-bold mb-4">Daftar Produk</h1>
        <div className="w-full w-xl relative">
          <div
            className="relative w-full max-w-xl"
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
            <div className="absolute right-3 top-1/2 -translate-y-1/2" onClick={()=>setOpen(true)}>
            <div className="p-2 rounded-full bg-neutral">
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
                        }}
                      >
                        {item.name}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">No results</div>
                  )}
                </div>
              </div>
            )}
          </div>

          
        </div>
        <div className="col-md-12 fs-4 mt-8 ">
          <Card />
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
};

export default Home;
