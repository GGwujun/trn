import os from "os";
import { promises as fs } from "fs";
import path from "path";
import Config from "./config";
import { validateCurrentUser } from "./user";

export const getConfig = async () => {
  const profPath = path.join(os.homedir(), ".tzcli/config.yaml");
  const exists: any = await fs.access(profPath);
  if (exists) {
    console.log("please input tzcli config");
  }
  const { username } = await Config();
  const isExistUser = await validateCurrentUser(username);

  if (isExistUser.length === 0) {
    console.log("isExistUser", "当前用户不存在或已被禁用");
  }
  return isExistUser[0];
};
