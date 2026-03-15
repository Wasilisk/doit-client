import { ROUTES } from "~/constants/routes";

export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie("auth_token");
  const publicRoutes = [ROUTES.LOGIN, ROUTES.REGISTER];

  if (!token.value && !publicRoutes.includes(to.path)) {
    const localePath = useLocalePath();
    return navigateTo(localePath(ROUTES.LOGIN), { redirectCode: 301 });
  }
});
