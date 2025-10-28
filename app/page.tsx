"use client";

import dynamic from 'next/dynamic';

const App = dynamic(() => import('@/App'), { ssr: false, loading: () => null });

export default function Page() {
  return <App />;
}



