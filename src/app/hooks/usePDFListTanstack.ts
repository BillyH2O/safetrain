import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const usePDFListTanstack = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const response = await axios.get("/api/get-chats");
      return response.data;
    },
  });

  return {
    chats: data ?? [],
    isLoading,
    refetch
  };
};
