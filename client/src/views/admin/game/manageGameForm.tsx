import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreateUpdateGame } from "../../../hooks/game/useCreateUpdateGame";
import { useDeleteGame } from "../../../hooks/game/useDeleteGame";
import { LiaCloudUploadAltSolid } from "react-icons/lia";
import toast from "react-hot-toast";

type GameFormData = {
  name: string;
  preview: string | null;
  fields: Field[];
};

type Props = {
  data?: GameFormData;
  id?: string;
};

type Field = {
  id: string;
  name: string;
  label: string;
  type: "text" | "select";
  required: boolean;
  options?: string[];
};

const createEmptyField = (): Field => ({
  id: crypto.randomUUID(),
  name: "",
  label: "",
  type: "text",
  required: false,
  options: [],
});

const ManageGameForm = ({ data, id }: Props) => {
  const navigate = useNavigate();
  const [name, setName] = useState(() => data?.name ?? "");
  const [preview, setPreview] = useState<string | null>(
    () => data?.preview ?? null,
  );
  const initialFields = data?.fields ?? [];
  const [fields, setFields] = useState<Field[]>(initialFields);
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const {
    mutate: createUpdateGameMutation,
    isPending: isCreatingUpdatingGame,
  } = useCreateUpdateGame(id);
  const { mutate: deleteGameMutation, isPending: isDeletingGame } =
    useDeleteGame();

  const DEFAULT_FIELD_NAMES = [
    "title",
    "description",
    "price",
    "cover",
    "stock",
    "guarantee",
  ];

  //  tambah field
  const addField = () => {
    setFields((prev) => [...prev, createEmptyField()]);
  };

  //  update field
  const handleFieldChange = <K extends keyof Field>(
    index: number,
    key: K,
    value: Field[K],
  ) => {
    setFields((prev) =>
      prev.map((field, i) =>
        i === index ? { ...field, [key]: value } : field,
      ),
    );
  };

  //  option
  const addOption = (index: number) => {
    setFields((prev) =>
      prev.map((field, i) =>
        i === index
          ? { ...field, options: [...(field.options || []), ""] }
          : field,
      ),
    );
  };

  const handleOptionChange = (
    fieldIndex: number,
    optionIndex: number,
    value: string,
  ) => {
    setFields((prev) =>
      prev.map((field, i) => {
        if (i !== fieldIndex) return field;
        const newOptions = [...(field.options || [])];
        newOptions[optionIndex] = value;
        return { ...field, options: newOptions };
      }),
    );
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    setFields((prev) =>
      prev.map((field, i) => {
        if (i !== fieldIndex) return field;

        if ((field.options || []).length <= 1) {
          return field;
        }

        return {
          ...field,
          options: (field.options || []).filter((_, i) => i !== optionIndex),
        };
      }),
    );
  };

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const generateName = (label: string) => {
    return label
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
  };

  //  submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    for (const field of fields) {
      if (!field.label.trim()) {
        newErrors[field.id] = "Field label is required";
      }

      if (field.type === "select") {
        if (!field.options || field.options.length === 0) {
          newErrors[field.id] = `Field "${field.label}" harus punya option`;
        } else if (field.options.some((opt) => !opt.trim())) {
          newErrors[field.id] = `Semua option di "${field.label}" wajib diisi`;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payloadFields = fields.map(({ id, ...rest }) => rest);
    createUpdateGameMutation(
      {
        name,
        image,
        fields: payloadFields,
      },
      {
        onSuccess: () => {
          toast.success(id ? "Game updated!" : "Game created!");
          setName("");
          setImage(null);
          setPreview(null);
          setFields([createEmptyField()]);
          navigate("/admin/games");
        },
        onError: (error: any) => {
          toast.error("Failed to update game");
          setErrors(error.response.data.errors);
        },
      },
    );
  };

  const handleDeleteGame = async () => {
    if (!confirm("Are you sure you want to delete this game?")) return;

    deleteGameMutation(id, {
      onSuccess: () => {
        alert("Game deleted!");
        navigate("/admin/games");
      },
      onError: () => {
        alert("Failed to delete game");
      },
    });
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
        Image: "File maksimal 2MB",
      }));
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));

    setErrors((prev) => ({
      ...prev,
      Image: "",
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-4 text-text">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {data ? "Edit Game" : "Create Game"}
        </h2>
        {data && (
          <button
            type="button"
            onClick={() => handleDeleteGame()}
            className="bg-red-600 rounded-sm text-white py-2 px-3 cursor-pointer"
          >
            {isDeletingGame ? "Deleting..." : "Delete Game"}
          </button>
        )}
      </div>

      {/* Game Name */}
      <p className="font-semibold mb-1">Name</p>
      <input
        type="text"
        placeholder="Game Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-surface input input-bordered p-2 w-full"
      />
      {errors?.Name && (
        <div className="text-error">
          <span>{errors?.Name}</span>
        </div>
      )}


      <label htmlFor="image" className="cursor-pointer">
        <span className="block text-sm font-medium ">Cover</span>
        <div className="w-80 aspect-[1.6/1] border rounded-lg flex items-center justify-center overflow-hidden">
          {preview ? (
            <img src={preview} className="object-cover w-full h-full" />
          ) : (
            <div className="flex flex-col items-center">
              <LiaCloudUploadAltSolid className="text-gray-700 text-4xl" />
              <p className="text-gray-700 text-sm font-medium">
                Upload Cover Image
              </p>
              <p className="text-gray-700 text-xs">PNG or JPG (max 2MB)</p>
            </div>
          )}
        </div>
      </label>
      <input
        type="file"
        id="image"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {errors?.Image && (
        <div className="text-error">
          <span>{errors?.Image}</span>
        </div>
      )}

      {/* Fields */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Custom Fields</h3>
        {fields.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            No custom fields yet. Click "Add Field" to create one.
          </p>
        )}

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border border-gray-300  p-3 mb-3 rounded-md space-y-2"
          >
            <label className="floating-label">
              <span className="bg-surface">Field Label</span>
              <input
                placeholder="Field Label"
                value={field.label}
                onChange={(e) => {
                  const label = e.target.value;

                  handleFieldChange(index, "label", label);
                  handleFieldChange(index, "name", generateName(label));
                }}
                className="bg-surface input border p-1 w-full"
              />
              {errors[field.id] && (
                <p className="text-red-500 text-sm">{errors[field.id]}</p>
              )}
            </label>

            <label className="floating-label mt-3">
              <span className="bg-surface">Field Type</span>
              <select
                value={field.type}
                onChange={(e) => {
                  const type = e.target.value as Field["type"];

                  handleFieldChange(index, "type", type);

                  if (type === "select") {
                    handleFieldChange(index, "required", true);
                    handleFieldChange(index, "options", [""]);
                  } else {
                    handleFieldChange(index, "required", false);
                    handleFieldChange(index, "options", []);
                  }
                }}
                className="bg-surface select border border-gray-300 p-1 rounded-sm"
              >
                <option value="text">Text</option>
                <option value="select">Select</option>
              </select>
            </label>

            <label className="flex gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={field.required}
                disabled={field.type === "select"}
                onChange={(e) =>
                  handleFieldChange(index, "required", e.target.checked)
                }
              />
              Required
            </label>

            {field.type === "select" && (
              <div>
                {field.options?.map((opt, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(index, i, e.target.value)
                      }
                      className="bg-surface input border p-1 rounded-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(index, i)}
                      className="bg-red-400 text-white py-2 px-3 cursor-pointer"
                    >
                      X
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addOption(index)}
                  className="bg-blue-500 text-white px-2 py-2 mt-1 rounded-sm cursor-pointer"
                >
                  + Add Option
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => removeField(index)}
              className="bg-red-600 rounded-sm text-white py-2 px-3 cursor-pointer"
            >
              Delete Field
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col">
        <button
          type="button"
          onClick={addField}
          className="w-fit rounded-sm bg-blue-600 text-white px-3 py-2 cursor-pointer"
        >
          + Add Field
        </button>

        <div>
          <h3 className="font-semibold mb-2 mt-4">Default Fields</h3>

          <div className="space-y-2 rounded-sm">
            {DEFAULT_FIELD_NAMES.map((field) => (
              <div className="flex" key={field}>
                <label className="label">
                  <input type="checkbox" checked={true} className="checkbox border-text bg-text checked:border-text checked:bg-text checked:text-bg" />
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Default fields are required by the system and cannot be edited.
          </p>
        </div>

        <button
          type="submit"
          className="my-2 rounded-sm bg-secondary1 text-bg px-3 py-2 cursor-pointer"
        >
          {id
            ? isCreatingUpdatingGame
              ? "Updating Game..."
              : "Update Game"
            : isCreatingUpdatingGame
              ? "Creating Game..."
              : "Save Game"}
        </button>
      </div>
    </form>
  );
};

export default ManageGameForm;
