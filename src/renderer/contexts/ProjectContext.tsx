import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { api } from '@services/api';

import { AuthContext } from './AuthContext';

type ProjectType = {
  id: string;
  title: string;
  createdAt: Date;
};

type CreateProjectData = {
  title: string;
};

type ProjectContextData = {
  projectSelected: ProjectType;
  projects: ProjectType[];
  selectProject: (id: string) => void;
  createProject: (data: CreateProjectData) => Promise<void>;
};

type ProjectProviderProps = {
  children: ReactNode;
};

export const ProjectContext = createContext<ProjectContextData>(
  {} as ProjectContextData
);

export function ProjectProvider({
  children,
}: ProjectProviderProps): JSX.Element {
  const { isSigned } = useContext(AuthContext);

  const [projectSelected, setProjectSelected] = useState<ProjectType>(
    {} as ProjectType
  );
  const [projects, setProjects] = useState<ProjectType[]>([]);

  useEffect(() => {
    async function loadProjects() {
      const response = await api.get('/projects');

      setProjects(response.data);
    }

    if (isSigned) {
      loadProjects();
    }
  }, [isSigned]);

  function selectProject(id: string): void {
    const findProject = projects.find((project) => project.id === id);

    if (findProject) {
      setProjectSelected(findProject);
    }
  }

  async function createProject({ title }: CreateProjectData): Promise<void> {
    try {
      const response = await api.post(`/projects`, {
        title,
      });

      setProjects((prevState) => [...prevState, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <ProjectContext.Provider
      value={{ projectSelected, projects, selectProject, createProject }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
