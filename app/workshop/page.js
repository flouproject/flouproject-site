import NavBar from "../../components/NavBar";
import PastWorkshopsHero from "../../components/PastWorkshopsHero";
import UpcomingWorkshopCTA from "../../components/UpcomingWorkshopCTA";

export default function WorkshopPage() {
  return (
    <>
      <NavBar />
      <main>
        <PastWorkshopsHero />
        <UpcomingWorkshopCTA />
      </main>
    </>
  );
}
