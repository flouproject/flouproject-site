import RegistrationForm from "../../../components/RegistrationForm";
import NavBar from "../../../components/NavBar";

export default function DaftarWorkshopPage() {
  return (
    <>
      <NavBar />
      <main style={{ padding: "48px 16px 100px" }}>
        <RegistrationForm />
      </main>
    </>
  );
}
