import { IdeHeader } from '@/components/ide/header';
import { IdeSidebar } from '@/components/ide/sidebar';
import { IdeEditor } from '@/components/ide/editor';
import { IdeOutputPanel } from '@/components/ide/output-panel';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <SidebarProvider defaultOpen={true}>
        <IdeSidebar />
        <SidebarInset className="!m-0 !h-screen !min-h-screen !rounded-none !p-0 shadow-none flex flex-col">
          <IdeHeader />
          <div className="flex-1 grid grid-rows-[minmax(0,3fr)_minmax(0,1fr)] overflow-hidden">
            <IdeEditor />
            <IdeOutputPanel />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
