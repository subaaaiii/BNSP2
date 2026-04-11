import { useState } from "react";
import { useSeller } from "../../../hooks/seller/useSeller";
import Api from "../../../services/api";
import { useUpdateStatusSeller } from "../../../hooks/seller/useUpdateStatusSeller";
import noPendingImg from "../../../assets/no_pending.png";

const ReviewSeller = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const { data: sellers } = useSeller();
  const [selected, setSelected] = useState<number[]>([]);
  const { mutate } = useUpdateStatusSeller();

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
    mutate(
      { ids, status },
      {
        onSuccess: () => {
          setSelected([]);
        },
        onError: (error) => {
          console.error("Error updating seller status:", error);
        },
      },
    );
  };

  return (
    <div className="overflow-x-auto">
      {!sellers?.some((seller) => seller.status === "pending") ? (
        <div className="flex flex-col items-center gap-4 py-10">
          <img src={noPendingImg} alt="No Pending Sellers" />
          <h2 className="text-2xl font-semibold text-gray-400">No Pending Sellers Application</h2>
        </div>
      ) : (
        <table className="table table-auto">
          <thead>
            <tr>
              <th>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selected.length === sellers?.length}
                    onChange={() =>
                      setSelected(
                        selected.length === sellers?.length
                          ? []
                          : sellers?.map((s) => s.id) || [],
                      )
                    }
                  />
                </label>
              </th>
              <th>Identity Card</th>
              <th className="w-full">Details</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {sellers
              ?.filter((seller) => seller.status === "pending")
              .map((seller) => (
                <tr
                  key={seller.id}
                  className={selected.includes(seller.id) ? "bg-base-300" : ""}
                >
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selected.includes(seller.id)}
                      onChange={() => handleCheck(seller.id)}
                    />
                  </td>

                  {/* IMAGE */}
                  <td className="whitespace-nowrap">
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        setPreview(
                          `${Api.defaults.baseURL}/images/sellers/identities/${seller.identity_image}`,
                        )
                      }
                    >
                      <div className="w-80 aspect-[1.6/1] border rounded-lg overflow-hidden">
                        <img
                          src={`${Api.defaults.baseURL}/images/sellers/identities/${seller.identity_image}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </td>

                  {/* DETAILS */}
                  <td>
                    <ul>
                      <li>ID Card Number: {seller.identity_number}</li>
                      <li>Name: {seller.user.name}</li>
                      <li>Gender: {seller.user.gender}</li>
                      <li>Birthday: {seller.user.birthday}</li>
                      <li>Address: {seller.user.address}</li>
                    </ul>
                  </td>

                  {/* ACTION */}
                  <td className="whitespace-nowrap">
                    <button
                      className="btn btn-success btn-sm mr-2"
                      onClick={() =>
                        handleReviewSelected({
                          ids: [seller.id],
                          status: "approved",
                        })
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() =>
                        handleReviewSelected({
                          ids: [seller.id],
                          status: "rejected",
                        })
                      }
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {selected.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-base-100 p-6 flex justify-center gap-4 items-center z-40 shadow-[0_-6px_10px_rgba(0,0,0,0.1)]">
          <span className="text-sm">{selected.length} selected</span>

          <div>
            <button
              className="btn btn-success btn-sm mr-2"
              onClick={() =>
                handleReviewSelected({ ids: selected, status: "approved" })
              }
            >
              Approve Selected
            </button>
            <button
              className="btn btn-error btn-sm"
              onClick={() =>
                handleReviewSelected({ ids: selected, status: "rejected" })
              }
            >
              Reject Selected
            </button>
          </div>
        </div>
      )}

      {/* 🔥 MODAL PREVIEW */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-w-5xl w-full p-4">
            {/* close button */}
            <button
              className="absolute top-2 right-2 btn btn-sm btn-circle"
              onClick={() => setPreview(null)}
            >
              ✕
            </button>

            {/* image */}
            <img
              src={preview}
              className="w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSeller;
