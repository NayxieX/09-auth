import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/serverApi";

export const useCreateNote = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onSuccess?.();
    },
  });
};
