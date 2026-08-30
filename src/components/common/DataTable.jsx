import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

function TableRowSkeleton({ columns }) {
  return (
    <tr className="border-b last:border-0">
      {columns.map((column, index) => (
        <td
          key={index}
          className={cn('py-3 pr-4', column.align === 'right' && 'text-right')}
        >
          <Skeleton className="h-4 w-24" />
        </td>
      ))}
    </tr>
  )
}

export function DataTable({
  title,
  description,
  columns,
  data = [],
  keyField = 'id',
  loading = false,
  page = 1,
  pageSize = 8,
  hasNext = false,
  emptyMessage = 'Nenhum dado encontrado.',
  onPageChange,
}) {
  return (
    <Card>
      <CardHeader>
        {title ? <CardTitle>{title}</CardTitle> : null}
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={cn('py-2 pr-4', column.align === 'right' && 'text-right')}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: pageSize }).map((_, index) => (
                  <TableRowSkeleton key={index} columns={columns} />
                ))}
              </tbody>
            </table>
          </div>
        ) : data.length === 0 ? (
          <p className="text-sm text-slate-500">{emptyMessage}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={cn('py-2 pr-4', column.align === 'right' && 'text-right')}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row[keyField]} className="border-b last:border-0">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          'py-3 pr-4',
                          column.className,
                          column.align === 'right' && 'text-right'
                        )}
                      >
                        {column.render
                          ? column.render(row)
                          : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {onPageChange ? (
          <div className="mt-4 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || loading}
              onClick={() => onPageChange(page - 1)}
            >
              Anterior
            </Button>
            <span className="text-sm text-slate-500">Página {page}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNext || loading}
              onClick={() => onPageChange(page + 1)}
            >
              Próxima
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
