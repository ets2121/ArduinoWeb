'use client';

import { useState } from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Book, CircuitBoard, Settings, Search, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const examples = {
  '01.Basics': ['BareMinimum', 'Blink', 'DigitalReadSerial', 'AnalogReadSerial', 'Fade'],
  '02.Digital': ['BlinkWithoutDelay', 'Button', 'Debounce', 'StateChangeDetection'],
  '03.Analog': ['AnalogInOutSerial', 'AnalogInput', 'AnalogWriteMega', 'Calibration'],
  '04.Communication': ['ASCIITable', 'Graph', 'Midi', 'MultiSerialMega'],
};

const libraries = [
    { name: 'Servo', version: '1.2.1', description: 'Control servo motors.' },
    { name: 'WiFiNINA', version: '1.8.14', description: 'Enable network connection (TCP and UDP) with the WiFiNINA family of shields.' },
    { name: 'LiquidCrystal', version: '1.0.7', description: 'Control LCD displays.' },
    { name: 'Stepper', version: '1.1.3', description: 'Control stepper motors.' },
];

const boards = [
    { name: 'Arduino Uno', category: 'Arduino AVR Boards' },
    { name: 'Arduino Mega 2560', category: 'Arduino AVR Boards' },
    { name: 'Arduino Nano', category: 'Arduino AVR Boards' },
    { name: 'Arduino Zero', category: 'Arduino SAMD Boards' },
    { name: 'Arduino MKR WiFi 1010', category: 'Arduino SAMD Boards' },
];


function SketchbookView({ onShowBoards, onShowLibraries }: { onShowBoards: () => void; onShowLibraries: () => void; }) {
    return (
        <div className="flex flex-col h-full">
            <SidebarHeader className="flex items-center justify-between p-2 pl-4">
                <h2 className="text-lg font-semibold">Sketchbook</h2>
                <SidebarTrigger />
            </SidebarHeader>
            <SidebarContent className="p-0">
                <div className="p-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Filter your sketches" className="pl-9 bg-sidebar-accent border-none h-9" />
                    </div>
                </div>
                <ScrollArea>
                    <Accordion type="multiple" defaultValue={['examples']} className="w-full px-2">
                        <AccordionItem value="sketchbook" className="border-none">
                            <AccordionTrigger className="hover:no-underline text-base font-medium px-2 py-2 hover:bg-sidebar-accent rounded-md">
                                Sketchbook
                            </AccordionTrigger>
                            <AccordionContent className="pl-4 text-sm">
                                Your sketches will appear here.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="examples" className="border-none">
                            <AccordionTrigger className="hover:no-underline text-base font-medium px-2 py-2 hover:bg-sidebar-accent rounded-md">
                                Examples
                            </AccordionTrigger>
                            <AccordionContent className="pl-2">
                                <Accordion type="single" collapsible className="w-full">
                                    {Object.entries(examples).map(([category, items]) => (
                                        <AccordionItem value={category} key={category} className="border-none">
                                            <AccordionTrigger className="hover:no-underline text-sm font-normal py-1.5 px-2 hover:bg-sidebar-accent rounded-md">
                                                {category}
                                            </AccordionTrigger>
                                            <AccordionContent className="pl-6">
                                                <ul className="space-y-1 py-1">
                                                    {items.map((item) => (
                                                        <li key={item}>
                                                            <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground font-normal">
                                                                {item}
                                                            </Button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </ScrollArea>
            </SidebarContent>
            <SidebarFooter className="p-2 border-t border-sidebar-border space-y-1 mt-auto">
                <Button variant="ghost" className="w-full justify-start gap-2" onClick={onShowLibraries}>
                    <Book className="h-4 w-4" />
                    Library Manager
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2" onClick={onShowBoards}>
                    <CircuitBoard className="h-4 w-4" />
                    Board Manager
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4" />
                    Preferences
                </Button>
            </SidebarFooter>
        </div>
    );
}

function BoardManagerView({ onBack }: { onBack: () => void }) {
    return (
        <div className="flex flex-col h-full">
            <SidebarHeader className="flex items-center p-2 pl-3">
                <Button variant="ghost" size="icon" className="h-8 w-8 mr-2" onClick={onBack}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-lg font-semibold">Board Manager</h2>
            </SidebarHeader>
            <div className="p-2 border-b border-sidebar-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search for boards" className="pl-9 bg-sidebar-accent border-none h-9" />
                </div>
            </div>
            <SidebarContent>
                <ScrollArea className="h-full">
                    <div className="p-2 space-y-2">
                        {boards.map((board, index) => (
                            <div key={index} className="p-2 rounded-md hover:bg-sidebar-accent">
                                <p className="font-medium">{board.name}</p>
                                <p className="text-sm text-muted-foreground">{board.category}</p>
                                <div className="flex gap-2 mt-2">
                                    <Button size="sm" variant="secondary">Install</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </SidebarContent>
        </div>
    )
}

function LibraryManagerView({ onBack }: { onBack: () => void }) {
    return (
        <div className="flex flex-col h-full">
            <SidebarHeader className="flex items-center p-2 pl-3">
                <Button variant="ghost" size="icon" className="h-8 w-8 mr-2" onClick={onBack}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-lg font-semibold">Library Manager</h2>
            </SidebarHeader>
            <div className="p-2 border-b border-sidebar-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search for libraries" className="pl-9 bg-sidebar-accent border-none h-9" />
                </div>
            </div>
            <SidebarContent>
                <ScrollArea className="h-full">
                    <div className="divide-y divide-sidebar-border">
                        {libraries.map((lib, index) => (
                            <div key={index} className="p-3 hover:bg-sidebar-accent">
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
            </SidebarContent>
        </div>
    )
}


export function IdeSidebar() {
    const [view, setView] = useState('sketchbook'); // 'sketchbook', 'boards', 'libraries'

    return (
        <Sidebar className="border-r border-border">
            {view === 'sketchbook' && (
                <SketchbookView
                    onShowBoards={() => setView('boards')}
                    onShowLibraries={() => setView('libraries')}
                />
            )}
            {view === 'boards' && <BoardManagerView onBack={() => setView('sketchbook')} />}
            {view === 'libraries' && <LibraryManagerView onBack={() => setView('sketchbook')} />}
        </Sidebar>
    );
}
