---
layout: post
title:  "MinGW-gcc/g++编译error：CreateProcess: No such file or directory"
date:   2016-06-04 22:00
categories: ENVIRONMENT
---

mingw编译时遇到标题所示错误，有可能你遇到的是跟我一样的问题。

浏览MinGW-WinAPI帮助时，不小心运行了命令 g`mingw-get update && mingw-get upgrade` 然后
也没注意输出，gcc 也能用。第二天发现用g++编译文件时输出`g++: error: CreateProcess: No such file or directory`
刚开始以为是安装什么新工具导致环境变量冲突了，可是检查发现也没问题，没有gcc/g++文件名冲突。

意识到有可能是之前检查更新命令没运行成功。一顿搜，引起 `g++: error: CreateProcess: No such file or directory` 的可能是执行`mingw-get update && mingw-get upgrade`时更新的解压安装包下载错误（据说经常是下载不完整）导致。


搜到说先执行：

`mingw-get remove mingw32-gcc-g++ && mingw-get remove mingw32-gcc`

然后直接尝试重新安装：

`mingw-get update && mingw-get installmingw32-gcc-g++`
`mingw-get rupdate && mingw-get installmingw32-gcc`

重现更新下载完安装时的错误输出，发现了我是第3行这个文件解压时报错：

```
Checking catalogue: mingw-developer-toolkit.xml; (item 111 of 112)              
Checking catalogue: msys-system-builder.xml; (item 112 of 112)                  
install: gcc-c++-4.9.3-1-mingw32-bin.tar.xz                                     
 installing gcc-c++-4.9.3-1-mingw32-bin.tar.xz                                  
mingw-get: *** ERROR *** D:\MinGW\/libexec/gcc/mingw32/4.9.3/cc1plus.exe: extrac
tion failed                                                                     
mingw-get: *** ERROR *** unexpected end of archive reading content record       
mingw-get: *** ERROR *** unexpected end of archive reading header record        
install: gcc-c++-4.8.1-4-mingw32-dev.tar.lzma                                   
 installing gcc-c++-4.8.1-4-mingw32-dev.tar.lzma                                
install: gcc-c++-4.8.1-4-mingw32-doc.tar.lzma                                   
```

找到源头就好办了，解除掉gcc和g++的错误安装，然后找到下载的临时文件`gcc-c++-4.9.3-1-mingw32-bin.tar.xz`
在MinGW目录下`D:\MinGW\var\cache\mingw-get\packages`

删除之。

重新运行更新 update，下载之前出错的 gcc、g++安装包...
迫不及待ing...应该已经恢复了吧？！

`g++ hellow.cpp`

“没有消息是最好的消息T^T”
