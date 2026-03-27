import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreateUpdateGame } from "../../../hooks/game/useCreateUpdateGame";
import { useDeleteGame } from "../../../hooks/game/useDeleteGame";

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
  const initialFields = data?.fields ?? [createEmptyField()];
  const [fields, setFields] = useState<Field[]>(initialFields);
  const [image, setImage] = useState<File | null>(null);
  const {
    mutate: createUpdateGameMutation,
    isPending: isCreatingUpdatingGame,
  } = useCreateUpdateGame(id);
  const { mutate: deleteGameMutation, isPending: isDeletingGame } =
    useDeleteGame();

  const DEFAULT_FIELD_NAMES = ["title", "description", "price", "cover"];

  const handleImageChange = (file: File) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

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

    if (!data && !image) {
      alert("Image wajib diupload");
      return;
    }

    for (const field of fields) {
      if (!field.name.trim()) {
        alert("Field name tidak boleh kosong");
        return;
      }

      if (field.type === "select") {
        if (!field.options || field.options.length === 0) {
          alert(`Field "${field.name}" harus punya option`);
          return;
        }
      }
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
          alert(id ? "Game updated!" : "Game created!");
          setName("");
          setImage(null);
          setPreview(null);
          setFields([createEmptyField()]);
          navigate("/admin/games");
        },
        onError: () => {
          alert("Failed to update game");
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

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {/* {isEdit ? "Edit Game" : "Create Game"} */}
        </h2>
        <button
          type="button"
          onClick={() => handleDeleteGame()}
          className="bg-red-600 rounded-sm text-white py-2 px-3 cursor-pointer"
        >
          {isDeletingGame ? "Deleting..." : "Delete Game"}
        </button>
      </div>

      {/* Game Name */}
      <p className="font-semibold mb-1">Name</p>
      <input
        type="text"
        placeholder="Game Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input input-bordered p-2 w-full"
      />

      {/* 🖼️ Image Upload */}
      <div>
        <p className="font-semibold mb-1">Cover</p>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleImageChange(e.target.files[0]);
            }
          }}
          className="file-input file-input-md"
        />

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="mt-2 h-48 w-64 object-cover rounded-lg"
          />
        )}
      </div>

      {/* Fields */}
      <div>
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
              <span>Field Label</span>
              <input
                placeholder="Field Label"
                value={field.label}
                onChange={(e) => {
                  const label = e.target.value;

                  handleFieldChange(index, "label", label);
                  handleFieldChange(index, "name", generateName(label));
                }}
                className="input border p-1 w-full"
              />
            </label>

            <label className="floating-label mt-3">
              <span>Field Type</span>
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
                className="select border border-gray-300 p-1 rounded-sm"
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
                      className="input border p-1 rounded-sm"
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
                  <input type="checkbox" defaultChecked className="checkbox" />
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
          className="my-2 rounded-sm bg-neutral text-white px-3 py-2 cursor-pointer"
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
