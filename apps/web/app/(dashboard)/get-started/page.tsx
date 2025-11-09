"use client";

import { useLogout } from '@/hooks/useAuth';
import React from 'react'

const GetStarted = () => {
  const logout = useLogout();
  return (
    <div className='w-full h-full flex justify-center items-center text-neutral-500' onClick={() => logout.mutate()}>GetStarted</div>
  )
}

export default GetStarted