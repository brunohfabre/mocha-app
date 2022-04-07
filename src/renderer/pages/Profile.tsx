import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useContext, useEffect, useRef, useState } from 'react';
import { usePageTitle } from 'renderer/hooks/pageTitleHook';
import * as Yup from 'yup';

import getValidationErrors from '@helpers/getValidationErrors';

import { AuthContext } from '@contexts/AuthContext';

import { api } from '@services/api';

import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Spin } from '@components/Spin';

type HandleSubmitData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export function Profile(): JSX.Element {
  const formRef = useRef<FormHandles>(null);

  const { user, updateProfile } = useContext(AuthContext);

  const { replaceTitle } = usePageTitle();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    replaceTitle('Profile');
  }, []);

  async function handleSubmit(data: HandleSubmitData) {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        firstName: Yup.string().required(),
        lastName: Yup.string().required(),
        email: Yup.string().required(),
        phone: Yup.string().required(),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      setIsLoading(true);

      const { firstName, lastName, email, phone } = data;

      const response = await api.put(`/users/${user?.id}`, {
        firstName,
        lastName,
        email,
        phone,
      });

      updateProfile(response.data);
    } catch (err: any) {
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
      <div className="mx-auto w-full max-w-xl p-8">
        profile page
        <Form ref={formRef} onSubmit={handleSubmit} initialData={user ?? {}}>
          <Input name="firstName" label="first name" placeholder="first name" />
          <Input name="lastName" label="last name" placeholder="last name" />
          <Input name="email" label="email" placeholder="email" />
          <Input name="phone" label="phone" placeholder="phone" />

          <footer className="flex justify-end mt-8">
            <Button type="submit">save</Button>
          </footer>
        </Form>
      </div>
    </>
  );
}
