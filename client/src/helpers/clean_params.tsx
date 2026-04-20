export const cleanParams = <T extends Record<string, any>>(filters: T) =>
  Object.fromEntries(
    Object.entries(filters).filter(
      ([_, value]) => value !== "" && value !== undefined && value !== null
    )
  );