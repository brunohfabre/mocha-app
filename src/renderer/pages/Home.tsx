import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import { usePageTitle } from 'renderer/hooks/pageTitleHook';

import { Button } from '@components/Button';

export function Home(): JSX.Element {
  const [modalVisible, setModalVisible] = useState(false);

  const { replaceTitle } = usePageTitle();

  useEffect(() => {
    replaceTitle('Home');
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center">
      <h1>home page</h1>

      <Dialog.Root>
        <Dialog.Trigger>
          <Button type="button" onClick={() => setModalVisible(true)}>
            open test dialog
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal container={document.getElementById('modal')}>
          <Dialog.Overlay className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black/50 p-4">
            <Dialog.Content className="bg-white">
              <Dialog.Title>
                <span>dialog title</span>
              </Dialog.Title>
              <Dialog.Description />
              <Dialog.Close />

              <div>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex
                rerum libero tempora excepturi ad, maiores, explicabo aliquam
                earum impedit voluptate tempore adipisci maxime consequuntur
                enim, commodi culpa deleniti minima porro!
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
