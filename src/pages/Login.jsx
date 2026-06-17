import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Field,
  FieldContent,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

export default function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>
            Informe suas credenciais para acessar o sistema.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form>
            <FieldSet>
              <Field>
                <FieldLabel>E-mail</FieldLabel>
                <FieldContent>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Senha</FieldLabel>
                <FieldContent>
                  <Input
                    type="password"
                    placeholder="Digite sua senha"
                  />
                </FieldContent>
              </Field>

              <Button type="submit">
                Entrar
              </Button>
            </FieldSet>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}