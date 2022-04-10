import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useContext, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import getValidationErrors from '@helpers/getValidationErrors';

import { ProjectContext } from '@contexts/ProjectContext';

import { api } from '@services/api';

import { usePageTitle } from '@hooks/pageTitleHook';

import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Modal } from '@components/Modal';
import { Spin } from '@components/Spin';

type HandleSubmitData = {
  title: string;
};

export function Header(): JSX.Element {
  const formRef = useRef<FormHandles>(null);

  const { projectSelected, projects, selectProject, createProject } =
    useContext(ProjectContext);

  const location = useLocation();
  const navigate = useNavigate();

  const { title: pageTitle } = usePageTitle();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showBackButton =
    location.pathname.split('/').filter((item) => Boolean(item)).length > 1;

  function handleNavigateBack(): void {
    navigate(-1);
  }

  async function handleSubmit(data: HandleSubmitData): Promise<void> {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        title: Yup.string().required(),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      setIsLoading(true);

      const { title } = data;

      await createProject({ title });
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
      }
    } finally {
      setIsLoading(false);

      setOpen(false);
    }
  }

  async function handleDeleteProject(id: string): Promise<void> {
    try {
      setIsLoading(true);

      await api.delete(`/projects/${id}`);

      toast.success('Project deleted.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Spin spinning={isLoading} />

      <Modal
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        title="Add new project"
      >
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Input name="title" label="Project name" placeholder="Project name" />

          <footer className="pt-8 flex justify-end gap-2">
            <Button type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add project</Button>
          </footer>
        </Form>
      </Modal>

      <div className="w-full h-12 bg-red-300 flex justify-between items-center pr-4">
        <div className="flex items-center">
          {showBackButton && (
            <button
              type="button"
              onClick={handleNavigateBack}
              className="w-12 h-12 flex justify-center items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}

          <span className={!showBackButton ? 'pl-4' : ''}>{pageTitle}</span>
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex items-center justify-center h-full">
            <span>{projectSelected?.title ?? 'Select a project'} ⌄</span>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content className="bg-red-100 py-2 w-40">
            {projects.map((project) => (
              <DropdownMenu.Item
                key={project.id}
                className={`cursor-pointer hover:bg-red-300 flex justify-between items-center ${
                  project.id === projectSelected.id
                    ? 'bg-red-200'
                    : 'bg-red-100'
                }`}
                onClick={() => selectProject(project.id)}
              >
                {project.title}

                <button
                  className="p-2 hover:bg-red-400"
                  onClick={(event) => {
                    event.stopPropagation();

                    handleDeleteProject(project.id);
                  }}
                >
                  X
                </button>
              </DropdownMenu.Item>
            ))}

            <DropdownMenu.Separator className="bg-red-500 h-0.5" />

            <DropdownMenu.Item
              className="cursor-pointer hover:bg-red-200"
              onClick={() => setOpen(true)}
            >
              + project
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </>
  );
}
