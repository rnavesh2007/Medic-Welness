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
                  <div key={title} style={{ background: COLORS.accent, borderRadius: 14, padding: "16px", border: `1p
