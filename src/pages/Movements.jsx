import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DateDisplay } from '@/components/common/DateDisplay'
import { DataTable } from '@/components/common/DataTable'
import { MovementService } from '../services/MovementService'
import { useSession } from '../context/SessionContext'

const PAGE_SIZE = 8

const formatAmount = (amount) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)

export default function Movements() {
  const navigate = useNavigate()
  const { session } = useSession()
  const [movements, setMovements] = useState([])
  const [accounts, setAccounts] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [createDescription, setCreateDescription] = useState('')
  const [createAmount, setCreateAmount] = useState('')
  const [createAccountId, setCreateAccountId] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    if (!session?.token) {
      navigate('/login')
      return
    }

    loadMovements(page)
    loadAccounts()
  }, [session, navigate])

  const loadMovements = async (nextPage = 1) => {
    setLoading(true)
    try {
      const data = await MovementService.list({ page: nextPage, limit: PAGE_SIZE })
      const list = Array.isArray(data) ? data : []
      setMovements(list)
      setPage(nextPage)
    } catch {} finally {
      setLoading(false)
    }
  }

  const loadAccounts = async () => {
    try {
      const data = await MovementService.listAccounts()
      setAccounts(Array.isArray(data) ? data : [])
    } catch {}
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    if (!createDescription.trim() || createAmount === '' || !createAccountId) return

    try {
      await MovementService.create({
        accountId: Number(createAccountId),
        description: createDescription.trim(),
        amount: Number(createAmount),
      })
      setCreateDescription('')
      setCreateAmount('')
      setCreateAccountId('')
      setCreateOpen(false)
      await loadMovements(1)
    } catch {}
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      await MovementService.remove(deleteTarget.id)
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

      <DataTable
        title="Lista de movimentações"
        description={summary}
        columns={[
          { key: 'description', header: 'Descrição' },
          { key: 'account', header: 'Conta', render: (movement) => movement.account?.description || '-' },
          {
            key: 'amount',
            header: 'Valor',
            render: (movement) => (
              <span className={movement.amount < 0 ? 'text-destructive' : ''}>
                {formatAmount(movement.amount)}
              </span>
            ),
          },
          { key: 'createdAt', header: 'Criada em', render: (movement) => <DateDisplay date={movement.createdAt} /> },
          {
            key: 'actions',
            header: 'Ações',
            align: 'right',
            render: (movement) => (
              <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(movement)}>
                Excluir
              </Button>
            ),
          },
        ]}
        data={movements}
        loading={loading}
        page={page}
        pageSize={PAGE_SIZE}
        hasNext={movements.length >= PAGE_SIZE}
        emptyMessage="Nenhuma movimentação registrada."
        onPageChange={loadMovements}
      />

      {createOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Nova movimentação</h2>
            <p className="mt-1 text-sm text-slate-500">Informe a descrição e o valor. Use valores negativos para saídas.</p>
            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <select
                value={createAccountId}
                onChange={(event) => setCreateAccountId(event.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                required
              >
                <option value="">Selecione uma conta</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>{account.description}</option>
                ))}
              </select>
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
                <Button type="submit" disabled={accounts.length === 0}>
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
