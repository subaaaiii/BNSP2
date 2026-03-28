import { useState } from "react";
import { useNavigate } from "react-router";
import { useGame } from "../../hooks/game/useGame";
import { useCreateProduct } from "../../hooks/product/useCreateProduct";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setPictureFile(file);
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
    <div className="font-std mb-10 w-full rounded-2xl bg-white p-10 font-normal leading-relaxed text-gray-900 shadow-xl">
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row justify-between mb-5 items-start">
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            {data?.fields && (
              <div className="space-y-4">
                {data.fields.map((field: any) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {field.label}
                    </label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={fieldValues[field.name] || ""}
                        onChange={handleFieldChange}
                        className="input select w-full"
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
                        className={`${errors[field.name] ? "input-error" : ""} w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                    )}

                    {errors[field.name] && (
                      <div className="text-error">
                        <span>{errors[field.name]}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className={`${errors.Title ? "input-error" : ""} w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.Title && (
                <div className="text-error">
                  <span>{errors.Title}</span>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                placeholder="description"
                className={`${errors.Description ? "input-error" : ""} w-full textarea textarea-md`}
                name="description"
                value={form.description}
                onChange={handleChange}
              ></textarea>
              {errors.Description && (
                <div className="text-error">
                  <span>{errors.Description}</span>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className={`${errors.Price ? "input-error" : ""}w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.Price && (
                <div className="text-error">
                  <span>{errors.Price}</span>
                </div>
              )}
            </div>
            <div>
              {pictureFile && (
                <img
                  src={URL.createObjectURL(pictureFile)}
                  alt="Profile"
                  className="max-w-64 max-h-48 rounded-sm mb-4"
                />
              )}
              <input
                type="file"
                id="image"
                hidden
                onChange={handleFileChange}
              />
              <label
                htmlFor="image"
                className="cursor-pointer text-sm text-indigo-700 bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300 ring ring-gray-300 hover:ring-indigo-300"
              >
                Add Product Image
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-indigo-800 text-white rounded-lg hover:bg-indigo-700"
              >
                {isPending ? "Loading..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOffer;
