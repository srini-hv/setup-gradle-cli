import * as core from '@actions/core';
import * as installer from './installer';

async function run() {
  try {
    let version = core.getInput('gradle-version');
    core.debug(`VERSION = '${version}'`);
    if (version) {
      await installer.getGradle(version);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
