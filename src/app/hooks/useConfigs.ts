import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useConfigs = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["configs-selector"],
    queryFn: async () => {
      const response = await axios.get("/api/get-configs");
      return response.data;
    },
  });

  return { configs: data ?? [], isLoading, error };
};
