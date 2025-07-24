import { list } from '@vercel/blob';

export default async function Blobs() {
    const response = await list();

    return (
        <>
        <h1>Blobs</h1>
        <p>Quantidade de arquivos: {response.blobs.length}</p>
            {response.blobs.map((blob) => (
                <a key={blob.pathname} href={blob.downloadUrl}>
                    <div>
                        <img
                            src={blob.url}
                            alt={blob.pathname}
                            width={40}
                            className="rounded" />
                        {blob.url}
                    </div>
                </a>
            ))}
        </>
    );
}