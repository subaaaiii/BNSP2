import { useQuery } from "@tanstack/react-query";
import Api from "../../services/api";
const DEFAULT_FIELD_NAMES = ["title", "description", "price", "cover"];

export const useGame = (id?: string) => {
  return useQuery({
    queryKey: ["game", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await Api.get(`/api/admin/games/${id}`);
      const game = res.data.data;
      const mappedFields = game.fields.map((field: any) => ({
        id: crypto.randomUUID(),
        name: field.name,
        label: field.label,
        type: field.type,
        required: field.required,
        options: field.options || [],
      }));

      const customFields = mappedFields.filter(
        (f: any) => !DEFAULT_FIELD_NAMES.includes(f.name),
      );

      return {
        name: game.name,
        preview: game.image
          ? `${Api.defaults.baseURL}/images/games/covers/${game.image}`
          : null,
        fields: customFields,
      };
    },
  });
};
