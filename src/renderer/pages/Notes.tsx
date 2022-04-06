import { useEffect } from 'react';
import { usePageTitle } from 'renderer/hooks/pageTitleHook';

export function Notes(): JSX.Element {
  const { replaceTitle } = usePageTitle();

  useEffect(() => {
    replaceTitle('Notes');
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center">
      <h1>notes page</h1>
    </div>
  );
}
