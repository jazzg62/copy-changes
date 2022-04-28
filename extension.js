// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const cgcf = require('cgcf');
const path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const workspaceRoot = vscode.workspace.rootPath;
const tmp = '.git/'+(Math.random()*100000).toFixed(0);
const target_path = path.join(workspaceRoot,tmp);

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cgcf" is now active!');
	

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('cgcf.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from cgcf!');

		// 获取当前路径
		// 列出所有更改的文件
		// 复制文件出来
	});

	let copyChanges = vscode.commands.registerCommand('cgcf.copyChanges', async function(){
		// let editor = vscode.window.activeTextEditor;
		// if (!editor) {
		// 	vscode.window.showInformationMessage('No editor is active');
		// 	return;
		// }
		// let document = editor.document;
		// console.log(document);
		// let text = document.getText();
		// vscode.env.clipboard.writeText(text);
		// vscode.window.showInformationMessage(workspaceRoot);
		cgcf.clear(target_path);
        let res = await cgcf.getGitRepoChanges(workspaceRoot);
        
        let source_file = "", target_file = "";
        for (let i in res) {
            source_file = path.resolve(workspaceRoot, res[i]);
            target_file= path.join(target_path, res[i]);
            cgcf.log(`[${workspaceRoot}] copy [${Number(i)+1}]: ${source_file} to ${target_file}`);
            cgcf.copy(source_file, target_file);
        }
        cgcf.log("total files:", res.length);
        cgcf.log("target path:", target_path);
		cgcf.openInExplorer(target_path);
	})

	context.subscriptions.push(disposable);
	context.subscriptions.push(copyChanges);
}

// this method is called when your extension is deactivated
function deactivate() {
	cgcf.clear(target_path);
}

module.exports = {
	activate,
	deactivate
}
