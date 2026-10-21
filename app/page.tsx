"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { getAssistantReply, validateMessage } from "@/lib/chat.mjs";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type ChatMessage = { id: string; role: "user" | "assistant"; text: string };
type Status = { text: string; kind: "success" | "error" | "info" };

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const checked = validateMessage(input);
    if (!checked.valid) {
      setStatus({ text: checked.reason === "too_long" ? "Ton message dépasse la limite de 1 000 caractères." : "Écris un message avant de l’envoyer.", kind: "error" });
      return;
    }
    if (sending) return;
    const userMessage = checked.message;
    const reply = getAssistantReply();
    setSending(true);
    setInput("");
    setStatus({ text: "Envoi du message…", kind: "info" });
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: "user", text: userMessage }, { id: crypto.randomUUID(), role: "assistant", text: reply }]);
    try {
      if (!supabase || !isSupabaseConfigured) throw new Error("Supabase is not configured");
      const { error } = await supabase.from("chat_messages").insert({ user_message: userMessage, assistant_reply: reply });
      if (error) throw error;
      setStatus({ text: "Message enregistré dans Supabase.", kind: "success" });
    } catch {
      setStatus({ text: "La réponse est affichée, mais le message n’a pas été enregistré. Vérifie la configuration puis réessaie.", kind: "error" });
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }
  const remaining = 1000 - input.length;
  return <main className="page-shell">
    <section className="chat-card" aria-labelledby="page-title">
      <header className="chat-header">
        <div className="brand-mark" aria-hidden="true">BS</div>
        <div><h1 id="page-title">Bonjour Soza</h1><p>Un petit test de conversation</p></div>
        <span className="online-indicator"><span aria-hidden="true" /> En ligne</span>
      </header>
      <div className="conversation" aria-label="Conversation">
        {messages.length === 0 ? <div className="empty-state"><div className="hello-icon" aria-hidden="true">✦</div><h2>Prêt à commencer ?</h2><p>Envoie un message pour commencer.</p></div> :
          <ol className="message-list" aria-live="polite" aria-relevant="additions">{messages.map((message) => <li key={message.id} className={`message-row message-row--${message.role}`}>
            {message.role === "assistant" && <div className="assistant-avatar" aria-hidden="true">BS</div>}
            <div className={`message-bubble message-bubble--${message.role}`}>{message.text}</div>
          </li>)}</ol>}
        <div ref={endRef} />
      </div>
      <div className="composer-area">
        {status && <p className={`status status--${status.kind}`} role="status"><span aria-hidden="true">{status.kind === "success" ? "✓" : status.kind === "error" ? "!" : "…"}</span>{status.text}</p>}
        <form className="composer" onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="message-input">Ton message</label>
          <input ref={inputRef} id="message-input" name="message" type="text" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Écris ton message…" autoComplete="off" maxLength={1001} aria-describedby="message-hint" disabled={sending} />
          <button type="submit" disabled={sending || input.trim().length === 0 || input.length > 1000}><span>{sending ? "Envoi…" : "Envoyer"}</span><span className="send-icon" aria-hidden="true">↗</span></button>
        </form>
        <div className="composer-footer"><span id="message-hint">Entrée pour envoyer</span><span className={remaining < 0 ? "counter counter--error" : "counter"}>{remaining} caractères restants</span></div>
      </div>
    </section>
    <p className="page-footnote">Une conversation simple, sans intelligence artificielle externe.</p>
  </main>;
}
