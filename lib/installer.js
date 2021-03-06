"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGradle = void 0;
// Load tempDirectory before it gets wiped by tool-cache
let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const path = __importStar(require("path"));
async function getGradle(version) {
    let toolPath;
    toolPath = tc.find('gradle', version);
    if (!toolPath) {
        toolPath = await downloadGradle(version);
    }
    //toolPath = path.join(toolPath, 'bin');
    core.debug(`toolPath = ${toolPath}`);
    var toolBinPath = path.join(toolPath, 'bin');
    core.addPath(toolBinPath);
}
exports.getGradle = getGradle;
async function downloadGradle(version) {
    var downloadUrl = `https://services.gradle.org/distributions/gradle-${version}-bin.zip`;
    var tool = 'gradle';
    var toolDirectoryName = `gradle-${version}`;
    core.debug(`downloading ${downloadUrl}`);
    try {
        const downloadPath = await tc.downloadTool(downloadUrl);
        core.debug(`downloadPath = '${downloadPath}'`);
        // const fullPath = path.join(downloadPath,`gradle-${version}-bin.zip`)
        const extractedPath = await tc.extractZip(downloadPath);
        core.debug(`extractedPath = '${extractedPath}'`);
        let toolRoot = path.join(extractedPath, toolDirectoryName);
        core.debug(`toolRoot = '${toolRoot}'`);
        return await tc.cacheDir(toolRoot, tool, version);
    }
    catch (err) {
        throw err;
    }
}
