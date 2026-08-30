import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DateDisplay } from '@/components/common/DateDisplay'
import { DataTable } from '@/components/common/DataTable'
import { api } from '../services/api'
import { useSession } from '../context/SessionContext'

const PAGE_SIZE = 8

export default function Accounts() {
  const navigate = useNavigate()
  const { session } = useSession()
  const [accounts, setAccounts] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [createDescription, setCreateDescription] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    if (!session?.token) {
      navigate('/login')
      return
    }

    loadAccounts(page)
  }, [session, navigate])

  const loadAccounts = async (nextPage = 1) => {
    setLoading(true)
    try {
      const data = await api.get(`/accounts?page=${nextPage}&limit=${PAGE_SIZE}`, { auth: true })
      const list = Array.isArray(data) ? data : []
      setAccounts(list)
      setPage(nextPage)
    } catch {} finally {
      setLoading(false)
    }
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    if (!createDescription.trim()) return

    try {
      await api.post('/accounts', { description: createDescription.trim() }, { auth: true })
      setCreateDescription('')
      setCreateOpen(false)
      await loadAccounts(1)
    } catch {}
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      await api.delete(`/accounts/${deleteTarget.id}`, { auth: true })
      setDeleteTarget(null)
      await loadAccounts(1)
    } catch {}
  }

  const summary = useMemo(() => {
    return `${accounts.length} conta${accounts.length === 1 ? '' : 's'} carregada${accounts.length === 1 ? '' : 's'}`
  }, [accounts.length])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Contas</h1>
          <p className="text-sm text-slate-500">Gerencie as contas cadastradas no sistema.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Nova conta</Button>
      </div>

      <DataTable
        title="Lista de contas"
        description={summary}
        columns={[
          { key: 'description', header: 'Descrição' },
          { key: 'createdAt', header: 'Criada em', render: (account) => <DateDisplay date={account.createdAt} /> },
          {
            key: 'actions',
            header: 'Ações',
            align: 'right',
            render: (account) => (
              <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(account)}>
                Excluir
              </Button>
            ),
          },
        ]}
        data={accounts}
        loading={loading}
        page={page}
        pageSize={PAGE_SIZE}
        hasNext={accounts.length >= PAGE_SIZE}
        emptyMessage="Nenhuma conta cadastrada."
        onPageChange={loadAccounts}
      />

      {createOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Nova conta</h2>
            <p className="mt-1 text-sm text-slate-500">Informe a descrição da conta.</p>
            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <Input
                value={createDescription}
                onChange={(event) => setCreateDescription(event.target.value)}
                placeholder="Ex.: Conta principal"
                required
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Criar conta
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Excluir conta</h2>
            <p className="mt-2 text-sm text-slate-600">
              Tem certeza que deseja excluir a conta <span className="font-semibold">{deleteTarget.description}</span>?
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
