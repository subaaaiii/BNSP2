import { useState, useContext, useEffect } from "react";
import { useUser } from "../../hooks/profile/useUser";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { LiaCloudUploadAltSolid } from "react-icons/lia";
import { useApplySeller } from "../../hooks/seller/useApplySeller";
import { useCheckSeller } from "../../hooks/seller/useCheckSeller";
import Api from "../../services/api";

interface ValidationErrors {
  [key: string]: string;
}

const SellerApply = () => {
  const navigate = useNavigate();
  const { data: sellerData } = useCheckSeller();

  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { user } = useContext(AuthContext)!;
  const userId = user?.id;
  const { data, isLoading } = useUser(userId);
  const { mutate, isPending } = useApplySeller();

  const [errors, setErrors] = useState<ValidationErrors>({});

  const [form, setForm] = useState({
    name: "",
    birthday: "",
    gender: "",
    address: "",
    identity_number: "",
    identity_image: null as File | null,
  });

  const [pictureFile, setPictureFile] = useState<File | null>(null);

  useEffect(() => {
    if (sellerData) {
      setForm({
        name: sellerData.user.name ?? "",
        birthday: sellerData.user.birthday ?? "",
        gender: sellerData.user.gender ?? "",
        address: sellerData.user.address ?? "",
        identity_number: sellerData.identity_number ?? "",
        identity_image: sellerData.identity_image ?? null,
      });
      setPreview(
        `${Api.defaults.baseURL}/images/sellers/identities/${sellerData.identity_image}`,
      );
    } else if (data) {
      setForm({
        name: data.name ?? "",
        birthday: data.birthday ?? "",
        gender: data.gender ?? "",
        address: data.address ?? "",
        identity_number: "",
        identity_image: null,
      });
    }
  }, [data]);

  useEffect(() => {
    if (sellerData) {
      console.log("seller data", sellerData);
    }
  }, [sellerData]);

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

  const MAX_SIZE = 2 * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      return;
    }
    if (file.size > MAX_SIZE) {
      setErrors((prev) => ({
        ...prev,
        IdentityImage: "File maksimal 2MB",
      }));
      return;
    }
    setPictureFile(file);
    setPreview(URL.createObjectURL(file));

    setErrors((prev) => ({
      ...prev,
      IdentityImage: "",
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("form data", form);
    mutate(
      {
        name: form.name,
        birthday: form.birthday,
        gender: form.gender,
        address: form.address,
        identity_number: form.identity_number,
        identity_image: pictureFile,
      },
      {
        onSuccess: () => {
          navigate("/");
        },
        onError: (error: any) => {
          setErrors(error.response.data.errors);
        },
      },
    );
  };
  if (isLoading) {
    return (
      <div className="mb-10 w-full rounded-2xl bg-white p-10 shadow-xl animate-pulse">
        <div className="flex flex-col md:flex-row justify-between mb-5">
          <div className="space-y-4 w-full">
            <div className="h-10 bg-gray-200 rounded w-40"></div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>

          <div className="text-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto"></div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-std mb-10 w-full rounded-2xl bg-white p-10 font-normal leading-relaxed text-gray-900 shadow-xl">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-blue-900">
          {sellerData ? "Seller Application Status" : "Apply as a Seller"}
        </h2>

        <p className="mt-2 text-gray-600 leading-relaxed">
          {sellerData
            ? "Your application is currently under review. Please wait while our team verifies your information."
            : "Complete your profile and upload your identification documents to start selling."}
        </p>

        <div
          className={`mt-4 p-4 rounded-lg border mb-4 ${
            sellerData?.status === "pending"
              ? "bg-yellow-50 border-yellow-200"
              : "bg-blue-50 border-blue-100"
          }`}
        >
          {sellerData?.status === "pending" ? (
            <div className="text-sm text-yellow-800 space-y-1">
              <p className="font-semibold">Status: Pending Review ⏳</p>
              <p>
                Your seller application is being reviewed by our team. This
                process usually takes 1–2 business days.
              </p>
              <p>
                You will be notified once your application is approved or if
                additional information is required.
              </p>
            </div>
          ) : (
            <p className="text-sm text-blue-800">
              Please ensure all information is accurate and matches your
              official identification. Our team will review your submission
              before approving your seller account.
            </p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col w-fit">
            <label
              className={`${sellerData?.status === "pending" ? "" : "cursor-pointer"}`}
            >
              <div className="w-80 aspect-[1.6/1] border rounded-lg flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img
                    src={preview}
                    className={`object-cover w-full h-full ${sellerData?.status === "pending" ? "grayscale" : ""}`}
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <LiaCloudUploadAltSolid className="text-gray-700 text-4xl" />
                    <p className="text-gray-700 text-sm font-medium">
                      Upload Identity Image
                    </p>
                    <p className="text-gray-700 text-xs">
                      PNG or JPG (max 2MB)
                    </p>
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={sellerData?.status === "pending"}
              />
            </label>
            {preview && (
              <p className="text-xs text-gray-600 mt-1 text-center">
                {pictureFile?.name}
              </p>
            )}
            {errors?.IdentityImage && (
              <div className="text-error justify-center flex">
                <span>{errors?.IdentityImage}</span>
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="identity_number"
              className="block text-sm font-medium text-gray-700"
            >
              Identity Number
            </label>
            <input
              type="number"
              name="identity_number"
              value={form.identity_number}
              onChange={handleChange}
              disabled={sellerData?.status === "pending"}
              className={`${errors.IdentityNumber ? "input-error" : ""} w-full disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.IdentityNumber && (
              <div className="text-error">
                <span>{errors.IdentityNumber}</span>
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={sellerData?.status === "pending"}
              className={`${errors.Name ? "input-error" : ""} w-full disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.Name && (
              <div className="text-error">
                <span>{errors.Name}</span>
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="birthday"
              className="block text-sm font-medium text-gray-700"
            >
              Birthday
            </label>
            <input
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
              disabled={sellerData?.status === "pending"}
              className={`${errors.Birthday ? "input-error" : ""}w-full disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.Birthday && (
              <div className="text-error">
                <span>{errors.Birthday}</span>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <div className="flex gap-4">
              <label>
                <input
                  type="checkbox"
                  name="gender"
                  value="male"
                  checked={form.gender === "male"}
                  disabled={sellerData?.status === "pending"}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="checkbox checkbox-sm"
                />
                Male
              </label>

              <label>
                <input
                  type="checkbox"
                  name="gender"
                  value="female"
                  checked={form.gender === "female"}
                  disabled={sellerData?.status === "pending"}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="checkbox checkbox-sm"
                />
                Female
              </label>
            </div>
            {errors.Gender && (
              <div className="text-error">
                <span>{errors.Gender}</span>
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <textarea
              placeholder="address"
              className={`${errors.Name ? "input-error" : ""} w-full textarea textarea-md`}
              name="address"
              value={form.address}
              onChange={handleChange}
              disabled={sellerData?.status === "pending"}
            ></textarea>
            {errors.Address && (
              <div className="text-error">
                <span>{errors.Address}</span>
              </div>
            )}
          </div>

          {sellerData?.status !== "pending" && (
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-indigo-800 text-white rounded-lg hover:bg-indigo-700"
              >
                {isPending ? "Loading..." : "Apply Now"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SellerApply;
