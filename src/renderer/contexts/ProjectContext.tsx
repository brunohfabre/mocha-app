import { createContext, ReactNode, useEffect, useState } from 'react';

import { api } from '@services/api';

type ProjectType = {
  id: string;
  title: string;
  createdAt: Date;
};

type ProjectContextData = {
  projectSelected: ProjectType;
  projects: ProjectType[];
  selectProject: (id: string) => void;
  createProject: (project: ProjectType) => void;
};

type ProjectContextProviderProps = {
  children: ReactNode;
};

export const ProjectContext = createContext<ProjectContextData>(
  {} as ProjectContextData
);

export function ProjectContextProvider({
  children,
}: ProjectContextProviderProps): JSX.Element {
  const [projectSelected, setProjectSelected] = useState<ProjectType>(
    {} as ProjectType
  );
  const [projects, setProjects] = useState<ProjectType[]>([]);

  useEffect(() => {
    async function loadProjects() {
      const response = await api.get('/projects');

      setProjects(response.data);
    }

    loadProjects();
  }, []);

  function selectProject(id: string): void {
    const findProject = projects.find((project) => project.id === id);

    if (findProject) {
      setProjectSelected(findProject);
    }
  }

  function createProject(project: ProjectType): void {
    setProjects((prevState) => [...prevState, project]);
  }

  return (
    <ProjectContext.Provider
      value={{ projectSelected, projects, selectProject, createProject }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
