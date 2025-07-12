

import { Button } from "@/components/ui/button";
import { Category } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash } from "lucide-react";


export function getColumns({
  onDelete
}: {
  onDelete: (category:Category) => void;
}):ColumnDef<Category>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "parent.name",
      header: "Parent Category",
      cell: ({row}) => {
        const parent = row.original.parent;
        return parent ? parent.name : "-";
    }
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({row}) => {
        const category = row.original;
        return (
            <div className="actionsContainer flex gap-5">
              <Button variant= "secondary" size="icon">
                <Pencil />
              </Button>

              <Button variant= "destructive" size="icon" onClick={() => onDelete(category)}>
                <Trash />
              </Button>
            </div>
        );
      }
    },
  ];
}