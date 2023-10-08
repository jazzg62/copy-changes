"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openInExplorer = exports.getGitRepoChanges = exports.clear = exports.parse = exports.log = exports.copyFolder = exports.copy = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
/**
 * 复制文件
 */
function copy(src, dst) {
    // 处理文件夹
    if (fs_1.default.statSync(src).isDirectory()) {
        fs_1.default.mkdirSync(dst, { recursive: true });
        copyFolder(src, dst);
        return;
    }
    // 处理文件
    const dirname = path_1.default.dirname(dst);
    // 创建对应的文件夹
    if (!fs_1.default.existsSync(dst))
        fs_1.default.mkdirSync(dirname, { recursive: true });
    fs_1.default.copyFileSync(src, dst);
}
exports.copy = copy;
/**
 * 复制文件夹
 */
function copyFolder(srcDir, desDir) {
    fs_1.default.readdir(srcDir, { withFileTypes: true }, (err, files) => {
        for (const file of files) {
            //判断是否为文件夹
            if (file.isDirectory()) {
                const dirS = path_1.default.resolve(srcDir, file.name);
                const dirD = path_1.default.resolve(desDir, file.name);
                //判断是否存在dirD文件夹
                if (!fs_1.default.existsSync(dirD)) {
                    fs_1.default.mkdir(dirD, (err) => {
                        if (err)
                            console.log(err);
                    });
                }
                copyFolder(dirS, dirD);
            }
            else {
                const srcFile = path_1.default.resolve(srcDir, file.name);
                const desFile = path_1.default.resolve(desDir, file.name);
                fs_1.default.copyFileSync(srcFile, desFile);
            }
        }
    });
}
exports.copyFolder = copyFolder;
/**
 * 打印日志
 */
function log() {
    console.log(...arguments);
}
exports.log = log;
/**
 * 解析diff文本
 */
function parse(statusText) {
    let arr = statusText.split("\n");
    let res = [];
    arr.forEach((el) => {
        if (el.startsWith("\t")) {
            res.push(el);
        }
    });
    let del = [];
    for (let i in res) {
        if (/deleted:    /.test(res[i]))
            del.push(Number(i));
        // 去掉\t
        res[i] = res[i].replace(/\t/g, "");
        // 去掉 modified
        res[i] = res[i].replace(/modified:   /g, "");
        // 去掉 new file
        res[i] = res[i].replace(/new file:   /g, "");
        // 去除 ../
        res[i] = res[i].replace(/\.\.\//g, "");
        // 去掉 renamed
        if (/renamed:    /.test(res[i])) {
            res[i] = res[i].replace(/renamed:    /g, "");
            let d = res[i].split('->');
            res[i] = d[1].trim();
        }
    }
    // 处理删除的文件
    let t = 0;
    for (let i in del) {
        res.splice(del[i] - t, 1);
        t++;
    }
    return res;
}
exports.parse = parse;
/**
 * 清空路径下的文件
 */
function clear(path) {
    if (!fs_1.default.existsSync(path))
        return;
    try {
        fs_1.default.rmSync(path, { recursive: true, force: true });
    }
    catch (e) {
        console.warn(e);
    }
}
exports.clear = clear;
/**
 * 获取git项目的改变文件列表
 */
function getGitRepoChanges(path) {
    if (!fs_1.default.existsSync(path))
        return [];
    let data = (0, child_process_1.execSync)(`cd /D ${path} && git status`).toString();
    return parse(data);
}
exports.getGitRepoChanges = getGitRepoChanges;
/**
 * 在文件浏览器中打开
 */
function openInExplorer(path) {
    if (!fs_1.default.existsSync(path))
        return false;
    (0, child_process_1.execSync)(`start "" "${path}"`);
    return true;
}
exports.openInExplorer = openInExplorer;
