const getApiBaseUrl = () => {
    if (!process.env.EXPO_PUBLIC_BACKEND_API) {
        throw new Error('EXPO_PUBLIC_BACKEND_API is not defined');
    }
    return process.env.EXPO_PUBLIC_BACKEND_API;
};

export const API_BASE_URL = getApiBaseUrl();
const SUB_ROOT = '/auth/public'; //this is hte api base and the tenantid
export const ROOT_API = `${API_BASE_URL}/${SUB_ROOT}`;
