import { ReactNode } from 'react';

type TabProps = {
  children: ReactNode;
  index?: number;
  indexSelected?: number;
  onChange?: (index: number) => void;
  onDelete?: (index: number) => void;
};

export function Tab({
  children,
  index,
  indexSelected,
  onChange,
  onDelete,
}: TabProps): JSX.Element {
  function handleClick(): void {
    if (onChange && index !== undefined) {
      onChange(index);
    }
  }

  return (
    <button
      type="button"
      className={`pl-4 pr-2 h-10 whitespace-nowrap ${
        index === indexSelected ? 'bg-violet-300' : 'bg-violet-200'
      } hover:bg-red-400`}
      onClick={handleClick}
    >
      <span className="mr-2">{children}</span>

      {onDelete && (
        <button
          type="button"
          className="bg-blue-400 px-2"
          onClick={(e) => {
            e.stopPropagation();

            if (onDelete && typeof index === 'number') {
              onDelete(index);
            }
          }}
        >
          X
        </button>
      )}
    </button>
  );
}
