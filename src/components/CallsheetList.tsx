
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CallsheetData } from '@/contexts/CallsheetContext';

interface CallsheetListProps {
  callsheets: CallsheetData[];
  onEdit: (id: string) => void;
}

export function CallsheetList({ callsheets, onEdit }: CallsheetListProps) {
  if (callsheets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No callsheets created yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {callsheets.map((callsheet) => (
        <Card key={callsheet.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{callsheet.projectTitle}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {new Date(callsheet.shootDate).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">
              <strong>Location:</strong> {callsheet.location}
            </p>
            <p className="text-sm mb-4">
              <strong>Call Time:</strong> {callsheet.generalCallTime}
            </p>
            <Button onClick={() => onEdit(callsheet.id)} className="w-full">
              Edit Callsheet
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
