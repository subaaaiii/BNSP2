import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { IoChatbubbles, IoTimerSharp } from "react-icons/io5";
import { RiMedal2Line } from "react-icons/ri";
import { IoMdThumbsUp } from "react-icons/io";
import Footer from "../../components/footer";

const DetailProduct = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div >
      <div className=" max-w-6xl mx-auto w-full h-screen grid grid-cols-5 gap-8">
      <div className="col-span-3 py-4 overflow-y-auto no-scrollbar">
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt=""
          className="w-full h-auto rounded-xl "
        />
        <h1 className="text-4xl font-bold mt-8">Ini title</h1>
        <div className="mt-8 rounded-lg py-4">
          <div className="w-full py-4 border-b border-gray-200 text-2xl font-bold">
            Product Info
          </div>
          <div className="grid grid-cols-8 relative py-4">
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[linear-gradient(to_right,#d1d5db_50%,transparent_0%)] bg-[length:15px_1px] " />
            <div className="col-span-2 text-lg text-gray-700">Brand</div>
            <div className="col-span-2 text-lg font-semibold">
              Rise of kingdoms
            </div>
          </div>
          <div className="p-4">
            <p className={`${expanded ? "" : "line-clamp-5"}`}>
              Decoration termasuk:
              <br />
              - Avatar Effect
              <br />
              - Profile Effect
              <br />
              - Nameplates
              <br />
              <br />
              Bisa request decoration sesuai pilihan kamu (selama tersedia di
              Discord)
              <br />
              <br />
              Metode:
              <br />
              - Via login
              <br />
              - Estimasi pengerjaan 1–10 menit
              <br />
              - Decoration langsung aktif setelah proses selesai
              <br />
              <br />
              Harga:
              <br />
              - Lebih murah dari harga resmi di Discord
              <br />
              - Harga mengikuti yang tertera pada produk
              <br />
              - Pilih varian harga yang sesuai dengan harga official Discord
              dari decoration yang dipilih
              <br />
              <br />
              Kenapa beli di sini?
              <br />
              - Lebih hemat dibanding beli langsung di Discord
              <br />
              - Bisa pilih deco sesuai selera
              <br />
              <br />
              Note:
              <br />
              - Untuk harga decoration bundle bisa tanyakan terlebih dahulu
              <br />
              - Decoration JUJUTSU KAISEN yang terlihat oleh orang lain hanya
              Nameplate dan Avatar Effect
              <br />- Profile Effect terkena region lock
            </p>
          </div>
          <div className="w-full flex justify-center p-4 items-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="py-2 px-4 text-neutral hover:bg-gray-300 rounded-lg"
            >
              {expanded ? (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">Lebih sedikit</span>
                  <IoIosArrowUp className="w-6 h-6" />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">Lebih banyak</span>
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
          <div className="text-lg text-[#005386]">14 day</div>
        </div>
        <div className="w-full bg-white flex flex-col py-2 mt-6 rounded-xl">
          <div className="w-full flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt=""
                className="w-16 h-16 rounded-full"
              />
              <div className="font-semibold">Lovebird store</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 text-white bg-neutral rounded-md ">
                <IoChatbubbles className="w-6 h-6" />
              </div>
              <div className="px-3 py-2 rounded-md font-semibold text-white text-center text-lg bg-neutral">
                Visit store
              </div>
            </div>
          </div>
          <div className="items-start space-y-3 mt-8">
            <div className="px-4 py-1 bg-gray-100 rounded-full w-fit flex gap-1 items-center">
              <RiMedal2Line className="text-blue-500" />
              <span>99% Suceesfull delivery</span>
            </div>
            <div className="px-4 py-1 bg-gray-100 rounded-full w-fit flex gap-1 items-center">
              <IoTimerSharp className="text-[#FFA500]" />
              <span>Join 27 Nov 2019</span>
            </div>
            <div className="px-4 py-1 bg-gray-100 rounded-full w-fit flex gap-1 items-center">
              <IoMdThumbsUp className="text-green-500" />
              <span className="text-green-500">97% All time rating</span>
            </div>
          </div>
        </div>
        <div className="w-full bg-white flex flex-col justify-center items-center gap-8 mt-4 rounded-xl">
          <span className="text-gray-500 text-center">1 Available</span>
          <div className="flex w-fit justify-between gap-16 items-center border border-gray-300 rounded-full px-2 py-2 shadow-md">
            <div className="aspect-square w-10 flex items-center justify-center  rounded-full  bg-gray-100 text-xl font-bold text-gray-500 cursor-pointer">
              -
            </div>
            <span className="text-lg ">1</span>
            <div className="aspect-square w-10 flex items-center justify-center  rounded-full  bg-gray-100 text-xl font-bold text-gray-500 cursor-pointer">
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
                Rp. 1,000,000
              </span>
              <span className="text-sm text-gray-500">IDR</span>
            </div>
          </div>
          <div className="w-full p-5 rounded-xl bg-red-500 text-white text-2xl text-center font-bold cursor-pointer">
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
