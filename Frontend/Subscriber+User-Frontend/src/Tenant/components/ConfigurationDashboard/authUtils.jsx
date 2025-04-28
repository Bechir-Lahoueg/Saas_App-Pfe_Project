// Auth utility functions
export function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
}

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export function setCookie(name, val) {
  document.cookie = [
    `${name}=${encodeURIComponent(val)}`,
    "Domain=.127.0.0.1.nip.io",
    "Path=/",
    "SameSite=Lax",
  ].join("; ");
}

export function deleteCookie(name) {
  document.cookie = `${name}=; Domain=.127.0.0.1.nip.io; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function getRootHost() {
  const host = window.location.host.split(":")[0];
  const [, ...rest] = host.split(".");
  return rest.join(".");
}

export function getUrlSubdomain() {
  return window.location.host.split(":")[0].split(".")[0];
}

// ─── NEW: the actual guard to run on every protected page
export function frontEndGuard() {
  const token = getCookie("accessToken");
  const payload = token && parseJwt(token);

  // if we have no token, or payload missing, or bad subdomain → kick user out
  if (
    !payload ||
    !payload.subdomain ||
    payload.subdomain !== getUrlSubdomain()
  ) {
    // wipe sensitive cookies
    ["accessToken", "subdomain"].forEach(deleteCookie);

    // redirect to root-login on the “root” host: e.g. 127.0.0.1.nip.io/connexion
    const root = getRootHost();
    window.location.href = `${window.location.protocol}//${root}/connexion`;
  }
}
