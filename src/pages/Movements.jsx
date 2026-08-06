import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Movements() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Movimentações</h1>
        <p className="text-sm text-slate-500">Listagem das movimentações registradas.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimas movimentações</CardTitle>
          <CardDescription>Exemplo inicial da área interna</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Recebimento de cliente — R$ 1.200,00</li>
            <li>• Pagamento de fornecedor — R$ 450,00</li>
            <li>• Transferência interna — R$ 300,00</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
