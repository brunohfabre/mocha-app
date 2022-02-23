import { ReactNode } from 'react';

type TabPanelProps = {
  children: ReactNode;
  index?: number;
  indexSelected?: number;
};

export function TabPanel({
  children,
  index,
  indexSelected,
}: TabPanelProps): JSX.Element {
  return (
    <div
      className={`flex-1 ${
        index === indexSelected ? 'flex' : 'hidden'
      } flex-col overflow-auto`}
    >
      {children}
    </div>
  );
}
