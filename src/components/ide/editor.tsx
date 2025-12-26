'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const blinkSketch = `/*
  Blink

  Turns an LED on for one second, then off for one second, repeatedly.

  Most Arduinos have an on-board LED you can control. On the UNO, MEGA and ZERO
  it is attached to digital pin 13, on MKR1000 on pin 6. LED_BUILTIN is set to
  the correct LED pin independent of the board used.
  If you want to know what pin the on-board LED is connected to on your Arduino
  model, check the Technical Specs of your board at:
  https://www.arduino.cc/en/Main/Products

  This example code is in the public domain.
*/

// the setup function runs once when you press reset or power the board
void setup() {
  // initialize digital pin LED_BUILTIN as an output.
  pinMode(LED_BUILTIN, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
  digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(1000);                       // wait for a second
  digitalWrite(LED_BUILTIN, LOW);    // turn the LED off by making the voltage LOW
  delay(1000);                       // wait for a second
}
`;

export function IdeEditor() {
    return (
        <div className="bg-card overflow-hidden h-full">
            <Tabs defaultValue="sketch_24a" className="h-full flex flex-col">
                <TabsList className="bg-background rounded-none justify-start border-b border-border p-0 h-10">
                    <TabsTrigger value="sketch_24a" className="data-[state=active]:bg-card data-[state=active]:shadow-none rounded-none border-r border-border h-full flex gap-2">
                        <span>sketch_24a.ino</span>
                        <Button asChild variant="ghost" size="icon" className="h-5 w-5 rounded-full hover:bg-muted" onClick={(e) => e.stopPropagation()}>
                            <div><X className="h-3 w-3"/></div>
                        </Button>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="sketch_24a" className="flex-1 mt-0">
                    <Textarea
                        className="h-full w-full resize-none border-none rounded-none bg-card p-4 font-code text-[15px] leading-relaxed focus-visible:ring-0"
                        defaultValue={blinkSketch}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
