#!/usr/bin/env node
/**
 * Déclenche un déploiement Render via Deploy Hook ou API.
 * Ajoutez dans env.local :
 *   RENDER_DEPLOY_HOOK=https://api.render.com/deploy/srv-xxx?key=yyy
 * ou :
 *   RENDER_API_KEY=rnd_...
 *   RENDER_SERVICE_ID=srv-...
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvLocal() {
  for (const file of ["env.local", ".env.local", ".env"]) {
    const path = resolve(root, file);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq === -1) continue;
      const key = t.slice(0, eq).trim();
      let val = t.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

loadEnvLocal();

const hook = process.env.RENDER_DEPLOY_HOOK;
const apiKey = process.env.RENDER_API_KEY;
const serviceId = process.env.RENDER_SERVICE_ID;

async function deployViaHook(url) {
  const res = await fetch(url, { method: "POST" });
  if (!res.ok) {
    throw new Error(`Deploy hook failed: ${res.status} ${await res.text()}`);
  }
  console.log("Render deploy triggered (deploy hook).");
}

async function deployViaApi(key, srv) {
  const res = await fetch(`https://api.render.com/v1/services/${srv}/deploys`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  if (!res.ok) {
    throw new Error(`Render API failed: ${res.status} ${await res.text()}`);
  }
  console.log("Render deploy triggered (API).");
}

try {
  if (hook) {
    await deployViaHook(hook);
  } else if (apiKey && serviceId) {
    await deployViaApi(apiKey, serviceId);
  } else {
    console.error(
      "Configurez Render pour déployer depuis la machine :\n" +
        "  • RENDER_DEPLOY_HOOK dans env.local (Render → Service → Settings → Deploy Hook)\n" +
        "  • ou RENDER_API_KEY + RENDER_SERVICE_ID\n" +
        "Sinon : Dashboard Render → Manual Deploy après avoir poussé le code.",
    );
    process.exit(1);
  }
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
