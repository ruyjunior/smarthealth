import { NextResponse } from 'next/server';
import { fetchFilteredUsers, fetchUsers } from '@/app/query/users/data';


export async function GET() {
    try {
        const users = await fetchUsers();
        return NextResponse.json({ users });
    } catch (error) {
        console.error('Erro ao buscar:', error);

        return NextResponse.json(
            { error: (error as Error).message }, // Aqui forçamos `error` a ser do tipo `Error`
            { status: 500 }
        );
    }
}