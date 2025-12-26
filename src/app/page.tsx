'use client';

import { IdeHeader } from '@/components/ide/header';
import { IdeSidebar } from '@/components/ide/sidebar';
import { IdeEditor } from '@/components/ide/editor';
import { IdeOutputPanel } from '@/components/ide/output-panel';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  return (
    <SidebarProvider defaultOpen={true}>
      <IdeSidebar />
      <SidebarInset className="!m-0 !h-screen !min-h-screen !rounded-none !p-0 shadow-none flex flex-col">
        <IdeHeader />
        <div className="flex-1 grid grid-rows-[minmax(0,1fr)] overflow-hidden md:grid-rows-[minmax(0,3fr)_minmax(0,1fr)]">
          {/* Desktop View */}
          <div className="hidden md:grid md:grid-rows-subgrid md:row-span-2 h-full">
            <IdeEditor />
            <IdeOutputPanel />
          </div>

          {/* Mobile View */}
          <div className="md:hidden h-full">
            <Tabs defaultValue="editor" className="h-full flex flex-col">
              <TabsList className="rounded-none justify-start border-b border-border p-0 h-10">
                <TabsTrigger value="editor" className="data-[state=active]:bg-card data-[state=active]:shadow-none rounded-none border-r border-border h-full flex-1">
                  Editor
                </TabsTrigger>
                <TabsTrigger value="output" className="data-[state=active]:bg-card data-[state=active]:shadow-none rounded-none border-r-0 border-border h-full flex-1">
                  Output/Serial
                </TabsTrigger>
              </TabsList>
              <TabsContent value="editor" className="flex-1 mt-0">
                <IdeEditor />
              </TabsContent>
              <TabsContent value="output" className="flex-1 mt-0 h-full">
                <IdeOutputPanel />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
