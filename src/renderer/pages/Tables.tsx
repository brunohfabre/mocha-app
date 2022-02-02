import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { toast } from 'react-toastify';

import { Button } from 'renderer/components/Button';
import { Insidebar } from 'renderer/components/Insidebar';
import { Tabs } from 'renderer/components/Tabs';
import { Spin } from 'renderer/components/Spin';
import { Table } from 'renderer/components/Table';

type FieldType = {
  name: string;
  type: string;
};

export function Tables(): JSX.Element {
  const { connection_id: connectionId } =
    useParams<{ connection_id: string }>();

  const editorRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [functions, setFunctions] = useState<string[]>([]);
  const [tables, setTables] = useState<string[]>([]);
  const [fields, setFields] = useState<FieldType[]>([]);
  const [rows, setRows] = useState([]);

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

        setTables(response.sort());
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

  async function handleRunQuery() {
    if (editorRef.current) {
      try {
        setIsLoading(true);

        const value = editorRef.current
          .getModel()
          .getValueInRange(editorRef.current.getSelection());

        const response = await window.electron.invoke('run-query', {
          connectionId,
          query: value,
        });

        setFields(response.fields);
        setRows(response.rows);
      } catch (err: any) {
        toast.error(err.message.toLowerCase().split('error:')[1].trimStart());
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <>
      <Spin spinning={isLoading} />

      <div className="flex-1 flex overflow-auto">
        <Insidebar functions={functions} tables={tables} />

        <div className="flex-1 flex flex-col overflow-auto">
          <Tabs />

          <section className="flex-1 bg-teal-100 flex flex-col justify-between">
            <Editor defaultLanguage="sql" onMount={handleEditorDidMount} />

            <div className="ml-auto flex items-center gap-8 p-4">
              <span className="flex items-center gap-2">
                {/* <Input type="checkbox" id="check" /> */}
                Limit to 100 rows
              </span>

              <Button type="button" onClick={handleRunQuery}>
                run query
              </Button>
            </div>
          </section>

          <section className="flex-1 flex flex-col overflow-auto">
            <div className="bg-orange-100 flex-1 w-full overflow-auto">
              <Table fields={fields} rows={rows} />
            </div>

            <footer className="bg-orange-200 h-10 px-4 flex items-center gap-4">
              <span>{rows.length}</span>

              <span>response_time</span>
            </footer>
          </section>
        </div>
      </div>
    </>
  );
}
