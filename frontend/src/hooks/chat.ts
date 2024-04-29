import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

const fetchChat = async (query: string) => {
  const { data } = await axiosInstance.post("/query", { query });
  return data;
};

const loadVideo = async (url: string) => {
  const { data } = await axiosInstance.post(`/load`, { video_url: url });
  return data;
};

export const useMutationChat = () => {
  return useMutation({
    mutationFn: fetchChat,
  });
};

export const useMutationLoadVideo = () => {
  return useMutation({
    mutationFn: loadVideo,
  });
};
