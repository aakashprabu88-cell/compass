import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f", color: "#f0f0f5", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "4rem", fontWeight: 700, marginBottom: "0.5rem" }}>404</h1>
        <p style={{ color: "#8888a0", marginBottom: "1.5rem" }}>This page could not be found.</p>
        <Link href="/" style={{ padding: "0.75rem 2rem", background: "#6366f1", color: "white", border: "none", borderRadius: 12, fontWeight: 600, textDecoration: "none", display: "inline-block" }}>
          Go Home
        </Link>
      </div>
    </div>
  );
}
