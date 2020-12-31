import { readdirSync } from "fs";
import { join } from "path";

// utils must build before core
const headPkgs = ["trn-utils", "trn-config"];
const tailPkgs = ["trn-core"];
const otherPkgs = readdirSync(join(__dirname, "packages")).filter(
  (pkg) =>
    pkg.charAt(0) !== "." && !headPkgs.includes(pkg) && !tailPkgs.includes(pkg)
);

export default {
  target: "node",
  cjs: { type: "babel", lazy: true },
  disableTypeCheck: true,
  pkgs: [...headPkgs, ...otherPkgs, ...tailPkgs],
};
