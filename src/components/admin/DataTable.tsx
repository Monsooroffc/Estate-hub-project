import { ReactNode } from 'react'

interface Column<T> {
  key: string
  header: string
  cell: (item: T) => ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  onRowClick?: (item: T) => void
}

export default function DataTable<T>({ columns, data, keyExtractor, onRowClick }: DataTableProps<T>) {
  if (data.length === 0) {
    return <div className="rounded-lg border bg-white p-8 text-center text-sm text-muted-foreground">No records found.</div>
  }
  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => <th key={col.key} className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">{col.header}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((item) => (
            <tr key={keyExtractor(item)} onClick={() => onRowClick?.(item)} className={onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''}>
              {columns.map((col) => <td key={col.key} className="px-4 py-3 whitespace-nowrap">{col.cell(item)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
