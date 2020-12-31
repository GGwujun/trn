import destr from "destr";
import { nanoid } from "nanoid";
import { updateUserNuxtRc } from "./utils/nuxtrc";
import { Telemetry } from "./telemetry";
import { Nuxt, TelemetryOptions } from "./types";
import { ensureUserconsent } from "./consent";
import log from "./utils/log";
import { hash } from "./utils/hash";

async function _telemetryModule(
  options: { telemetry?: boolean; debug?: boolean } = {}
) {
  const toptions: TelemetryOptions = {
    endpoint:
      destr(process.env.NUXT_TELEMETRY_ENDPOINT) ||
      "https://telemetry.nuxtjs.com",
    debug: destr(process.env.NUXT_TELEMETRY_DEBUG),
  };

  if (!toptions.debug) {
    log.level = -Infinity;
  }

  if (options.telemetry !== true) {
    if (
      toptions.enabled === false ||
      options.telemetry === false ||
      !(await ensureUserconsent(toptions))
    ) {
      log.info("Telemetry disabled");
      return;
    }
  }

  log.info("Telemetry enabled");

  if (!toptions.seed) {
    toptions.seed = hash(nanoid());
    updateUserNuxtRc("telemetry.seed", toptions.seed);
    log.info("Seed generated:", toptions.seed);
  }

  const t = new Telemetry({}, toptions);

  t.createEvent("project");
  t.createEvent("session");
  t.createEvent("command");
  t.sendEvents();

  profile(t);
}

async function telemetryModule() {
  try {
    await _telemetryModule();
  } catch (err) {
    log.error(err);
  }
}

function profile(t: Telemetry) {
  const startT: any = {};
  const duration: any = {};

  const timeStart = (name: string) => {
    startT[name] = Date.now();
  };
  const timeEnd = (name: string) => {
    duration[name] = Date.now() - startT[name];
  };

  timeStart("generate");
  timeEnd("generate");
}

export default telemetryModule;
