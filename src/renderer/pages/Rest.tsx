import { useEffect } from 'react';
import { usePageTitle } from 'renderer/hooks/pageTitleHook';

export function Rest(): JSX.Element {
  const { replaceTitle } = usePageTitle();

  useEffect(() => {
    replaceTitle('Rest');
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center">
      <h1>rest page</h1>
    </div>
  );
}
