import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function ModeToggle({ className }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Avoid hydration mismatch by only rendering after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="ghost" size="icon" className={cn("opacity-0", className)} />;
  }

  return (
    <DropdownMenu dir="rtl">

      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("hover:bg-accent hover:text-accent-foreground transition-colors", className)}
        >
          <Sun className="h-6 w-6 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-6 w-6 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">تبديل المظهر</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setTheme("light")} 
          className={cn(theme === "light" && "bg-accent")}>
          <Sun className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
          فاتح
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className={cn(theme === "dark" && "bg-accent")}>
          <Moon className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
          داكن
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// <lable htmlfo="zahraa">Toggle Theme</lable>
// <input type="text" name="zahraa" id="" />
