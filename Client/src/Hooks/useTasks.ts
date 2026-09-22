import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { createTask, deleteTask, getTask, getTasks, patchTask } from "../Api/tasks";

interface taskData{
  title?: string;
  importance?: "low" | "medium" | "high";
  date?: Date;
  status?: "pending" | "completed";
}


export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await getTasks();
      return res.data;
    },
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: async () => {
      const res = await getTask(id);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id:string) => deleteTask(id),
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey: ["tasks"]})
        }
    })
}

export const usePatchTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn : ({ id, data }: { id: string; data: taskData }) => patchTask(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:["tasks"]})
        }
    })
}