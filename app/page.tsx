import { Header } from "@/components/header"
import { SubHeader } from "@/components/sub-header"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { TeamsTable } from "@/components/teams-table"

export default function TeamsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SubHeader />
      <BreadcrumbNav />

      <main className="px-6 py-6">
        <h1 className="text-2xl font-semibold mb-6">Teams</h1>
        <TeamsTable />
      </main>
    </div>
  )
}
