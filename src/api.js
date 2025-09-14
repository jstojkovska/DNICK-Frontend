import axios from "axios";

export const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

export function setAuth(access) {
    if (access) {
        api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
        localStorage.setItem("access", access);
    } else {
        delete api.defaults.headers.common["Authorization"];
        localStorage.removeItem("access");
    }
}
export function clearAuth() {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
}

const existing = localStorage.getItem("access");
if (existing) setAuth(existing);

let refreshing = null;

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            const rt = localStorage.getItem("refresh");
            if (!rt) {
                clearAuth();
                return Promise.reject(error);
            }

            if (!refreshing) {
                refreshing = axios
                    .post("http://127.0.0.1:8000/api/token/refresh/", { refresh: rt })
                    .then(({ data }) => {
                        const newAccess = data.access;
                        if (!newAccess) throw new Error("No access in refresh response");
                        setAuth(newAccess);
                        return newAccess;
                    })
                    .catch((e) => {
                        clearAuth();
                        throw e;
                    })
                    .finally(() => {
                        refreshing = null;
                    });
            }

            try {
                await refreshing;
                return api(original);
            } catch (e) {
                return Promise.reject(e);
            }
        }

        return Promise.reject(error);
    }
);
