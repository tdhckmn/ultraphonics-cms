import React from "react";
import {
    CellRendererParams,
    OnRowClickParams,
    OnVirtualTableColumnResizeParams,
    VirtualTableColumn,
    VirtualTableFilterValues,
    VirtualTableWhereFilterOp,
} from "./VirtualTableProps";
import { FilterFormFieldProps } from "./VirtualTableHeader";

export type VirtualTableRowProps<T> = {
    style: any;
    rowHeight: number;
    rowData: T;
    rowIndex: number;
    onRowClick?: (props: OnRowClickParams<any>) => void;
    children: React.ReactNode[];
    columns: VirtualTableColumn[];
    hoverRow?: boolean;
    rowClassName?: (rowData: T) => string | undefined;
};

export type VirtualTableContextProps<T extends any> = {
    data?: T[];
    rowHeight?: number;
    columns: VirtualTableColumn[];
    cellRenderer: React.ComponentType<CellRendererParams<T>>;
    currentSort: "asc" | "desc" | undefined;
    filter?: VirtualTableFilterValues<any>;
    onRowClick?: (props: OnRowClickParams<any>) => void;
    onColumnSort: (key: string) => any;
    onColumnResize: (params: OnVirtualTableColumnResizeParams) => void;
    onColumnResizeEnd: (params: OnVirtualTableColumnResizeParams) => void;
    onFilterUpdate: (
        column: VirtualTableColumn,
        filterForProperty?: [VirtualTableWhereFilterOp, any]
    ) => void;
    sortByProperty?: string;
    customView?: React.ReactNode;
    hoverRow: boolean;
    createFilterField?: (props: FilterFormFieldProps<any>) => React.ReactNode;
    rowClassName?: (rowData: T) => string | undefined;
    endAdornment?: React.ReactNode;
    AddColumnComponent?: React.ComponentType;
};
