import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setError('');
      window.location.href = '/';
    }
  };

  return (
    <div className="bg-white h-screen w-screen flex justify-center items-center">
      <Card className="p-4">
        <form onSubmit={handleLogin}>
          <div className="space-y-2">
            <p>Login</p>
            <p>{error}</p>
            <Input type="email" placeholder="Enter email" value={email} onChange={({ target: { value } }) => setEmail(value)} />
            <Input type="password" placeholder="Enter password" value={password} onChange={({ target: { value } }) => setPassword(value)} />
            <Button type="submit">Login</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;
