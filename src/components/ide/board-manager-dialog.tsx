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
import { useCli } from '@/hooks/use-cli';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface SearchedPlatform {
  id: string;
  name?: string;
  releases: {
    [version: string]: {
      name: string;
    };
  };
  latest_version: string;
}

interface CoreSearchResult {
  platforms: SearchedPlatform[];
}


interface InstalledPlatform {
  id: string;
  installed_version: string;
  latest_version: string;
  name?: string; 
}


interface InstalledCoreResponse {
  platforms: InstalledPlatform[];
}


export function BoardManagerDialog({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: searchResults, error: searchError, isLoading: isSearching } = useCli<CoreSearchResult>(
    searchTerm ? ['core', 'search', searchTerm, '--format', 'json'] : null
  );
  
  const { data: installedData, error: installedError, isLoading: isLoadingInstalled, mutate: refreshInstalled } = useCli<InstalledCoreResponse>(
    ['core', 'list', '--format', 'json'],
    { revalidateOnFocus: true }
  );

  const handleInstall = async (coreId: string) => {
    toast({ title: `Installing ${coreId}...`, description: 'This may take a moment.' });
    try {
      const response = await fetch(`/api/cli/core/install/${coreId}`);
      const result = await response.text();
       if (!response.ok) {
        try {
          const errorData = JSON.parse(result);
          throw new Error(errorData.error || 'Installation failed');
        } catch(e) {
          throw new Error(result || 'Installation failed');
        }
      }
      toast({ title: 'Installation Complete', description: result });
      refreshInstalled();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleRemove = async (coreId: string) => {
    toast({ title: `Removing ${coreId}...` });
    try {
      const response = await fetch(`/api/cli/core/uninstall/${coreId}`);
      const result = await response.text();
       if (!response.ok) {
        try {
          const errorData = JSON.parse(result);
          throw new Error(errorData.error || 'Removal failed');
        } catch(e) {
          throw new Error(result || 'Removal failed');
        }
      }
      toast({ title: 'Removal Complete', description: result });
      refreshInstalled();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const renderSkeletons = () => (
    <div className="p-2 space-y-2 mx-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-3 rounded-md flex justify-between items-center">
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-9 w-20" />
        </div>
      ))}
    </div>
  );

  const installedCores = installedData?.platforms || [];
  const searchedPlatforms = searchResults?.platforms || [];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl h-3/4 flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Board Manager</DialogTitle>
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
                      placeholder="Search for boards (e.g., 'avr')"
                      className="pl-9 bg-background border-border h-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <ScrollArea className="flex-1">
              {isSearching && renderSkeletons()}
              {searchError && (
                <Alert variant="destructive" className="m-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{searchError.message}</AlertDescription>
                </Alert>
              )}
              {searchResults && (
                <div className="p-2 space-y-2">
                  {searchedPlatforms.map((platform, index) => (
                    <div key={index} className="p-3 rounded-md hover:bg-accent mx-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{platform.releases[platform.latest_version]?.name || platform.id}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {platform.id}
                          </p>
                        </div>
                        <Button size="sm" variant="secondary" onClick={() => handleInstall(platform.id)}>
                          Install
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
               {searchResults && searchedPlatforms.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">No cores found.</div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="installed" className="flex-1 mt-0">
             <ScrollArea className="h-full">
              {isLoadingInstalled && renderSkeletons()}
              {installedError && (
                 <Alert variant="destructive" className="m-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{installedError.message}</AlertDescription>
                </Alert>
              )}
              {installedData && (
                <div className="p-6 pt-2">
                  {installedCores.map((core, index) => (
                    <div key={index} className="p-3 rounded-md hover:bg-accent">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{core.name || core.id}</p>
                          <p className="text-sm text-muted-foreground">
                            Version {core.installed_version}
                          </p>
                        </div>
                         <Button size="sm" variant="outline" onClick={() => handleRemove(core.id)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {installedData && installedCores.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">No cores installed.</div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
