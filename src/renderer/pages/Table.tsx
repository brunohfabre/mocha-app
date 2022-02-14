import { Insidebar } from 'renderer/components/Insidebar';
import { Tabs } from 'renderer/components/TabsOld';

export function Table(): JSX.Element {
  return (
    <div className="flex-1 flex">
      <Insidebar />

      <section className="flex-1 flex flex-col">
        <Tabs isTable />

        <div className="bg-orange-100 flex-1 p-4">table data</div>

        <footer className="bg-orange-200 h-10 px-4 flex items-center gap-4">
          <span>rows_count</span>

          <span>response_time</span>
        </footer>
      </section>
    </div>
  );
}
