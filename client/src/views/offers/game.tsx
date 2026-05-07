import { useState } from "react";
import { useNavigate } from "react-router";
import { FiAlertCircle } from "react-icons/fi";
import { useGames } from "../../hooks/game/useGames";
import { FaAngleLeft } from "react-icons/fa6";
import { IoIosInformationCircle } from "react-icons/io";
import TopNavbar from "../../components/top_navbar";


const SelectGameBrand = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const { data: games } = useGames({ page: 1, limit: 6 });
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="p-0 md:p-6 max-w-6xl mx-auto">
      <TopNavbar title="Select brand"/>
      <h1 className="hidden md:block text-2xl font-bold mb-6 text-gray-900">
        Add new offer
      </h1>
      <div className="flex md:hidden justify-between items-center bg-white md:bg-transparent fixed md:static top-0 left-0 w-full p-4 shadow-lg md:shadow-none">
        <div className="flex items-center gap-5">
          <FaAngleLeft className="w-8 h-7" onClick={() => navigate(-1)} />
          <h1 className="text-xl font-medium text-gray-900">Add new offer</h1>
        </div>
        <IoIosInformationCircle
          className="w-8 h-8 text-blue-500 rounded-full"
          onClick={() => setShowInfo(!showInfo)}
        />
      </div>
      <div
        className={`fixed inset-0 z-50 md:hidden transition-transform duration-300 ${
          showInfo ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* overlay */}
        <div
          className="absolute inset-0 bg-black/30"
          onClick={() => setShowInfo(false)}
        />

        {/* drawer content */}
        <div className="absolute top-0 right-0 w-full h-full bg-white overflow-y-auto">
          {/* header */}
          <div className="relative flex items-center py-5 px-6">
            <h2 className="text-lg font-semibold flex justify-center w-full">Tips and info</h2>
            <button onClick={() => setShowInfo(false)} className="absolute top-5 right-6">✕</button>

          </div>
          <hr className="border-gray-300"/>

          {/* content */}
          <ul className="list-disc p-8 text-gray-600 space-y-4">
            <li>
              Select the correct and relevant brand game so that buyers can find
              your offers easily.
            </li>
            <li>
              Sellers are strictly prohibited from offering any product or
              services which may violate local laws and regulations.
            </li>
            <li>
              To request for a brand or product not listed here, please send a
              ticket to us and provide the URL to the official brand site.
            </li>
            <li>
              SubGAME reserves the right to remove any offer that violates our
              policies without prior notice.
            </li>
            <li>Uploading fake codes is strictly prohibited.</li>
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="col-span-4 md:col-span-3 p-4 md:p-12 bg-bg shadow-xl rounded-xl leading-relaxed text-gray-900">
          <div className="text-2xl font-medium text-text">Game brand</div>
          <div className="font-std mb-4 text-text">
            Select game brand you want to offer
          </div>
          <div className="w-full bg-[#448aff] rounded-lg flex flex-row items-start mb-4 px-3 md:px-4">
            <FiAlertCircle className="hidden md:block w-16 h-16 text-white mx-4 mt-2" />
            <ol className="list-decimal pl-5 text-white space-y-3 py-4 ">
              <li>
                Changing of the email address is not supported officially:
                Sellers must provide the email address to the buyers and make
                sure they gain full access of the email such as secret questions
                etc.
              </li>
              <li>
                Changing of the email address is supported officially: Sellers
                must assist buyers to change the email address and provide the
                proof.
              </li>
              <li>
                Payment will be put on hold if seller did not submit proof for
                (1) or (2). If seller fails to provide proof, the payment will
                be deducted to refund buyer when there is a dispute.
              </li>
              <li>
                You must be the main owner of the account(s) you intend to sell.
              </li>
              <li>
                Sellers are obligated to assist the buyer whenever an issue
                arises with the Account during the insurance period. The payment
                period will be adjusted based on the number of days the account
                was insured for.
              </li>
            </ol>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:gap-64 mb-20 md:mb-6">
            <div className="text-text">
              Brand
              <span className="text-red-500">*</span>
            </div>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="select rounded-lg w-full bg-surface text-text"
            >
              <option value="" disabled hidden >
                Select brand game
              </option>
              {games?.map((g: any) => (
                <option key={g.id} value={g.id}>
                  {" "}
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="hidden md:block col-span-1">
          <ul className="list-disc pl-5 text-gray-600 space-y-4 py-4 px-4 text-xs">
            <li>
              Select the correct and relevant brand game so that buyers can find
              your offers easily.
            </li>
            <li>
              Sellers are strictly prohibited from offering any product or
              services which may violate local laws and regulations.
            </li>
            <li>
              To request for a brand or product not listed here, please send a
              ticket to us and provide the URL to the official brand site.
            </li>
            <li>
              SubGAME reserves the right to remove any offer that violates our
              policies without prior notice.
            </li>
            <li>Uploading fake codes is strictly prohibited.</li>
          </ul>
        </div>
      </div>
      {selected && (
        <div className="md:grid md:grid-cols-4 bg-bg md:bg-transparent fixed md:static bottom-0 left-0 w-full p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] md:shadow-none">
          <div className="col-span-3 w-full flex justify-center md:justify-end ">
            <button
              className="bg-secondary1 cursor-pointer text-white font-medium py-3 px-5 rounded w-full md:w-auto"
              onClick={() => navigate(`/offers/create?game=${selected}`)}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectGameBrand;
