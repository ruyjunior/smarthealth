'use server';
import { signIn } from '@/app/lib/auth';

type CredentialsError = {
  digest?: string;
  type?: string;
  message?: string;
};

export async function authenticate(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  try {
    const redirectTo = (formData.get('redirectTo') as string) || '/dashboard';
    await signIn('credentials', formData, { redirectTo });
  } catch (error) {
    const credentialsError = error as CredentialsError;
    if (credentialsError?.digest?.startsWith('NEXT_REDIRECT')) {
      // Deixe o erro ser lançado para o Next.js redirecionar!
      throw error;
    }
    if (
      credentialsError?.type === 'CredentialsSignin' ||
      credentialsError?.message?.includes('CredentialsSignin')
    ) {
      // A mesma resposta para e-mail inexistente e senha errada: dizer qual dos
      // dois falhou revela quais endereços têm conta.
      return 'E-mail ou senha incorretos.';
    }
    return 'Erro ao tentar autenticar. Tente novamente.';
  }
}
