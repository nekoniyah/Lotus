import fs from "fs/promises";
import path from "path";

export default async function loadDirectoryList(
  baseDir: string,
  defaultDir: string,
) {
  const files = await fs.readdir(baseDir, { withFileTypes: true });

  /**
   * Key of the map is the child directory of "folderpath" (first call)
   * That child directory is also called as "main dir".
   *
   * The values, in the other hand, are all paths to files inside that child directory.
   *
   * There can be many child directories, sub-folders of "main dirs" can't be main dirs.
   */

  let map: { [key: string]: string[] } = {};

  for (let file of files) {
    if (file.isDirectory()) {
      const filepath = path.join(baseDir, file.name);

      const daMap = await loadDirectoryList(filepath, defaultDir);

      for (let d in daMap) {
        if (map[d]) map[d] = [...map[d]!, ...daMap[d]!];
        else map[d] = daMap[d]!;
      }
    } else {
      if (file.parentPath === defaultDir) {
        // FILE is not nested at all
        let mainDirName = file.name;
        map[mainDirName.replace(".ts", "")] = [
          `${file.parentPath}/${mainDirName}`,
        ];
      } else {
        // This the most nested FILE (typescript)

        let mainDir = defaultDir;
        let index = mainDir.split("/").length; // Will change later for more flexibility

        const mainDirName = file.parentPath.split("/")[index]!;

        if (map[mainDirName])
          map[mainDirName] = [
            ...map[mainDirName],
            `${file.parentPath}/${file.name}`,
          ];
        else map[mainDirName] = [`${file.parentPath}/${file.name}`];
      }
    }
  }

  return map;
}
