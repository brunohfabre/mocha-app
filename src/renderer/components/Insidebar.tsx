import { ReactNode, useRef } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { ResizableBox } from 'react-resizable';

import { Input } from './Input';

interface AccordionProps {
  children: ReactNode;
}

function Accordion({ children }: AccordionProps): JSX.Element {
  return (
    <div className="mt-4 overflow-y-auto tables-test flex flex-col flex-1">
      {children}
    </div>
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
  children: ReactNode;
}

function AccordionItem({ children }: AccordionItemProps): JSX.Element {
  return (
    <button
      type="button"
      className="h-full max-h-8 flex items-center ml-4 hover:bg-gray-400"
      onClick={() => window.alert('Under construction.')}
    >
      {children}
    </button>
  );
}

interface InsidebarProps {
  functions: string[];
  tables: string[];
}

export function Insidebar({ functions, tables }: InsidebarProps): JSX.Element {
  const formRef = useRef<FormHandles>(null);
  const testeRef = document.getElementsByClassName('tables-test');

  return (
    <ResizableBox
      resizeHandles={['e']}
      axis="x"
      width={testeRef[0]?.scrollWidth + 42 || 240}
      height={Infinity}
      minConstraints={[240, Infinity]}
      maxConstraints={[556, Infinity]}
      className="bg-gray-300 p-4 flex flex-col overflow-y-auto"
    >
      <div className="flex flex-col overflow-y-auto">
        <Form ref={formRef} onSubmit={() => undefined}>
          <Input name="search" placeholder="search" />
        </Form>

        {!!functions.length && (
          <Accordion>
            <AccordionTitle>functions</AccordionTitle>

            {functions.map((item) => (
              <AccordionItem key={item}>{item}</AccordionItem>
            ))}
          </Accordion>
        )}

        {!!tables.length && (
          <Accordion>
            <AccordionTitle>tables</AccordionTitle>

            <div className="flex-1 flex flex-col overflow-y-auto">
              {tables.map((item) => (
                <AccordionItem key={item}>{item}</AccordionItem>
              ))}
            </div>
          </Accordion>
        )}
      </div>
    </ResizableBox>
  );
}
