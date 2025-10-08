import { Home, HelpCircle, CircleX } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SubHeader() {
  return (
    <div className="bg-primary text-primary-foreground px-6 py-3">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10">
          <Home className="h-4 w-4" />
        </Button>
        <div className="flex flex-row items-center gap-4 p-3  -mb-3 rounded-tl-md rounded-tr-md  bg-white">
        <span className="font-medium  text-black">Admin Settings </span>
        <span className="text-black cursor-pointer"> <CircleX /> </span>
       
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 ml-auto text-primary-foreground hover:bg-primary-foreground/10"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
