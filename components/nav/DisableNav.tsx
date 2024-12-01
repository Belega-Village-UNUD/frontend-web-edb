export const DisableNav = (pathname: string): boolean => {
  if (pathname === '/404') {
    return true;
  }

  const disableNavbar: (string | RegExp)[] = [
    '/404',
    '/success',
    '/failed',
    '/buyer/login',
    '/buyer/register',
    '/buyer/verif',
    '/buyer/reset',
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