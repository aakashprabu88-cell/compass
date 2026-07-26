"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f", color: "#f0f0f5", fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: 28 }}>
          ⚠
        </div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Something went wrong</h2>
        <p style={{ color: "#8888a0", marginBottom: "1.5rem" }}>{error.message || "An unexpected error occurred."}</p>
        <button onClick={reset} style={{ padding: "0.75rem 2rem", background: "#6366f1", color: "white", border: "none", borderRadius: 12, fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>
          Try Again
        </button>
        <p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#555" }}>If this keeps happening, try opening in an incognito/private window or a different browser.</p>
      </div>
    </div>
  );
}
