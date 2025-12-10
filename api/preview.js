import { getDrive } from "./google.js";

export default async function handler(req, res) {
    // Autoriser uniquement GET
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "Missing file id parameter" });
        }

        const drive = getDrive();

        // Récupérer les infos du fichier
        const file = await drive.files.get({
            fileId: id,
            fields: "id, name, mimeType, webViewLink"
        });

        // Générer l'URL de prévisualisation
        const previewUrl = `https://drive.google.com/file/d/${id}/preview`;

        res.status(200).json({
            success: true,
            url: previewUrl,
            webViewLink: file.data.webViewLink,
            name: file.data.name,
            mimeType: file.data.mimeType
        });
    } catch (e) {
        console.error("Preview error:", e);
        res.status(500).json({ error: e.message });
    }
}