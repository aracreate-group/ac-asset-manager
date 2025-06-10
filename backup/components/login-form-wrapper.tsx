'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const LoginForm = dynamic(
    () => import('./login-form').then((mod) => mod.LoginForm),
    {
        ssr: false,
        loading: () => <div className='h-full w-full bg-gray-500'></div>
    }
)

export function LoginFormWrapper() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return <LoginForm />
}
