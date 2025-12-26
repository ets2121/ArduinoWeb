'use client';

import { IdeHeader } from '@/components/ide/header';
import { IdeSidebar } from '@/components/ide/sidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const boards = [
    { name: 'Arduino Uno', category: 'Arduino AVR Boards' },
    { name: 'Arduino Mega 2560', category: 'Arduino AVR Boards' },
    { name: 'Arduino Nano', category: 'Arduino AVR Boards' },
    { name: 'Arduino Zero', category: 'Arduino SAMD Boards' },
    { name: 'Arduino MKR WiFi 1010', category: 'Arduino SAMD Boards' },
];

export default function BoardsPage() {
  return (
    <>
      <IdeSidebar />
      <SidebarInset className="!m-0 !h-screen !min-h-screen !rounded-none !p-0 shadow-none flex flex-col">
        <IdeHeader />
        <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>Board Manager</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="p-2 border-b border-border">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search for boards" className="pl-9 bg-background border-border h-9" />
                        </div>
                    </div>
                    <ScrollArea className="h-[calc(100vh-200px)]">
                        <div className="p-2 space-y-2">
                            {boards.map((board, index) => (
                                <div key={index} className="p-3 rounded-md hover:bg-accent">
                                    <div className='flex justify-between'>
                                      <div>
                                        <p className="font-medium">{board.name}</p>
                                        <p className="text-sm text-muted-foreground">{board.category}</p>
                                      </div>
                                      <Button size="sm" variant="secondary">Install</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </main>
      </SidebarInset>
    </>
  );
}
