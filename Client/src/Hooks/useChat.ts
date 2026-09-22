import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChatHistory, sendMessage } from "../Api/ai";

export const useChatHistory = () => {
  return useQuery({
    queryKey: ["chat"],
    queryFn: async () => {
      const res = await getChatHistory();
      return res.data;
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: string) => sendMessage(message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });
};
