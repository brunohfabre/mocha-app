import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { Form } from '@unform/web';

import { useRef } from 'react';
import { api } from 'renderer/services/api';
import { FormHandles } from '@unform/core';
import getValidationErrors from 'renderer/helpers/getValidationErrors';
import { useLoading } from 'renderer/hooks/loadingHook';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { LinkButton } from '../components/LinkButton';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function SignUp(): JSX.Element {
  const navigate = useNavigate();

  const formRef = useRef<FormHandles>(null);

  const { setLoading } = useLoading();

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
        firstName,
        lastName,
        phone,
        email,
        password,
      });

      window.alert('Account created. Please log in.');

      navigate(-1);
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
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="p-8 flex flex-col max-w-sm w-full">
        <h1 className="text-4xl font-bold self-center">Sign Up</h1>

        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-2"
        >
          <Input name="firstName" placeholder="First name" label="First name" />
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

        <span className="self-center mt-8">
          Already have an account?{' '}
          <LinkButton onClick={() => navigate(-1)}>Sign in</LinkButton>
        </span>
      </div>
    </div>
  );
}
