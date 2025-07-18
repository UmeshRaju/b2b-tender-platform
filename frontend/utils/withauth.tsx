// utils/withAuth.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function withAuth(Component: any) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login'); // redirect if not logged in
      }
    }, []);

    return <Component {...props} />;
  };
}
