import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PassedRoute from '@/utils/PassedRoute';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      router.push('/login');
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="bg-white h-screen w-screen flex justify-center items-center">
      <Card className="p-4">
        <form onSubmit={handleRegister}>
          <div className="space-y-2">
            <p>Register</p>
            <p>{error}</p>
            <Input type="text" placeholder="Enter name" value={name} onChange={({ target: { value } }) => setName(value)} />
            <Input type="email" placeholder="Enter email" value={email} onChange={({ target: { value } }) => setEmail(value)} />
            <Input type="password" placeholder="Enter password" value={password} onChange={({ target: { value } }) => setPassword(value)} />
            <p>
              <Link href={'/register'}>Login here</Link>
            </p>
            <Button type="submit">Register</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PassedRoute(Register);