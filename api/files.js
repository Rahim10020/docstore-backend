import { getDrive } from "./google.js";

export default async function handler(req, res) {
    // Autoriser uniquement GET
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const drive = getDrive();

        // Lister les fichiers
        const response = await drive.files.list({
            pageSize: 100,
            fields: "files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink)",
            orderBy: "createdTime desc"
        });

        res.status(200).json({
            success: true,
            files: response.data.files || []
        });
    } catch (e) {
        console.error("List files error:", e);
        res.status(500).json({ error: e.message });
    }
}