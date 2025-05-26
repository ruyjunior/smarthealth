'use server'
import { signIn } from '@/app/lib/auth';
import { fetchUserByEmail } from '@/app/query/users/data'; // ajuste para sua função real

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  const email = formData.get('email') as string;
  const user = await fetchUserByEmail(email);

  if (!user) {
    return 'E-mail não cadastrado.';
  }

  try {
    await signIn('credentials', formData);
  } catch (error: any) {
    if (error?.type === 'CredentialsSignin' || error?.message?.includes('CredentialsSignin')) {
      return 'Senha incorreta.';
    }
    return 'Erro ao tentar autenticar. Tente novamente.';
  }
}