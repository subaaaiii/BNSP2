import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useGame } from "../../hooks/game/useGame";
import { useCreateAndUpdateProduct } from "../../hooks/product/useCreateAndUpdateProduct";
import { LiaCloudUploadAltSolid } from "react-icons/lia";
import { useGetProductById } from "../../hooks/product/useGetProductById";
import Api from "../../services/api";
import toast from "react-hot-toast";
import TopNavbar from "../../components/top_navbar";

interface ValidationErrors {
  [key: string]: string;
}

const ProductForm = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const { data: product } = useGetProductById(productId ?? undefined);
  // const product = productData?.data;
  const gameIdFromParams = searchParams.get("game");
  const gameId = product ? product?.game_id : gameIdFromParams;
  const { data } = useGame(gameId ?? undefined);

  const { mutate, isPending } = useCreateAndUpdateProduct(
    productId ?? undefined,
  );
  const navigate = useNavigate();
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [preview, setPreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState<boolean>(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    fieldValues: "",
    stock: "1",
    guarantee: "",
  });

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title ?? "",
        description: product.description ?? "",
        price: product.price ?? "",
        image: product.image ?? "",
        fieldValues: product.field_values ?? "",
        stock: product.stock ?? "1",
        guarantee: product.guarantee ?? "",
      });
      setFieldValues(product.field_values || {});
      if (product.image != "") {
        setPreview(`${Api.defaults.baseURL}/images/products/${product.image}`);
      }
    }
  }, [product]);

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
        Image: "File maksimal 2MB",
      }));
      return;
    }

    setRemoveImage(false);
    setPictureFile(file);
    setPreview(URL.createObjectURL(file));

    setErrors((prev) => ({
      ...prev,
      Image: "",
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      {
        gameId: gameId!,
        title: form.title,
        description: form.description,
        price: form.price,
        image: pictureFile,
        fieldValues,
        stock: form.stock,
        guarantee: form.guarantee,
        remove_image: removeImage,
      },
      {
        onSuccess: () => {
          toast.success(
            `Offer ${productId ? "updated" : "created"} successfully!`,
          );
          navigate("/offers");
        },
        onError: (error: any) => {
          setErrors(error.response.data.errors);
          toast.error(
            `Failed to ${productId ? "update" : "create"} offer. ${error.response.data.message || ""}`,
          );
          console.error("Error details:", error.response.data);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
      <TopNavbar title={`${productId ? "Update Offer" : "Create offer"}`}/>
      <div>
        <h2 className="text-3xl font-semibold mb-4 px-4 md:px-0 hidden md:block">
          {productId ? "Update Offer" : "Create offer"}
        </h2>

        {/* ================= SECTION 1 ================= */}
        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-4 md:col-span-3 font-std mb-10 w-full rounded-2xl bg-bg p-4 md:p-10 font-normal leading-relaxed text-gray-900 shadow-xl">
            <div className="flex flex-col">
              <div className="flex flex-col justify-between mb-5 items-start">
                <h6 className="text-2xl font-semibold mb-4 text-text">Offer Details</h6>

                <div className="grid grid-cols-3 w-full space-y-4">
                  <div className="col-span-1">
                    <div className="font-medium text-text">Game Brand</div>
                  </div>
                  <div className="col-span-2">
                    <div className="font-medium text-text">
                      {data?.name}
                    </div>
                  </div>
                </div>

                <hr className="w-full border-t border-gray-300 my-10 " />

                <div className="space-y-10 w-full">
                  {data?.fields && (
                    <div className="space-y-10">
                      {data.fields.map((field: any) => {
                        return (
                          <div
                            key={field.id}
                            className="grid grid-cols-1 md:grid-cols-3 space-y-2 md:space-y-0 items-center"
                          >
                            <div className="col-span-1">
                              <label
                                htmlFor={field.name}
                                className="block text-sm font-medium text-text"
                              >
                                {field.label}
                              </label>
                            </div>

                            <div className="col-span-2 ">
                              {field.type === "select" ? (
                                <>
                                  <select
                                    name={field.name}
                                    value={fieldValues?.[field.name] || ""}
                                    onChange={handleFieldChange}
                                    className="input select rounded-xl w-full md:max-w-xs"
                                  >
                                    <option value="">
                                      Select {field.label} option
                                    </option>
                                    {field.options?.map((opt: any) => (
                                      <option key={opt} value={opt}>
                                        {opt}
                                      </option>
                                    ))}
                                  </select>
                                  {errors[field.name] && (
                                    <div className="text-error">
                                      <span>{errors[field.name]}</span>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div>
                                  <input
                                    type="text"
                                    name={field.name}
                                    value={fieldValues[field.name] || ""}
                                    onChange={handleFieldChange}
                                    className={`bg-surface text-text ${errors[field.name] ? "input-error" : ""} input px-3 py-2 rounded-xl w-full md:max-w-xs`}
                                  />
                                  {errors[field.name] && (
                                    <div className="text-error">
                                      <span>{errors[field.name]}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <hr className="w-full border-t border-gray-300 my-10 " />

                  {/* IMAGE */}
                  <div className="grid grid-cols-1 md:grid-cols-3 space-y-2 md:space-y-0 items-center">
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium text-text col-span-1"
                    >
                      Image
                    </label>

                    <label
                      htmlFor="image"
                      className="flex gap-6 col-span-2 items-center cursor-pointer"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`${errors.Image ? "border border-red-300" : "border border-gray-300"} w-80 aspect-[1.6/1] rounded-lg flex items-center justify-center overflow-hidden`}
                        >
                          {preview ? (
                            <img
                              src={preview}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="flex flex-col items-center">
                              <LiaCloudUploadAltSolid className="text-text text-4xl" />
                              <p className="text-text text-sm font-medium">
                                Upload Cover Image
                              </p>
                              <p className="text-text text-xs">
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

                        {preview && (
                          <button
                            type="button"
                            onClick={() => {
                              setPictureFile(null);
                              setPreview(null);
                              setRemoveImage(true);
                            }}
                            className="text-xs text-red-500 hover:underline bg-red-100 px-3 py-2 rounded mt-2"
                          >
                            Remove image
                          </button>
                        )}
                        {errors.Image && (
                          <div className="text-error">
                            <span>{errors.Image}</span>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* TITLE */}
                  <div className="grid grid-cols-1 md:grid-cols-3 space-y-2 md:space-y-0 items-center">
                    <label className="text-sm font-medium text-text col-span-1">
                      Title
                    </label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className={`bg-surface text-text ${errors.Title ? "input-error" : ""}input  w-full rounded-md md:rounded-xl`}
                      />
                      {errors.Title && (
                        <div className="text-error">
                          <span>{errors.Title}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div className="grid grid-cols-1 md:grid-cols-3 space-y-2 md:space-y-0 items-center">
                    <label className="col-span-1 text-sm font-medium text-text">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className={`bg-surface text-text ${errors.Description ? "input-error" : ""} col-span-2 w-full h-32 textarea textarea-md px-3 py-2 border border-gray-300 rounded-md md:rounded-xl`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="hidden md:block md:col-span-1 mt-4">
            <ul className="list-disc space-y-3 text-text">
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
        <div className="grid grid-cols-4 gap-6 ">
          <div className="col-span-4 md:col-span-3 font-std pb-30 md:mb-10 w-full rounded-2xl bg-bg p-4 md:p-10 text-gray-900 shadow-xl">
            <div className="flex flex-col space-y-10">
              <h6 className="text-2xl font-semibold mb-4">Sales Information</h6>

              <div className="grid grid-cols-1 md:grid-cols-3 items-center">
                <label className="col-span-1 text-sm font-medium text-text">
                  Price
                </label>
                <div className="col-span-2 w-full md:max-w-xs items-center">
                  <p
                    className={`border  ${errors.Price ? " border-red-300" : "border-gray-300"} input w-full md:w-auto flex bg-gray-100 rounded-md md:rounded-xl font-semibold pr-0 overflow-hidden"`}
                  >
                    <span>IDR</span>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      className={`bg-surface text-text border-l ${errors.Price ? " border-red-300" : "border-gray-300"} pl-2 rounded-r-lg w-full `}
                    />
                  </p>
                  {errors.Price && (
                    <div className="text-error">
                      <span>{errors.Price}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 items-center">
                <label className="text-sm font-medium text-text">
                  Stock
                </label>
                <div className="col-span-2 w-full md:max-w-xs">
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    className={`bg-surface text-text ${errors.Stock ? "input-error" : ""} rounded-md md:rounded-xl  input w-full`}
                  />
                  {errors.Stock && (
                    <div className="text-error">
                      <span>{errors.Stock}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 items-center">
                <label className="col-span-1 text-sm font-medium text-text">
                  Guarantee time
                </label>
                <div className="col-span-2 w-full md:max-w-xs">
                  <select
                    name="guarantee"
                    value={form.guarantee}
                    onChange={handleChange}
                    className={`bg-surface text-text ${errors.Guarantee ? "input-error" : ""} col-span-2 input select rounded-md md:rounded-xl w-full`}
                  >
                    <option value="">Select guarantee time</option>
                    {[7, 14, 30].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt} days
                      </option>
                    ))}
                  </select>
                  {errors.Guarantee && (
                    <div className="text-error">
                      <span>{errors.Guarantee}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block col-span-1 mt-4">
            <ul className="list-disc space-y-3 text-text">
              <li>Set a reasonable but competitive price.</li>
              <li>
                You can also get more sales by offering a longer Guarantee time.
              </li>
            </ul>
          </div>
        </div>

        {/* ================= ACTION ================= */}
        <div className="bg-bg md:bg-transparent fixed md:static bottom-0 left-0 w-full grid grid-cols-4 p-4 md:pb-10 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] md:shadow-none">
          <div className="col-span-4 md:col-span-3 flex justify-center md:justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cursor-pointer px-4 py-2 bg-surface text-text rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className=" cursor-pointer px-4 py-2 bg-secondary1 text-bg rounded-lg"
            >
              {isPending ? "Loading..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
