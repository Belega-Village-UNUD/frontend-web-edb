export const DisableNav = (pathname: string): boolean => {
  const disableNavbar: string[] = ['/404', '/buyer/login', '/buyer/register', '/buyer/verif']
  return disableNavbar.includes(pathname)
}