import Editor from '@monaco-editor/react';
import { useEffect, useRef, useState } from 'react';

import { Button } from 'renderer/components/Button';
import { Insidebar } from 'renderer/components/Insidebar';
import { Tabs } from 'renderer/components/Tabs';
import { Spin } from 'renderer/components/Spin';
import { useParams } from 'react-router-dom';

export function Tables(): JSX.Element {
  const { connection_id: connectionId } =
    useParams<{ connection_id: string }>();

  const editorRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [functions, setFunctions] = useState<string[]>([]);
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    window.addEventListener('resize', () => {
      editorRef.current.layout({
        width: 'auto',
        height: 'auto',
      });

      // const { width, height } = editorEl.getBoundingClientRect();
      // editorRef.current.layout({
      //   width,
      //   height,
      // });
    });
  }, []);

  useEffect(() => {
    async function loadTables(): Promise<void> {
      try {
        setIsLoading(true);

        const response = await window.electron.invoke('show-tables', {
          connectionId,
        });

        setTables(response);
      } catch (err: any) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadTables();
  }, [connectionId]);

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  function showValue() {
    if (editorRef.current) {
      const value = editorRef.current
        .getModel()
        .getValueInRange(editorRef.current.getSelection());

      alert(value.trim());
    }
  }

  return (
    <>
      <Spin spinning={isLoading} />

      <div className="flex-1 flex">
        <Insidebar functions={functions} tables={tables} />

        <div className="flex-1 flex flex-col">
          <Tabs />

          <section className="flex-1 bg-teal-100 p-4 flex flex-col justify-between gap-4">
            <Editor
              defaultLanguage="sql"
              defaultValue="// some comment"
              onMount={handleEditorDidMount}
            />

            <div className="ml-auto flex items-center gap-8">
              <span className="flex items-center gap-2">
                {/* <Input type="checkbox" id="check" /> */}
                Limit to 100 rows
              </span>

              <Button type="button" onClick={showValue}>
                run query
              </Button>
            </div>
          </section>

          <section className="flex-1 flex flex-col">
            <div className="bg-orange-100 flex-1 p-4">result of query</div>

            <footer className="bg-orange-200 h-10 px-4 flex items-center gap-4">
              <span>rows_count</span>

              <span>response_time</span>
            </footer>
          </section>
        </div>
      </div>
    </>
  );
}
