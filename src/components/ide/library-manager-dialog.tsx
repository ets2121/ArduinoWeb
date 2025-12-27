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
import { useState } from 'react';
import { useCli } from '@/hooks/use-cli';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useToast } from '@/hooks/use-toast';

interface LibraryRelease {
  author: string;
  version: string;
  maintainer: string;
  sentence: string;
  paragraph: string;
}

interface SearchedLibrary {
  name: string;
  latest: LibraryRelease;
}

interface LibrarySearchResult {
  libraries: SearchedLibrary[];
}

interface InstalledLibraryInfo {
  name: string;
  version: string;
  author: string;
  maintainer: string;
}

interface InstalledLibrary {
  library: InstalledLibraryInfo;
}

interface InstalledLibrariesResponse {
  installed_libraries: InstalledLibrary[];
}

export function LibraryManagerDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: searchData, error: searchError, isLoading: isSearching } = useCli<LibrarySearchResult>(
    searchTerm ? ['lib', 'search', searchTerm, 'format=json'] : null
  );

  const { data: installedData, error: installedError, isLoading: isLoadingInstalled, mutate: refreshInstalled } = useCli<InstalledLibrariesResponse>(
    ['lib', 'list', 'format=json'],
    { revalidateOnFocus: true }
  );

  const handleInstall = async (libName: string) => {
    toast({ title: `Installing ${libName}...`, description: 'This may take a moment.' });
    try {
      const response = await fetch(`/api/cli/lib/install/${libName}`);
      const result = await response.text();
      if (!response.ok) {
        try {
          const errorData = JSON.parse(result);
          throw new Error(errorData.error || 'Installation failed');
        } catch (e) {
          throw new Error(result || 'Installation failed');
        }
      }
      toast({ title: 'Installation Complete', description: result });
      refreshInstalled();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleRemove = async (libName: string) => {
    toast({ title: `Removing ${libName}...` });
    try {
      const response = await fetch(`/api/cli/lib/uninstall/${libName}`);
      const result = await response.text();
      if (!response.ok) {
        try {
          const errorData = JSON.parse(result);
          throw new Error(errorData.error || 'Removal failed');
        } catch (e) {
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
    <div className="divide-y divide-border p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-3">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-9 w-20 ml-4 shrink-0" />
          </div>
          <Skeleton className="h-3 w-1/4 mt-2" />
        </div>
      ))}
    </div>
  );

  const installedLibraries = installedData?.installed_libraries || [];
  const searchedLibraries = searchData?.libraries || [];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl h-3/4 flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Library Manager</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="search" className="flex flex-col flex-1 h-full overflow-hidden">
          <div className="px-6 mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="installed">Installed</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="search" className="flex-1 flex flex-col mt-0 overflow-hidden">
            <div className="p-2 border-b border-t border-border mt-2 shrink-0">
              <div className="relative px-4">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for libraries (e.g., 'servo')"
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
              {searchData && 'libraries' in searchData && (
                <div className="divide-y divide-border p-4">
                  {searchedLibraries.map((lib, index) => (
                    <div key={index} className="p-3 hover:bg-accent">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{lib.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {lib.latest.sentence || `By ${lib.latest.author}`}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="ml-4 shrink-0"
                          onClick={() => handleInstall(lib.name)}
                        >
                          Install
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Version {lib.latest.version}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {searchData && searchedLibraries.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">No libraries found.</div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="installed" className="flex-1 mt-0 overflow-hidden">
            <ScrollArea className="h-full">
              {isLoadingInstalled && renderSkeletons()}
              {installedError && (
                <Alert variant="destructive" className="m-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{installedError.message}</AlertDescription>
                </Alert>
              )}
              {installedData && 'installed_libraries' in installedData && (
                <div className="divide-y divide-border p-4">
                  {installedLibraries.map((item, index) => (
                    <div key={index} className="p-3 hover:bg-accent">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.library.name}</p>
                          <p className="text-sm text-muted-foreground">
                            By {item.library.author || item.library.maintainer}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-4 shrink-0"
                          onClick={() => handleRemove(item.library.name)}
                        >
                          Remove
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Version {item.library.version}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {installedData && installedLibraries.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">No libraries installed.</div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
