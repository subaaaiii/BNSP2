import { useState } from "react";
import { useNavigate } from "react-router";
import { useGame } from "../../hooks/game/useGame";
import { useCreateProduct } from "../../hooks/product/useCreateProduct";
import { LiaCloudUploadAltSolid } from "react-icons/lia";
import { FiInfo } from "react-icons/fi";

interface ValidationErrors {
  [key: string]: string;
}

const CreateOffer = ({ gameId }: { gameId: string }) => {
  const { data } = useGame(gameId);
  const { mutate, isPending } = useCreateProduct();
  const navigate = useNavigate();
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<ValidationErrors>({});

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    fieldValues: "",
    stock: 1,
    guarantee: "",
  });

  const [pictureFile, setPictureFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFieldValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const MAX_SIZE = 2 * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (file.size > MAX_SIZE) {
      setErrors((prev) => ({
        ...prev,
        IdentityImage: "File maksimal 2MB",
      }));
      return;
    }

    setPictureFile(file);

    setErrors((prev) => ({
      ...prev,
      IdentityImage: "",
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      {
        gameId: gameId!,
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        image: pictureFile,
        fieldValues,
        // stock: form.stock,
        // guarantee: form.guarantee,
      },
      {
        onSuccess: () => {
          navigate("/product/games");
        },
        onError: (error: any) => {
          setErrors(error.response.data.errors);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h2 className="text-3xl font-semibold mb-4">Create Offer</h2>

        {/* ================= SECTION 1 ================= */}
        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-3 font-std mb-10 w-full rounded-2xl bg-white p-10 font-normal leading-relaxed text-gray-900 shadow-xl">
            <div className="flex flex-col">
              <div className="flex flex-col justify-between mb-5 items-start">
                <h6 className="text-2xl font-semibold mb-4">
                  Offer Details
                </h6>

                <div className="grid grid-cols-3 w-full space-y-4">
                  <div className="col-span-1">
                    <div className="font-medium text-gray-700">
                      Game Brand
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="font-medium text-gray-700">
                      {data?.name}
                    </div>
                  </div>
                </div>

                <hr className="w-full border-t border-gray-300 my-10 " />

                {/* 🔥 FORM CONTENT (tetap sama, cuma tidak buka form lagi) */}
                <div className="space-y-10 w-full">
                  {data?.fields && (
                    <div className="space-y-10">
                      {data.fields.map((field: any) => (
                        <div key={field.id} className="grid grid-cols-3">
                          <div className="col-span-1">
                            <label
                              htmlFor={field.name}
                              className="block text-sm font-medium text-gray-700"
                            >
                              {field.label}
                            </label>
                          </div>

                          <div className="col-span-2">
                            {field.type === "select" ? (
                              <select
                                name={field.name}
                                value={fieldValues[field.name] || ""}
                                onChange={handleFieldChange}
                                className="input select rounded-xl"
                              >
                                {field.options?.map((opt: any) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                name={field.name}
                                value={fieldValues[field.name] || ""}
                                onChange={handleFieldChange}
                                className={`${errors[field.name] ? "input-error" : ""} input px-3 py-2 rounded-xl`}
                              />
                            )}
                          </div>

                          {errors[field.name] && (
                            <div className="text-error">
                              <span>{errors[field.name]}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <hr className="w-full border-t border-gray-300 my-10 " />

                  {/* IMAGE */}
                  <div className="grid grid-cols-3">
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium text-gray-700 col-span-1"
                    >
                      Image
                    </label>

                    <label
                      htmlFor="image"
                      className="flex gap-6 col-span-2 items-center cursor-pointer"
                    >
                      <div className="w-80 aspect-[1.6/1] border rounded-lg flex items-center justify-center overflow-hidden">
                        {pictureFile ? (
                          <img
                            src={URL.createObjectURL(pictureFile)}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex flex-col items-center">
                            <LiaCloudUploadAltSolid className="text-gray-700 text-4xl" />
                            <p className="text-gray-700 text-sm font-medium">
                              Upload Cover Image
                            </p>
                            <p className="text-gray-700 text-xs">
                              PNG or JPG (max 2MB)
                            </p>
                          </div>
                        )}
                      </div>

                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      {pictureFile && (
                        <button
                          type="button"
                          onClick={() => setPictureFile(null)}
                          className="text-xs text-red-500 hover:underline bg-red-100 px-3 py-2 rounded mt-2"
                        >
                          Remove image
                        </button>
                      )}
                    </label>

                    {errors.Title && (
                      <div className="text-error">
                        <span>{errors.Title}</span>
                      </div>
                    )}
                  </div>

                  {/* TITLE */}
                  <div className="grid grid-cols-3">
                    <label className="text-sm font-medium text-gray-700 col-span-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className={`${errors.Title ? "input-error" : ""} col-span-2 w-full px-3 py-2 border border-gray-300 rounded-xl input`}
                    />
                    {errors.Title && (
                      <div className="text-error">
                        <span>{errors.Title}</span>
                      </div>
                    )}
                  </div>

                  {/* DESCRIPTION */}
                  <div className="grid grid-cols-3">
                    <label className="col-span-1 text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className={`${errors.Description ? "input-error" : ""} col-span-2 w-full textarea textarea-md px-3 py-2 border border-gray-300 rounded-xl`}
                    />
                    {errors.Description && (
                      <div className="text-error">
                        <span>{errors.Description}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="col-span-1 mt-4">
            <ul className="list-disc space-y-3 text-gray-700">
              <li>
                Buyers must know what they're buying. Provide product
                specifications accurately and truthfully.
              </li>
              <li>
                Make it easy for buyers to read and understand product
                descriptions by using bullet points or numbering.
              </li>
            </ul>
          </div>
        </div>

        {/* ================= SECTION 2 ================= */}
        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-3 font-std mb-10 w-full rounded-2xl bg-white p-10 text-gray-900 shadow-xl">
            <div className="flex flex-col space-y-10">
              <h6 className="text-2xl font-semibold mb-4">
                Sales Information
              </h6>

              <div className="grid grid-cols-3">
                <label className="text-sm font-medium text-gray-700">
                  Price
                </label>
                <div className="flex items-center">
                  <p className="border border-gray-300 bg-gray-100 px-3 py-2 rounded-l-xl font-semibold">
                    IDR
                  </p>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className={`${errors.Price ? "input-error" : ""} px-3 py-2 border border-gray-300 rounded-r-xl`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3">
                <label className="text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className={`${errors.Stock ? "input-error" : ""} col-span-2 px-3 py-2 border border-gray-300 rounded-xl input`}
                />
              </div>

              <div className="grid grid-cols-3">
                <label className="text-sm font-medium text-gray-700">
                  Guarantee time
                </label>
                <select
                  name="guarantee"
                  value={form.guarantee}
                  onChange={handleChange}
                  className="input select rounded-xl"
                >
                  <option value="">Select guarantee time</option>
                  {[7, 14, 30].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt} day
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="col-span-1 mt-4">
            <ul className="list-disc space-y-3 text-gray-700">
              <li>Set a reasonable but competitive price.</li>
              <li>
                You can also get more sales by offering a longer
                Guarantee time.
              </li>
            </ul>
          </div>
        </div>

        {/* ================= ACTION ================= */}
        <div className="grid grid-cols-4 pb-10">
          <div className="col-span-3 flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-800 text-white rounded-lg"
            >
              {isPending ? "Loading..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateOffer;