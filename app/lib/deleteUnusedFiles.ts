import { sql } from "@vercel/postgres";
import { list, del } from '@vercel/blob';

// Função para buscar todos os arquivos do storage (Vercel Blob API)
async function listAllBlobFiles() {
    // Exemplo usando Vercel Blob REST API
    const data = await list();
    return data.blobs || [];
}

export async function deleteUnusedFiles() {
    // 1. Busca todos os avatarurl usados
    const avatarResult = await sql`
        SELECT avatarurl FROM smarthealth.users
        `;
    const logoResult = await sql`
        SELECT logourl FROM smarthealth.clinics
        `;
    const usedAvatarUrls = avatarResult.rows.map(u => u.avatarurl).filter(Boolean);
    const usedLogoUrls = logoResult.rows.map(u => u.logourl).filter(Boolean);
    const usedUrls = usedAvatarUrls;
    usedUrls.push(...usedLogoUrls);

    // 2. Busca todos os arquivos do storage
    const allFiles = await listAllBlobFiles();
    console.log("All files in storage:", allFiles.length);


    // 3. Filtra arquivos não usados
    interface BlobFile {
        url: string;
        [key: string]: any;
    }

    interface UserRow {
        avatarurl: string | null;
    }

    const unusedFiles: BlobFile[] = (allFiles as BlobFile[]).filter(
        (file: BlobFile) => !usedUrls.includes(file.url)
    );

    // 4. Exclui do storage
    for (const file of unusedFiles) {
        await del(file.url );
    }
    console.log("Deleted unused files:", unusedFiles.length);

    return { deleted: unusedFiles.length };
}