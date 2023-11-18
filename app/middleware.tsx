export const checkMiddlewareAuth = (callback: () => void, router: any) => () => {
  const is_login = localStorage.getItem('is_login');
  if (!is_login) { router.push('/buyer/login'); return; }
  callback();
};

export const middlewareAuth = (callback: () => void, router: any) => () => {
  const is_login = localStorage.getItem('is_login');
  if (is_login === 'true') { router.push('/'); return; }
  callback();
};

export const checkMiddlewareProfile = (callback: () => void, router: any) => () => {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');
  const is_verified = localStorage.getItem('is_verified');
  if (!token && !email && !is_verified) { router.push('/buyer/login'); return; }
  callback();
}

export const middlewareProfile = (callback: () => void, router: any) => () => {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');
  const is_verified = localStorage.getItem('is_verified');
  if (token && email && is_verified) { router.push('/buyer/profile'); return; }
  callback();
}