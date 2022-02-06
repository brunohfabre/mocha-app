import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ResizableBox } from 'react-resizable';
import { v4 as uuid } from 'uuid';

import { EditorState } from '@codemirror/state';
import { EditorView, keymap, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { history, historyKeymap } from '@codemirror/history';
import { indentOnInput } from '@codemirror/language';
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/gutter';
import { defaultHighlightStyle } from '@codemirror/highlight';
import { sql } from '@codemirror/lang-sql';

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
  const [responseTime, setResponseTime] = useState(0);
  const [functions, setFunctions] = useState<string[]>([]);
  const [tables, setTables] = useState<string[]>([]);
  const [fields, setFields] = useState<FieldType[]>([]);
  const [rows, setRows] = useState([]);
  const [isQuired, setIsQuired] = useState(false);
  const [finalValue, setFinalValue] = useState<any>();
  const [lastQuery, setLastQuery] = useState('');

  const containerRef = useRef(null);
  const [editorView, setEditorView] = useState<any>();

  useEffect(() => {
    if (!containerRef.current) return;

    const startState = EditorState.create({
      doc: '',
      extensions: [
        keymap.of([...defaultKeymap, ...historyKeymap]),
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        indentOnInput(),
        defaultHighlightStyle.fallback,
        highlightActiveLine(),
        sql(),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.changes) {
            setFinalValue({
              text: update.state.doc.text.reduce(
                (previousValue: string, currentValue: string) => {
                  if (previousValue) {
                    return `${previousValue} ${currentValue}`;
                  }

                  return currentValue;
                },
                ''
              ),
              selection: update.state.selection.ranges[0],
            });
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: containerRef.current,
    });

    setEditorView(view);
  }, [containerRef]);

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

  async function handleRunQuery() {
    try {
      const initialTime = Date.now();

      setIsLoading(true);

      const value = finalValue.text.slice(
        finalValue.selection.from,
        finalValue.selection.to
      );

      const response = await window.electron.invoke('run-query', {
        connectionId,
        query: value,
      });

      setFields(response.fields);
      setRows(
        response.rows.map((row: { [key: string]: string }) => ({
          ...row,
          rowId: uuid(),
        }))
      );

      const finalTime = Date.now();

      setLastQuery(value);
      setResponseTime(finalTime - initialTime);
      setIsQuired(true);
    } catch (err: any) {
      toast.error(err.message.toLowerCase().split('error:')[1].trimStart());
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Spin spinning={isLoading} />

      <div className="flex-1 flex overflow-auto">
        <Insidebar functions={functions} tables={tables} />

        <div className="flex-1 flex flex-col overflow-auto">
          <Tabs />

          <section className="flex-1 bg-teal-100 flex flex-col justify-between overflow-auto">
            <div ref={containerRef} className="flex-1 overflow-auto" />

            <div className="flex items-center gap-8 p-4 bg-teal-200 justify-end">
              {/* <span className="flex items-center gap-2">
                <Input type="checkbox" id="check" />
                Limit to 100 rows
              </span> */}

              <Button type="button" onClick={handleRunQuery}>
                run query
              </Button>
            </div>
          </section>

          <ResizableBox
            resizeHandles={['n']}
            axis="y"
            width={Infinity}
            height={300}
            minConstraints={[Infinity, 180]}
            maxConstraints={[Infinity, 556]}
            className="bg-gray-300 flex flex-col overflow-auto"
          >
            <section className="flex-1 flex flex-col overflow-auto">
              <div className="bg-orange-100 flex-1 w-full overflow-auto">
                <Table fields={fields} rows={rows} lastQuery={lastQuery} />
              </div>

              {isQuired && (
                <footer className="bg-orange-200 h-10 px-4 flex items-center gap-4">
                  <span>{rows.length} rows</span>

                  <span>{responseTime} ms</span>
                </footer>
              )}
            </section>
          </ResizableBox>
        </div>
      </div>
    </>
  );
}
