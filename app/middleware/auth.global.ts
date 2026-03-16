import { ROUTES } from "~/constants/routes";

export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie("auth_token");
  const localePath = useLocalePath();
  const publicRoutes = [ROUTES.LOGIN, ROUTES.REGISTER];

  const isPublic = publicRoutes.some(
    (route) => to.path === localePath(route) || to.path === route,
  );

  if (!token.value && !isPublic) {
    return navigateTo(localePath(ROUTES.LOGIN));
  }
});
