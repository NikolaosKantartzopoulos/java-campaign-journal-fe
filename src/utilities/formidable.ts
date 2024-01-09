import { NextApiRequest } from "next";
import formidable from "formidable";
import path from "path";

export const saveFile = (
  req: NextApiRequest,
  saveLocally?: boolean,
  folderName?: string,
  fileName?: string
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  console.log(`${process.env.FILE_STORAGE_PATH}`, folderName);
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(
      process.env.FILE_STORAGE_PATH || "/public/",
      folderName || ""
    );
    if (fileName) {
      options.filename = (ext) => {
        return fileName + ext;
      };
    } else {
      // options.filename = (name, ext, path, form) => {
      options.filename = (path) => {
        return Date.now().toString() + "_" + path.originalFilename;
      };
    }
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
