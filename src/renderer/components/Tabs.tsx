import { ReactNode } from 'react';

interface TabsProps {
  tabs: string[];
  tabActive: string;
  onChange: (tab: string) => void;
  onRemove: (tab: string) => void;
  sqlComponent: ReactNode;
  tableComponent: ReactNode;
}

export function Tabs({
  tabs,
  tabActive,
  onChange,
  onRemove,
  sqlComponent,
  tableComponent,
}: TabsProps): JSX.Element {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="flex bg-violet-100">
        <button
          type="button"
          className={`h-10 px-4 flex items-center gap-2 ${
            tabActive === 'sql' ? 'bg-violet-300' : 'bg-violet-200'
          }`}
          onClick={() => onChange('sql')}
        >
          sql
        </button>

        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`h-10 px-4 flex items-center gap-2 ${
              tabActive === tab ? 'bg-violet-300' : 'bg-violet-200'
            }`}
            onClick={() => onChange(tab)}
          >
            {tab}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(tab);
              }}
            >
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
            </button>
          </button>
        ))}
      </div>

      {tabActive === 'sql' ? <>{sqlComponent}</> : <>{tableComponent}</>}
    </div>
  );
}
