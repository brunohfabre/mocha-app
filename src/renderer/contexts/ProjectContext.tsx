import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'react-toastify';

import { api } from '@services/api';

import { AuthContext } from './AuthContext';

type ProjectType = {
  id: string;
  title: string;
  created_at: Date;
  is_default: boolean;
};

type CreateProjectData = {
  title: string;
};

type ProjectContextData = {
  projectSelected: ProjectType;
  projects: ProjectType[];
  selectProject: (id: string) => void;
  createProject: (data: CreateProjectData) => Promise<void>;
  deleteProject: (id: string) => void;
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
      const response = await api.get<ProjectType[]>('/projects');

      setProjects(response.data);

      const findDefaultProject = response.data.find(
        (project) => project.is_default
      );

      if (findDefaultProject) {
        setProjectSelected(findDefaultProject);
      }
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

      setProjectSelected(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteProject(id: string): Promise<void> {
    try {
      await api.delete(`/projects/${id}`);

      toast.success('Project deleted.');

      setProjects((prevState) =>
        prevState.filter((project) => project.id !== id)
      );

      const findDefaultProject = projects.find((project) => project.is_default);

      if (findDefaultProject) {
        setProjectSelected(findDefaultProject);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <ProjectContext.Provider
      value={{
        projectSelected,
        projects,
        selectProject,
        createProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
