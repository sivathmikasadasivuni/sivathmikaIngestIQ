import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Database,
  Cloud,
  HardDrive,
  CheckCircle,
  Upload,
  Server,
  CloudRain,
  Loader2,
  Folder,
  File,
  X,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getBuckets, getObjects, getAzureContainers, getAzureBlobs } from "@/lib/api";

interface DataUploadCenterStepProps {
  job: any;
}

export default function DataUploadCenterStep({ job }: DataUploadCenterStepProps) {
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [sourceConfig, setSourceConfig] = useState<any>({});
  const [destinationConfig, setDestinationConfig] = useState<any>({ type: "" });
  const [isSourceConnected, setIsSourceConnected] = useState<boolean>(false);
  const [isSourceConnecting, setIsSourceConnecting] = useState<boolean>(false);
  const [isDestConnected, setIsDestConnected] = useState<boolean>(false);
  const [isDestConnecting, setIsDestConnecting] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedSourcePath, setSelectedSourcePath] = useState<string>("");
  const [selectedDestPath, setSelectedDestPath] = useState<string>("");
  const [showSourceBrowser, setShowSourceBrowser] = useState<boolean>(false);
  const [showDestBrowser, setShowDestBrowser] = useState<boolean>(false);
  const [showSourceDBBrowser, setShowSourceDBBrowser] = useState<boolean>(false);
  const [sourceSelectedItem, setSourceSelectedItem] = useState<string | null>(null);
  const [destSelectedItem, setDestSelectedItem] = useState<string | null>(null);
  const [sourceDBSelectedTables, setSourceDBSelectedTables] = useState<string[]>([]);
  const { toast } = useToast();
  const [buckets, setBuckets] = useState<any[]>([]);
  const [objects, setObjects] = useState<any[]>([]);

  const dataSources = [
    { value: "local", label: "Local", icon: HardDrive },
    { value: "s3", label: "S3", icon: Cloud },
    { value: "azure-blob", label: "Azure Blob", icon: CloudRain },
    { value: "database", label: "Database", icon: Server },
  ];

  const destinations = [
    { value: "s3", label: "S3", icon: Cloud },
    { value: "azure-blob", label: "Azure Blob", icon: Database },
    { value: "database", label: "Database", icon: Server },
  ];

  const mockTables = ["customers", "orders", "products", "employees", "departments"];

  useEffect(() => {
    const storedSource = localStorage.getItem('selectedSource');
    const storedDestination = localStorage.getItem('selectedDestination');
    const storedSourcePath = localStorage.getItem('datasource');
    const storedDestPath = localStorage.getItem('datadestination');
    
    if (storedSource) setSelectedSource(storedSource);
    if (storedDestination) setSelectedDestination(storedDestination);
    if (storedSourcePath) {
      setSelectedSourcePath(storedSourcePath);
      setIsSourceConnected(true);
    }
    if (storedDestPath) {
      setSelectedDestPath(storedDestPath);
      setIsDestConnected(true);
    }
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(acceptedFiles);
    const fileNames = acceptedFiles.map((file) => file.name).join(", ");
    setSelectedSourcePath(fileNames);
    setIsSourceConnected(true);
    localStorage.setItem("selectedBucket", "local");
    localStorage.setItem("selectedFile", acceptedFiles[0].name);
    localStorage.setItem("datasource", fileNames);
    localStorage.setItem("selectedSource", "local");
    toast({ title: "Files Uploaded", description: `${acceptedFiles.length} file(s) uploaded successfully` });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const fetchBuckets = async () => {
    try {
      const data = selectedSource === "azure-blob" || selectedDestination === "azure-blob" 
        ? await getAzureContainers() 
        : await getBuckets();
      if (Array.isArray(data)) {
        const formattedBuckets = data.map((name: string) => ({ name }));
        setBuckets(formattedBuckets);
      } else {
        setBuckets([]);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch buckets/containers", variant: "destructive" });
      setBuckets([]);
    }
  };

  const fetchObjects = async (bucketName: string, prefix?: string) => {
    try {
      const data = selectedSource === "azure-blob" || selectedDestination === "azure-blob"
        ? await getAzureBlobs(bucketName, prefix)
        : await getObjects(bucketName, prefix);
      setObjects(data || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch objects", variant: "destructive" });
      setObjects([]);
    }
  };

  const handleS3Navigation = (item: string, isFolder: boolean, type: "source" | "destination") => {
    const config = type === "source" ? sourceConfig : destinationConfig;
    const setConfig = type === "source" ? setSourceConfig : setDestinationConfig;
    const prefix = type === "source" ? selectedSource : selectedDestination;

    if (item === "..") {
      const parts = (config.currentPath || "").split("/").filter((p: string) => p);
      if (parts.length === 0) {
        setConfig((prev: any) => ({ ...prev, bucket: undefined, currentPath: "" }));
        setObjects([]);
      } else {
        parts.pop();
        const newPath = parts.join("/") + (parts.length > 0 ? "/" : "");
        setConfig((prev: any) => ({ ...prev, currentPath: newPath }));
        fetchObjects(config.bucket!, newPath);
      }
    } else if (isFolder) {
      const newPath = (config.currentPath || "") + item;
      setConfig((prev: any) => ({ ...prev, currentPath: newPath }));
      fetchObjects(config.bucket!, newPath);
    } else {
      const fileKey = (config.currentPath || "") + item;
      const fullPath = `${prefix}://${config.bucket}/${fileKey}`;
      
      if (type === "source") {
        setSelectedSourcePath(fullPath);
        setIsSourceConnected(true);
        localStorage.setItem("selectedBucket", config.bucket!);
        localStorage.setItem("selectedFile", fileKey);
        localStorage.setItem("datasource", fullPath);
        localStorage.setItem("selectedSource", prefix);
        setShowSourceBrowser(false);
        toast({ title: "File Selected", description: `Selected: ${fullPath}` });
      } else {
        setSelectedDestPath(fullPath);
        setIsDestConnected(true);
        localStorage.setItem("selectedDestBucket", config.bucket!);
        localStorage.setItem("selectedDestFolder", fileKey);
        localStorage.setItem("datadestination", fullPath);
        localStorage.setItem("selectedDestination", prefix);
        setShowDestBrowser(false);
        toast({ title: "Destination Selected", description: `Selected: ${fullPath}` });
      }
    }
    if (type === "source") setSourceSelectedItem(null);
    else setDestSelectedItem(null);
  };

  const handleSelectBucket = (bucket: string, type: "source" | "destination") => {
    const setConfig = type === "source" ? setSourceConfig : setDestinationConfig;
    setConfig((prev: any) => ({ ...prev, bucket, currentPath: "" }));
    fetchObjects(bucket, "");
    
    if (type === "source") {
      localStorage.setItem("selectedBucket", bucket);
      setSourceSelectedItem(null);
    } else {
      localStorage.setItem("selectedDestBucket", bucket);
      setDestSelectedItem(null);
    }
  };

  const handleConnect = async (type: "source" | "destination") => {
    if (type === "source") {
      if (selectedSource === "local") {
        setShowSourceBrowser(true);
      } else if (selectedSource === "s3" || selectedSource === "azure-blob") {
        setIsSourceConnecting(true);
        try {
          await fetchBuckets();
          setShowSourceBrowser(true);
        } finally {
          setIsSourceConnecting(false);
        }
      } else if (selectedSource === "database") {
        if (!sourceConfig.databaseName || !sourceConfig.username) {
          toast({ title: "Error", description: "Database Name and Username required", variant: "destructive" });
          return;
        }
        setIsSourceConnecting(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShowSourceDBBrowser(true);
        setIsSourceConnecting(false);
      }
    } else {
      if (!selectedSourcePath) {
        toast({ title: "Error", description: "Please select a source file first", variant: "destructive" });
        return;
      }
      if (selectedDestination === "s3" || selectedDestination === "azure-blob") {
        setIsDestConnecting(true);
        try {
          await fetchBuckets();
          setShowDestBrowser(true);
        } finally {
          setIsDestConnecting(false);
        }
      } else if (selectedDestination === "database") {
        if (!destinationConfig.databaseName || !destinationConfig.username) {
          toast({ title: "Error", description: "Database Name and Username required", variant: "destructive" });
          return;
        }
        setIsDestConnecting(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const dbPath = `${selectedDestination}://${destinationConfig.databaseName}`;
        setSelectedDestPath(dbPath);
        setIsDestConnected(true);
        localStorage.setItem("datadestination", dbPath);
        localStorage.setItem("selectedDestination", selectedDestination);
        setIsDestConnecting(false);
        toast({ title: "Connected", description: "Database connection successful" });
      }
    }
  };

  const handleRemoveSource = () => {
    setSelectedSourcePath("");
    setIsSourceConnected(false);
    setSourceConfig({});
    setUploadedFiles([]);
    localStorage.removeItem("selectedFile");
    localStorage.removeItem("selectedBucket");
    localStorage.removeItem("datasource");
  };

  const handleRemoveDest = () => {
    setSelectedDestPath("");
    setIsDestConnected(false);
    setDestinationConfig({ type: selectedDestination });
    localStorage.removeItem("selectedDestFolder");
    localStorage.removeItem("selectedDestBucket");
    localStorage.removeItem("datadestination");
  };

  const Breadcrumbs = ({ type }: { type: "source" | "destination" }) => {
    const config = type === "source" ? sourceConfig : destinationConfig;
    const path = config.currentPath || "";
    const bucketOrContainer = config.bucket;

    return (
      <div className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground mb-2">
        <span
          onClick={() => {
            if (type === "source") {
              setSourceConfig((prev: any) => ({ ...prev, bucket: undefined, currentPath: "" }));
              setObjects([]);
            } else {
              setDestinationConfig((prev: any) => ({ ...prev, bucket: undefined, currentPath: "" }));
              setObjects([]);
            }
          }}
          className="cursor-pointer hover:underline flex items-center"
        >
          <Folder className="w-4 h-4 mr-1" /> Root
        </span>
        {bucketOrContainer && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span
              onClick={() => {
                if (type === "source") {
                  setSourceConfig((prev: any) => ({ ...prev, currentPath: "" }));
                  fetchObjects(bucketOrContainer, "");
                } else {
                  setDestinationConfig((prev: any) => ({ ...prev, currentPath: "" }));
                  fetchObjects(bucketOrContainer, "");
                }
              }}
              className="cursor-pointer hover:underline"
            >
              {bucketOrContainer}
            </span>
          </>
        )}
        {path.split("/").filter((p: string) => p).map((part: string, idx: number) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-4 h-4" />
            <span
              onClick={() => {
                const newPath = path.split("/").slice(0, idx + 1).join("/") + "/";
                if (type === "source") {
                  setSourceConfig((prev: any) => ({ ...prev, currentPath: newPath }));
                  fetchObjects(sourceConfig.bucket!, newPath);
                } else {
                  setDestinationConfig((prev: any) => ({ ...prev, currentPath: newPath }));
                  fetchObjects(destinationConfig.bucket!, newPath);
                }
              }}
              className="cursor-pointer hover:underline"
            >
              {part}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Dialog open={showSourceBrowser && selectedSource === "local"} onOpenChange={setShowSourceBrowser}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Local Files</DialogTitle>
            <DialogDescription>Select files to upload from your local device</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/50"}`}>
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                {isDragActive ? "Drop files here" : "Drag & drop files here, or click to select"}
              </p>
            </div>
            {uploadedFiles.length > 0 && (
              <>
                <div className="border rounded-lg max-h-96 overflow-y-auto">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border-b last:border-b-0">
                      <File className="w-4 h-4" />
                      <div className="flex-1 text-sm truncate">{file.name}</div>
                    </div>
                  ))}
                </div>
                <Button onClick={() => setShowSourceBrowser(false)}>
                  Select {uploadedFiles.length} File{uploadedFiles.length !== 1 ? "s" : ""}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSourceBrowser && (selectedSource === "s3" || selectedSource === "azure-blob")} onOpenChange={setShowSourceBrowser}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Browse {selectedSource === "azure-blob" ? "Azure Containers" : "S3 Buckets"}</DialogTitle>
            <DialogDescription>Select a file from your {selectedSource === "azure-blob" ? "container" : "bucket"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Breadcrumbs type="source" />
            <div className="border rounded-lg max-h-96 overflow-y-auto">
              {!sourceConfig.bucket ? (
                buckets.length > 0 ? (
                  buckets.map((bucket) => (
                    <div
                      key={bucket.name}
                      className={`flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer border-b ${sourceSelectedItem === bucket.name ? "bg-primary/20" : ""}`}
                      onDoubleClick={() => handleSelectBucket(bucket.name, "source")}
                      onClick={() => setSourceSelectedItem(bucket.name)}
                    >
                      <Folder className="w-4 h-4 text-blue-500" />
                      <div className="flex-1 font-medium">{bucket.name}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-muted-foreground">No buckets available</div>
                )
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer border-b" onDoubleClick={() => handleS3Navigation("..", true, "source")}>
                    <Folder className="w-4 h-4" />
                    <div>..</div>
                  </div>
                  {objects.length > 0 ? (
                    objects.map((obj) => {
                      const isFolder = obj.isFolder || obj.key.endsWith("/");
                      return (
                        <div
                          key={obj.key}
                          className={`flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer border-b ${sourceSelectedItem === obj.key ? "bg-primary/20" : ""}`}
                          onDoubleClick={() => handleS3Navigation(obj.key, isFolder, "source")}
                          onClick={() => setSourceSelectedItem(obj.key)}
                        >
                          {isFolder ? <Folder className="w-4 h-4 text-blue-500" /> : <File className="w-4 h-4" />}
                          <div className="flex-1">{obj.key.split("/").pop() || obj.key}</div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-3 text-center text-muted-foreground">No files available</div>
                  )}
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDestBrowser} onOpenChange={setShowDestBrowser}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Browse {selectedDestination === "azure-blob" ? "Azure Containers" : "S3 Buckets"}</DialogTitle>
            <DialogDescription>Select destination location</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Breadcrumbs type="destination" />
            <div className="border rounded-lg max-h-96 overflow-y-auto">
              {!destinationConfig.bucket ? (
                buckets.map((bucket) => (
                  <div
                    key={bucket.name}
                    className={`flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer border-b ${destSelectedItem === bucket.name ? "bg-primary/20" : ""}`}
                    onDoubleClick={() => handleSelectBucket(bucket.name, "destination")}
                    onClick={() => setDestSelectedItem(bucket.name)}
                  >
                    <Folder className="w-4 h-4 text-blue-500" />
                    <div>{bucket.name}</div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer border-b" onDoubleClick={() => handleS3Navigation("..", true, "destination")}>
                    <Folder className="w-4 h-4" />
                    <div>..</div>
                  </div>
                  {objects.map((obj) => {
                    const isFolder = obj.isFolder || obj.key.endsWith("/");
                    return (
                      <div
                        key={obj.key}
                        className={`flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer border-b ${destSelectedItem === obj.key ? "bg-primary/20" : ""}`}
                        onDoubleClick={() => handleS3Navigation(obj.key, isFolder, "destination")}
                        onClick={() => setDestSelectedItem(obj.key)}
                      >
                        {isFolder ? <Folder className="w-4 h-4 text-blue-500" /> : <File className="w-4 h-4" />}
                        <div>{obj.key}</div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSourceDBBrowser} onOpenChange={setShowSourceDBBrowser}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Browse Database Tables</DialogTitle>
            <DialogDescription>Select tables from {sourceConfig.databaseName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border rounded-lg max-h-96 overflow-y-auto">
              {mockTables.map((table) => (
                <div key={table} className="flex items-center gap-3 p-3 border-b">
                  <Checkbox
                    checked={sourceDBSelectedTables.includes(table)}
                    onCheckedChange={(checked) => {
                      if (checked) setSourceDBSelectedTables((prev) => [...prev, table]);
                      else setSourceDBSelectedTables((prev) => prev.filter((t) => t !== table));
                    }}
                  />
                  <Database className="w-4 h-4" />
                  <div>{table}</div>
                </div>
              ))}
            </div>
            <Button
              onClick={() => {
                if (sourceDBSelectedTables.length > 0) {
                  const fullPath = `database://${sourceConfig.databaseName}/${sourceDBSelectedTables.join(",")}`;
                  setSelectedSourcePath(fullPath);
                  setIsSourceConnected(true);
                  localStorage.setItem("selectedBucket", sourceConfig.databaseName!);
                  localStorage.setItem("selectedFile", sourceDBSelectedTables.join(","));
                  localStorage.setItem("datasource", fullPath);
                  localStorage.setItem("selectedSource", "database");
                  setShowSourceDBBrowser(false);
                  setSourceDBSelectedTables([]);
                  toast({ title: "Tables Selected", description: `Selected ${sourceDBSelectedTables.length} table(s)` });
                }
              }}
              disabled={sourceDBSelectedTables.length === 0}
            >
              Select {sourceDBSelectedTables.length} Table{sourceDBSelectedTables.length !== 1 ? "s" : ""}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Source</CardTitle>
            <CardDescription>Select and configure your data source</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Data Source</Label>
              <Select value={selectedSource} onValueChange={(val) => { setSelectedSource(val); localStorage.setItem("selectedSource", val); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {dataSources.map((s) => {
                    const Icon = s.icon;
                    return (
                      <SelectItem key={s.value} value={s.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {s.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            {selectedSource === "database" && (
              <div className="space-y-4">
                <Input
                  placeholder="Database Name"
                  value={sourceConfig.databaseName || ""}
                  onChange={(e) => setSourceConfig((prev: any) => ({ ...prev, databaseName: e.target.value }))}
                />
                <Input
                  placeholder="Username"
                  value={sourceConfig.username || ""}
                  onChange={(e) => setSourceConfig((prev: any) => ({ ...prev, username: e.target.value }))}
                />
              </div>
            )}
            {selectedSource && (
              <Button onClick={() => handleConnect("source")} disabled={isSourceConnecting} className="w-full">
                {isSourceConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  "Connect to Source"
                )}
              </Button>
            )}
            {selectedSourcePath && (
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm truncate">{selectedSourcePath}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleRemoveSource}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Destination</CardTitle>
            <CardDescription>Select and configure your destination</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Destination</Label>
              <Select value={selectedDestination} onValueChange={(val) => { setSelectedDestination(val); localStorage.setItem("selectedDestination", val); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((d) => {
                    const Icon = d.icon;
                    return (
                      <SelectItem key={d.value} value={d.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {d.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            {selectedDestination === "database" && (
              <div className="space-y-4">
                <Input
                  placeholder="Database Name"
                  value={destinationConfig.databaseName || ""}
                  onChange={(e) => setDestinationConfig((prev: any) => ({ ...prev, databaseName: e.target.value }))}
                />
                <Input
                  placeholder="Username"
                  value={destinationConfig.username || ""}
                  onChange={(e) => setDestinationConfig((prev: any) => ({ ...prev, username: e.target.value }))}
                />
              </div>
            )}
            {selectedDestination && (
              <Button onClick={() => handleConnect("destination")} disabled={isDestConnecting} className="w-full">
                {isDestConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  "Connect to Destination"
                )}
              </Button>
            )}
            {selectedDestPath && (
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm truncate">{selectedDestPath}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleRemoveDest}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isSourceConnected && isDestConnected && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              Configuration Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-1">Source</h4>
                <p className="text-muted-foreground break-all">{selectedSourcePath}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Destination</h4>
                <p className="text-muted-foreground break-all">{selectedDestPath}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}