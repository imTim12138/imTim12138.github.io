---
layout: "post"
title: "读MCU实现各种姿势的I/O和外设访问\n程序-笔记"
date: "2016-04-01 21:51"
categories: MCU
---
以前零零碎碎地看I/O和外设访问的程序库，总是形不成套路，最近又看了些框架清晰的书和程序，决心把这方面总结下，T_T记性不好，总得备“不时之需”。

# ARM <span style="color: purple">Crotex- M </span> 风格的接口实现
通过使用指针式访问内存某些特定地址，可以实现对特定外设的寄存器访问。外设的地址映射与硬件有关，而构造的对应外设的数据结构也取决于系统存储器中外设映射地址的分布状态。

ARM定义的映射外设寄存器的内存地址：

![memary](/images/memary.png)

## 引例
先引一个Crotex-M权威指南上,展现原理的例子：

1.定义指向0x40010800、0x40010804、0x40010808三个字的指针，并直接添加*，用于给特定地址直接赋值。

~~~scala
/* STN32F 100RBT6BeGPIO A 端口配置寄存器低字 */
#define GPIOA_CRL  ( * ((volatile unsigned long * ) (0x40010800)))
/* STN32F 100RBT6BeGPIO A 端口配置寄存器高字 */
#define GPIOA_CRH  ( * ((volatile unsigned long * ) (0x40010804)))
/* STN32F 100RBT6BeGPIO A 端口输入数据寄存器 */
#define GPIOA_IDR  ( * ((volatile unsigned long * ) (0x40010808)))
//...
~~~
> Tips:最里层两个同级括号将整数强制转换成`volatile unsigned long`型指针，最外层是为了取指针直接给指向的地址赋值。

2.操纵寄存器

~~~cpp
/* 复位GPIOA */
void GPIOA_reset(void) {  
  GPIOA_CRL = 0;//位0~7，都设置为模拟输入
  GPIOA_CRL = 0;//位8~15，都设置为模拟输入
  GPIOA_ODR = 0;//默认输出0
  return;
}
~~~

> Tips：直接操纵少量寄存器这样非常好用，但是对于大量寄存器的操作这样就有问题了

## Keil.<span style="color: purple">STM32F_1xx_DFP</span><span style="color: red"> USART</span>

对于较大量的寄存器操作，举串口做的例子(源码自设备头`stm32f10x.h`和驱动库`stm32f10x_usart.c`等文件)：

1.一些需要常用的接口外设的基地址映射不是直接定义的，而是由某基地址再加偏移地址得到的。如`STM32F1XX_DFP`中`USART1`在内存中映射的方式：

~~~scala
/*!< Peripheral base address in the alias region */
#define PERIPH_BASE           ((uint32_t)0x40000000)
//...
#define APB2PERIPH_BASE       (PERIPH_BASE + 0x10000)
//...
#define USART1_BASE           (APB2PERIPH_BASE + 0x3800)
//...
~~~

2.可以看到地址定义在上图的Peripheral位段区。
- 使用16位偏移地址可以不用每次都存储32位地址常量，减小程序体积。

3.为多个相同的`USARTx`外设构造相同的数据结构，创建可复用的代码，这样的接口不仅仅减小代码体积，还能以一个实例同时初始化或配置多个同种外设：

~~~scala
typedef struct
{
  __IO uint16_t SR;//状态寄存器
  uint16_t  RESERVED0;
  __IO uint16_t DR;//数据寄存器
  uint16_t  RESERVED1;
  __IO uint16_t BRR;//波特比率寄存器
  uint16_t  RESERVED2;
  __IO uint16_t CR1;//控制寄存器1
  uint16_t  RESERVED3;
  __IO uint16_t CR2;//控制寄存器2
  uint16_t  RESERVED4;
  __IO uint16_t CR3;//控制寄存器3
  uint16_t  RESERVED5;
  __IO uint16_t GTPR;//保护时间和预分频寄存器
  uint16_t  RESERVED6;
} USART_TypeDef;
~~~

4."__IO"是CMSIS标准头中的定义,只是给变量的类型加以限定,用到了两个类型限定符`const`
和`volatile`

```scala
#ifdef _cplusplus //对于ISO-C...我们不去管它
  #define _I volatile /* !<定义"只读"权限 */
#else
  #define _I volatile const/* !<定义"只读"权限 */
#endif
#define _O volatile /* !<定义"只写"权限 */
#define _IO voiatile /* !<定义"读/写"权限 */
```

5.USART发送一个字的函数--例子1:

**stm32f10x_usart.c源文件中**

```cpp
void USART_SendData(USART_TypeDef* USARTx, uint16_t Data)
{
  /* Check the parameters */
  assert_param(IS_USART_ALL_PERIPH(USARTx));
  assert_param(IS_USART_DATA(Data));

  /* Transmit Data */
  USARTx->DR = (Data & (uint16_t)0x01FF);
}
//...
```
> Tips:<span style="color: green">DR</span>(数据寄存器的后9位[0-8]是TXD\RXD\校验等等数据的存储域)

6.位段获取USART各种状态位--例子2:

```cpp
/**
  * @brief  Checks whether the specified USART flag is set or not.
  * @param  USARTx: Select the USART or the UART peripheral.
  *   This parameter can be one of the following values:
  *   USART1, USART2, USART3, UART4 or UART5.
  * @param  USART_FLAG: specifies the flag to check.
  *   This parameter can be one of the following values:
  *     @arg USART_FLAG_CTS:  CTS Change flag (not available for UART4 and UART5)
  *     @arg USART_FLAG_LBD:  LIN Break detection flag
  *     @arg USART_FLAG_TXE:  Transmit data register empty flag
  *     @arg USART_FLAG_TC:   Transmission Complete flag
  *     @arg USART_FLAG_RXNE: Receive data register not empty flag
  *     @arg USART_FLAG_IDLE: Idle Line detection flag
  *     @arg USART_FLAG_ORE:  OverRun Error flag
  *     @arg USART_FLAG_NE:   Noise Error flag
  *     @arg USART_FLAG_FE:   Framing Error flag
  *     @arg USART_FLAG_PE:   Parity Error flag
  * @retval The new state of USART_FLAG (SET or RESET).
  */
FlagStatus USART_GetFlagStatus(USART_TypeDef* USARTx, uint16_t USART_FLAG)
{
  FlagStatus bitstatus = RESET;
  /* Check the parameters */
  assert_param(IS_USART_ALL_PERIPH(USARTx));
  assert_param(IS_USART_FLAG(USART_FLAG));
  /* The CTS flag is not available for UART4 and UART5 */
  if (USART_FLAG == USART_FLAG_CTS)
  {
    assert_param(IS_USART_123_PERIPH(USARTx));
  }  

  if ((USARTx->SR & USART_FLAG) != (uint16_t)RESET)
  {
    bitstatus = SET;
  }
  else
  {
    bitstatus = RESET;
  }
  return bitstatus;
}
//...
```

**stm32f10x_usart.h头文件中**:定义了多个标志位

```scala
/** @defgroup USART_Flags
  * @{
  */

#define USART_FLAG_CTS                       ((uint16_t)0x0200)
#define USART_FLAG_LBD                       ((uint16_t)0x0100)
#define USART_FLAG_TXE                       ((uint16_t)0x0080)
#define USART_FLAG_TC                        ((uint16_t)0x0040)
#define USART_FLAG_RXNE                      ((uint16_t)0x0020)
#define USART_FLAG_IDLE                      ((uint16_t)0x0010)
#define USART_FLAG_ORE                       ((uint16_t)0x0008)
#define USART_FLAG_NE                        ((uint16_t)0x0004)
#define USART_FLAG_FE                        ((uint16_t)0x0002)
#define USART_FLAG_PE                        ((uint16_t)0x0001)
#define IS_USART_FLAG(FLAG) (((FLAG) == USART_FLAG_PE) || ((FLAG) == USART_FLAG_TXE) || \
                             ((FLAG) == USART_FLAG_TC) || ((FLAG) == USART_FLAG_RXNE) || \
                             ((FLAG) == USART_FLAG_IDLE) || ((FLAG) == USART_FLAG_LBD) || \
                             ((FLAG) == USART_FLAG_CTS) || ((FLAG) == USART_FLAG_ORE) || \
                             ((FLAG) == USART_FLAG_NE) || ((FLAG) == USART_FLAG_FE))
//...
#define IS_USART_DATA(DATA) ((DATA) <= 0x1FF)
```

7.外设寄存器详细位定义,用于驱动函数操纵外设具体细节:
- 硬件位段操作的原子性，决定不会再因为与中断等异常共享变量而丢失数据。原因就是，中断一定会在位段操作之后再被响应。

# <span style="color: red">待续</span>

# Keil.stm32f1xx_DFP中的其它例子

### FSMC

### SPI和IIC

### GPIO

# CCS.MSP-Ware中的例子

# controlSUITE-C2000-MCU中的例子
