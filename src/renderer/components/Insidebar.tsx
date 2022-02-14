import { ReactNode, useEffect, useRef, useState } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { ResizableBox } from 'react-resizable';

import { Input } from './Input';

interface AccordionProps {
  children: ReactNode;
}

function Accordion({ children }: AccordionProps): JSX.Element {
  return (
    <div className="mt-4 overflow-y-auto flex flex-col flex-1">{children}</div>
  );
}

interface AccordionTitleProps {
  children: ReactNode;
}

function AccordionTitle({ children }: AccordionTitleProps): JSX.Element {
  return (
    <strong className="h-8 flex items-center justify-between">
      {children}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </strong>
  );
}

interface AccordionItemProps {
  name: string;
  onClick: (value: string) => void;
}

function AccordionItem({ name, onClick }: AccordionItemProps): JSX.Element {
  return (
    <button
      type="button"
      className="h-full max-h-8 flex items-center ml-4 hover:bg-gray-400"
      onClick={() => onClick(name)}
    >
      {name}
    </button>
  );
}

interface InsidebarProps {
  functions: string[];
  tables: string[];
  onClick: (value: string) => void;
}

export function Insidebar({
  functions,
  tables,
  onClick,
}: InsidebarProps): JSX.Element {
  const searchFormRef = useRef<FormHandles>(null);

  const [filteredFunctions, setFilteredFunctions] = useState<string[]>([]);
  const [filteredTables, setFilteredTables] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    function handleSearch(): void {
      setFilteredFunctions(
        functions.filter((item) =>
          item.toLowerCase().includes(search.toLowerCase())
        )
      );

      setFilteredTables(
        tables.filter((item) =>
          item.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    handleSearch();
  }, [search, functions, tables]);

  return (
    <ResizableBox
      resizeHandles={['e']}
      axis="x"
      width={300}
      height={Infinity}
      minConstraints={[220, Infinity]}
      maxConstraints={[500, Infinity]}
      className="bg-gray-300 flex flex-col overflow-auto"
    >
      <div className="flex flex-col overflow-y-auto overflow-x-hidden">
        <Form ref={searchFormRef} onSubmit={() => undefined} className="m-4">
          <Input
            name="search"
            placeholder="search"
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </Form>

        {!!filteredTables.length && (
          <>
            <strong className="px-4 h-8 w-full">Tables</strong>

            <div className="flex flex-col">
              {filteredTables.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="pl-8 pr-4 h-8 flex items-center hover:bg-gray-400"
                  onClick={() => onClick(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </ResizableBox>
  );
}
