import { NextApiRequest } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import logger from "../../logger";

export const saveFile = (
  req: NextApiRequest,
  saveLocally?: boolean,
  folderName?: string,
  fileName?: string
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(
      process.env.FILE_STORAGE_PATH || "/public/",
      folderName || ""
    );

    options.filename = () => fileName as string;
    options.keepExtensions = true;
  }
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};
export async function readImageFromDrive(
  folderName?: string,
  fileName?: string
) {
  // Replace 'path/to/your/image.jpg' with the actual path to your image file
  const imagePath = path.join(
    process.env.FILE_STORAGE_PATH || "/public/",
    folderName || "",
    fileName || ""
  );
  try {
    // Reading the image file using fs.promises.readFile()
    const image = await fs.readFile(imagePath);
    // Encode the image data to Base64
    const base64Image = Buffer.from(image).toString("base64");
    return base64Image;
  } catch (err) {
    logger.error("Error reading the file:", err);
    return null; // Return null or handle the error accordingly
  }
}

export async function deleteImageFromDrive(
  folderName?: string,
  fileName?: string
) {
  const imagePath = path.join(
    process.env.FILE_STORAGE_PATH || "/public/",
    folderName || "",
    fileName || ""
  );
  try {
    // Reading the image file using fs.promises.readFile()
    await fs.unlink(imagePath);
    // Encode the image data to Base64
  } catch (err) {
    logger.error("Error reading the file:", err);
    return null; // Return null or handle the error accordingly
  }
}
