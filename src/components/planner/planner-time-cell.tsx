import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
 
import { COLUMN_WIDTH } from '@/utils/planner-constants';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

interface TimeGridCellProps {
  hour: Date;
  resourceId: string;
  columnIndex: number;
  onDrop?: (hour: Date, resourceId: string, data: any) => void;
}

const TimeGridCell = ({ 
  hour, 
  resourceId, 
  columnIndex,
  onDrop 
}: TimeGridCellProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const element = ref.current!;

    return dropTargetForElements({
      element,
      getData: () => ({
        hour,
        resourceId,
        columnIndex
      }),
      onDragEnter: () => setIsOver(true),
      onDragLeave: () => setIsOver(false),
      onDrop: (dragData) => {
        setIsOver(false);
        if (dragData.source.data.type === 'appointment') {
          onDrop?.(hour, resourceId, dragData.source.data);
        }
      },
    });
  }, [hour, resourceId, columnIndex, onDrop]);

  return (
    <div
      ref={ref}
      className={cn(
        "h-full border-r",
        isOver && "bg-primary/10",
        "transition-colors"
      )}
      style={{ width: COLUMN_WIDTH }}
    />
  );
};

export default TimeGridCell;