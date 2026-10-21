export const ASSISTANT_REPLY = "bonjour soza";
export const MAX_MESSAGE_LENGTH = 1000;

export function validateMessage(value) {
  if (typeof value !== "string") return { valid: false, reason: "invalid_type" };
  const message = value.trim();
  if (!message) return { valid: false, reason: "empty" };
  if (message.length > MAX_MESSAGE_LENGTH) return { valid: false, reason: "too_long" };
  return { valid: true, message };
}

export function getAssistantReply() { return ASSISTANT_REPLY; }
