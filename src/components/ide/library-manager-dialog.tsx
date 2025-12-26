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

export function LibraryManagerDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl h-3/4 flex flex-col">
        <DialogHeader>
          <DialogTitle>Library Manager</DialogTitle>
        </DialogHeader>
        <div className="p-2 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for libraries"
              className="pl-9 bg-background border-border h-9"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="divide-y divide-border">
            {libraries.map((lib, index) => (
              <div key={index} className="p-3 hover:bg-accent">
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
      </DialogContent>
    </Dialog>
  );
}
