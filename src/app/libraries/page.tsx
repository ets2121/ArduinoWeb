'use client';

import { IdeHeader } from '@/components/ide/header';
import { IdeSidebar } from '@/components/ide/sidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const libraries = [
    { name: 'Servo', version: '1.2.1', description: 'Control servo motors.' },
    { name: 'WiFiNINA', version: '1.8.14', description: 'Enable network connection (TCP and UDP) with the WiFiNINA family of shields.' },
    { name: 'LiquidCrystal', version: '1.0.7', description: 'Control LCD displays.' },
    { name: 'Stepper', version: '1.1.3', description: 'Control stepper motors.' },
];

export default function LibrariesPage() {
  return (
    <>
      <IdeSidebar />
      <SidebarInset className="!m-0 !h-screen !min-h-screen !rounded-none !p-0 shadow-none flex flex-col">
        <IdeHeader />
        <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>Library Manager</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-2 border-b border-border">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search for libraries" className="pl-9 bg-background border-border h-9" />
                        </div>
                    </div>
                    <ScrollArea className="h-[calc(100vh-200px)]">
                        <div className="divide-y divide-border">
                            {libraries.map((lib, index) => (
                                <div key={index} className="p-3 hover:bg-accent">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">{lib.name}</p>
                                            <p className="text-sm text-muted-foreground">{lib.description}</p>
                                        </div>
                                        <Button size="sm" variant="secondary" className="ml-4 shrink-0">Install</Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Version {lib.version}</p>
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
