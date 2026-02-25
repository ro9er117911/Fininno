import { redirect } from "next/navigation";

export default function RootPage() {
  // redirect home page to dashboard immediately
  redirect("/dashboard");
}
