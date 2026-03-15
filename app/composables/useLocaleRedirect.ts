import type { Locale } from "~/types/i18n";

export const useLocaleRedirect = () => {
  const localePath = useLocalePath();

  const redirect = (
    path: string | Record<string, unknown>,
    locale?: Locale,
  ) => {
    const resolvedPath = locale ? localePath(path, locale) : localePath(path);

    return navigateTo(resolvedPath);
  };

  return {
    redirect,
  };
};
