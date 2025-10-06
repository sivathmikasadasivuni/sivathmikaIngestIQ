import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Upload } from "lucide-react";

interface Job {
  id: string;
  name: string;
}

interface ScheduleStepProps {
  job: Job;
}

export default function ScheduleStep01({ job }: ScheduleStepProps) {
  const [scheduleType, setScheduleType] = useState<"time" | "file">("time");
  const [frequency, setFrequency] = useState("");
  const [time, setTime] = useState("");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Schedule Configuration
          </CardTitle>
          <CardDescription>
            Configure when and how your job should run
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trigger Type Selection */}
          <div className="space-y-4">
            <Label>Trigger Type</Label>
            <RadioGroup
              value={scheduleType}
              onValueChange={(value: "time" | "file") => setScheduleType(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="time" id="time-based" />
                <Label
                  htmlFor="time-based"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  Time-based Schedule
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="file" id="file-based" />
                <Label
                  htmlFor="file-based"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  File Upload Trigger
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Time-based Config */}
          {scheduleType === "time" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger>
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
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* File-based Config */}
          {scheduleType === "file" && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                The job will be triggered when a newer version of the
                selected source file is received.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}