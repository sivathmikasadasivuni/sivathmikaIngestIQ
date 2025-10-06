import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Upload } from "lucide-react";

interface CompactScheduleStepProps {
  config?: Record<string, any>;
  onConfigChange?: (config: Record<string, any>) => void;
  triggerType?: "SCHEDULE" | "File";
  scheduleDetails?: {
    frequency?: string;
    time?: string;
  };
}

export default function CompactScheduleStep({ 
  config, 
  onConfigChange,
  triggerType: initialTriggerType,
  scheduleDetails 
}: CompactScheduleStepProps) {
  const [triggerType, setTriggerType] = useState<"SCHEDULE" | "File">(
    config?.triggerType || initialTriggerType || "File"
  );
  const [frequency, setFrequency] = useState(
    config?.frequency || scheduleDetails?.frequency || ""
  );
  const [time, setTime] = useState(
    config?.time || scheduleDetails?.time || ""
  );

  // Update state when props change (from API)
  useEffect(() => {
    if (initialTriggerType) {
      setTriggerType(initialTriggerType);
    }
    if (scheduleDetails?.frequency) {
      setFrequency(scheduleDetails.frequency);
    }
    if (scheduleDetails?.time) {
      setTime(scheduleDetails.time);
    }
    // TEMP DEBUG: Log state init
console.log('🔍 CompactScheduleStep init - config:', config, 'triggerType state:', triggerType, 'frequency:', frequency, 'time:', time);
  }, [initialTriggerType, scheduleDetails]);

  useEffect(() => {
    if (onConfigChange) {
      const configToSave = {
        triggerType,
        frequency: triggerType === "SCHEDULE" ? frequency : undefined,
        time: triggerType === "SCHEDULE" ? time : undefined,
      };
      
      onConfigChange(configToSave);
      
      // Save to localStorage for persistence
    }
  }, [triggerType, frequency, time, onConfigChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Schedule Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label>Trigger Type *</Label>
          <RadioGroup
            value={triggerType}
            onValueChange={(value: "SCHEDULE" | "File") => setTriggerType(value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="SCHEDULE" id="schedule-trigger" />
              <Label htmlFor="schedule-trigger" className="flex items-center gap-2 cursor-pointer font-normal">
                <Clock className="w-4 h-4" />
                Time-based Schedule
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="File" id="file-trigger" />
              <Label htmlFor="file-trigger" className="flex items-center gap-2 cursor-pointer font-normal">
                <Upload className="w-4 h-4" />
                File Upload Trigger
              </Label>
            </div>
          </RadioGroup>
        </div>

        {triggerType === "SCHEDULE" && (
          <div className="space-y-4 pt-2 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency *</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Job will run automatically based on the schedule you configure above.
              </p>
            </div>
          </div>
        )}

        {triggerType === "File" && (
          <div className="p-3 bg-muted rounded-lg border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Job will be triggered automatically when a newer version of the selected source file is received.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}