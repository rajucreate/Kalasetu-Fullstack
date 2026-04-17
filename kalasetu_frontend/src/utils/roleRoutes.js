export function getDefaultRouteByRole(role) {
  switch (role) {
    case 'CONSULTANT':
      return '/consultant/dashboard';
    case 'ARTISAN':
      return '/artisan/dashboard';
    case 'BUYER':
      return '/buyer/dashboard';
    case 'ADMIN':
      return '/admin/dashboard';
    default:
      return '/';
  }
}

export function canAccessRoute(userRole, allowedRoles = []) {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(userRole);
}
