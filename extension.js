// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const cgcf = require('cgcf');
const path = require('path');
const fs = require('fs');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const workspaceRoot = vscode.workspace.rootPath;
const tmp = '.git/cc.changes';
const target_path = path.join(workspaceRoot,tmp);

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let copyChanges = vscode.commands.registerCommand('cc.copyChanges', function(){
		cgcf.clear(target_path);
        let res = cgcf.getGitRepoChanges(workspaceRoot);
		if(res.length === 0){
			vscode.window.showWarningMessage('无文件改动！');
			return ;
		}
        let source_file = "", target_file = "";
        for (let i in res) {
            source_file = path.resolve(workspaceRoot, res[i]);
            target_file= path.join(target_path, res[i]);
            cgcf.copy(source_file, target_file);
        }
		if(cgcf.openInExplorer(target_path))
			vscode.window.showInformationMessage(`拷贝成功！共${res.length}个项目`);
		else
			vscode.window.showInformationMessage(`拷贝出错！`);
	})

	context.subscriptions.push(copyChanges);
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