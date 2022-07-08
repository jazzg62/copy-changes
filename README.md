# 介绍

这个拓展可以让你复制git项目中有改动的部分，包含文件和文件夹

This extension allows you to copy the part of the project that has been changed, including files and folders.


## 如何使用

![demo](https://jazzg62.github.io/cgcf-extension/demo.gif)

打开侧边栏Source Control, 右键点击更改的文件，选择Copy Changes
或直接运行命令Copy Changes

在成功复制后，会自动打开存储所有改动文件的临时文件夹


## 特性

复制git项目中改动的文件和文件夹 [✔]

支持windows [✔]


## 已知问题

目前仅支持windows，其他环境未做测试！！！

如复制文件出现错误，可检查改动的文件或文件夹中是否出现中文，如出现中文，可尝试运行以下命令修复。
```bash
git config --global core.quotepath false
```