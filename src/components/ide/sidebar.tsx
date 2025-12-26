'use client';

import { usePathname } from 'next/navigation';
import {
  Sidebar as SidebarContainer,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Book, CircuitBoard, Settings, Notebook } from 'lucide-react';
import Link from 'next/link';
import { LibraryManagerDialog } from './library-manager-dialog';
import { BoardManagerDialog } from './board-manager-dialog';


export function IdeSidebar() {
    const pathname = usePathname();

    return (
        <SidebarContainer className="border-r border-border">
             <div className="flex flex-col h-full">
                <SidebarHeader className="flex items-center justify-between p-2 pl-4">
                    <h2 className="text-lg font-semibold">Arduino</h2>
                    <SidebarTrigger />
                </SidebarHeader>
                <SidebarContent className="p-2">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Link href="/">
                                <SidebarMenuButton isActive={pathname === '/'} tooltip="Sketchbook">
                                    <Notebook />
                                    <span>Sketchbook</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <LibraryManagerDialog>
                                <SidebarMenuButton tooltip="Library Manager">
                                    <Book />
                                    <span>Libraries</span>
                                </SidebarMenuButton>
                            </LibraryManagerDialog>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                           <BoardManagerDialog>
                                <SidebarMenuButton tooltip="Board Manager">
                                    <CircuitBoard />
                                    <span>Boards</span>
                                </SidebarMenuButton>
                            </BoardManagerDialog>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter className="p-2 border-t border-sidebar-border mt-auto">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip="Settings">
                                <Settings />
                                <span>Settings</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </div>
        </SidebarContainer>
    );
}
