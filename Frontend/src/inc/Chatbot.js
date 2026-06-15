import React, { useState } from "react";
import "./Chatbot.css";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  // helper to extract text from OpenRouter response (robust to different shapes)
  function extractTextFromResponse(data) {
    // common OpenAI-like shapes
    if (!data) return null;
    if (data.choices && data.choices[0]) {
      // some providers put message in choices[0].message.content
      const msg = data.choices[0].message;
      if (msg && (msg.content || msg.content?.[0])) {
        // if content is string
        if (typeof msg.content === "string") return msg.content;
        // if content is array with text fields
        if (Array.isArray(msg.content)) {
          return msg.content.map(c => (c.text || c)).join(" ");
        }
      }
      // sometimes text is in choices[0].text
      if (data.choices[0].text) return data.choices[0].text;
    }

    // some other shapes
    if (data.output && Array.isArray(data.output) && data.output[0]) {
      // e.g. output[0].content[0].text
      const out = data.output[0];
      if (out.content && out.content[0] && out.content[0].text) return out.content[0].text;
      if (out.text) return out.text;
    }

    // fallback to stringifying
    try {
      return JSON.stringify(data);
    } catch (e) {
      return "Sorry, I couldn't parse the response.";
    }
  }

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { from: "user", text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // optimistic loading message for bot
    const loadingMsg = { from: "bot", text: "..." };
    setMessages(prev => [...prev, loadingMsg]);

    try {
      const resp = await fetch("http://localhost:2000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed })
      });

      if (!resp.ok) {
        const text = await resp.text();
        // replace loading message with error
        setMessages(prev => prev.map(m => m === loadingMsg ? { from: "bot", text: `Error: ${text}` } : m));
        return;
      }

      const data = await resp.json();
      const botText = extractTextFromResponse(data) || "No reply";

      // replace loading message with actual bot reply
      setMessages(prev => prev.map(m => m === loadingMsg ? { from: "bot", text: botText } : m));

    } catch (err) {
      setMessages(prev => prev.map(m => m === loadingMsg ? { from: "bot", text: `Network error: ${err.message}` } : m));
    }
  };

  return (
    <>
      <button className="chatbot-btn" onClick={() => setOpen(!open)}>💬</button>

      {open && (
        <div className="chatbot-window">
          <div className="chat-header">
            Yogashrini Assistant
            <button className="close-btn" onClick={() => setOpen(false)}>✖</button>
          </div>

          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`msg ${msg.from}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask something…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="send-btn">➤</button>
          </div>
        </div>
      )}
    </>
  );
}
