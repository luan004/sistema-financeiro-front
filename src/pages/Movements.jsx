import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DateDisplay } from '@/components/common/DateDisplay'
import { api } from '../services/api'
import { useSession } from '../context/SessionContext'

const PAGE_SIZE = 8

const formatAmount = (amount) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)

export default function Movements() {
  const navigate = useNavigate()
  const { session } = useSession()
  const [movements, setMovements] = useState([])
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)
  const [createDescription, setCreateDescription] = useState('')
  const [createAmount, setCreateAmount] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    if (!session?.token) {
      navigate('/login')
      return
    }

    loadMovements(page)
  }, [session, navigate])

  const loadMovements = async (nextPage = 1) => {
    try {
      const data = await api.get(`/movements?page=${nextPage}&limit=${PAGE_SIZE}`, { auth: true })
      const list = Array.isArray(data) ? data : []
      setMovements(list)
      setPage(nextPage)
    } catch {}
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    if (!createDescription.trim() || createAmount === '') return

    try {
      await api.post('/movements', { description: createDescription.trim(), amount: Number(createAmount) }, { auth: true })
      setCreateDescription('')
      setCreateAmount('')
      setCreateOpen(false)
      await loadMovements(1)
    } catch {}
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      await api.delete(`/movements/${deleteTarget.id}`, { auth: true })
      setDeleteTarget(null)
      await loadMovements(1)
    } catch {}
  }

  const summary = useMemo(() => {
    return `${movements.length} movimentação${movements.length === 1 ? '' : 'ões'} carregada${movements.length === 1 ? '' : 's'}`
  }, [movements.length])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Movimentações</h1>
          <p className="text-sm text-slate-500">Gerencie as movimentações registradas no sistema.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Nova movimentação</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de movimentações</CardTitle>
          <CardDescription>{summary}</CardDescription>
        </CardHeader>
        <CardContent>
          {movements.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhuma movimentação registrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500">
                    <th className="py-2 pr-4">Descrição</th>
                    <th className="py-2 pr-4">Valor</th>
                    <th className="py-2 pr-4">Criada em</th>
                    <th className="py-2 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((movement) => (
                    <tr key={movement.id} className="border-b last:border-0">
                      <td className="py-3 pr-4">{movement.description}</td>
                      <td className={`py-3 pr-4 ${movement.amount < 0 ? 'text-destructive' : ''}`}>
                        {formatAmount(movement.amount)}
                      </td>
                      <td className="py-3 pr-4"><DateDisplay date={movement.createdAt} /></td>
                      <td className="py-3 text-right">
                        <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(movement)}>
                          Excluir
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => loadMovements(page - 1)}>
              Anterior
            </Button>
            <span className="text-sm text-slate-500">Página {page}</span>
            <Button variant="outline" size="sm" disabled={movements.length < PAGE_SIZE} onClick={() => loadMovements(page + 1)}>
              Próxima
            </Button>
          </div>
        </CardContent>
      </Card>

      {createOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Nova movimentação</h2>
            <p className="mt-1 text-sm text-slate-500">Informe a descrição e o valor. Use valores negativos para saídas.</p>
            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <Input
                value={createDescription}
                onChange={(event) => setCreateDescription(event.target.value)}
                placeholder="Ex.: Salário"
                required
              />
              <Input
                type="number"
                step="0.01"
                value={createAmount}
                onChange={(event) => setCreateAmount(event.target.value)}
                placeholder="Ex.: -50.90"
                required
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Criar movimentação
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Excluir movimentação</h2>
            <p className="mt-2 text-sm text-slate-600">
              Tem certeza que deseja excluir a movimentação <span className="font-semibold">{deleteTarget.description}</span>?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancelar
              </Button>
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Confirmar exclusão
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
