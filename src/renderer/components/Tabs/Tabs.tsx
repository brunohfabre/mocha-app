import React, { ReactElement } from 'react';

type TabsProps = {
  children: ReactElement[];
  index: number;
  onChange: (index: number) => void;
};

export function Tabs({ children, index, onChange }: TabsProps): JSX.Element {
  return (
    <div className="flex flex-col overflow-auto flex-1">
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          onChange,
          indexSelected: index,
        });
      })}
    </div>
  );
}
