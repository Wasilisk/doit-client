import { ROUTES } from "~/constants/routes";

export const useDashboardNav = () => {
  const localePath = useLocalePath();
  const authStore = useAuthStore();

  const navLinks = computed(() => [
    {
      label: "My Tasks",
      icon: "pi pi-check-square",
      to: localePath(ROUTES.TASKS),
    },
    { label: "Tags", icon: "pi pi-tag", to: localePath(ROUTES.TAGS) },
    {
      label: "Deleted Items",
      icon: "pi pi-trash",
      to: localePath(ROUTES.TASKS_DELETED),
    },
    { label: "Settings", icon: "pi pi-cog", to: localePath(ROUTES.SETTINGS) },
  ]);

  const userInitials = computed(() => {
    const name = authStore.user?.full_name || "";
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  });

  const fullAvatarUrl = computed(() => {
    if (!authStore.user?.avatar_url) return null;
    const baseUrl = useRuntimeConfig().public.apiUrl.replace(/\/$/, "");
    const path = authStore.user.avatar_url.startsWith("/")
      ? authStore.user.avatar_url
      : `/${authStore.user.avatar_url}`;
    return `${baseUrl}${path}`;
  });

  const handleLogout = async () => {
    authStore.logout();
    await navigateTo(localePath(ROUTES.LOGIN));
  };

  return {
    navLinks,
    userInitials,
    fullAvatarUrl,
    handleLogout,
    authStore,
  };
};
