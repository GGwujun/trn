import os from "os";
import { promises as fs } from "fs";
import inquirer from "inquirer";
import path from "path";
import yaml from "yaml";
import { isShortDateStr, mark, getProfileFromFile } from "./profile";

function generateQuestions({ username }: any) {
  return [
    {
      type: "input",
      name: "username",
      message: "tanzk username",
      default: username,
    },
  ];
}

export default async function config() {
  const profile = await getProfileFromFile();

  const username = mark(profile.username);

  let newProf = await inquirer.prompt(
    generateQuestions({
      username: profile.username,
    })
  );

  if (newProf.username === username) {
    newProf.username = profile.username;
  }

  const configDir = path.join(process.env.HOME || os.homedir(), ".tzcli");

  const profPath = path.join(configDir, "config.yaml");
  const exists: any = await fs.access(profPath, 0);

  let profYml;

  if (!exists) {
    const profContent = await fs.readFile(profPath, "utf8");
    profYml = yaml.parse(profContent);
    profYml.username = newProf.username;

    if (!isShortDateStr(profYml.api_version)) {
      profYml.api_version = profYml.api_version.slice(0, 10);
    }
  } else {
    profYml = {
      api_version: "2020-11-12",
      username: newProf.username,
      debug: false,
    };
    await fs.mkdir(configDir);
  }

  await fs.writeFile(profPath, yaml.stringify(profYml), {
    mode: parseInt("0600", 8),
  });

  return profYml;
}
