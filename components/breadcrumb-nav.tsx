import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"

export function BreadcrumbNav() {
  return (
    <div className="flex items-center gap-2 px-6 py-3 text-sm text-muted-foreground">
      <Home className="h-4 w-4" />
      <ChevronRight className="h-4 w-4" />
      <Link href="/admin-settings" className="hover:text-foreground">
        Admin Settings
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground font-medium">Teams</span>
    </div>
  )
}
