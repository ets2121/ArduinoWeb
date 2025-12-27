'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Check, ArrowRight, ChevronDown, Menu } from 'lucide-react';
import { useSidebar } from '../ui/sidebar';
import { SidebarTrigger } from '../ui/sidebar';
import { LibraryManagerDialog } from './library-manager-dialog';
import { BoardManagerDialog } from './board-manager-dialog';
import { useCli } from '@/hooks/use-cli';

interface Port {
  address: string;
  label: string;
  protocol: string;
  protocol_label: string;
  properties?: Record<string, string>;
}

interface DetectedPort {
  port: Port;
}

interface BoardListResponse {
  detected_ports: DetectedPort[];
}

export function IdeHeader() {
  const { open } = useSidebar();
  const { data: boardData, error: boardError } = useCli<BoardListResponse>(['board', 'list', '--json']);

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-2 md:px-4 shrink-0">
      <div className="flex items-center gap-2 md:gap-4">
        <SidebarTrigger className={open ? 'hidden' : ''} />
        <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium text-foreground hidden sm:block">Arduino IDE</h1>
        </div>
        <div className="flex items-center gap-1 rounded-md bg-background p-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary">
            <Check className="h-5 w-5" />
            <span className="sr-only">Verify</span>
          </Button>
          <div className="h-6 w-px bg-border" />
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary">
            <ArrowRight className="h-5 w-5" />
            <span className="sr-only">Upload</span>
          </Button>
        </div>
        <Select>
          <SelectTrigger className="w-32 md:w-48 h-9 bg-background">
            <SelectValue placeholder="Select a board/port" />
          </SelectTrigger>
          <SelectContent>
            {boardError && <SelectItem value="error" disabled>{boardError.message}</SelectItem>}
            {!boardData && !boardError && <SelectItem value="loading" disabled>Loading boards...</SelectItem>}
            {boardData?.detected_ports && boardData.detected_ports.length > 0 ? (
                boardData.detected_ports.map(({ port }) => (
                    <SelectItem key={port.address} value={port.address}>
                    {port.label}
                    </SelectItem>
                ))
            ) : (
                <SelectItem value="none" disabled>No boards found</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-1">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 gap-1">File<ChevronDown className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>New Sketch</DropdownMenuItem>
                <DropdownMenuItem>Open</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Save</DropdownMenuItem>
                <DropdownMenuItem>Save As...</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Preferences</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 gap-1">Edit<ChevronDown className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>Undo</DropdownMenuItem>
                <DropdownMenuItem>Redo</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Increase Font Size</DropdownMenuItem>
                <DropdownMenuItem>Decrease Font Size</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 gap-1">Sketch<ChevronDown className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>Verify/Compile</DropdownMenuItem>
                <DropdownMenuItem>Upload</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Include Library</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><Menu /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>New Sketch</DropdownMenuItem>
                <DropdownMenuItem>Open</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Save</DropdownMenuItem>
                <DropdownMenuItem>Save As...</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Verify/Compile</DropdownMenuItem>
                <DropdownMenuItem>Upload</DropdownMenuItem>
                <DropdownMenuSeparator />
                <LibraryManagerDialog>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Library Manager</DropdownMenuItem>
                </LibraryManagerDialog>
                <BoardManagerDialog>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Board Manager</DropdownMenuItem>
                </BoardManagerDialog>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Preferences</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
