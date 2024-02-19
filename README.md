# Git Changes

This extension allows you to view changed parts of your git project, including files and folders.

这个拓展可以让你查看 git 项目中有改动的部分，包含文件和文件夹

## How to use

Open the sidebar Source Control, right-click on the changed file and select Show Changes

After a successful copy, the temporary folder where all changed files are stored is automatically opened.

![demo](./docs/demo.gif)

## Feature

View changed files and folders in git project

Supports selecting some changes to view

## Known issues

Currently only supports Windows

If the project contains special characters, it may fail. You can try running the following command to fix it.

```bash
git config --global core.quotepath false
```


## Problem feedback and suggestions

[Submit ISSUE](https://github.com/jazzg62/cgcf-extension/issues/new)
