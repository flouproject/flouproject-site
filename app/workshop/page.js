import RegistrationForm from "../../components/RegistrationForm";
import NavBar from "../../components/NavBar";

export default function WorkshopPage() {
  return (
    <>
      <NavBar />
      <main style={{ padding: "48px 16px" }}>
        <RegistrationForm />
      </main>
    </>
  );
}
