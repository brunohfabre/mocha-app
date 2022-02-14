import React, { ReactElement } from 'react';

type TabListProps = {
  children: ReactElement | ReactElement[];
  indexSelected?: number;
  onChange?: (index: number) => void;
};

export function TabList({
  children,
  indexSelected,
  onChange,
}: TabListProps): JSX.Element {
  return (
    <div className="flex overflow-auto bg-violet-100">
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child, { index, indexSelected, onChange });
      })}
    </div>
  );
}
