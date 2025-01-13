import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { getS3Url, uploadBufferToS3 } from "./s3";

export async function generatePdfThumbnail(pdfKey: string): Promise<string | null> {
  try {
    console.log("[DEBUG] Début de generatePdfThumbnail pour le PDF :", pdfKey);

    // 1) Télécharger le PDF
    const pdfUrl = getS3Url(pdfKey);
    const pdfBuffer = await fetch(pdfUrl).then((res) => {
      if (!res.ok) throw new Error("Impossible de télécharger le PDF.");
      return res.arrayBuffer();
    });
    console.log("[DEBUG] PDF téléchargé avec succès.");

    // 2) Écrire le PDF dans /tmp
    const tmpDir = os.tmpdir();
    const tmpPdfPath = path.join(tmpDir, `pdf-${Date.now()}.pdf`);
    const tmpImagePath = path.join(tmpDir, `preview-${Date.now()}.png`);
    fs.writeFileSync(tmpPdfPath, Buffer.from(pdfBuffer));
    console.log("[DEBUG] PDF écrit dans le fichier temporaire :", tmpPdfPath);

    // 3) Convertir la 1ère page en PNG via pdftoppm
    console.log("[DEBUG] Lancement de pdftoppm...");
    await new Promise((resolve, reject) => {
      execFile(
        "pdftoppm",
        ["-png", "-f", "1", "-singlefile", tmpPdfPath, tmpImagePath.replace(".png", "")],
        (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            resolve(stdout || stderr);
          }
        }
      );
    });
    console.log("[DEBUG] pdftoppm terminé.");

    // 4) Vérifier si le PNG a bien été créé
    if (!fs.existsSync(tmpImagePath)) {
      throw new Error("Miniature non générée.");
    }

    // 5) Lire l'image en Buffer
    const thumbnailBuffer = fs.readFileSync(tmpImagePath);

    // 6) Uploader ce buffer sur S3
    const { file_key: thumbnailKey } = await uploadBufferToS3(thumbnailBuffer, "thumbnail.png");
    console.log("[DEBUG] Miniature uploadée sur S3 avec succès :", thumbnailKey);

    // 7) Nettoyer les fichiers temporaires
    fs.unlinkSync(tmpPdfPath);
    fs.unlinkSync(tmpImagePath);

    // On retourne la clé de la miniature S3
    return thumbnailKey;
  } catch (error) {
    console.error("[ERROR] Erreur dans generatePdfThumbnail :", error);
    return null;
  }
}
