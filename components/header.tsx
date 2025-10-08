import { Search, Bell, Grid3x3, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex h-14 items-center gap-2 md:gap-4 px-3 md:px-6">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/img/logo.png" alt="Logo" className="" />
        </div>

        <div className="relative flex-1 max-w-md hidden lg:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for anything"
            className="pl-9 bg-muted/50 border-0"
          />
        </div>

        <nav className="hidden xl:flex items-center gap-1 flex-1 justify-center">
          <Button
            variant="outline"
            size="sm"
            className="text-primary font-medium bg-blue-400/10 hover:bg-blue-400/5">
            Home
          </Button>
          <Button variant="ghost" size="sm">
            Workbench
          </Button>
          <Button variant="ghost" size="sm">
            Tickets
          </Button>
          <Button variant="ghost" size="sm">
            Service Catalogue
          </Button>
          <Button variant="ghost" size="sm">
            Knowledge Management
          </Button>
          <Button variant="ghost" size="sm">
            Admin Settings
          </Button>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-3 ml-auto">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <img
              src="/img/more.png"
              alt="more"
              className="h-5 w-5 inline ml-1"
              aria-label="dropdown arrow"
            />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/img/wrapper.png" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              U
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
