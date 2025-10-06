import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Database, FileText, Settings, CheckCircle, AlertCircle, Clock, Target, Filter, Calendar, ArrowLeft } from 'lucide-react';

// Import your existing step components
import BusinessLogicStep01 from "./steps01/BusinessLogicStep01";
import ScheduleStep01 from "./steps01/ScheduleStep01";
import CompactDataUploadStep from "./steps/CompactDataUploadStep";

interface JobStage {
  id: string;
  name: string;
  type: string;
  status: string;
  description?: string;
  config?: Record<string, any>;
}

interface StageConfigDialogProps {
  stage: JobStage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (stage: JobStage) => void;
  job?: any;
}

// Map stage types to your step components
const stageTypeInfo = {
  upload_center: { 
    icon: Database, 
    color: '#3b82f6', 
    label: 'Data Upload Center',
    description: 'Configure data source and destination settings',
    component: CompactDataUploadStep
  },
  loading: { 
    icon: Target, 
    color: '#10b981', 
    label: 'Schema Analysis',
    description: 'Analyze schema of the data',
    component: () => <Card><CardContent className="p-4 text-center text-muted-foreground">Click on save configuration to run this step.</CardContent></Card>
  },
  validation: { 
    icon: Filter, 
    color: '#f59e0b', 
    label: 'DQ Rules',
    description: 'Validate data quality and consistency',
    component: () => <Card><CardContent className="p-4 text-center text-muted-foreground">Click on save configuration to run this step.</CardContent></Card>
  },
  processing: { 
    icon: Settings, 
    color: '#ef4444', 
    label: 'NER',
    description: 'Named Entity Recognition processing',
    component: () => <Card><CardContent className="p-4 text-center text-muted-foreground">Click on save configuration to run this step.</CardContent></Card>
  },
  collection: { 
    icon: Database, 
    color: '#6b7280', 
    label: 'Business Logic',
    description: 'Apply business logic to collected data',
    component: BusinessLogicStep01
  },
  connection: { 
    icon: Database, 
    color: '#3b82f6', 
    label: 'Data Transformations',
    description: 'Extract, Transform, Load processes',
    component: () => <Card><CardContent className="p-4 text-center text-muted-foreground">Click on save configuration to run this step.</CardContent></Card>
  },
  transfer: { 
    icon: Target, 
    color: '#10b981', 
    label: 'Schedule Jobs',
    description: 'Schedule automated job runs',
    component: ScheduleStep01
  },
};

export default function StageConfigDialog({ 
  stage, 
  open, 
  onOpenChange, 
  onSave,
  job
}: StageConfigDialogProps) {
  const [stageConfig, setStageConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    if (stage) {
      setStageConfig(stage.config || {});
    }
  }, [stage]);

  const handleSave = () => {
    const updatedStage: JobStage = {
      ...stage,
      config: stageConfig,
    };
    onSave(updatedStage);
    switch (stage.type) {
      case 'loading':
        localStorage.setItem('schema', 'used');
        break;
      case 'validation':
        localStorage.setItem('rules', 'used');
        break;
      case 'processing':
        localStorage.setItem('ner', 'used');
        break;
      case 'collection':
        localStorage.setItem('businesslogic', 'used');
        break;
      case 'connection':
        localStorage.setItem('datatransformations', 'executed');
        break;
      default:
        break;
    }
  };

  const handleCancel = () => {
    switch (stage.type) {
      case 'loading':
        localStorage.setItem('schema', 'skipped');
        break;
      case 'validation':
        localStorage.setItem('rules', 'skipped');
        break;
      case 'processing':
        localStorage.setItem('ner', 'skipped');
        break;
      case 'collection':
        localStorage.setItem('businesslogic', 'skipped');
        break;
      case 'connection':
        localStorage.setItem('datatransformations', 'skipped');
        break;
      default:
        break;
    }
    onOpenChange(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'running': return <Play className="w-5 h-5 text-blue-500" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

const renderStageSpecificConfig = () => {
  const typeInfo = stageTypeInfo[stage.type as keyof typeof stageTypeInfo];
  
  if (!typeInfo?.component) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Unknown Stage Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Configuration for stage type "{stage.type}" is not available.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle each stage type explicitly with correct props
  if (stage.type === 'upload_center') {
    return (
      <CompactDataUploadStep
        config={stageConfig}
        onConfigChange={setStageConfig}
        jobDatasource={job?.datasource}
        jobDatadestination={job?.datadestination}
      />
    );
  }
  
  if (stage.type === 'collection') {
    return (
      <BusinessLogicStep01 
        job={job ?? null}
      />
    );
  }
  if (stage.type === 'transfer') {
    const scheduleJob = job ? { id: job.id, name: job.name } : { id: stage.id, name: stage.name };
    return (
      <ScheduleStep01 
        job={scheduleJob}
      />
    );
  }
  
  // // For placeholder components ONLY (loading, validation, processing, connection)
  // if (stage.type === 'loading' || stage.type === 'validation' || 
  //     stage.type === 'processing' || stage.type === 'connection') {
  //   const StageConfigComponent = typeInfo.component;
  //   return <StageConfigComponent />;
  // }

  // Fallback
  return (
    <Card>
      <CardContent className="p-4 text-center text-muted-foreground">
        Configuration not available for this stage type.
      </CardContent>
    </Card>
  );
};

  const typeInfo = stageTypeInfo[stage.type as keyof typeof stageTypeInfo] || {
    icon: Settings,
    color: '#6b7280',
    label: 'Unknown Stage',
    description: 'Unknown stage type',
    component: null
  };
  const TypeIcon = typeInfo.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${typeInfo.color}20` }}
            >
              <TypeIcon className="w-5 h-5" style={{ color: typeInfo.color }} />
            </div>
            Configure Stage: {stage.name}
          </DialogTitle>
          {/* Back to Flow Button */}
          <div className="flex justify-start pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Flow
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stage Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stage Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Stage Type</div>
                  <p className="font-medium">{typeInfo.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">{typeInfo.description}</p>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Current Status</div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(stage.status)}
                    <Badge className={`${stage.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      stage.status === 'running' ? 'bg-blue-100 text-blue-800' : 
                      stage.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                      {stage.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stage-Specific Configuration */}
          {renderStageSpecificConfig()}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}