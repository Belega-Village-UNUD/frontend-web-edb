export const DisableNav = (pathname: string): boolean => {
  const disableNavbar: (string | RegExp)[] = [
    '/404',
    '/buyer/login',
    '/buyer/register',
    '/buyer/verif',
    /^\/store/,
    /^\/admin/,
  ]
  return disableNavbar.some((pattern) => {
    if (typeof pattern === 'string') {
      return pattern === pathname;
    } else {
      return pattern.test(pathname);
    }
  });
}