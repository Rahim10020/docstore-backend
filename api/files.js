import { getDrive } from "./google.js";

export default async function handler(req, res) {
    // Autoriser uniquement GET
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const drive = getDrive();

        // Récupérer TOUS les fichiers avec pagination
        let allFiles = [];
        let pageToken = null;

        do {
            // Lister les fichiers avec tous les champs nécessaires
            const response = await drive.files.list({
                pageSize: 100, // Maximum par requête
                pageToken: pageToken, // Token pour la page suivante
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

            // Ajouter les fichiers de cette page au total
            allFiles = allFiles.concat(files);

            // Récupérer le token pour la page suivante
            pageToken = response.data.nextPageToken;

            console.log(`Page récupérée: ${files.length} fichiers. Total: ${allFiles.length}`);

        } while (pageToken); // Continue tant qu'il y a des pages

        console.log(`TOUS les fichiers récupérés: ${allFiles.length} au total`);

        res.status(200).json({
            success: true,
            count: allFiles.length,
            files: allFiles,
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