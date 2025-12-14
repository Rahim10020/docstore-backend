import { getDrive } from "../../google.js";

export default async function handler(req, res) {
    // Autoriser uniquement GET
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: "File ID required"
        });
    }

    try {
        const drive = getDrive();

        // Récupérer UN SEUL fichier par son ID
        const response = await drive.files.get({
            fileId: id,
            fields: "id, name, mimeType, size, createdTime, modifiedTime, webViewLink, iconLink, thumbnailLink",
            supportsAllDrives: true
        });

        const file = response.data;

        res.status(200).json({
            success: true,
            file: {
                id: file.id,
                name: file.name || 'Sans nom',
                mimeType: file.mimeType || 'application/octet-stream',
                size: file.size || '0',
                createdTime: file.createdTime,
                modifiedTime: file.modifiedTime,
                webViewLink: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
                iconLink: file.iconLink || '',
                thumbnailLink: file.thumbnailLink || ''
            }
        });
    } catch (e) {
        console.error(`Get file ${id} error:`, e);

        // Erreur 404 si le fichier n'existe pas
        if (e.code === 404 || e.message?.includes('not found')) {
            return res.status(404).json({
                success: false,
                error: "File not found",
                fileId: id
            });
        }

        res.status(500).json({
            success: false,
            error: e.message,
            details: e.response?.data || null
        });
    }
}