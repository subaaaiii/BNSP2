import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const Security = () => {
  const { user } = useContext(AuthContext)!;
  return (
    <div className="font-std mb-10 w-full rounded-2xl bg-white p-10 font-normal leading-relaxed text-gray-900 shadow-xl">
      <div className="flex flex-row">
        <div className="flex flex-col mb-5 items-start w-full ">
          <h2 className="mb-5 text-4xl font-bold text-blue-900">Security</h2>
          <div className="flex justify-between w-full items-center py-4">
            <div>
              <div className="font-semibold text-lg">Email</div>
              <div className="text-gray-600">
                Your Email Address is {user?.email}
              </div>
            </div>
            <button
              className="shadow-md py-3 px-5 rounded-box cursor-pointer"
              onClick={() => {
                const modal = document.getElementById(
                  "my_modal_1",
                ) as HTMLDialogElement | null;
                if (modal) modal.showModal();
              }}
            >
              Edit
            </button>
            <dialog id="my_modal_1" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">
                  Press ESC key or click the button below to close
                </p>
                <div className="modal-action">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
          <hr className="w-full border-gray-300" />
          <div className="flex justify-between w-full items-center py-4">
            <div>
              <div className="font-semibold text-lg">Password</div>
              <div className="text-gray-600">
                Guard your password and do not reveal it to anyone.
              </div>
            </div>
            <button
              className="shadow-md py-3 px-5 rounded-box cursor-pointer"
              onClick={() => {
                const modal = document.getElementById(
                  "my_modal_2",
                ) as HTMLDialogElement | null;
                if (modal) modal.showModal();
              }}
            >
              Edit
            </button>
            <dialog id="my_modal_2" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">
                  Password
                </p>
                <div className="modal-action">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>

          </div>
          <hr className="w-full border-gray-300" />
        </div>
      </div>
    </div>
  );
};
export default Security;
