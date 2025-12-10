import { getDrive } from "./google.js";
import { Readable } from "stream";

export default async function handler(req, res) {
    // Autoriser uniquement POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const drive = getDrive();

        const { name, mimeType, data } = req.body;

        if (!name || !mimeType || !data) {
            return res.status(400).json({ error: "Missing required fields: name, mimeType, data" });
        }

        // Convertir base64 en buffer
        const buffer = Buffer.from(data, "base64");
        const stream = Readable.from(buffer);

        // Upload vers Google Drive
        const file = await drive.files.create({
            requestBody: {
                name,
                mimeType
            },
            media: {
                mimeType,
                body: stream
            },
            fields: "id, name, mimeType, size, createdTime"
        });

        res.status(200).json({
            success: true,
            file: file.data
        });
    } catch (e) {
        console.error("Upload error:", e);
        res.status(500).json({ error: e.message });
    }
}