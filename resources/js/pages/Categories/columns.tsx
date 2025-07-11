

import { Category } from "@/types"
import { ColumnDef } from "@tanstack/react-table"


export const columns: ColumnDef<Category>[] = [
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
]