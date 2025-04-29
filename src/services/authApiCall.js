import { apiRequest } from "./apiRequest";

export const loginRequest = async (post) => {

    const api = await apiRequest({
        url: "/auth/login",
        method: "post",
        body: post,
    });
    return api.data;
};
