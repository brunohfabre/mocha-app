import { useNavigate } from 'react-router-dom';

import { useState } from 'react';
import { api } from 'renderer/services/api';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { LinkButton } from '../components/LinkButton';

export function SignUp(): JSX.Element {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function handleSubmit(): Promise<void> {
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      setLoading(true);

      const response = await api.post('/users', {
        firstName,
        lastName,
        phone,
        email,
        password,
      });

      window.alert('Account created. Please log in.');

      navigate(-1);
    } catch (err) {
      if (err.data?.status === 'validation_error') {
        window.alert(JSON.stringify(err.data.errors));
      } else {
        window.alert(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="p-8 flex flex-col max-w-sm w-full">
        <h1 className="text-4xl font-bold self-center">Sign Up</h1>

        <Input
          placeholder="First name"
          className="mt-8"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          placeholder="Last name"
          className="mt-4"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <Input
          placeholder="Mobile phone with country"
          className="mt-4"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input
          placeholder="Email"
          className="mt-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          className="mt-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          placeholder="Confirm password"
          className="mt-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button className="mt-8" onClick={handleSubmit} isLoading={loading}>
          sign up
        </Button>

        <span className="self-center mt-8">
          Already have an account?{' '}
          <LinkButton onClick={() => navigate(-1)}>Sign in</LinkButton>
        </span>
      </div>
    </div>
  );
}
