import path from "path";
import os from "os";
import yaml from "yaml";
import { promises as fs } from "fs";

export function mark(source: string) {
  if (!source) {
    return source;
  }
  const subStr = source.slice(-4);
  return `***********${subStr}`;
}

export function isShortDateStr(str: string) {
  //example:2008-07-22
  var dateFormat = /^\d{4}-\d{2}-\d{2}$/;
  return dateFormat.test(str);
}

export async function getProfileFromFile() {
  const profPath = path.join(
    process.env.HOME || os.homedir(),
    ".tzcli/config.yaml"
  );
  const exists: any = await fs.access(profPath);

  var profile = {
    username: "",
  };

  if (!exists) {
    return profile;
  }

  const profContent = await fs.readFile(profPath, "utf8");
  const profYml = yaml.parse(profContent);

  if (profYml.username) {
    profile.username = profYml.username;
  }

  return profile;
}
