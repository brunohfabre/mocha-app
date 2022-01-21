import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from 'renderer/services/api';
import { LinkButton } from '../components/LinkButton';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function SignIn(): JSX.Element {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(): Promise<void> {
    try {
      setLoading(true);

      const response = await api.post('/sessions', {
        email,
        password,
      });

      window.alert(JSON.stringify(response.data));
    } catch (err) {
      if (err.data?.type === 'validation_error') {
        window.alert(err.data.errors);
      } else {
        window.alert(err.message);
      }

      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="p-8 flex flex-col max-w-sm w-full">
        <h1 className="text-4xl font-bold self-center">Sign In</h1>

        <Button
          className="mt-12"
          onClick={() => window.alert('Under contruction.')}
        >
          continue with github
        </Button>

        <Input
          placeholder="email"
          className="mt-8"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="password"
          className="mt-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button className="mt-8" onClick={handleSubmit} isLoading={loading}>
          sign in
        </Button>

        <LinkButton
          className="mt-8"
          onClick={() => window.alert('Under contruction.')}
        >
          Forgot password?
        </LinkButton>

        <span className="self-center mt-8">
          Don&apos;t have account?{' '}
          <LinkButton onClick={() => navigate('signup')}>Sign up</LinkButton>
        </span>
      </div>
    </div>
  );
}
