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