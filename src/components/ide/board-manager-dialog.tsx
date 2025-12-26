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

const boards = [
  { name: 'Arduino Uno', category: 'Arduino AVR Boards' },
  { name: 'Arduino Mega 2560', category: 'Arduino AVR Boards' },
  { name: 'Arduino Nano', category: 'Arduino AVR Boards' },
  { name: 'Arduino Zero', category: 'Arduino SAMD Boards' },
  { name: 'Arduino MKR WiFi 1010', category: 'Arduino SAMD Boards' },
];

export function BoardManagerDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl h-3/4 flex flex-col">
        <DialogHeader>
          <DialogTitle>Board Manager</DialogTitle>
        </DialogHeader>
        <div className="p-2 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for boards"
              className="pl-9 bg-background border-border h-9"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {boards.map((board, index) => (
              <div key={index} className="p-3 rounded-md hover:bg-accent">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{board.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {board.category}
                    </p>
                  </div>
                  <Button size="sm" variant="secondary">
                    Install
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
