// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const cgcf = require('cgcf');
const path = require('path');
const fs = require('fs');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const workspaceRoot = vscode.workspace.rootPath;
// const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.path;
const tmp = '.git/cc.changes';
const target_path = path.join(workspaceRoot,tmp);

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let copyChanges = vscode.commands.registerCommand('cc.copyChanges', function(){
		cgcf.clear(target_path);
        let changes = cgcf.getGitRepoChanges(workspaceRoot);
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
            cgcf.copy(source_file, target_file);
        }
		if(cgcf.openInExplorer(target_path))
			vscode.window.showInformationMessage(`拷贝成功！共${count}个项目`);
		else
			vscode.window.showInformationMessage(`拷贝出错！`);
	})

	let copySelectChanges= vscode.commands.registerCommand('cc.copySelectedChanges', function(){
		cgcf.clear(target_path);
		let changes = arguments;
		if(changes.length === 0){
			vscode.window.showWarningMessage('无文件改动！');
			return ;
		}
		let source_file = "", target_file = "";
		let count = 0;
        for (let item of changes) {
			source_file = item['_resourceUri']['_fsPath'];
			// 文件不存在时，忽略
			if(!fs.existsSync(source_file)) continue;
			target_file = source_file.replace(workspaceRoot, target_path);
			count++;
			cgcf.copy(source_file, target_file);
        }
		if(count == 0){
			vscode.window.showWarningMessage('无新增或修改的文件！');
			return ;
		}
		if(cgcf.openInExplorer(target_path))
			vscode.window.showInformationMessage(`拷贝成功！共${count}个项目`);
		else
			vscode.window.showInformationMessage(`拷贝出错！`);
	})

	context.subscriptions.push(copyChanges);
	context.subscriptions.push(copySelectChanges);
}

// this method is called when your extension is deactivated
function deactivate() {
	if(fs.existsSync(target_path))
		cgcf.clear(target_path);
}

module.exports = {
	activate,
	deactivate
}