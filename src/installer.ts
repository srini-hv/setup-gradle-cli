// Load tempDirectory before it gets wiped by tool-cache
let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';

import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as path from 'path';


export async function getGradle(version: string) {
  let toolPath: string;
  toolPath = tc.find('gradle', version);

  if (!toolPath) {
    toolPath = await downloadGradle(version);
  }

  //toolPath = path.join(toolPath, 'bin');
  core.debug(`toolPath = ${toolPath}`);
  var toolBinPath = path.join(toolPath, 'bin');
  core.addPath(toolBinPath);
}

async function downloadGradle(version: string): Promise<string> {
  var downloadUrl = `https://gradle.org/next-steps/?version=${version}&format=bin`;
  var tool = 'gradle';
  core.debug(`downloading ${downloadUrl}`);

  try {
    const downloadPath = await tc.downloadTool(downloadUrl);
    core.debug(`downloadPath = '${downloadPath}'`);
    const fullPath = path.join(downloadPath,`gradle-${version}-bin`)
    const extractedPath = await tc.extractZip(fullPath);
    core.debug(`extractedPath = '${extractedPath}'`);
    let toolRoot = path.join(extractedPath, tool);
    core.debug(`toolRoot = '${toolRoot}'`);
    return await tc.cacheDir(toolRoot, tool, version);
  } catch (err) {
    throw err;
  }
}
