

import { Button } from "@/components/ui/button";
import { Category } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash } from "lucide-react";


export function getColumns({
  onEdit,
  onDelete,
}: {
  onEdit: (category:Category) => void;
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
        const parent = row.original.parent; /* We retrieve the parent name of the record on every row */
        return parent ? parent.name : "-"; /* If it has a parent, its name is displayed, if it doesn't, a hyphen is written */
    }
    },
    {
      /* Here we have the buttons from our table for each register */
      accessorKey: "actions",
      header: "Actions",
      cell: ({row}) => {
        const category = row.original;
        return (
            <div className="actionsContainer flex gap-5">
              <Button variant= "secondary" size="icon" onClick={() => onEdit(category)}>
                <Pencil />
              </Button>

              {/* We just create the button and trigger the method that fires when is clicked */}
              <Button variant= "destructive" size="icon" onClick={() => onDelete(category)}>
                <Trash />
              </Button>
            </div>
        );
      }
    },
  ];
}