import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth-options';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function hasRole(role: string | string[]) {
  const user = await getCurrentUser();
  if (!user) return false;

  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(user.role);
}