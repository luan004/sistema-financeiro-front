import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NumericFormat } from 'react-number-format'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DateDisplay } from '@/components/common/DateDisplay'
import { api } from '../services/api'
import { useSession } from '../context/SessionContext'

const formatAmount = (amount) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)

export default function Dashboard() {
  const navigate = useNavigate()
  const { session } = useSession()
  const [totalBalance, setTotalBalance] = useState(0)
  const [movements, setMovements] = useState([])

  useEffect(() => {
    if (!session?.token) {
      navigate('/login')
      return
    }

    loadData()
  }, [session, navigate])

  const loadData = async () => {
    try {
      const [accounts, movementsData] = await Promise.all([
        api.get('/accounts?page=1&limit=100', { auth: true }),
        api.get('/movements?page=1&limit=10', { auth: true }),
      ])

      const balance = Array.isArray(accounts)
        ? accounts.reduce((sum, account) => sum + (account.balance || 0), 0)
        : 0

      setTotalBalance(balance)
      setMovements(Array.isArray(movementsData) ? movementsData : [])
    } catch {}
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-slate-500">Resumo do sistema financeiro.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Saldo total</CardTitle>
            <CardDescription>Somatório de todas as contas</CardDescription>
          </CardHeader>
          <CardContent>
            <NumericFormat
              value={totalBalance}
              displayType="text"
              thousandSeparator=""
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              prefix="R$ "
              className={`text-3xl font-semibold ${totalBalance < 0 ? 'text-destructive' : ''}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimas movimentações</CardTitle>
            <CardDescription>Últimas 10 entradas e saídas</CardDescription>
          </CardHeader>
          <CardContent>
            {movements.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhuma movimentação registrada.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-slate-500">
                      <th className="py-1 pr-2">Descrição</th>
                      <th className="py-1 pr-2">Valor</th>
                      <th className="py-1">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.map((movement) => (
                      <tr key={movement.id} className="border-b last:border-0">
                        <td className="py-2 pr-2">{movement.description}</td>
                        <td className={`py-2 pr-2 ${movement.amount < 0 ? 'text-destructive' : ''}`}>
                          {formatAmount(movement.amount)}
                        </td>
                        <td className="py-2"><DateDisplay date={movement.createdAt} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
