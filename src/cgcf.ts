import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

/**
 * 复制文件
 */
export function copy(src: string, dst: string): void {
    // 处理文件夹
    if (fs.statSync(src).isDirectory()) {
        fs.mkdirSync(dst, { recursive: true })
        copyFolder(src, dst);
        return;
    }
    // 处理文件
    const dirname = path.dirname(dst);
    // 创建对应的文件夹
    if (!fs.existsSync(dst)) fs.mkdirSync(dirname, { recursive: true });
    fs.copyFileSync(src, dst);
}

/**
 * 复制文件夹
 */
export function copyFolder(srcDir: string, desDir: string): void {
    fs.readdir(srcDir, { withFileTypes: true }, (err, files) => {
        for (const file of files) {
            //判断是否为文件夹
            if (file.isDirectory()) {
                const dirS = path.resolve(srcDir, file.name);
                const dirD = path.resolve(desDir, file.name);
                //判断是否存在dirD文件夹
                if (!fs.existsSync(dirD)) {
                    fs.mkdir(dirD, (err) => {
                        if (err) console.log(err);
                    });
                }
                copyFolder(dirS, dirD);
            } else {
                const srcFile = path.resolve(srcDir, file.name);
                const desFile = path.resolve(desDir, file.name);
                fs.copyFileSync(srcFile, desFile);
            }
        }
    })
}

/**
 * 打印日志
 */
export function log() {
    console.log(...arguments);
}

/**
 * 解析diff文本
 */
export function parse(statusText: string): string[] {
    let arr = statusText.split("\n");
    let res: string[] = [];
    arr.forEach((el) => {
        if (el.startsWith("\t")) {
            res.push(el);
        }
    })
    let del: number[] = [];
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

/**
 * 清空路径下的文件
 */
export function clear(path: string): void {
    if (!fs.existsSync(path))
        return;
    try {
        fs.rmSync(path, { recursive: true, force: true });
    } catch (e) {
        console.warn(e);
    }
}

/**
 * 获取git项目的改变文件列表
 */
export function getGitRepoChanges(path: string): string[] {
    if (!fs.existsSync(path))
        return [];
    let data = execSync(`cd /D ${path} && git status`).toString();
    return parse(data);
}

/**
 * 在文件浏览器中打开
 */
export function openInExplorer(path: string): boolean {
    if (!fs.existsSync(path))
        return false;
    execSync(`start "" "${path}"`);
    return true;
}
