import { ROUTES } from "~/constants/routes"

export default defineNuxtRouteMiddleware((to) => {
    const store = useAuthStore()

    const publicRoutes = [ROUTES.LOGIN, ROUTES.REGISTER]
    if (!store.isAuthenticated && !publicRoutes.includes(to.path)) {
        return navigateTo(ROUTES.LOGIN)
    }
})