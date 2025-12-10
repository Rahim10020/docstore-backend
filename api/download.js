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

        // Récupérer les métadonnées du fichier
        const fileMeta = await drive.files.get({
            fileId: id,
            fields: "name, mimeType"
        });

        // Télécharger le contenu du fichier
        const file = await drive.files.get(
            { fileId: id, alt: "media" },
            { responseType: "stream" }
        );

        // Définir les headers appropriés
        res.setHeader("Content-Type", fileMeta.data.mimeType || "application/octet-stream");
        res.setHeader("Content-Disposition", `attachment; filename="${fileMeta.data.name}"`);

        // Stream le fichier vers la réponse
        file.data.pipe(res);
    } catch (e) {
        console.error("Download error:", e);
        res.status(500).json({ error: e.message });
    }
}