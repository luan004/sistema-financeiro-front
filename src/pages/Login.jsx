import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  Field,
  FieldContent,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'

import { useSession } from '../context/SessionContext'
import { api } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const { session, login } = useSession()
  const [formData, setFormData] = useState({ mail: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (session?.token) {
      navigate('/dashboard')
    }
  }, [session, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const data = await api.post('/login', {
        mail: formData.mail,
        password: formData.password,
      })

      login({
        token: data.token,
        userId: data.userId,
        mail: formData.mail,
      })

      setSuccess('Login realizado com sucesso.')
      setFormData({ mail: '', password: '' })
      navigate('/dashboard')
    } catch (err) {
      setError(err.detail)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>
            Informe suas credenciais para acessar o sistema.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldSet>
              <Field>
                <FieldLabel>E-mail</FieldLabel>
                <FieldContent>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.mail}
                    onChange={(event) => setFormData({ ...formData, mail: event.target.value })}
                    required
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Senha</FieldLabel>
                <FieldContent>
                  <Input
                    type="password"
                    placeholder="Digite sua senha"
                    value={formData.password}
                    onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                    required
                  />
                </FieldContent>
              </Field>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </FieldSet>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}