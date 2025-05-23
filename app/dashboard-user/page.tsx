import { getSession } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import DashboardContent from '@/components/DashboardContent';

export default async function Dashboard() {
  const session = await getSession();
  console.log('Session:', session); 

  if (!session || !session.user) {
    console.log('No session, redirecting to /login');
    redirect('/login');
  }

  return <DashboardContent session={session} />;
}