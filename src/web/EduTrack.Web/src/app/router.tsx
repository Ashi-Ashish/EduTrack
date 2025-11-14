import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { AppLayout } from '@/app/layouts'
import { AboutPage, HomePage, NotFoundPage } from '@/app/pages'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppLayout />}>
      <Route index element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
)

export function AppRouter() {
  return <RouterProvider router={router} />
}
