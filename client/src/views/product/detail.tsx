import { useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { IoChatbubbles, IoTimerSharp } from "react-icons/io5";
import { RiMedal2Line } from "react-icons/ri";
import { IoMdThumbsUp } from "react-icons/io";
import Footer from "../../components/footer";
import { useGetProductById } from "../../hooks/product/useGetProductById";
import { useNavigate, useParams } from "react-router";
import Api from "../../services/api";
import { formattedPrice } from "../../helpers/formatted_price";

const DetailProduct = () => {
  const [expanded, setExpanded] = useState(false);
  const [quantity, setQuantity] = useState<number | "">(1);
  const { id } = useParams();
  const { data, isLoading } = useGetProductById(id);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("data nih", data);
  }, [data]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleAddQuantity = () => {
  if (!data?.stock) return;

  setQuantity((prev) => {
    const current = prev === "" ? 0 : prev;
    return Math.min(data.stock, current + 1);
  });
};

const handleMinusQuantity = () => {
  setQuantity((prev) => {
    const current = prev === "" ? 1 : prev;
    return Math.max(1, current - 1);
  });
};
  return (
    <div>
      <div className=" max-w-6xl mx-auto w-full h-screen grid grid-cols-5 gap-8">
        <div className="col-span-3 py-4 overflow-y-auto no-scrollbar">
          <img
            src={
              data.image
                ? `${Api.defaults.baseURL}/images/products/${data.image}`
                : `${Api.defaults.baseURL}/images/games/covers/${data.game.image}`
            }
            alt=""
            className="w-full aspect-[1.8/1] rounded-xl object-cover"
          />
          <h1 className="text-4xl font-bold mt-8 text-text">{data.title}</h1>
          <div className="mt-8 rounded-lg py-4">
            <div className="w-full py-4 border-b border-gray-200 text-2xl font-bold text-text">
              Product Info
            </div>
            <div className="grid grid-cols-8 relative py-4">
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[linear-gradient(to_right,#d1d5db_50%,transparent_0%)] bg-[length:15px_1px] " />
              <div className="col-span-2 text-lg text-text">Brand</div>
              <div className="col-span-2 text-lg font-semibold text-text">
                {data.game.name}
              </div>
            </div>
            <div className="p-4">
              <p className={`text-text ${expanded ? "" : "line-clamp-5"}`}>
                {data.description}
              </p>
            </div>
            <div className="w-full flex justify-center p-4 items-center">
              <button
                onClick={() => setExpanded(!expanded)}
                className="py-2 px-4 text-neutral hover:bg-surface rounded-lg"
              >
                {expanded ? (
                  <div className="flex items-center gap-2 text-text">
                    <span className="font-semibold text-lg ">Lebih sedikit</span>
                    <IoIosArrowUp className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-text">
                    <span className="font-semibold text-lg ">Lebih banyak</span>
                    <IoIosArrowDown className="w-6 h-6" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-2 w-full py-4 flex flex-col">
          <div className="w-full flex justify-between bg-[#eef4ff] py-4 px-8 rounded-xl shadow-sm">
            <div className="flex gap-2 items-center">
              <AiOutlineSafetyCertificate className="w-8 h-8 text-[#005386]" />
              <span className="text-lg text-[#005386] font-semibold">
                Free insuranse
              </span>
            </div>
            <div className="text-lg text-[#005386]">{data.guarantee} day</div>
          </div>
          <div className="w-full bg-bg flex flex-col py-2 mt-6 rounded-xl">
            <div className="w-full flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <img
                  src={`${Api.defaults.baseURL}/images/users/${data.user.picture}`}
                  alt=""
                  className="w-16 h-16 rounded-full"
                />
                <div className="font-semibold text-text">{data.user.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="p-2 text-bg bg-secondary1 rounded-md cursor-pointer"
                  onClick={() => navigate("/chat/offer/" + data.id)}
                >
                  <IoChatbubbles className="w-6 h-6" />
                </div>
                <div className="px-3 py-2 rounded-md font-semibold text-bg text-center text-lg bg-secondary1 cursor-pointer">
                  Visit store
                </div>
              </div>
            </div>
            <div className="items-start space-y-3 mt-8">
              <div className="px-4 py-1 bg-surface rounded-full w-fit flex gap-1 items-center">
                <RiMedal2Line className="text-blue-500" />
                <span className="text-text text-sm">99% Suceesfull delivery</span>
              </div>
              <div className="px-4 py-1 bg-surface rounded-full w-fit flex gap-1 items-center">
                <IoTimerSharp className="text-[#FFA500]" />
                <span className="text-text text-sm">Join 27 Nov 2019</span>
              </div>
              <div className="px-4 py-1 bg-surface rounded-full w-fit flex gap-1 items-center">
                <IoMdThumbsUp className="text-green-500" />
                <span className="text-text text-sm ">97% All time rating</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-bg flex flex-col justify-center items-center gap-8 mt-4 rounded-xl">
            <span className="text-gray-500 text-center">
              {data.stock} Available
            </span>
            <div className="flex w-fit justify-between gap-16 items-center border border-gray-300 rounded-full px-2 py-2 shadow-md">
              <div
                className="aspect-square w-10 flex items-center justify-center  rounded-full  bg-gray-100 text-xl font-bold text-gray-500 cursor-pointer"
                onClick={handleMinusQuantity}
              >
                -
              </div>
              {/* <span className="text-lg ">{quantity}</span> */}
              <input
                className="w-12 text-center bg-transparent outline-none text-text"
                min="1"
                max={data?.stock}
                type="number"
                value={quantity}
                onChange={(e) => {
  const val = e.target.value;

  if (val === "") {
    setQuantity(""); // ⬅️ ini yang kamu mau
    return;
  }

  let num = Number(val);

  if (num < 1) num = 1;
  if (num > data?.stock) num = data.stock;

  setQuantity(num);
}}
onBlur={() => {
  if (quantity === "" || quantity < 1) {
    setQuantity(1);
  }
}}
              />
              <div
                className="aspect-square w-10 flex items-center justify-center  rounded-full  bg-gray-100 text-xl font-bold text-gray-500 cursor-pointer"
                onClick={handleAddQuantity}
              >
                +
              </div>
            </div>
            <hr className="border-gray-300 w-full " />
            <div className="flex w-full justify-between">
              <span className="text-2xl font-bold text-gray-500">
                Total Amount
              </span>
              <div className="flex gap-1 items-center">
                <span className="text-2xl font-bold text-gray-500">
                  Rp. {formattedPrice(data.price * (quantity || 0))}
                </span>
                <span className="text-sm text-gray-500">IDR</span>
              </div>
            </div>
            <div className="w-full p-5 rounded-xl bg-secondary1 text-bg text-2xl text-center font-bold cursor-pointer">
              Buy Now
            </div>
          </div>
        </div>
      </div>
      <div className="-mb-20 -mx-4">
        <Footer />
      </div>
    </div>
  );
};
export default DetailProduct;
