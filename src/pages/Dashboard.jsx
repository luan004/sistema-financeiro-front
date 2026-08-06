import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-slate-500">Resumo do sistema financeiro.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Saldo</CardTitle>
            <CardDescription>Valor disponível no momento</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">R$ 12.500,00</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movimentações</CardTitle>
            <CardDescription>Últimas entradas e saídas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">24</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
