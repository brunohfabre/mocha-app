import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Input } from './Input';

interface AccordionProps {
  children: ReactNode;
}

function Accordion({ children }: AccordionProps): JSX.Element {
  return <div className="mt-4">{children}</div>;
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
    <Link className="h-8 flex items-center ml-4" to="1">
      {children}
    </Link>
  );
}

export function Insidebar(): JSX.Element {
  return (
    <aside className="bg-gray-300 w-60 p-4 flex flex-col">
      <Input placeholder="search" />

      <Accordion>
        <AccordionTitle>functions</AccordionTitle>

        {new Array(3).fill('f').map((_, index) => (
          <AccordionItem>function_name #{index + 1}</AccordionItem>
        ))}
      </Accordion>

      <Accordion>
        <AccordionTitle>tables</AccordionTitle>

        {new Array(7).fill('t').map((_, index) => (
          <AccordionItem>table_name #{index + 1}</AccordionItem>
        ))}
      </Accordion>
    </aside>
  );
}
