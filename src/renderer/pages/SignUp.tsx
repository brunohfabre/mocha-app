import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import getValidationErrors from 'renderer/helpers/getValidationErrors';
import { api } from 'renderer/services/api';
import * as Yup from 'yup';

import { AuthContext } from '@contexts/AuthContext';

import { useLoading } from '@hooks/loadingHook';

import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { LinkButton } from '@components/LinkButton';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function SignUp(): JSX.Element {
  const { signIn } = useContext(AuthContext);

  const navigate = useNavigate();

  const { setLoading } = useLoading();

  const formRef = useRef<FormHandles>(null);

  async function handleSubmit(data: FormData): Promise<void> {
    const { firstName, lastName, phone, email, password } = data;

    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        firstName: Yup.string().required(),
        lastName: Yup.string().required(),
        phone: Yup.string().required(),
        email: Yup.string().required(),
        password: Yup.string().required(),
        confirmPassword: Yup.string().oneOf(
          [Yup.ref('password'), undefined],
          'Passwords do not match'
        ),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      setLoading(true);

      await api.post('/users', {
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
        password,
      });

      await signIn({ email, password });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="p-8 flex flex-col max-w-md w-full">
          <h1 className="text-3xl font-bold self-center">Sign Up</h1>

          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-2"
          >
            <Input
              name="firstName"
              placeholder="First name"
              label="First name"
            />
            <Input name="lastName" placeholder="Last name" label="Last name" />
            <Input
              name="phone"
              placeholder="Mobile phone with country"
              label="Phone"
            />
            <Input name="email" placeholder="Email" label="Email" />
            <Input name="password" placeholder="Password" label="Password" />
            <Input
              name="confirmPassword"
              placeholder="Confirm password"
              label="Confirm password"
            />

            <Button type="submit" className="mt-8">
              sign up
            </Button>
          </Form>

          <span className="self-center mt-8 text-sm">
            Already have an account?{' '}
            <LinkButton onClick={() => navigate(-1)}>Sign in</LinkButton>
          </span>
        </div>
      </div>
    </>
  );
}
