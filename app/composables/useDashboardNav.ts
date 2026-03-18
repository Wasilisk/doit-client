import { ROUTES } from "~/constants/routes";

export const useDashboardNav = () => {
  const localePath = useLocalePath();
  const authStore = useAuthStore();

  const navLinks = computed(() => [
    {
      label: "navigation.myTasks",
      icon: "pi pi-check-square",
      to: localePath(ROUTES.TASKS),
    },
    {
      label: "navigation.tags",
      icon: "pi pi-tag",
      to: localePath(ROUTES.TAGS),
    },
    {
      label: "navigation.deletedItems",
      icon: "pi pi-trash",
      to: localePath(ROUTES.TASKS_DELETED),
    },
    {
      label: "navigation.settings",
      icon: "pi pi-cog",
      to: localePath(ROUTES.SETTINGS),
    },
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

  const handleLogout = async () => {
    authStore.logout();
    await navigateTo(localePath(ROUTES.LOGIN));
  };

  return {
    navLinks,
    userInitials,
    handleLogout,
    authStore,
  };
};
