import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { RESOURCE_COLUMN_WIDTH, ROW_HEIGHT } from '@/utils/planner-constants';
import { Resource } from '@/types/planner-types';


interface PlannerResourceListProps {
    resources: Resource[];
    selectedResources: string[];
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onResourceToggle: (resourceId: string) => void;
}

const PlannerResourceList = ({
    resources,
    selectedResources,
    searchTerm,
    onSearchChange,
    onResourceToggle
}: PlannerResourceListProps) => {
    return (
        <div className="border-r flex flex-col flex-shrink-0" style={{ width: RESOURCE_COLUMN_WIDTH }}>
            <div className="p-2 border-b">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-8"
                        placeholder="Search resources..."
                    />
                </div>
            </div>
            <ScrollArea className="flex-1">
                {resources.map(resource => (
                    <div
                        key={resource.id}
                        role="button"
                        tabIndex={0}
                        className={cn(
                            "border-b p-4",
                            "hover:bg-accent/5 transition-colors",
                            selectedResources.includes(resource.id) && "bg-accent/5"
                        )}
                        style={{ height: ROW_HEIGHT }}
                        onClick={() => onResourceToggle(resource.id)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                onResourceToggle(resource.id);
                            }
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted">
                                {resource.avatar && (
                                    <img
                                        src={resource.avatar}
                                        alt={resource.name}
                                        className="w-full h-full rounded-full"
                                    />
                                )}
                            </div>
                            <div>
                                <div className="font-medium">{resource.name}</div>
                                <div className="text-sm text-muted-foreground">
                                    {resource.role}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </ScrollArea>
        </div>
    );
};

export default PlannerResourceList;