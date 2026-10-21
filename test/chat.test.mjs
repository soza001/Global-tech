import test from "node:test";
import assert from "node:assert/strict";
import { getAssistantReply, validateMessage } from "../lib/chat.mjs";

test("every non-empty message gets the exact fixed reply", () => {
  assert.equal(getAssistantReply("Salut"), "bonjour soza");
  assert.equal(getAssistantReply("How are you?"), "bonjour soza");
  assert.equal(getAssistantReply("  autre message  "), "bonjour soza");
});
test("empty and whitespace-only messages are rejected", () => {
  assert.deepEqual(validateMessage(""), { valid: false, reason: "empty" });
  assert.deepEqual(validateMessage("   "), { valid: false, reason: "empty" });
});
test("messages longer than 1000 characters are rejected", () => {
  assert.deepEqual(validateMessage("x".repeat(1001)), { valid: false, reason: "too_long" });
  assert.equal(validateMessage("x".repeat(1000)).valid, true);
});
test("non-string values are rejected", () => { assert.deepEqual(validateMessage(null), { valid: false, reason: "invalid_type" }); });
