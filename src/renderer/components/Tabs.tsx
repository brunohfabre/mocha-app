import { useNavigate } from 'react-router-dom';

interface TabsProps {
  isTable?: boolean;
}

export function Tabs({ isTable }: TabsProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="flex bg-violet-100">
      <button
        type="button"
        className={`h-10 px-4 flex items-center gap-2 ${
          isTable ? 'bg-violet-200' : 'bg-violet-300'
        }`}
        onClick={() => navigate(-1)}
      >
        sql
      </button>

      {isTable && (
        <div className="h-10 px-4 flex items-center gap-2 bg-violet-300">
          table_name
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
