import { axiosInstance } from "../axios";

export const getSubscriptionDetails = async () => {
    const response = await axiosInstance.get("/subscription/details");
    return response.data;
};