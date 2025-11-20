import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { AppLayout } from '@/app/layouts'
import { AboutPage, HomePage, NotFoundPage, SignInPage, ForbiddenPage } from '@/app/pages'
// Uncomment when you need protected routes:
// import { ProtectedRoute } from '@/lib/auth/guards'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public routes without layout */}
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />

      {/* Protected routes with layout */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />

        {/* Example protected route with role requirement:
        <Route
          path="admin"
          element={
            <ProtectedRoute requiredRoles={['Admin', 'SuperAdmin']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        */}
      </Route>
    </>,
  ),
)

export function AppRouter() {
  return <RouterProvider router={router} />
}
