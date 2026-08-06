import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '../services/api'
import { useSession } from '../context/SessionContext'

const PAGE_SIZE = 10

export default function Accounts() {
  const navigate = useNavigate()
  const { session } = useSession()
  const [accounts, setAccounts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [createDescription, setCreateDescription] = useState('')
  const [createLoading, setCreateLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (!session?.token) {
      navigate('/login')
      return
    }

    loadAccounts(page)
  }, [session, navigate])

  const loadAccounts = async (nextPage = 1) => {
    setLoading(true)
    setError('')

    try {
      const data = await api.get(`/accounts?page=${nextPage}&limit=${PAGE_SIZE}`, { auth: true })
      const list = Array.isArray(data) ? data : []
      setAccounts(list)
      setHasMore(list.length === PAGE_SIZE)
      setPage(nextPage)
    } catch (err) {
      setError(err.detail || 'Não foi possível carregar as contas.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    if (!createDescription.trim()) return

    setCreateLoading(true)
    setError('')

    try {
      await api.post('/accounts', { description: createDescription.trim() }, { auth: true })
      setCreateDescription('')
      setCreateOpen(false)
      await loadAccounts(1)
    } catch (err) {
      setError(err.detail || 'Não foi possível criar a conta.')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    setDeleteLoading(true)
    setError('')

    try {
      await api.delete(`/accounts/${deleteTarget.id}`, { auth: true })
      setDeleteTarget(null)
      await loadAccounts(1)
    } catch (err) {
      setError(err.detail || 'Não foi possível excluir a conta.')
    } finally {
      setDeleteLoading(false)
    }
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

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>Lista de contas</CardTitle>
          <CardDescription>{summary}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-500">Carregando contas...</p>
          ) : accounts.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhuma conta cadastrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500">
                    <th className="py-2 pr-4">Descrição</th>
                    <th className="py-2 pr-4">Criada em</th>
                    <th className="py-2 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.id} className="border-b last:border-0">
                      <td className="py-3 pr-4">{account.description}</td>
                      <td className="py-3 pr-4">{account.createdAt}</td>
                      <td className="py-3 text-right">
                        <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(account)}>
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
            <Button variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => loadAccounts(page - 1)}>
              Anterior
            </Button>
            <span className="text-sm text-slate-500">Página {page}</span>
            <Button variant="outline" size="sm" disabled={!hasMore || loading} onClick={() => loadAccounts(page + 1)}>
              Próxima
            </Button>
          </div>
        </CardContent>
      </Card>

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
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} disabled={createLoading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? 'Criando...' : 'Criar conta'}
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
              <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleteLoading}>
                Cancelar
              </Button>
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                {deleteLoading ? 'Excluindo...' : 'Confirmar exclusão'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
