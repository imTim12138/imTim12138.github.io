---
layout: "post"
title: "读MCU实现各种姿势的I/O和外设访问\n程序-笔记"
date: "2016-04-01 21:51"
categories: MCU
---
以前零零碎碎地看I/O和外设访问的代码，总是形不成套路，最近又看了些框架清晰的书和程序，决心把这方面总结下，T_T记性不好，总得备“不时之需”。

# ARM Crotex-M 风格的接口实现
通过使用指针式访问内存某些特定地址，可以实现对特定外设的寄存器访问。

外设的地址映射与硬件有关，而构造的对应外设的数据结构也取决于系统存储器中外设映射地址的分布状态。

以最常用的外设GPIO为例，看看如何实现访问和I/O：


ARM定义的映射外设寄存器的内存地址：

![memary](/images/memary.png)

一些需要常用的接口外设，如Uart在内存中映射的地址
先引一个Crotex-M权威指南上的例子：

## Keil.stm32f1xx_DFP中的其它例子

### FSMC

### SPI和IIC

### USART

## CCS.MSP-Ware中的例子

## controlSUITE-C2000-MCU中的例子
