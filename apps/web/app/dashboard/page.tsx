"use client";
import { useLogout, useSession } from '@/hooks/useAuth';
import { Button } from '@workspace/ui/components/button';
import { useTransitionRouter } from 'next-view-transitions';

export default function Dashboard() {
  const router = useTransitionRouter();

  const { data: user, isPending } = useSession();
  const logout = useLogout();

  if (!user && !isPending) {
    router.push('/login');
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex min-h-screen flex-col justify-center items-center'>
      <div className='max-w-md bg-neutral-200 rounded-2xl flex flex-col justify-center items-center p-5 gap-5'>
        <h2 className='text-black text-2xl font-bold'>Dashboard</h2>
        <p className='text-black'>Welcome, {user.firstName} {user.lastName}</p>
        <Button onClick={() => logout.mutate()}>Logout</Button>
      </div>
    </div>
  )
}
