'use server';
import { signIn } from '@/app/lib/auth';
import { fetchUserByEmail } from '@/app/query/users/data';

export async function authenticate(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = formData.get('redirectTo') as string || '/dashboard';
  
  console. log('E-mail:', email);
  console.log('Senha:', password);
  console.log('Redirecionar para:', redirectTo);

  const user = await fetchUserByEmail(email);
  if (!user) return 'E-mail não cadastrado.';

  try {
    const redirectTo = formData.get('redirectTo') as string || '/dashboard';
    await signIn('credentials', formData, { redirectTo });
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      // Deixe o erro ser lançado para o Next.js redirecionar!
      throw error;
    }
    if (error?.type === 'CredentialsSignin' || error?.message?.includes('CredentialsSignin')) {
      return 'Senha incorreta.';
    }
    return 'Erro ao tentar autenticar. Tente novamente.';
  }
}
