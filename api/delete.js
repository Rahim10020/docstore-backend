import { getDrive } from "./google.js";

export default async function handler(req, res) {
    // Autoriser uniquement DELETE
    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "Missing file id parameter" });
        }

        const drive = getDrive();

        // Supprimer le fichier
        await drive.files.delete({
            fileId: id
        });

        res.status(200).json({
            success: true,
            message: "File deleted successfully",
            fileId: id
        });
    } catch (e) {
        console.error("Delete error:", e);
        res.status(500).json({ error: e.message });
    }
}