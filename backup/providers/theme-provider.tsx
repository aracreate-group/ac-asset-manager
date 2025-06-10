// components/theme-provider.tsx
"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // This prevents hydration mismatch
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        // This is critical - it suppresses the hydration warning
        >
            {/* Only render children when mounted to prevent hydration mismatch */}
            <div suppressHydrationWarning>
                {mounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
            </div>
        </NextThemesProvider>
    )
}