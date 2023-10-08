"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = __importDefault(require("vscode"));
const utils = __importStar(require("./utils"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
const workspaceRoot = vscode_1.default.workspace.rootPath;
// const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.path;
const tmp = '.git/cc.changes';
const target_path = path_1.default.join(workspaceRoot, tmp);
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let showChanges = vscode_1.default.commands.registerCommand('cc.showChanges', function () {
        console.log(target_path);
        utils.clear(target_path);
        let changes = utils.getGitRepoChanges(workspaceRoot);
        console.log(changes);
        if (changes.length === 0) {
            vscode_1.default.window.showWarningMessage('无文件改动！');
            return;
        }
        let source_file = "", target_file = "";
        let count = 0;
        for (let item of changes) {
            source_file = path_1.default.resolve(workspaceRoot, item);
            target_file = path_1.default.join(target_path, item);
            count++;
            utils.copy(source_file, target_file);
        }
        if (utils.openInExplorer(target_path))
            vscode_1.default.window.showInformationMessage(`成功！共${count}个项目`);
        else
            vscode_1.default.window.showInformationMessage(`出现错误！`);
    });
    let showSelectChanges = vscode_1.default.commands.registerCommand('cc.showSelectedChanges', function () {
        utils.clear(target_path);
        let changes = arguments;
        if (changes.length === 0) {
            vscode_1.default.window.showWarningMessage('无文件改动！');
            return;
        }
        let source_file = "", target_file = "";
        let count = 0;
        for (let item of changes) {
            if (!item)
                continue;
            source_file = item['resourceUri']['_fsPath'];
            // 文件不存在时，忽略
            if (!fs_1.default.existsSync(source_file))
                continue;
            target_file = source_file.replace(workspaceRoot, target_path);
            count++;
            utils.copy(source_file, target_file);
        }
        if (count == 0) {
            vscode_1.default.window.showWarningMessage('无新增或修改的文件！');
            return;
        }
        if (utils.openInExplorer(target_path))
            vscode_1.default.window.showInformationMessage(`成功！共${count}个项目`);
        else
            vscode_1.default.window.showInformationMessage(`出现错误！`);
    });
    context.subscriptions.push(showChanges);
    context.subscriptions.push(showSelectChanges);
}
// this method is called when your extension is deactivated
function deactivate() {
    if (fs_1.default.existsSync(target_path))
        utils.clear(target_path);
}
module.exports = {
    activate,
    deactivate
};
