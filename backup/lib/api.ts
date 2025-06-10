/**
 * @file /Users/gowtham/code/projects/arametrics/system/next-client/src/lib/api.ts
 * @author Gowtham <gowtham@aracreate.com>
 * @version 2.0.0
 * @license Apache-2.0
 * @copyright 2025 araCreate GmbH
 */

// import axios, { AxiosError } from 'axios'
// import { z } from 'zod'

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// export type ApiError = {
//     message: string
//     errors?: Record<string, string[]>
// }

// const apiErrorSchema = z.object({
//     message: z.string(),
//     errors: z.record(z.array(z.string())).optional(),
// })

// const axiosInstance = axios.create({
//     baseURL: API_URL,
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     withCredentials: true,
// })

// axiosInstance.interceptors.request.use((config) => {
//     const session = localStorage.getItem('session')
//     if (session) {
//         config.headers.Authorization = `Bearer ${session}`
//     }
//     return config
// })

// axiosInstance.interceptors.response.use(
//     (response) => {
//         if (response.status === 401) {
//             localStorage.removeItem('session')
//             window.location.href = '/login'
//         }
//         return response.data
//     },
//     (error: AxiosError) => {
//         if (error.response?.status === 401) {
//             localStorage.removeItem('session')
//             window.location.href = '/login'
//         }

//         const data = error.response?.data
//         const parsed = apiErrorSchema.safeParse(data)

//         if (!parsed.success) {
//             throw new Error('An unexpected error occurred')
//         }

//         throw parsed.data
//     }
// )

// export const apiClient = {
//     get: <T>(url: string) => axiosInstance.get<any, T>(url),
//     post: <T>(url: string, data: unknown) => axiosInstance.post<any, T>(url, data),
//     put: <T>(url: string, data: unknown) => axiosInstance.put<any, T>(url, data),
//     delete: <T>(url: string) => axiosInstance.delete<any, T>(url),
// }
// lib/api.ts
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
    baseURL: '/api',
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;