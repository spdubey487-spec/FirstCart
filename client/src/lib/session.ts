export function getSessionId(): string {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return "server-session";
  }
  
  let sessionId = localStorage.getItem("sessionId");
  
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("sessionId", sessionId);
  }
  
  return sessionId;
}
