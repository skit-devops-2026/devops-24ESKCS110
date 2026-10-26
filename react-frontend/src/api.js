const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

export function getToken() {
  return localStorage.getItem("devvault_token") || "";
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("devvault_user") || "null");
  } catch {
    return null;
  }
}

export function storeSession({ token, user }) {
  localStorage.setItem("devvault_token", token);
  localStorage.setItem("devvault_user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("devvault_token");
  localStorage.removeItem("devvault_user");
}

export async function apiRequest(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    throw new Error(`Cannot reach DevVault API at ${API_BASE}. Make sure the backend is running.`);
  }
  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }
  if (response.status === 401) {
    clearSession();
    if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
      window.location.assign("/login");
    }
  }
  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || `Request failed (${response.status})`);
  }
  return payload;
}

export const authApi = {
  register: (body) => apiRequest("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => apiRequest("/auth/me"),
};

export const itemApi = {
  list: async (type, params = {}) => {
    const query = new URLSearchParams(params);
    const suffix = query.toString() ? `?${query}` : "";
    return (await apiRequest(`/${type}${suffix}`)).data || [];
  },
  create: async (type, body) => (await apiRequest(`/${type}`, { method: "POST", body: JSON.stringify(body) })).data,
  update: async (type, id, body) => (await apiRequest(`/${type}/${id}`, { method: "PATCH", body: JSON.stringify(body) })).data,
  remove: (type, id) => apiRequest(`/${type}/${id}`, { method: "DELETE" }),
};
