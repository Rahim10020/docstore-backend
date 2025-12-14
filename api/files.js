import { getDrive } from "./google.js";

export default async function handler(req, res) {
    // Autoriser uniquement GET
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const drive = getDrive();

        // Lister les fichiers avec tous les champs nécessaires
        const response = await drive.files.list({
            pageSize: 100,
            fields: "nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, iconLink, thumbnailLink)",
            orderBy: "createdTime desc",
            // Exclure les fichiers dans la corbeille
            q: "trashed=false"
        });

        // Formater les fichiers pour s'assurer que tous les champs sont présents
        const files = (response.data.files || []).map(file => ({
            id: file.id,
            name: file.name || 'Sans nom',
            mimeType: file.mimeType || 'application/octet-stream',
            size: file.size || '0',
            createdTime: file.createdTime,
            modifiedTime: file.modifiedTime,
            webViewLink: file.webViewLink,
            iconLink: file.iconLink,
            thumbnailLink: file.thumbnailLink
        }));

        res.status(200).json({
            success: true,
            count: files.length,
            files: files,
            nextPageToken: response.data.nextPageToken
        });
    } catch (e) {
        console.error("List files error:", e);
        res.status(500).json({
            success: false,
            error: e.message,
            details: e.response?.data || null
        });
    }
}