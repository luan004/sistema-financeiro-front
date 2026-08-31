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
import { AuthService } from '../services/AuthService'

export default function Login() {
  const navigate = useNavigate()
  const { session, login } = useSession()
  const [loginData, setLoginData] = useState({ mail: '', password: '' })
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' })
  const [loginLoading, setLoginLoading] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)

  useEffect(() => {
    if (session?.token) {
      navigate('/dashboard')
    }
  }, [session, navigate])

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoginLoading(true)

    try {
      const data = await AuthService.login(loginData.mail, loginData.password)

      login({
        token: data.token,
        userId: data.userId,
        mail: loginData.mail,
      })

      setLoginData({ mail: '', password: '' })
      navigate('/dashboard')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    setRegisterLoading(true)

    try {
      await AuthService.register(registerData.name, registerData.email, registerData.password)

      setRegisterData({ name: '', email: '', password: '' })
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="flex w-full max-w-4xl flex-col gap-6 md:flex-row">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Informe suas credenciais para acessar o sistema.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <FieldSet>
                <Field>
                  <FieldLabel>E-mail</FieldLabel>
                  <FieldContent>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={loginData.mail}
                      onChange={(event) => setLoginData({ ...loginData, mail: event.target.value })}
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
                      value={loginData.password}
                      onChange={(event) => setLoginData({ ...loginData, password: event.target.value })}
                      required
                    />
                  </FieldContent>
                </Field>

                <Button type="submit" disabled={loginLoading} className="w-full">
                  {loginLoading ? 'Entrando...' : 'Entrar'}
                </Button>
              </FieldSet>
            </form>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para se cadastrar.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <FieldSet>
                <Field>
                  <FieldLabel>Nome</FieldLabel>
                  <FieldContent>
                    <Input
                      placeholder="Seu nome"
                      value={registerData.name}
                      onChange={(event) => setRegisterData({ ...registerData, name: event.target.value })}
                      required
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>E-mail</FieldLabel>
                  <FieldContent>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={registerData.email}
                      onChange={(event) => setRegisterData({ ...registerData, email: event.target.value })}
                      required
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Senha</FieldLabel>
                  <FieldContent>
                    <Input
                      type="password"
                      placeholder="Crie uma senha"
                      value={registerData.password}
                      onChange={(event) => setRegisterData({ ...registerData, password: event.target.value })}
                      required
                    />
                  </FieldContent>
                </Field>

                <Button type="submit" disabled={registerLoading} className="w-full">
                  {registerLoading ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
              </FieldSet>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
