import { useAuth } from '@/lib/auth';

const Dashboard = () => {
  console.log('Dashboard component rendering');
  const auth = useAuth();
  console.log('Auth context:', auth);

  if (!auth) {
    console.log('Auth context is undefined');
    return <div>Loading...</div>;
  }

  const { user } = auth;
  console.log('User from auth:', user);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {user?.email || 'Guest'}</p>
    </div>
  );
};

export default Dashboard; 