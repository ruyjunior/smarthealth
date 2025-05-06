'use server'
import { signIn } from '@/app/lib/auth';
import AuthError  from 'next-auth';


export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    console.log('formData', formData);
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }
  