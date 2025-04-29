import { apiRequest } from "./apiRequest";


export const getProgressReport = async () => {
    const api = await apiRequest({
        url: "/progress-reports",
        method: "get",
        header: true,
    });
    return api.data;
};



