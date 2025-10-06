// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Plus, X, GripVertical, Play, Database, FileText, Settings, CheckCircle, AlertCircle, Clock, Target, Filter, Calendar } from 'lucide-react';
// import { useToast } from "@/hooks/use-toast";
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import {
//   useSortable,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import StageConfigDialog from './StageConfigDialog';

// interface JobStage {
//   id: string;
//   name: string;
//   type: string;
//   status: string;
//   description?: string;
//   config?: Record<string, any>;
// }

// interface Job {
//   id: string;
//   name: string;
//   category: string;
//   lastRun: string;
//   status: string;
//   description?: string;
//   isConnected?: boolean;
//   stages?: JobStage[];
// }

// interface EnhancedEditJobDialogProps {
//   job: Job | null;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSave: (jobId: string, stages: JobStage[]) => void;
// }

// // Updated available steps to match stage types from Jobs.tsx
// const availableSteps = [
//   { id: 'extraction', name: 'Extract Data', icon: Database, color: '#3b82f6', description: 'Extract data from source systems' },
//   { id: 'transformation', name: 'Transform Data', icon: Settings, color: '#8b5cf6', description: 'Apply business rules and transformations' },
//   { id: 'loading', name: 'Load Data', icon: Target, color: '#10b981', description: 'Load processed data into target system' },
//   { id: 'validation', name: 'Data Validation', icon: Filter, color: '#f59e0b', description: 'Validate data quality and consistency' },
//   { id: 'processing', name: 'Data Processing', icon: Settings, color: '#ef4444', description: 'Process data for analytics or reporting' },
//   { id: 'collection', name: 'Data Collection', icon: Database, color: '#6b7280', description: 'Collect data from various sources' },
//   { id: 'connection', name: 'Source Connection', icon: Database, color: '#3b82f6', description: 'Connect to source database' },
//   { id: 'transfer', name: 'Data Transfer', icon: Target, color: '#10b981', description: 'Transfer data to target system' },
// ];

// function DraggableStepItem({ step }: { step: typeof availableSteps[0] }) {
//   const StepIcon = step.icon;
  
//   return (
//     <Card 
//       className="cursor-grab hover:shadow-md transition-all border-l-4 active:cursor-grabbing"
//       style={{ borderLeftColor: step.color }}
//       draggable
//       onDragStart={(e) => {
//         e.dataTransfer.setData('application/json', JSON.stringify({
//           type: 'new-step',
//           step: step
//         }));
//       }}
//     >
//       <CardContent className="p-3">
//         <div className="flex items-center gap-3">
//           <GripVertical className="w-4 h-4 text-muted-foreground" />
//           <div 
//             className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
//             style={{ backgroundColor: `${step.color}20` }}
//           >
//             <StepIcon className="w-4 h-4" style={{ color: step.color }} />
//           </div>
//           <div className="flex-1 min-w-0">
//             <h4 className="font-medium text-sm">{step.name}</h4>
//             <p className="text-xs text-muted-foreground truncate">
//               {step.description}
//             </p>
//           </div>
//           <Plus className="w-4 h-4 text-muted-foreground" />
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function SortableStageItem({ stage, index, onEdit, onDelete }: {
//   stage: JobStage;
//   index: number;
//   onEdit: (stage: JobStage) => void;
//   onDelete: (stageId: string) => void;
// }) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id: stage.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.5 : 1,
//   };

//   const stepInfo = availableSteps.find(step => step.id === stage.type);
//   const StepIcon = stepInfo?.icon || Settings;

//   const getStatusIcon = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
//       case 'running': return <Play className="w-4 h-4 text-blue-500" />;
//       case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
//       default: return <Clock className="w-4 h-4 text-gray-500" />;
//     }
//   };

//   return (
//     <div className="relative">
//       <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium z-10">
//         {index + 1}
//       </div>
//       <Card
//         ref={setNodeRef}
//         className="cursor-pointer hover:shadow-md transition-all border-l-4 ml-4"
//         style={{
//           ...style,
//           borderLeftColor: stepInfo?.color || '#e5e7eb'
//         }}
//         onClick={() => onEdit(stage)}
//       >
//         <CardContent className="p-4">
//           <div className="flex items-center gap-3">
//             <div
//               {...attributes}
//               {...listeners}
//               className="cursor-grab hover:cursor-grabbing"
//             >
//               <GripVertical className="w-4 h-4 text-muted-foreground" />
//             </div>
            
//             <div 
//               className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
//               style={{ backgroundColor: `${stepInfo?.color}20` }}
//             >
//               <StepIcon className="w-5 h-5" style={{ color: stepInfo?.color }} />
//             </div>
            
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2 mb-1">
//                 <h4 className="font-medium text-sm truncate">{stage.name}</h4>
//                 {getStatusIcon(stage.status)}
//               </div>
//               <p className="text-xs text-muted-foreground capitalize">
//                 {stage.type.replace('_', ' ')}
//               </p>
//               {stage.description && (
//                 <p className="text-xs text-muted-foreground mt-1 truncate">
//                   {stage.description}
//                 </p>
//               )}
//             </div>

//             <div className="flex items-center gap-2">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="w-6 h-6 p-0 hover:bg-red-100"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onDelete(stage.id);
//                 }}
//               >
//                 <X className="w-3 h-3" />
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// function DropZone({ index, onDrop }: { index: number; onDrop: (index: number, data: any) => void }) {
//   const [isOver, setIsOver] = useState(false);

//   return (
//     <div
//       className={`h-8 flex items-center justify-center transition-all ${
//         isOver ? 'bg-primary/10 border-2 border-dashed border-primary' : 'border-2 border-dashed border-transparent'
//       }`}
//       onDragOver={(e) => {
//         e.preventDefault();
//         setIsOver(true);
//       }}
//       onDragLeave={() => setIsOver(false)}
//       onDrop={(e) => {
//         e.preventDefault();
//         setIsOver(false);
//         const data = JSON.parse(e.dataTransfer.getData('application/json'));
//         onDrop(index, data);
//       }}
//     >
//       {isOver && (
//         <div className="text-xs text-primary font-medium">Drop here to insert</div>
//       )}
//     </div>
//   );
// }

// export default function EnhancedEditJobDialog({ 
//   job, 
//   open, 
//   onOpenChange, 
//   onSave 
// }: EnhancedEditJobDialogProps) {
//   const { toast } = useToast();
//   const [stages, setStages] = useState<JobStage[]>([]);
//   const [selectedStage, setSelectedStage] = useState<JobStage | null>(null);
//   const [stageConfigDialogOpen, setStageConfigDialogOpen] = useState(false);

//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   useEffect(() => {
//     if (job) {
//       setStages(job.stages || []);
//     }
//   }, [job]);

//   // Filter available steps to exclude those already used in stages
//   const filteredAvailableSteps = availableSteps.filter(
//     step => !stages.some(stage => stage.type === step.id)
//   );

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;

//     if (active.id !== over?.id) {
//       setStages((items) => {
//         const oldIndex = items.findIndex((item) => item.id === active.id);
//         const newIndex = items.findIndex((item) => item.id === over?.id);

//         return arrayMove(items, oldIndex, newIndex);
//       });
//     }
//   };

//   const handleDropAtPosition = (index: number, data: any) => {
//     if (data.type === 'new-step') {
//       const newStage: JobStage = {
//         id: `stage_${Date.now()}`,
//         name: data.step.name,
//         type: data.step.id,
//         status: 'pending',
//         description: data.step.description,
//         config: {}
//       };
      
//       setStages(prev => {
//         const newStages = [...prev];
//         newStages.splice(index, 0, newStage);
//         return newStages;
//       });
      
//       toast({
//         title: "Stage Added",
//         description: `${data.step.name} has been added to position ${index + 1}`,
//       });
//     }
//   };

//   const addStepToEnd = (step: typeof availableSteps[0]) => {
//     const newStage: JobStage = {
//       id: `stage_${Date.now()}`,
//       name: step.name,
//       type: step.id,
//       status: 'pending',
//       description: step.description,
//       config: {}
//     };
//     setStages(prev => [...prev, newStage]);
    
//     toast({
//       title: "Stage Added",
//       description: `${step.name} has been added to the job`,
//     });
//   };

//   const handleEditStage = (stage: JobStage) => {
//     setSelectedStage(stage);
//     setStageConfigDialogOpen(true);
//   };

//   const handleDeleteStage = (stageId: string) => {
//     setStages(prev => prev.filter(stage => stage.id !== stageId));
//   };

//   const handleSaveStageConfig = (updatedStage: JobStage) => {
//     setStages(prev => prev.map(stage => 
//       stage.id === updatedStage.id ? updatedStage : stage
//     ));
//     setStageConfigDialogOpen(false);
//     setSelectedStage(null);
//   };

//   const handleSave = () => {
//     if (!job) return;
//     onSave(job.id, stages);
//   };

//   if (!job) return null;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
//         <DialogHeader>
//           <DialogTitle>Edit Job Stages: {job.name}</DialogTitle>
//         </DialogHeader>

//         <div className="flex-1 flex gap-6 overflow-hidden">
//           {/* Left Panel - Available Steps */}
//           <div className="w-80 flex flex-col">
//             <h3 className="font-semibold mb-4">Available Steps</h3>
//             <div className="flex-1 overflow-y-auto space-y-2">
//               {filteredAvailableSteps.length === 0 ? (
//                 <div className="text-center py-6">
//                   <p className="text-muted-foreground">All available steps have been added</p>
//                 </div>
//               ) : (
//                 filteredAvailableSteps.map((step) => (
//                   <div key={step.id} onClick={() => addStepToEnd(step)}>
//                     <DraggableStepItem step={step} />
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Right Panel - Job Stage Pipeline */}
//           <div className="flex-1 border-l pl-6 flex flex-col">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="font-semibold">Job Stage Pipeline ({stages.length} stages)</h3>
//               <div className="text-sm text-muted-foreground">
//                 Drag to reorder • Click to configure
//               </div>
//             </div>
            
//             <div className="flex-1 overflow-y-auto">
//               {stages.length === 0 ? (
//                 <div className="flex items-center justify-center h-full border-2 border-dashed border-muted-foreground/25 rounded-lg">
//                   <div className="text-center">
//                     <Database className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
//                     <p className="text-muted-foreground mb-2">No stages added</p>
//                     <p className="text-sm text-muted-foreground">Drag steps from the left panel to build your pipeline</p>
//                   </div>
//                 </div>
//               ) : (
//                 <DndContext
//                   sensors={sensors}
//                   collisionDetection={closestCenter}
//                   onDragEnd={handleDragEnd}
//                 >
//                   <SortableContext items={stages.map(s => s.id)} strategy={verticalListSortingStrategy}>
//                     <div className="space-y-1">
//                       <DropZone index={0} onDrop={handleDropAtPosition} />
//                       {stages.map((stage, index) => (
//                         <div key={stage.id}>
//                           <SortableStageItem
//                             stage={stage}
//                             index={index}
//                             onEdit={handleEditStage}
//                             onDelete={handleDeleteStage}
//                           />
//                           <DropZone index={index + 1} onDrop={handleDropAtPosition} />
//                         </div>
//                       ))}
//                     </div>
//                   </SortableContext>
//                 </DndContext>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end gap-2 pt-4 border-t">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSave}>
//             Save Changes
//           </Button>
//         </div>

//         {/* Stage Configuration Dialog */}
//         {selectedStage && (
//           <StageConfigDialog
//             stage={selectedStage}
//             open={stageConfigDialogOpen}
//             onOpenChange={setStageConfigDialogOpen}
//             onSave={handleSaveStageConfig}
//           />
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }



// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Plus, X, GripVertical, Play, Database, FileText, Settings, CheckCircle, AlertCircle, Clock, Target, Filter, Calendar } from 'lucide-react';
// import { useToast } from "@/hooks/use-toast";
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import {
//   useSortable,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import StageConfigDialog from './StageConfigDialog';

// interface JobStage {
//   id: string;
//   name: string;
//   type: string;
//   status: string;
//   description?: string;
//   config?: Record<string, any>;
// }

// interface Job {
//   id: string;
//   name: string;
//   category: string;
//   lastRun: string;
//   status: string;
//   description?: string;
//   isConnected?: boolean;
//   stages?: JobStage[];
// }

// interface EnhancedEditJobDialogProps {
//   job: Job | null;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSave: (jobId: string, stages: JobStage[]) => void;
// }

// // Available steps
// const availableSteps = [
//   { id: 'upload_center', name: 'Data Upload Center', icon: Database, color: '#3b82f6', description: 'Manage data extraction and destination' },
//   { id: 'loading', name: 'Schema Analysis', icon: Target, color: '#10b981', description: 'Analyze schema of the data' },
//   { id: 'validation', name: 'DQ Rules', icon: Filter, color: '#f59e0b', description: 'Validate data quality and consistency' },
//   { id: 'processing', name: 'NER', icon: Settings, color: '#ef4444', description: 'Named Entity Recognition processing' },
//   { id: 'collection', name: 'Business Logic', icon: Database, color: '#6b7280', description: 'Apply business logic to collected data' },
//   { id: 'connection', name: 'ETL', icon: Database, color: '#3b82f6', description: 'Extract, Transform, Load processes' },
//   { id: 'transfer', name: 'Schedule Jobs', icon: Target, color: '#10b981', description: 'Schedule automated job runs' },
// ];

// function DraggableStepItem({ step }: { step: typeof availableSteps[0] }) {
//   const StepIcon = step.icon;
  
//   return (
//     <Card 
//       className="cursor-grab hover:shadow-md transition-all border-l-4 active:cursor-grabbing"
//       style={{ borderLeftColor: step.color }}
//       draggable
//       onDragStart={(e) => {
//         e.dataTransfer.setData('application/json', JSON.stringify({
//           type: 'new-step',
//           step: step
//         }));
//       }}
//     >
//       <CardContent className="p-3">
//         <div className="flex items-center gap-3">
//           <GripVertical className="w-4 h-4 text-muted-foreground" />
//           <div 
//             className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
//             style={{ backgroundColor: `${step.color}20` }}
//           >
//             <StepIcon className="w-4 h-4" style={{ color: step.color }} />
//           </div>
//           <div className="flex-1 min-w-0">
//             <h4 className="font-medium text-sm">{step.name}</h4>
//             <p className="text-xs text-muted-foreground truncate">
//               {step.description}
//             </p>
//           </div>
//           <Plus className="w-4 h-4 text-muted-foreground" />
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function SortableStageItem({ stage, index, onEdit, onDelete }: {
//   stage: JobStage;
//   index: number;
//   onEdit: (stage: JobStage) => void;
//   onDelete: (stageId: string) => void;
// }) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id: stage.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.5 : 1,
//   };

//   const stepInfo = availableSteps.find(step => step.id === stage.type);
//   const StepIcon = stepInfo?.icon || Settings;

//   const getStatusIcon = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
//       case 'running': return <Play className="w-4 h-4 text-blue-500" />;
//       case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
//       default: return <Clock className="w-4 h-4 text-gray-500" />;
//     }
//   };

//   return (
//     <div className="relative">
//       <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium z-10">
//         {index + 1}
//       </div>
//       <Card
//         ref={setNodeRef}
//         className="cursor-pointer hover:shadow-md transition-all border-l-4 ml-4"
//         style={{
//           ...style,
//           borderLeftColor: stepInfo?.color || '#e5e7eb'
//         }}
//         onClick={() => onEdit(stage)}
//       >
//         <CardContent className="p-4">
//           <div className="flex items-center gap-3">
//             <div
//               {...attributes}
//               {...listeners}
//               className="cursor-grab hover:cursor-grabbing"
//             >
//               <GripVertical className="w-4 h-4 text-muted-foreground" />
//             </div>
            
//             <div 
//               className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
//               style={{ backgroundColor: `${stepInfo?.color}20` }}
//             >
//               <StepIcon className="w-5 h-5" style={{ color: stepInfo?.color }} />
//             </div>
            
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2 mb-1">
//                 <h4 className="font-medium text-sm truncate">{stage.name}</h4>
//                 {getStatusIcon(stage.status)}
//               </div>
//               <p className="text-xs text-muted-foreground capitalize">
//                 {stage.type.replace('_', ' ')}
//               </p>
//               {stage.description && (
//                 <p className="text-xs text-muted-foreground mt-1 truncate">
//                   {stage.description}
//                 </p>
//               )}
//             </div>

//             <div className="flex items-center gap-2">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="w-6 h-6 p-0 hover:bg-red-100"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onDelete(stage.id);
//                 }}
//               >
//                 <X className="w-3 h-3" />
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// function DropZone({ index, onDrop }: { index: number; onDrop: (index: number, data: any) => void }) {
//   const [isOver, setIsOver] = useState(false);

//   return (
//     <div
//       className={`h-8 flex items-center justify-center transition-all ${
//         isOver ? 'bg-primary/10 border-2 border-dashed border-primary' : 'border-2 border-dashed border-transparent'
//       }`}
//       onDragOver={(e) => {
//         e.preventDefault();
//         setIsOver(true);
//       }}
//       onDragLeave={() => setIsOver(false)}
//       onDrop={(e) => {
//         e.preventDefault();
//         setIsOver(false);
//         const data = JSON.parse(e.dataTransfer.getData('application/json'));
//         onDrop(index, data);
//       }}
//     >
//       {isOver && (
//         <div className="text-xs text-primary font-medium">Drop here to insert</div>
//       )}
//     </div>
//   );
// }

// export default function EnhancedEditJobDialog({ 
//   job, 
//   open, 
//   onOpenChange, 
//   onSave 
// }: EnhancedEditJobDialogProps) {
//   const { toast } = useToast();
//   const [stages, setStages] = useState<JobStage[]>([]);
//   const [selectedStage, setSelectedStage] = useState<JobStage | null>(null);
//   const [stageConfigDialogOpen, setStageConfigDialogOpen] = useState(false);
//   const [jobType, setJobType] = useState(job?.category || '');
//   const [glueName, setGlueName] = useState(job?.id || '');

//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   useEffect(() => {
//     if (job) {
//       setStages(job.stages || []);
//       setJobType(job.category);
//       setGlueName(job.id);
//     }
//   }, [job]);

//   const filteredAvailableSteps = availableSteps.filter(
//     step => !stages.some(stage => stage.type === step.id)
//   );

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;

//     if (active.id !== over?.id) {
//       setStages((items) => {
//         const oldIndex = items.findIndex((item) => item.id === active.id);
//         const newIndex = items.findIndex((item) => item.id === over?.id);

//         return arrayMove(items, oldIndex, newIndex);
//       });
//     }
//   };

//   const handleDropAtPosition = (index: number, data: any) => {
//     if (data.type === 'new-step') {
//       const newStage: JobStage = {
//         id: `stage_${Date.now()}`,
//         name: data.step.name,
//         type: data.step.id,
//         status: 'pending',
//         description: data.step.description,
//         config: {}
//       };
      
//       setStages(prev => {
//         const newStages = [...prev];
//         newStages.splice(index, 0, newStage);
//         return newStages;
//       });
      
//       toast({
//         title: "Stage Added",
//         description: `${data.step.name} has been added to position ${index + 1}`,
//       });
//     }
//   };

//   const addStepToEnd = (step: typeof availableSteps[0]) => {
//     const newStage: JobStage = {
//       id: `stage_${Date.now()}`,
//       name: step.name,
//       type: step.id,
//       status: 'pending',
//       description: step.description,
//       config: {}
//     };
//     setStages(prev => [...prev, newStage]);
    
//     toast({
//       title: "Stage Added",
//       description: `${step.name} has been added to the job`,
//     });
//   };

//   const handleEditStage = (stage: JobStage) => {
//     setSelectedStage(stage);
//     setStageConfigDialogOpen(true);
//   };

//   const handleDeleteStage = (stageId: string) => {
//     setStages(prev => prev.filter(stage => stage.id !== stageId));
//   };

//   const handleSaveStageConfig = (updatedStage: JobStage) => {
//     setStages(prev => prev.map(stage => 
//       stage.id === updatedStage.id ? updatedStage : stage
//     ));
//     setStageConfigDialogOpen(false);
//     setSelectedStage(null);
//   };

//   const handleSave = () => {
//     if (!job) return;
//     const updatedJob = {
//       ...job,
//       category: jobType,
//       id: glueName
//     };
//     onSave(updatedJob.id, stages);
//   };

//   if (!job) return null;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
//         <DialogHeader>
//           <DialogTitle>Edit Job Stages: {job.name}</DialogTitle>
//           <div className="grid grid-cols-3 gap-4 mt-4">
//             <div>
//               <label className="text-sm font-medium">Job Name</label>
//               <p className="text-sm text-muted-foreground">{job.name}</p>
//             </div>
            
//           </div>
//         </DialogHeader>

//         <div className="flex-1 flex gap-6 overflow-hidden">
//           {/* Left Panel - Available Steps */}
//           <div className="w-80 flex flex-col">
//             <h3 className="font-semibold mb-4">Available Steps</h3>
//             <div className="flex-1 overflow-y-auto space-y-2">
//               {filteredAvailableSteps.length === 0 ? (
//                 <div className="text-center py-6">
//                   <p className="text-muted-foreground">All available steps have been added</p>
//                 </div>
//               ) : (
//                 filteredAvailableSteps.map((step) => (
//                   <div key={step.id} onClick={() => addStepToEnd(step)}>
//                     <DraggableStepItem step={step} />
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Right Panel - Job Stage Pipeline */}
//           <div className="flex-1 border-l pl-6 flex flex-col">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="font-semibold">Job Stage Pipeline ({stages.length} stages)</h3>
//               <div className="text-sm text-muted-foreground">
//                 Drag to reorder • Click to configure
//               </div>
//             </div>
            
//             <div className="flex-1 overflow-y-auto">
//               {stages.length === 0 ? (
//                 <div className="flex items-center justify-center h-full border-2 border-dashed border-muted-foreground/25 rounded-lg">
//                   <div className="text-center">
//                     <Database className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
//                     <p className="text-muted-foreground mb-2">No stages added</p>
//                     <p className="text-sm text-muted-foreground">Drag steps from the left panel to build your pipeline</p>
//                   </div>
//                 </div>
//               ) : (
//                 <DndContext
//                   sensors={sensors}
//                   collisionDetection={closestCenter}
//                   onDragEnd={handleDragEnd}
//                 >
//                   <SortableContext items={stages.map(s => s.id)} strategy={verticalListSortingStrategy}>
//                     <div className="space-y-1">
//                       <DropZone index={0} onDrop={handleDropAtPosition} />
//                       {stages.map((stage, index) => (
//                         <div key={stage.id}>
//                           <SortableStageItem
//                             stage={stage}
//                             index={index}
//                             onEdit={handleEditStage}
//                             onDelete={handleDeleteStage}
//                           />
//                           <DropZone index={index + 1} onDrop={handleDropAtPosition} />
//                         </div>
//                       ))}
//                     </div>
//                   </SortableContext>
//                 </DndContext>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end gap-2 pt-4 border-t">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSave}>
//             Save Changes
//           </Button>
//         </div>

//         {/* Stage Configuration Dialog */}
//         {selectedStage && (
//           <StageConfigDialog
//             stage={selectedStage}
//             open={stageConfigDialogOpen}
//             onOpenChange={setStageConfigDialogOpen}
//             onSave={handleSaveStageConfig}
//           />
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }


// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Plus, X, GripVertical, Play, Database, FileText, Settings, CheckCircle, AlertCircle, Clock, Target, Filter, Calendar } from 'lucide-react';
// import { useToast } from "@/hooks/use-toast";
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import {
//   useSortable,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import StageConfigDialog from './StageConfigDialog';

// interface JobStage {
//   id: string;
//   name: string;
//   type: string;
//   status: string;
//   description?: string;
//   config?: Record<string, any>;
// }

// interface Job {
//   id: string;
//   name: string;
//   category: string;
//   lastRun: string;
//   status: string;
//   description?: string;
//   isConnected?: boolean;
//   stages?: JobStage[];
// }

// interface EnhancedEditJobDialogProps {
//   job: Job | null;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSave: (jobId: string, stages: JobStage[]) => void;
// }

// // Available steps
// const availableSteps = [
//   { id: 'upload_center', name: 'Data Upload Center', icon: Database, color: '#3b82f6', description: 'Manage data extraction and destination' },
//   { id: 'loading', name: 'Schema Analysis', icon: Target, color: '#10b981', description: 'Analyze schema of the data' },
//   { id: 'validation', name: 'DQ Rules', icon: Filter, color: '#f59e0b', description: 'Validate data quality and consistency' },
//   { id: 'processing', name: 'NER', icon: Settings, color: '#ef4444', description: 'Named Entity Recognition processing' },
//   { id: 'collection', name: 'Business Logic', icon: Database, color: '#6b7280', description: 'Apply business logic to collected data' },
//   { id: 'connection', name: 'ETL', icon: Database, color: '#3b82f6', description: 'Extract, Transform, Load processes' },
//   { id: 'transfer', name: 'Schedule Jobs', icon: Target, color: '#10b981', description: 'Schedule automated job runs' },
// ];

// function DraggableStepItem({ step }: { step: typeof availableSteps[0] }) {
//   const StepIcon = step.icon;
  
//   return (
//     <Card 
//       className="cursor-grab hover:shadow-md transition-all border-l-4 active:cursor-grabbing"
//       style={{ borderLeftColor: step.color }}
//       draggable
//       onDragStart={(e) => {
//         e.dataTransfer.setData('application/json', JSON.stringify({
//           type: 'new-step',
//           step: step
//         }));
//       }}
//     >
//       <CardContent className="p-3">
//         <div className="flex items-center gap-3">
//           <GripVertical className="w-4 h-4 text-muted-foreground" />
//           <div 
//             className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
//             style={{ backgroundColor: `${step.color}20` }}
//           >
//             <StepIcon className="w-4 h-4" style={{ color: step.color }} />
//           </div>
//           <div className="flex-1 min-w-0">
//             <h4 className="font-medium text-sm">{step.name}</h4>
//             <p className="text-xs text-muted-foreground truncate">
//               {step.description}
//             </p>
//           </div>
//           <Plus className="w-4 h-4 text-muted-foreground" />
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function SortableStageItem({ stage, index, onEdit, onDelete }: {
//   stage: JobStage;
//   index: number;
//   onEdit: (stage: JobStage) => void;
//   onDelete: (stageId: string) => void;
// }) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id: stage.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.5 : 1,
//   };

//   const stepInfo = availableSteps.find(step => step.id === stage.type);
//   const StepIcon = stepInfo?.icon || Settings;

//   const getStatusIcon = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
//       case 'running': return <Play className="w-4 h-4 text-blue-500" />;
//       case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
//       default: return <Clock className="w-4 h-4 text-gray-500" />;
//     }
//   };

//   return (
//     <div className="relative">
//       <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium z-10">
//         {index + 1}
//       </div>
//       <Card
//         ref={setNodeRef}
//         className="cursor-pointer hover:shadow-md transition-all border-l-4 ml-4"
//         style={{
//           ...style,
//           borderLeftColor: stepInfo?.color || '#e5e7eb'
//         }}
//         onClick={() => onEdit(stage)}
//       >
//         <CardContent className="p-4">
//           <div className="flex items-center gap-3">
//             <div
//               {...attributes}
//               {...listeners}
//               className="cursor-grab hover:cursor-grabbing"
//             >
//               <GripVertical className="w-4 h-4 text-muted-foreground" />
//             </div>
            
//             <div 
//               className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
//               style={{ backgroundColor: `${stepInfo?.color}20` }}
//             >
//               <StepIcon className="w-5 h-5" style={{ color: stepInfo?.color }} />
//             </div>
            
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2 mb-1">
//                 <h4 className="font-medium text-sm truncate">{stage.name}</h4>
//                 {getStatusIcon(stage.status)}
//               </div>
//               <p className="text-xs text-muted-foreground capitalize">
//                 {stage.type.replace('_', ' ')}
//               </p>
//               {stage.description && (
//                 <p className="text-xs text-muted-foreground mt-1 truncate">
//                   {stage.description}
//                 </p>
//               )}
//             </div>

//             <div className="flex items-center gap-2">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="w-6 h-6 p-0 hover:bg-red-100"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onDelete(stage.id);
//                   switch (stage.type) {
//                     case 'loading':
//                       localStorage.setItem('schema', 'skipped');
//                       break;
//                     case 'validation':
//                       localStorage.setItem('rules', 'skipped');
//                       break;
//                     case 'processing':
//                       localStorage.setItem('ner', 'skipped');
//                       break;
//                     case 'collection':
//                       localStorage.setItem('businesslogic', 'skipped');
//                       break;
//                     case 'connection':
//                       localStorage.setItem('etl', 'skipped');
//                       break;
//                     default:
//                       break;
//                   }
//                 }}
//               >
//                 <X className="w-3 h-3" />
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// function DropZone({ index, onDrop }: { index: number; onDrop: (index: number, data: any) => void }) {
//   const [isOver, setIsOver] = useState(false);

//   return (
//     <div
//       className={`h-8 flex items-center justify-center transition-all ${
//         isOver ? 'bg-primary/10 border-2 border-dashed border-primary' : 'border-2 border-dashed border-transparent'
//       }`}
//       onDragOver={(e) => {
//         e.preventDefault();
//         setIsOver(true);
//       }}
//       onDragLeave={() => setIsOver(false)}
//       onDrop={(e) => {
//         e.preventDefault();
//         setIsOver(false);
//         const data = JSON.parse(e.dataTransfer.getData('application/json'));
//         onDrop(index, data);
//       }}
//     >
//       {isOver && (
//         <div className="text-xs text-primary font-medium">Drop here to insert</div>
//       )}
//     </div>
//   );
// }

// export default function EnhancedEditJobDialog({ 
//   job, 
//   open, 
//   onOpenChange, 
//   onSave 
// }: EnhancedEditJobDialogProps) {
//   const { toast } = useToast();
//   const [stages, setStages] = useState<JobStage[]>([]);
//   const [selectedStage, setSelectedStage] = useState<JobStage | null>(null);
//   const [stageConfigDialogOpen, setStageConfigDialogOpen] = useState(false);
//   const [jobType, setJobType] = useState(job?.category || '');
//   const [glueName, setGlueName] = useState(job?.id || '');

//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   useEffect(() => {
//     if (job) {
//       setStages(job.stages || []);
//       setJobType(job.category);
//       setGlueName(job.id);
//     }
//   }, [job]);

//   const filteredAvailableSteps = availableSteps.filter(
//     step => !stages.some(stage => stage.type === step.id)
//   );

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;

//     if (active.id !== over?.id) {
//       setStages((items) => {
//         const oldIndex = items.findIndex((item) => item.id === active.id);
//         const newIndex = items.findIndex((item) => item.id === over?.id);

//         return arrayMove(items, oldIndex, newIndex);
//       });
//     }
//   };

//   const handleDropAtPosition = (index: number, data: any) => {
//     if (data.type === 'new-step') {
//       const newStage: JobStage = {
//         id: `stage_${Date.now()}`,
//         name: data.step.name,
//         type: data.step.id,
//         status: 'pending',
//         description: data.step.description,
//         config: {}
//       };
      
//       setStages(prev => {
//         const newStages = [...prev];
//         newStages.splice(index, 0, newStage);
//         if (newStage.type === 'loading') localStorage.setItem('schema', 'used');
//         if (newStage.type === 'validation') localStorage.setItem('rules', 'used');
//         if (newStage.type === 'processing') localStorage.setItem('ner', 'used');
//         if (newStage.type === 'collection') localStorage.setItem('businesslogic', 'used');
//         if (newStage.type === 'connection') localStorage.setItem('etl', 'used');
//         return newStages;
//       });
      
//       toast({
//         title: "Stage Added",
//         description: `${data.step.name} has been added to position ${index + 1}`,
//       });
//     }
//   };

//   const addStepToEnd = (step: typeof availableSteps[0]) => {
//     const newStage: JobStage = {
//       id: `stage_${Date.now()}`,
//       name: step.name,
//       type: step.id,
//       status: 'pending',
//       description: step.description,
//       config: {}
//     };
//     setStages(prev => [...prev, newStage]);
//     if (newStage.type === 'loading') localStorage.setItem('schema', 'used');
//     if (newStage.type === 'validation') localStorage.setItem('rules', 'used');
//     if (newStage.type === 'processing') localStorage.setItem('ner', 'used');
//     if (newStage.type === 'collection') localStorage.setItem('businesslogic', 'used');
//     if (newStage.type === 'connection') localStorage.setItem('etl', 'used');
    
//     toast({
//       title: "Stage Added",
//       description: `${step.name} has been added to the job`,
//     });
//   };

//   const handleEditStage = (stage: JobStage) => {
//     setSelectedStage(stage);
//     setStageConfigDialogOpen(true);
//   };

//   const handleDeleteStage = (stageId: string) => {
//     setStages(prev => prev.filter(stage => stage.id !== stageId));
//   };

//   const handleSaveStageConfig = (updatedStage: JobStage) => {
//     setStages(prev => prev.map(stage => 
//       stage.id === updatedStage.id ? updatedStage : stage
//     ));
//     setStageConfigDialogOpen(false);
//     setSelectedStage(null);
//   };

//   const handleSave = () => {
//     if (!job) return;
//     const updatedJob = {
//       ...job,
//       category: jobType,
//       id: glueName
//     };
//     onSave(updatedJob.id, stages);
//   };

//   if (!job) return null;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
//         <DialogHeader>
//           <DialogTitle>Edit Job Stages: {job.name}</DialogTitle>
//           <div className="grid grid-cols-3 gap-4 mt-4">
//             <div>
//               <label className="text-sm font-medium">Job Name</label>
//               <p className="text-sm text-muted-foreground">{job.name}</p>
//             </div>
            
//           </div>
//         </DialogHeader>

//         <div className="flex-1 flex gap-6 overflow-hidden">
//           {/* Left Panel - Available Steps */}
//           <div className="w-80 flex flex-col">
//             <h3 className="font-semibold mb-4">Available Steps</h3>
//             <div className="flex-1 overflow-y-auto space-y-2">
//               {filteredAvailableSteps.length === 0 ? (
//                 <div className="text-center py-6">
//                   <p className="text-muted-foreground">All available steps have been added</p>
//                 </div>
//               ) : (
//                 filteredAvailableSteps.map((step) => (
//                   <div key={step.id} onClick={() => addStepToEnd(step)}>
//                     <DraggableStepItem step={step} />
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Right Panel - Job Stage Pipeline */}
//           <div className="flex-1 border-l pl-6 flex flex-col">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="font-semibold">Job Stage Pipeline ({stages.length} stages)</h3>
//               <div className="text-sm text-muted-foreground">
//                 Drag to reorder • Click to configure
//               </div>
//             </div>
            
//             <div className="flex-1 overflow-y-auto">
//               {stages.length === 0 ? (
//                 <div className="flex items-center justify-center h-full border-2 border-dashed border-muted-foreground/25 rounded-lg">
//                   <div className="text-center">
//                     <Database className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
//                     <p className="text-muted-foreground mb-2">No stages added</p>
//                     <p className="text-sm text-muted-foreground">Drag steps from the left panel to build your pipeline</p>
//                   </div>
//                 </div>
//               ) : (
//                 <DndContext
//                   sensors={sensors}
//                   collisionDetection={closestCenter}
//                   onDragEnd={handleDragEnd}
//                 >
//                   <SortableContext items={stages.map(s => s.id)} strategy={verticalListSortingStrategy}>
//                     <div className="space-y-1">
//                       <DropZone index={0} onDrop={handleDropAtPosition} />
//                       {stages.map((stage, index) => (
//                         <div key={stage.id}>
//                           <SortableStageItem
//                             stage={stage}
//                             index={index}
//                             onEdit={handleEditStage}
//                             onDelete={handleDeleteStage}
//                           />
//                           <DropZone index={index + 1} onDrop={handleDropAtPosition} />
//                         </div>
//                       ))}
//                     </div>
//                   </SortableContext>
//                 </DndContext>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end gap-2 pt-4 border-t">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={handleSave}>
//             Save Changes
//           </Button>
//         </div>

//         {/* Stage Configuration Dialog */}
//         {selectedStage && (
//           <StageConfigDialog
//             stage={selectedStage}
//             open={stageConfigDialogOpen}
//             onOpenChange={setStageConfigDialogOpen}
//             onSave={handleSaveStageConfig}
//           />
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, GripVertical, Play, Database, FileText, Settings, CheckCircle, AlertCircle, Clock, Target, Filter } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import StageConfigDialog from './StageConfigDialog';

interface JobStage {
  id: string;
  name: string;
  type: string;
  status: string;
  description?: string;
  config?: any;
}

interface Job {
  id: string;
  name: string;
  category: string;
  stages?: JobStage[];
}

interface EnhancedEditJobDialogProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (jobId: string, stages: JobStage[]) => void;
}

const availableSteps = [
  { id: 'upload_center', name: 'Data Upload Center', icon: Database, color: '#3b82f6', description: 'Manage data extraction and destination' },
  { id: 'loading', name: 'Schema Analysis', icon: Target, color: '#10b981', description: 'Analyze schema of the data' },
  { id: 'validation', name: 'DQ Rules', icon: Filter, color: '#f59e0b', description: 'Validate data quality and consistency' },
  { id: 'processing', name: 'NER', icon: Settings, color: '#ef4444', description: 'Named Entity Recognition processing' },
  { id: 'collection', name: 'Business Logic', icon: Database, color: '#6b7280', description: 'Apply business logic to collected data' },
  { id: 'connection', name: 'Data Transformations', icon: Database, color: '#3b82f6', description: 'Extract, Transform, Load processes' },
  { id: 'transfer', name: 'Schedule Jobs', icon: Target, color: '#10b981', description: 'Schedule automated job runs' },
];

const getAuthToken = () => localStorage.getItem("authToken") || "";
const BASE_URL = "https://ingestq-backend-954554516.ap-south-1.elb.amazonaws.com";

interface CreateJobConfigRequest {
  jobName: string;
  triggerType: "SCHEDULE" | "File";
  steps: {
    rules: "executed" | "skipped" | "used";
    ner: "executed" | "skipped" | "used";
    businessLogic: "executed" | "skipped" | "used";
    datatransformations?: "executed" | "skipped" | "used";
    etl?: "executed" | "skipped" | "used";
  };
  datasource: string;
  datadestination: string;
  scheduleDetails?: {
    frequency?: string;
    time?: string;
  };
  business_logic_rules?: { [key: string]: string };
  job_type: string;
  glue_name?: string;
  gname: string;
  resourcegroup?: string;
  datafactory?: string;
  pipeline?: string;
}

const createJobConfig = async (data: CreateJobConfigRequest): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/create-job-config`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create job config: ${response.status} - ${errorText}`);
  }

  return await response.json();
};

function DraggableStepItem({ step }: { step: typeof availableSteps[0] }) {
  const StepIcon = step.icon;
  
  return (
    <Card 
      className="cursor-grab hover:shadow-md transition-all border-l-4 active:cursor-grabbing"
      style={{ borderLeftColor: step.color }}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
          type: 'new-step',
          step: step
        }));
      }}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <div 
            className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${step.color}20` }}
          >
            <StepIcon className="w-4 h-4" style={{ color: step.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm">{step.name}</h4>
            <p className="text-xs text-muted-foreground truncate">
              {step.description}
            </p>
          </div>
          <Plus className="w-4 h-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

function SortableStageItem({ stage, index, onEdit, onDelete }: {
  stage: JobStage;
  index: number;
  onEdit: (stage: JobStage) => void;
  onDelete: (stageId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stage.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const stepInfo = availableSteps.find(step => step.id === stage.type);
  const StepIcon = stepInfo?.icon || Settings;

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running': return <Play className="w-4 h-4 text-blue-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium z-10">
        {index + 1}
      </div>
      <Card
        ref={setNodeRef}
        className="cursor-pointer hover:shadow-md transition-all border-l-4 ml-4"
        style={{
          ...style,
          borderLeftColor: stepInfo?.color || '#e5e7eb'
        }}
        onClick={() => onEdit(stage)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>
            
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${stepInfo?.color}20` }}
            >
              <StepIcon className="w-5 h-5" style={{ color: stepInfo?.color }} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm truncate">{stage.name}</h4>
                {getStatusIcon(stage.status)}
              </div>
              <p className="text-xs text-muted-foreground capitalize">
                {stage.type.replace('_', ' ')}
              </p>
              {stage.description && (
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {stage.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 hover:bg-red-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(stage.id);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DropZone({ index, onDrop }: { index: number; onDrop: (index: number, data: any) => void }) {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      className={`h-8 flex items-center justify-center transition-all ${
        isOver ? 'bg-primary/10 border-2 border-dashed border-primary' : 'border-2 border-dashed border-transparent'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        onDrop(index, data);
      }}
    >
      {isOver && (
        <div className="text-xs text-primary font-medium">Drop here to insert</div>
      )}
    </div>
  );
}

export default function EnhancedEditJobDialog({ 
  job, 
  open, 
  onOpenChange, 
  onSave 
}: EnhancedEditJobDialogProps) {
  const { toast } = useToast();
  const [stages, setStages] = useState<JobStage[]>([]);
  const [selectedStage, setSelectedStage] = useState<JobStage | null>(null);
  const [stageConfigDialogOpen, setStageConfigDialogOpen] = useState(false);
  const [jobName, setJobName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (job && open) {
      setJobName(job.name);
      
      if (job.stages && job.stages.length > 0) {
        setStages(job.stages);
      } else {
        const mandatoryStageIds = ['upload_center', 'loading', 'transfer'];
        const mandatoryStages = availableSteps
          .filter(step => mandatoryStageIds.includes(step.id))
          .map(step => ({
            id: `stage_${step.id}_${Date.now()}`,
            name: step.name,
            type: step.id,
            status: 'Pending',
            description: step.description,
            config: {}
          }));
        setStages(mandatoryStages);
      }
    }
  }, [job, open]);

  const filteredAvailableSteps = availableSteps.filter(
    step => !stages.some(stage => stage.type === step.id)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setStages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDropAtPosition = (index: number, data: any) => {
    if (data.type === 'new-step') {
      const newStage: JobStage = {
        id: `stage_${Date.now()}`,
        name: data.step.name,
        type: data.step.id,
        status: 'Pending',
        description: data.step.description,
        config: {}
      };
      
      setStages(prev => {
        const newStages = [...prev];
        newStages.splice(index, 0, newStage);
        return newStages;
      });
      
      toast({
        title: "Stage Added",
        description: `${data.step.name} has been added to position ${index + 1}`,
      });
    }
  };

  const addStepToEnd = (step: typeof availableSteps[0]) => {
    const newStage: JobStage = {
      id: `stage_${Date.now()}`,
      name: step.name,
      type: step.id,
      status: 'Pending',
      description: step.description,
      config: {}
    };
    setStages(prev => [...prev, newStage]);
    
    toast({
      title: "Stage Added",
      description: `${step.name} has been added to the job`,
    });
  };

  const handleEditStage = (stage: JobStage) => {
    setSelectedStage(stage);
    setStageConfigDialogOpen(true);
  };

  const handleDeleteStage = (stageId: string) => {
    setStages(prev => prev.filter(stage => stage.id !== stageId));
    
    toast({
      title: "Stage Removed",
      description: "Stage has been removed from the pipeline",
    });
  };

  const handleSaveStageConfig = (updatedStage: JobStage) => {
    setStages(prev => prev.map(stage => 
      stage.id === updatedStage.id ? updatedStage : stage
    ));
    setStageConfigDialogOpen(false);
    setSelectedStage(null);
  };

const handleSaveAndCreate = async () => {
  if (!job || !jobName.trim()) {
    toast({
      title: "Validation Error",
      description: "Job name is required",
      variant: "destructive",
    });
    return;
  }

  setIsCreating(true);

  try {
    onSave(job.id, stages);

    const selectedBucket = localStorage.getItem("selectedBucket") || "";
    const selectedFile = localStorage.getItem("selectedFile") || "";
    const selectedDestBucket = localStorage.getItem("selectedDestBucket") || "";
    const selectedDestFolder = localStorage.getItem("selectedDestFolder") || "";
    
    // Get the category which maps to job_type in backend
    const jobCategory = localStorage.getItem("jobCategory") || job.category || "glue";
    const jobType = localStorage.getItem("jobType") || jobCategory;

    // Get category-specific fields from localStorage
    const glueName = localStorage.getItem("glueName") || "";
    const gname = localStorage.getItem("gname") || jobName;
    const resourceGroup = localStorage.getItem("resourceGroup") || "";
    const dataFactory = localStorage.getItem("dataFactory") || "";
    const pipeline = localStorage.getItem("pipeline") || "";

    const hasValidation = stages.some(s => s.type === 'validation');
    const hasNER = stages.some(s => s.type === 'processing');
    const hasBusinessLogic = stages.some(s => s.type === 'collection');
    const hasTransformations = stages.some(s => s.type === 'connection');

    const scheduleStage = stages.find(s => s.type === 'transfer');
    const scheduleConfig = scheduleStage?.config || {};

    const datasource = selectedBucket && selectedFile ? `s3://${selectedBucket}/${selectedFile}` : "";
    const datadestination = selectedDestBucket && selectedDestFolder ? `s3://${selectedDestBucket}/${selectedDestFolder}` : "";

    if (!datasource || !datadestination) {
      toast({
        title: "Validation Error",
        description: "Data source and destination must be configured",
        variant: "destructive",
      });
      setIsCreating(false);
      return;
    }

    // Determine trigger type
    const triggerType = scheduleConfig.triggerType || "SCHEDULE";

    // Base job configuration
    const createJobData: CreateJobConfigRequest = {
      jobName: jobName,
      triggerType: triggerType,
      steps: {
        rules: hasValidation ? "executed" : "skipped",
        ner: hasNER ? "executed" : "skipped",
        businessLogic: hasBusinessLogic ? "executed" : "skipped",
        datatransformations: hasTransformations ? "executed" : "skipped",
        etl: hasTransformations ? "executed" : "skipped",
      },
      datasource,
      datadestination,
      // Only include scheduleDetails if trigger type is SCHEDULE
      ...(triggerType === "SCHEDULE" && {
        scheduleDetails: {
          frequency: scheduleConfig.frequency || "daily",
          time: scheduleConfig.time || "00:00"
        }
      }),
      business_logic_rules: scheduleConfig.businessLogicRules || {},
      job_type: jobType.toLowerCase(), // This is the category from frontend
      gname: gname, // Always send gname
    };

    // Add category-specific fields based on job type
    if (jobType.toLowerCase() === 'glue') {
      createJobData.glue_name = glueName || jobName;
    } else if (jobType.toLowerCase() === 'adf') {
      createJobData.resourcegroup = resourceGroup;
      createJobData.datafactory = dataFactory;
      createJobData.pipeline = pipeline;
    } else if (jobType.toLowerCase() === 'lambda') {
      // Add lambda-specific fields if needed in future
    } else if (jobType.toLowerCase() === 'batch') {
      // Add batch-specific fields if needed in future
    } else if (jobType.toLowerCase() === 'airflow') {
      // Add airflow-specific fields if needed in future
    }

    console.log("Creating job with payload:", createJobData);

    const result = await createJobConfig(createJobData);

    if (result.success) {
      toast({
        title: "Success",
        description: `${jobType.toUpperCase()} job pipeline configured and created successfully`,
      });
      onOpenChange(false);
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to create job",
        variant: "destructive",
      });
    }
  } catch (error: any) {
    console.error("Error creating job:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to create job configuration",
      variant: "destructive",
    });
  } finally {
    setIsCreating(false);
  }
};

  if (!job) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Job Pipeline: {job.name} ({job.category.toUpperCase()})</DialogTitle>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <div>
                <Label htmlFor="jobName">Job Name / Pipeline Name</Label>
                <Input
                  id="jobName"
                  type="text"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  placeholder="Enter job/pipeline name"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This name will be used for the {job.category.toUpperCase()} job configuration
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 flex gap-6 overflow-hidden">
            <div className="w-80 flex flex-col">
              <h3 className="font-semibold mb-4">Available Steps</h3>
              <div className="flex-1 overflow-y-auto space-y-2">
                {filteredAvailableSteps.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">All available steps have been added</p>
                  </div>
                ) : (
                  filteredAvailableSteps.map((step) => (
                    <div key={step.id} onClick={() => addStepToEnd(step)}>
                      <DraggableStepItem step={step} />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex-1 border-l pl-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Job Stage Pipeline ({stages.length} stages)</h3>
                <div className="text-sm text-muted-foreground">
                  Click to configure stages
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {stages.length === 0 ? (
                  <div className="flex items-center justify-center h-full border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="text-center">
                      <Database className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-muted-foreground mb-2">No stages added</p>
                      <p className="text-sm text-muted-foreground">Drag steps from the left panel to build your pipeline</p>
                    </div>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={stages.map(s => s.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-1">
                        <DropZone index={0} onDrop={handleDropAtPosition} />
                        {stages.map((stage, index) => (
                          <div key={stage.id}>
                            <SortableStageItem
                              stage={stage}
                              index={index}
                              onEdit={handleEditStage}
                              onDelete={handleDeleteStage}
                            />
                            <DropZone index={index + 1} onDrop={handleDropAtPosition} />
                          </div>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAndCreate} disabled={isCreating}>
              {isCreating ? "Creating..." : "Save Changes & Create Job"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {selectedStage && (
        <StageConfigDialog
          stage={selectedStage}
          open={stageConfigDialogOpen}
          onOpenChange={setStageConfigDialogOpen}
          onSave={handleSaveStageConfig}
        />
      )}
    </>
  );
}