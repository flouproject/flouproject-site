import RegistrationForm from "../../../components/RegistrationForm";
import NavBar from "../../../components/NavBar";
import { UPCOMING_WORKSHOPS } from "../../../lib/workshops";

export default function DaftarWorkshopPage() {
  const workshop = UPCOMING_WORKSHOPS[0];

  return (
    <>
      <NavBar />
      <main style={{ padding: "48px 16px 100px", maxWidth: 480, margin: "0 auto" }}>
        {workshop && (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 16,
              marginBottom: 24,
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <img
              src={workshop.image}
              alt={workshop.title}
              style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 10, flexShrink: 0 }}
            />
            <div>
              <div style={{ fontSize: 12, color: "#8a8a8a", marginBottom: 2 }}>
                Kamu sedang mendaftar workshop
              </div>
              <div style={{ fontWeight: 700, fontSize: 17, fontFamily: "var(--font-heading)" }}>
                {workshop.title}
              </div>
            </div>
          </div>
        )}
        <RegistrationForm />
      </main>
    </>
  );
}
