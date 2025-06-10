import { useState, useEffect, useRef } from "react";
import { TextField, Button, IconButton, Box, Paper } from "@mui/material";
import { Send, Trash2 } from "lucide-react";
// import ReactMarkdown from "react-markdown";

type Message = { from: "user" | "bot"; text: string };
type ChatPayload = { message: string; history: [string, string][] };

const ChatBotWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<[string, string][]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chat_history");
    const savedPairs = localStorage.getItem("chat_pairs");
    if (saved) setMessages(JSON.parse(saved));
    if (savedPairs) setHistory(JSON.parse(savedPairs));
  }, []);

  // Save messages + pairs
  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(messages));
    localStorage.setItem("chat_pairs", JSON.stringify(history));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, history]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const botMsg: Message = { from: "bot", text: "" };
    setMessages((prev) => [...prev, botMsg]);

    try {
      const res = await fetch("https://swift-supply/api/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history }),
      });

      if (!res.body) throw new Error("No stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        fullText += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].text = fullText;
          return updated;
        });
      }

      setHistory((prev) => [...prev, [input, fullText]]);
    } catch (err) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { from: "bot", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setHistory([]);
    localStorage.removeItem("chat_history");
    localStorage.removeItem("chat_pairs");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button variant="contained" onClick={() => setOpen(!open)}>
        Chat
      </Button>
      {open && (
        <Paper className="p-4 w-80 max-h-[80vh] overflow-hidden shadow-lg rounded-xl mt-2 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">Swift Chatbot</span>
            <IconButton size="small" onClick={clearMessages}>
              <Trash2 size={16} />
            </IconButton>
          </div>

          <Box className="flex-1 overflow-y-auto space-y-3 mb-2 pr-1">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm whitespace-pre-wrap ${
                  msg.from === "bot" ? "text-left" : "text-right"
                }`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-xl break-words max-w-[85%] ${
                    msg.from === "bot"
                      ? "bg-gray-200 text-black"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {/* <ReactMarkdown>{msg.text}</ReactMarkdown> */}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </Box>

          <div className="flex items-center gap-2">
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              disabled={loading}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
            />
            <IconButton onClick={sendMessage} disabled={loading}>
              <Send />
            </IconButton>
          </div>
        </Paper>
      )}
    </div>
  );
};

export default ChatBotWidget;
