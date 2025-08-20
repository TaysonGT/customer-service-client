type LoginRole = "client" | "support";

const LAST_LOGIN_KEY = "last_login_role";
const LOGIN_HISTORY_KEY = "login_history";

// Store the last login role (localStorage)
export const setLastLoginRole = (role: LoginRole) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LAST_LOGIN_KEY, role);
  }
};

// Get the last login role (localStorage)
export const getLastLoginRole = (): LoginRole | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(LAST_LOGIN_KEY) as LoginRole | null;
  }
  return null;
};

// Store login history (cookie with 30-day expiry)
export const addLoginToHistory = (role: LoginRole) => {
  const history = getLoginHistory();
  const updatedHistory = [...history.filter(r => r !== role), role]; // Move to end
  const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  
  document.cookie = `${LOGIN_HISTORY_KEY}=${JSON.stringify(updatedHistory)}; expires=${expiry}; path=/; SameSite=Lax`;
};

// Get login history (cookie)
export const getLoginHistory = (): LoginRole[] => {
  if (typeof document === "undefined") return [];
  
  const cookie = document.cookie
    .split("; ")
    .find(row => row.startsWith(`${LOGIN_HISTORY_KEY}=`));
  
  if (!cookie) return [];
  
  try {
    return JSON.parse(cookie.split("=")[1]) as LoginRole[];
  } catch {
    return [];
  }
};

// Determine which login page to show based on history
export const getPreferredLoginRole = (): LoginRole => {
  const lastLogin = getLastLoginRole();
  const history = getLoginHistory();
  
  // If no history, default to client
  if (history.length === 0) return "client";
  
  // Count occurrences in history
  const counts = history.reduce((acc, role) => {
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<LoginRole, number>);
  
  // Return most frequent, with last login as tiebreaker
  return lastLogin || 'client';
};