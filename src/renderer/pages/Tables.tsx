import Editor from '@monaco-editor/react';
import { useEffect, useRef } from 'react';

import { Button } from 'renderer/components/Button';
import { Input } from 'renderer/components/Input';
import { Insidebar } from 'renderer/components/Insidebar';
import { Tabs } from 'renderer/components/Tabs';

export function Tables(): JSX.Element {
  const editorRef = useRef<any>(null);

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
    <div className="flex-1 flex">
      <Insidebar />

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
              <Input type="checkbox" id="check" />
              Limit to 100 rows
            </span>

            <Button onClick={showValue}>run query</Button>
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
  );
}
