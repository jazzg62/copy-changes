// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import vscode from 'vscode';
import * as utils from './utils';
import path from 'path';
import fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const workspaceRoot = vscode.workspace.rootPath as string;
// const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.path;
const tmp = '.git/cc.changes';
const target_path = path.join(workspaceRoot,tmp);

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context:vscode.ExtensionContext) {
	let showChanges = vscode.commands.registerCommand('cc.showChanges', function(){
		console.log(target_path)
		utils.clear(target_path);
        let changes = utils.getGitRepoChanges(workspaceRoot);
		console.log(changes);
		if(changes.length === 0){
			vscode.window.showWarningMessage('无文件改动！');
			return ;
		}
        let source_file = "", target_file = "";
		let count = 0;
        for (let item of changes) {
            source_file = path.resolve(workspaceRoot, item);
            target_file= path.join(target_path, item);
			count++;
            utils.copy(source_file, target_file);
        }
		if(utils.openInExplorer(target_path))
			vscode.window.showInformationMessage(`成功！共${count}个项目`);
		else
			vscode.window.showInformationMessage(`出现错误！`);
	})

	let showSelectChanges= vscode.commands.registerCommand('cc.showSelectedChanges', function(){
		utils.clear(target_path);
		let changes = arguments;
		if(changes.length === 0){
			vscode.window.showWarningMessage('无文件改动！');
			return ;
		}
		let source_file = "", target_file = "";
		let count = 0;
        for (let item of changes) {
			if(!item) continue;
			source_file = item['resourceUri']['_fsPath'];
			// 文件不存在时，忽略
			if(!fs.existsSync(source_file)) continue;
			target_file = source_file.replace(workspaceRoot, target_path);
			count++;
			utils.copy(source_file, target_file);
        }
		if(count == 0){
			vscode.window.showWarningMessage('无新增或修改的文件！');
			return ;
		}
		if(utils.openInExplorer(target_path))
			vscode.window.showInformationMessage(`成功！共${count}个项目`);
		else
			vscode.window.showInformationMessage(`出现错误！`);
	})

	context.subscriptions.push(showChanges);
	context.subscriptions.push(showSelectChanges);
}

// this method is called when your extension is deactivated
function deactivate() {
	if(fs.existsSync(target_path))
		utils.clear(target_path);
}

module.exports = {
	activate,
	deactivate
}
