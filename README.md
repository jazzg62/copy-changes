# 介绍

这个拓展可以让你复制 git 项目中有改动的部分，包含文件和文件夹

This extension allows you to copy the part of the project that has been changed, including files and folders.

## 如何使用

![demo](https://jazzg62.github.io/cgcf-extension/demo.gif)

打开侧边栏 Source Control, 右键点击更改的文件，选择 Copy Changes
或直接运行命令 Copy Changes

在成功复制后，会自动打开存储所有改动文件的临时文件夹

## 特性

复制 git 项目中改动的文件和文件夹

支持选择部分改动复制

## 已知问题

目前仅支持 windows，其他环境未做测试！！！

改动的文件名中含有中文的，可能会出现复制失败的情况，可尝试运行以下命令修复。

```bash
git config --global core.quotepath false
```
