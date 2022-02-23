import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from 'renderer/contexts/AuthContext';
import getValidationErrors from 'renderer/helpers/getValidationErrors';
import { api } from 'renderer/services/api';
import * as Yup from 'yup';

import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { LinkButton } from '@components/LinkButton';
import { Spin } from '@components/Spin';

interface FormData {
  email: string;
  password: string;
}

export function SignIn(): JSX.Element {
  const navigate = useNavigate();

  const formRef = useRef<FormHandles>(null);

  const { signIn } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: FormData): Promise<void> {
    const { email, password } = data;

    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string().required(),
        password: Yup.string().required(),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      setIsLoading(true);

      const response = await api.post('/sessions', {
        email,
        password,
      });

      signIn(response.data);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Spin spinning={isLoading} />

      <div className="h-screen flex flex-col items-center justify-center">
        <div className="p-8 flex flex-col max-w-sm w-full">
          <h1 className="text-4xl font-bold self-center">Sign In</h1>

          <Button
            type="button"
            className="mt-12"
            onClick={() => window.alert('Under construction.')}
          >
            continue with github
          </Button>

          <span className="flex justify-center my-4">or</span>

          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 "
          >
            <Input name="email" placeholder="Email" label="Email" />
            <Input name="password" placeholder="Password" label="Password" />

            <Button type="submit" className="mt-8">
              sign in
            </Button>
          </Form>

          <LinkButton
            className="mt-8"
            onClick={() => window.alert('Under construction.')}
          >
            Forgot password?
          </LinkButton>

          <span className="self-center mt-8">
            Don&apos;t have account?{' '}
            <LinkButton onClick={() => navigate('signup')}>Sign up</LinkButton>
          </span>
        </div>
      </div>
    </>
  );
}
