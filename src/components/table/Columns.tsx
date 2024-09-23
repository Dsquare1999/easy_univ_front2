"use client"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./DataTableColumnHeader"

export type HeaderProps = {
    [key: string] : string | number
  }

export const Columns= (headers: string[]): ColumnDef<HeaderProps>[] => {
    if (headers && headers.length > 0) {
        const headerColumns: ColumnDef<HeaderProps>[] = headers.map((header: string) => ({
            accessorKey: header,
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={header} />
            ),
        }));
        return headerColumns;
    }
    return []    
};