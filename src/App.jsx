import { useState, useRef, useEffect } from "react";

const COLORS = {
  bg: "#f0f7f4",
  card: "#ffffff",
  primary: "#1a7f5a",
  primaryDark: "#145f44",
  accent: "#e8f5ee",
  accentStrong: "#c3e8d4",
  text: "#1a2e25",
  muted: "#6b8f7e",
  border: "#d4ece0",
  chatUser: "#1a7f5a",
  chatBot: "#f0f7f4",
};

const FAQS = [
  { q: "appointment", a: "You can book an appointment by calling our helpline at 1800-XXX-XXXX or filling out the Patient Support form on this page. Our team will reach out within 24 hours." },
  { q: "volunteer", a: "We welcome volunteers! Fill out the Volunteer Registration form on this page. You can choose from medical support, logistics, or community outreach roles." },
  { q: "services", a: "Medic Wellness provides home healthcare, medical consultations, nursing support, physiotherapy, and elder care services across India." },
  { q: "cost", a: "Our services are subsidized for low-income families. Please contact us with your details and we will assess the support you qualify for." },
  { q: "free", a: "Many of our services are free or subsidized for low-income families. Contact us and we will assess your eligibility." },
  { q: "emergency", a: "For medical emergencies, please call 112 immediately. For urgent care support, reach us at our 24x7 helpline: 1800-XXX-XXXX." },
  { q: "location", a: "Medic Wellness currently operates in Delhi NCR, Mumbai, Bengaluru, and Hyderabad. We are expanding to more cities soon." },
  { q: "donate", a: "You can support us by donating on our website or by contacting our team. All donations are eligible for tax exemption under 80G." },
  { q: "hello", a: "Hello! 👋 I'm the Medic Wellness assistant. I can help you with appointment booking, volunteer registration, our services, costs, and more. What would you like to know?" },
  { q: "hi", a: "Hi there! 👋 I'm here to help you with any questions about Medic Wellness. Ask me about our services, appointments, volunteering, or anything else!" },
];

async function callClaude(messages, system) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      ...(system ? { system } : {}),
      messages,
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || null;
}

function getBotReply(userMsg) {
  const lower = userMsg.toLowerCase();
  for (const faq of FAQS) {
    if (lower.includes(faq.q)) return faq.a;
  }
  return null;
}

function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! 👋 I'm the Medic Wellness AI assistant. Ask me about appointments, volunteering, services, or anything else!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newMessages = [...messages, { role: "user", text: trimmed }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const localReply = getBotReply(trimmed);
    if (localReply) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "bot", text: localReply }]);
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const system = `You are a helpful healthcare support assistant for Medic Wellness, an Indian NGO providing home healthcare, nursing, elder care, and medical support services.
Answer questions warmly and concisely about: appointments, volunteering, services offered, costs (subsidized for low-income), locations (Delhi NCR, Mumbai, Bengaluru, Hyderabad), donations, and general health support.
Keep responses under 3 sentences. Be empathetic and professional. If asked something outside healthcare/NGO scope, politely redirect.`;

      const apiMessages = newMessages.map(m => ({
        role: m.role === "bot" ? "assistant" : "user",
        content: m.text,
      }));

      const reply = await callClaude(apiMessages, system);
      setMessages(prev => [...prev, { role: "bot", text: reply || "I'm sorry, I couldn't process that. Please try again." }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Sorry, I'm having trouble connecting. Please try again in a moment." }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 430, background: COLORS.card, borderRadius: 20, border: `1.5px solid ${COLORS.border}`, boxShadow: "0 8px 32px rgba(26,127,90,0.08)", overflow: "hidden" }}>
      <div style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "'DM Serif Display', Georgia, serif" }}>Medic Wellness AI</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>● Online — Ask me anything</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "78%", padding: "10px 14px",
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: m.role === "user" ? COLORS.chatUser : COLORS.chatBot,
              color: m.role === "user" ? "#fff" : COLORS.text,
              fontSize: 13.5, lineHeight: 1.5,
              border: m.role === "bot" ? `1px solid ${COLORS.border}` : "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
            }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "10px 18px", borderRadius: "18px 18px 18px 4px", background: COLORS.chatBot, border: `1px solid ${COLORS.border}`, fontSize: 18, letterSpacing: 3, color: COLORS.muted }}>•••</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: "10px 12px", borderTop: `1px solid ${COLORS.border}`, display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !loading && sendMessage()}
          placeholder="Type your question..."
          style={{ flex: 1, padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${COLORS.border}`, outline: "none", fontSize: 13.5, background: COLORS.bg, color: COLORS.text, fontFamily: "inherit" }}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
          background: loading || !input.trim() ? COLORS.border : COLORS.primary,
          color: loading || !input.trim() ? COLORS.muted : "#fff",
          border: "none", borderRadius: 12, padding: "10px 18px",
          fontWeight: 700, fontSize: 14, cursor: loading || !input.trim() ? "not-allowed" : "pointer", transition: "all 0.2s"
        }}>Send</button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "11px 14px", borderRadius: 10,
  border: `1.5px solid ${COLORS.border}`, outline: "none",
  fontSize: 13.5, background: COLORS.bg, color: COLORS.text,
  boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.2s",
};

function RegistrationForm() {
  const [tab, setTab] = useState("patient");
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", message: "", role: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoResponse, setAutoResponse] = useState("");

  const cities = ["Delhi NCR", "Mumbai", "Bengaluru", "Hyderabad", "Other"];
  const volunteerRoles = ["Medical Support", "Logistics & Delivery", "Community Outreach", "Admin & Tech"];

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    if (!form.name || !form.phone) return;
    setLoading(true);

    try {
      const prompt = tab === "patient"
        ? `A patient named ${form.name} from ${form.city || "India"} has submitted a support request to Medic Wellness NGO with the message: "${form.message || "General support needed"}". Write a warm, personal 2-sentence auto-response using their name, acknowledging their request and letting them know our team will call them within 24 hours.`
        : `A volunteer named ${form.name} from ${form.city || "India"} has registered with Medic Wellness NGO for the role: "${form.role || "General volunteering"}". Write a warm, personal 2-sentence auto-response using their name, welcoming them to the team and letting them know they will receive an onboarding email within 48 hours.`;

      const reply = await callClaude([{ role: "user", content: prompt }], null);
      setAutoResponse(reply || "Thank you for reaching out! Our team will contact you soon.");
    } catch {
      setAutoResponse(`Thank you, ${form.name}! Our team at Medic Wellness will get in touch with you shortly.`);
    }

    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) return (
    <div style={{ background: COLORS.accent, borderRadius: 20, padding: "36px 28px", border: `1.5px solid ${COLORS.accentStrong}`, textAlign: "center" }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>✅</div>
      <h3 style={{ color: COLORS.primary, fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 24, margin: "0 0 12px" }}>
        {tab === "patient" ? "Request Received!" : "Welcome Aboard!"}
      </h3>
      <p style={{ color: COLORS.text, fontSize: 14.5, lineHeight: 1.8, margin: "0 0 22px", maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
        {autoResponse}
      </p>
      <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", city: "", message: "", role: "" }); setAutoResponse(""); }}
        style={{ background: COLORS.primary, color: "#fff", border: "none", borderRadius: 10, padding: "11px 26px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
        Submit Another
      </button>
    </div>
  );

  return (
    <div style={{ background: COLORS.card, borderRadius: 20, border: `1.5px solid ${COLORS.border}`, boxShadow: "0 8px 32px rgba(26,127,90,0.08)", overflow: "hidden" }}>
      <div style={{ display: "flex", background: COLORS.accent }}>
        {["patient", "volunteer"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "14px", border: "none", cursor: "pointer",
            background: tab === t ? COLORS.card : "transparent",
            color: tab === t ? COLORS.primary : COLORS.muted,
            fontWeight: tab === t ? 700 : 500, fontSize: 14,
            borderBottom: tab === t ? `3px solid ${COLORS.primary}` : "3px solid transparent",
            transition: "all 0.2s", fontFamily: "inherit"
          }}>
            {t === "patient" ? "🏥 Patient Support" : "🤝 Volunteer Registration"}
          </button>
        ))}
      </div>

      <div style={{ padding: "24px 24px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name *" style={inputStyle} />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number *" style={inputStyle} />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email Address" style={inputStyle} />
          <select name="city" value={form.city} onChange={handleChange} style={{ ...inputStyle, color: form.city ? COLORS.text : COLORS.muted }}>
            <option value="">Select City</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {tab === "volunteer" && (
          <select name="role" value={form.role} onChange={handleChange}
            style={{ ...inputStyle, marginBottom: 14, color: form.role ? COLORS.text : COLORS.muted }}>
            <option value="">Select Volunteer Role</option>
            {volunteerRoles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        )}

        <textarea name="message" value={form.message} onChange={handleChange}
          placeholder={tab === "patient" ? "Describe your healthcare needs or concerns..." : "Tell us about your background and motivation..."}
          rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />

        <button onClick={handleSubmit} disabled={loading || !form.name || !form.phone} style={{
          marginTop: 16, width: "100%", padding: "14px",
          background: loading || !form.name || !form.phone ? COLORS.border : `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
          color: loading || !form.name || !form.phone ? COLORS.muted : "#fff",
          border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15,
          cursor: loading || !form.name || !form.phone ? "not-allowed" : "pointer",
          transition: "all 0.25s", letterSpacing: 0.3
        }}>
          {loading ? "Generating your response..." : tab === "patient" ? "Request Support →" : "Register as Volunteer →"}
        </button>

        {(!form.name || !form.phone) && (
          <p style={{ margin: "8px 0 0", fontSize: 12, color: COLORS.muted, textAlign: "center" }}>* Name and phone number are required</p>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: COLORS.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;700&display=swap');
        * { box-sizing: border-box; }
        input:focus, textarea:focus, select:focus { border-color: #1a7f5a !important; box-shadow: 0 0 0 3px rgba(26,127,90,0.12); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fadeUp { animation: fadeUp 0.45s ease forwards; }
      `}</style>

      <nav style={{ background: "#fff", borderBottom: `1px solid ${COLORS.border}`, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🩺</span>
          <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 20, color: COLORS.primary }}>
            Medic <span style={{ color: COLORS.text }}>Wellness</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[["home", "Home"], ["form", "Register"], ["chat", "AI Chat"]].map(([id, label]) => (
            <button key={id} onClick={() => setActiveSection(id)} style={{
              padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
              background: activeSection === id ? COLORS.accent : "transparent",
              color: activeSection === id ? COLORS.primary : COLORS.muted,
              fontWeight: activeSection === id ? 700 : 500, fontSize: 13.5,
              fontFamily: "inherit", transition: "all 0.2s"
            }}>{label}</button>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px 60px" }}>

        {activeSection === "home" && (
          <div className="fadeUp">
            <div style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`, borderRadius: 24, padding: "48px 40px", color: "#fff", marginBottom: 32, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
              <div style={{ position: "absolute", bottom: -20, left: "40%", width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, opacity: 0.75, margin: "0 0 10px", textTransform: "uppercase" }}>Medic Wellness — Healthcare for All</p>
              <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 36, fontWeight: 400, margin: "0 0 14px", lineHeight: 1.2 }}>
                Quality Healthcare,<br />Wherever You Are
              </h1>
              <p style={{ fontSize: 15, opacity: 0.85, margin: "0 0 28px", lineHeight: 1.6, maxWidth: 480 }}>
                We connect patients in need with compassionate care — from home nursing to elder support. Register for help or join our volunteer network today.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button onClick={() => setActiveSection("form")} style={{ padding: "12px 24px", borderRadius: 12, border: "2px solid #fff", background: "#fff", color: COLORS.primary, fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>Get Support →</button>
                <button onClick={() => setActiveSection("chat")} style={{ padding: "12px 24px", borderRadius: 12, border: "2px solid rgba(255,255,255,0.5)", background: "transparent", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>Chat with AI 🤖</button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
              {[["2,400+", "Patients Served"], ["180+", "Active Volunteers"], ["4", "Cities"]].map(([n, l]) => (
                <div key={l} style={{ background: COLORS.card, borderRadius: 16, padding: "20px", border: `1.5px solid ${COLORS.border}`, textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontFamily: "'DM Serif Display', Georgia, serif", color: COLORS.primary, marginBottom: 4 }}>{n}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 500 }}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{ background: COLORS.card, borderRadius: 20, padding: "24px", border: `1.5px solid ${COLORS.border}` }}>
              <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 22, margin: "0 0 18px", color: COLORS.text }}>Our Services</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  ["🏠", "Home Healthcare", "Nursing & medical care at your doorstep"],
                  ["👴", "Elder Care", "Compassionate support for senior citizens"],
                  ["💊", "Medication Support", "Prescription management & reminders"],
                  ["🫀", "Physiotherapy", "Recovery support & mobility training"],
                ].map(([icon, title, desc]) => (
                  <div key={title} style={{ background: COLORS.accent, borderRadius: 14, padding: "16px", border: `1px solid ${COLORS.accentStrong}` }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.primary, marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 12.5, color: COLORS.muted, lineHeight: 1.4 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "form" && (
          <div className="fadeUp">
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 28, margin: "0 0 6px" }}>Register with Us</h2>
            <p style={{ color: COLORS.muted, margin: "0 0 24px", fontSize: 14 }}>Need healthcare support or want to volunteer? Fill out the form and our team will reach out shortly.</p>
            <RegistrationForm />
          </div>
        )}

        {activeSection === "chat" && (
          <div className="fadeUp">
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 28, margin: "0 0 6px" }}>AI Health Assistant</h2>
            <p style={{ color: COLORS.muted, margin: "0 0 24px", fontSize: 14 }}>Ask about our services, appointments, volunteering, or anything else. Powered by Claude AI.</p>
            <Chatbot />
            <div style={{ marginTop: 16, background: COLORS.accent, borderRadius: 14, padding: "14px 18px", border: `1px solid ${COLORS.accentStrong}` }}>
              <p style={{ margin: 0, fontSize: 12.5, color: COLORS.muted }}>
                💡 <strong>Try asking:</strong> "How do I book an appointment?" · "What services do you offer?" · "How can I volunteer?" · "Is care free?"
              </p>
              <footer
  style={{
    textAlign: "center",
    padding: "20px",
    marginTop: "40px",
    borderTop: "1px solid #ddd",
    color: "#666",
    fontSize: "14px"
  }}
>
  © 2026 Medic Wellness. Developed by Navesh R. All Rights Reserved.
</footer>
            </div>
          </div>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: "20px", textAlign: "center", background: "#fff" }}>
        <p style={{ margin: 0, fontSize: 12, color: COLORS.muted }}>
          🩺 Medic Wellness · Helpline: 1800-XXX-XXXX · Delhi NCR · Mumbai · Bengaluru · Hyderabad
        </p>
      </div>
    </div>
  );
}
