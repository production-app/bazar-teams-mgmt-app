import { Header } from "@/components/header";
import { SubHeader } from "@/components/sub-header";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { TeamsTable } from "@/components/teams-table";

export default function TeamsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SubHeader />
      <BreadcrumbNav />

      <main className="py-6 mb-4 container mx-auto px-2 p-10 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6">Teams</h1>
        <hr className="border-t-2 border-gray-600/5 my-6 mb-6" />
        <TeamsTable />
      </main>
    </div>
  );
}
