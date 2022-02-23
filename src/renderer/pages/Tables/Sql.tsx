import { ResizableBox } from 'react-resizable';
import ace, { Ace } from 'ace-builds';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/ext-language_tools';
import { v4 as uuid } from 'uuid';

import { Spin } from 'renderer/components/Spin';
import { Button } from 'renderer/components/Button';
import { Table } from 'renderer/components/Table';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

type FieldType = {
  name: string;
  type: string;
};

type SqlProps = {
  tables: string[];
};

export function Sql({ tables }: SqlProps): JSX.Element {
  const { connection_id: connectionId } =
    useParams<{ connection_id: string }>();

  const editorRef = useRef<AceEditor>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [isQuired, setIsQuired] = useState(false);
  const [fields, setFields] = useState<FieldType[]>([]);
  const [rows, setRows] = useState<{ [key: string]: string }[]>([]);
  const [responseTime, setResponseTime] = useState(0);

  useEffect(() => {
    const langTools = ace.require('ace/ext/language_tools');

    const sqlTablesCompleter = {
      getCompletions: (
        editor: Ace.Editor,
        session: Ace.EditSession,
        point: Ace.Point,
        string: string,
        callback: Ace.CompleterCallback
      ): void => {
        callback(
          null,
          tables.map(
            (table) =>
              ({
                caption: table,
                value: table,
                meta: 'Table',
              } as Ace.Completion)
          )
        );
      },
    };
    langTools.addCompleter(sqlTablesCompleter);
  }, [tables]);

  async function handleRunQuery() {
    try {
      const initialTime = Date.now();

      setIsLoading(true);

      if (!editorRef.current) {
        return;
      }

      const value = editorRef.current.editor.getSelectedText();

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

  function handleUpdateRows(items: { [key: string]: string }) {
    Object.keys(items).forEach((item) => {
      setRows((prevState) =>
        prevState.map((row) =>
          row.rowId === item ? Object.assign(row, items) : row
        )
      );
    });
  }

  return (
    <>
      <Spin spinning={isLoading} />

      <section className="flex-1 bg-teal-100 flex flex-col justify-between overflow-auto">
        <AceEditor
          ref={editorRef}
          width="100%"
          mode="sql"
          theme="textmate"
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            tabSize: 2,
            fontSize: 14,
            fontFamily: 'jetbrains-mono',
          }}
        />

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
            <Table
              fields={fields}
              rows={rows}
              updateRows={handleUpdateRows}
              lastQuery={lastQuery}
            />
          </div>

          {isQuired && (
            <footer className="bg-orange-200 h-10 px-4 flex items-center gap-4">
              <span>{rows.length} rows</span>

              <span>{responseTime} ms</span>
            </footer>
          )}
        </section>
      </ResizableBox>
    </>
  );
}
