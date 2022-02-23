import React, { ReactElement } from 'react';

type TabPanelsProps = {
  children: ReactElement | ReactElement[];
  indexSelected?: number;
};

export function TabPanels({
  children,
  indexSelected,
}: TabPanelsProps): JSX.Element {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child, { index, indexSelected });
      })}
    </div>
  );
}
