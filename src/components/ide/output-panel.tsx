'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

const outputLog = `Sketch uses 928 bytes (2%) of program storage space. Maximum is 32256 bytes.
Global variables use 9 bytes (0%) of dynamic memory, leaving 2039 bytes for local variables. Maximum is 2048 bytes.
`;
const initialSerialLog = `13:37:01.001 -> Serial Monitor Started\n`;

export function IdeOutputPanel() {
    const [activeTab, setActiveTab] = useState("output");
    
    return (
        <div className="bg-card border-t border-border">
            <Tabs defaultValue="output" onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="flex justify-between items-center border-b border-border h-10 shrink-0">
                    <TabsList className="bg-card rounded-none justify-start p-0 h-full">
                        <TabsTrigger value="output" className="data-[state=active]:bg-background data-[state=active]:shadow-none rounded-none border-r border-border h-full px-4">Output</TabsTrigger>
                        <TabsTrigger value="serial" className="data-[state=active]:bg-background data-[state=active]:shadow-none rounded-none border-r border-border h-full px-4">Serial Monitor</TabsTrigger>
                    </TabsList>
                    {activeTab === 'serial' && (
                         <div className="flex items-center gap-2 px-4">
                            <Select defaultValue="9600">
                                <SelectTrigger className="w-28 h-7 text-xs bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="9600">9600 baud</SelectItem>
                                    <SelectItem value="115200">115200 baud</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-auto">
                    <ScrollArea className="h-full">
                        <TabsContent value="output" className="mt-0 p-4">
                            <pre className="font-code text-xs text-muted-foreground whitespace-pre-wrap">{outputLog}</pre>
                        </TabsContent>
                        <TabsContent value="serial" className="mt-0 p-4">
                            <pre className="font-code text-xs text-foreground whitespace-pre-wrap">{initialSerialLog}</pre>
                        </TabsContent>
                    </ScrollArea>
                </div>
                
                {activeTab === 'serial' && (
                    <div className="flex items-center gap-2 border-t border-border p-2 shrink-0">
                        <Input placeholder="Message" className="bg-background"/>
                        <Button>Send</Button>
                    </div>
                )}
            </Tabs>
        </div>
    );
}
