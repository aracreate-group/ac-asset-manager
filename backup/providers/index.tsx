// components/providers/providers.tsx
'use client'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '@/providers/theme-provider'
import { QueryProvider } from './query-provider'

export function Providers({ children }: { children: React.ReactNode }) {

    return (
        <QueryProvider >
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryProvider>
    )
}