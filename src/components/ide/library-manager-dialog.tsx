'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const libraries = [
  { name: 'Servo', version: '1.2.1', description: 'Control servo motors.' },
  {
    name: 'WiFiNINA',
    version: '1.8.14',
    description:
      'Enable network connection (TCP and UDP) with the WiFiNINA family of shields.',
  },
  {
    name: 'LiquidCrystal',
    version: '1.0.7',
    description: 'Control LCD displays.',
  },
  {
    name: 'Stepper',
    version: '1.1.3',
    description: 'Control stepper motors.',
  },
];

const installedLibraries = [
    { name: 'Servo', version: '1.2.1', description: 'Control servo motors.' },
    { name: 'LiquidCrystal', version: '1.0.7', description: 'Control LCD displays.' },
];

export function LibraryManagerDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl h-3/4 flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Library Manager</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="search" className="flex flex-col h-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="search">Search</TabsTrigger>
                <TabsTrigger value="installed">Installed</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="search" className="flex-1 flex flex-col mt-0">
            <div className="p-2 border-b border-t border-border mt-2">
              <div className="relative px-4">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for libraries"
                  className="pl-9 bg-background border-border h-9"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="divide-y divide-border">
                {libraries.map((lib, index) => (
                  <div key={index} className="p-3 hover:bg-accent mx-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{lib.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {lib.description}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="ml-4 shrink-0"
                      >
                        Install
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Version {lib.version}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="installed" className="flex-1 mt-0">
            <ScrollArea className="h-full">
              <div className="divide-y divide-border">
                {installedLibraries.map((lib, index) => (
                  <div key={index} className="p-3 hover:bg-accent mx-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{lib.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {lib.description}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-4 shrink-0"
                      >
                        Remove
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Version {lib.version}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
