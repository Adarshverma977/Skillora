let onSessionExpired = null;
let sessionExpiryHandled = false;

export const registerSessionExpiryHandler = (handler) => {
  onSessionExpired = handler;
};

export const handleSessionExpired = () => {
  if (sessionExpiryHandled) return;

  sessionExpiryHandled = true;

  try {
    localStorage.removeItem("skillora-token");
    localStorage.removeItem("skillora-user");
  } catch (error) {
    console.error("Unable to clear session data:", error);
  }

  if (typeof onSessionExpired === "function") {
    onSessionExpired();
  } else {
    window.location.replace("/login");
  }
};

export const resetSessionExpiry = () => {
  sessionExpiryHandled = false;
};
