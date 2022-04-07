import { useEffect } from 'react';
import { usePageTitle } from 'renderer/hooks/pageTitleHook';

export function Home(): JSX.Element {
  const { replaceTitle } = usePageTitle();

  useEffect(() => {
    replaceTitle('Home');
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center">
      <h1>home page</h1>
    </div>
  );
}
