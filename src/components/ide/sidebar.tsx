'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Book, CircuitBoard, Cuboid, LifeBuoy, Settings, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const examples = {
  '01.Basics': ['BareMinimum', 'Blink', 'DigitalReadSerial', 'AnalogReadSerial', 'Fade'],
  '02.Digital': ['BlinkWithoutDelay', 'Button', 'Debounce', 'StateChangeDetection'],
  '03.Analog': ['AnalogInOutSerial', 'AnalogInput', 'AnalogWriteMega', 'Calibration'],
  '04.Communication': ['ASCIITable', 'Graph', 'Midi', 'MultiSerialMega'],
};

export function IdeSidebar() {
  return (
    <Sidebar className="border-r border-border">
        <SidebarHeader className="flex items-center justify-between p-2 pl-4">
            <h2 className="text-lg font-semibold">Sketchbook</h2>
            <SidebarTrigger />
        </SidebarHeader>
      <SidebarContent className="p-0">
        <div className="p-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input placeholder="Filter your sketches" className="pl-9 bg-sidebar-accent border-none h-9" />
            </div>
        </div>
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
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Book className="h-4 w-4" />
            Library Manager
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <CircuitBoard className="h-4 w-4" />
            Board Manager
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
