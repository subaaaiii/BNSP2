import {  useState } from "react";
import { useNavigate } from "react-router";
import { FiAlertCircle } from "react-icons/fi";
import { useGames } from "../../hooks/game/useGames";

const SelectGameBrand = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const { data: games } = useGames();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Add new offer</h1>
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="col-span-3 p-12 bg-white shadow-xl rounded-xl leading-relaxed text-gray-900">
          <div className="text-2xl font-medium">Game brand</div>
          <div className="font-std mb-4">
            Select game brand you want to offer
          </div>
          <div className="w-full bg-[#448aff] rounded-lg flex flex-row items-start mb-4 ">
            <FiAlertCircle className="w-16 h-16 text-white mx-4 mt-2" />
            <ol className="list-decimal pl-5 text-white space-y-3 py-4 px-4">
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
          <div className="flex items-center gap-64">
            <div className="">
              Brand*
            </div>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="select rounded-lg"
            >
              <option value="" disabled hidden>
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
        <div className="col-span-1">
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
      {selected &&(
        <div className="grid grid-cols-4">
        <div className="col-span-3 w-full flex justify-end">
          <button className="bg-neutral hover:bg-gray-700 cursor-pointer text-white font-medium py-3 px-5 rounded" onClick={()=>navigate(`/offers/create?game=${selected}`)}>
            Continue
          </button>
        </div>
      </div>
      )}
    </div>
  );
};

export default SelectGameBrand;
