import { getUpcomingEvents } from "@/lib/data/events";
import HomeClientShell from "@/app/components/HomeClientShell";

export const metadata = {
  title: "Anova Motorsport | Penyelenggara Balap Resmi IMI",
  description: "Anova Motorsport — penyelenggara event balap profesional (Drag Race & Motoprix) resmi di bawah naungan IMI. Daftar event sekarang.",
};

export default async function Home() {
  const upcomingEvents = await getUpcomingEvents(2);

  return <HomeClientShell upcomingEvents={upcomingEvents} />;
}
