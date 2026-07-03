import RegistrationForm from "../../components/RegistrationForm";
import NavBar from "../../components/NavBar";
import { colors } from "../../lib/theme";

export default function WorkshopPage() {
  return (
    <>
      <NavBar />
      <main style={{ padding: "56px 16px 72px", background: colors.paper }}>
        <RegistrationForm />
      </main>
    </>
  );
}
