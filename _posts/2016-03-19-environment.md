---
layout: post
title: "jekyll生成我的静态博客"
date: 2016-03-19
categories: jekyll
---

# 一步步用jekyll生成文章页面

终于搭完了 `ruby-gem&DevKit + jekyll + git` 的博客环境，有点曲折。而生成站点之后发现，想读懂这么多高层次的代码很难，看的少导致很不习惯。索性查查教程，总结一下工具的使用方法，顺便了解下jekyll的原理。

## 搭建环境

以前在windows上用gcc的时候安装了`MinGW`，在用git时安装了`git-bush`（也是基于`MinGW`）。此番需要安装`ruby+DevKit`也不很麻烦。

安装`ruby`要注意版本，我装的是`WinX64+MinGW`和`DevKit-MinGW64`。在setup `DevKit`时注意配置好`Ruby`所在路径。

为`ruby`的`gem`更换淘宝国内服务器source时报错了，估计是餠子在学校这个地理原因，无奈只好翻墙连Amazon的服务器，好在jekyll和其它的依赖文件都不大。

上述装好后，浏览下`_config.yml`里面还需要什么，再去一个一个`gem`。

windows下受不了命令行点阵字符的同学,可以试试大名鼎鼎的`cmder`或小巧的`consola2`

## [jekyll目录结构](http://jekyll.bootcss.com/docs/structure/)

涉及文章发布更新的主要文件
: `_posts` 文章为转换成网页前原始文件存储的地方
: `_layouts` 模板文件定义文章的显示效果,文章是内容,这个对文章进行各种安排
: `_includes` 包含需要重用内容的路径
: `css , images , favicon.ico , CNAME` 这些特定用途文件则直接拷贝输出到`＿site`

## [jekyll命令](http://jekyll.bootcss.com/docs/usage/)

常用的jekyll命令就是
: `jekyll build` 编译（build可简写为b）
: `jekyll serve` 运行开发服务器（server可简写为s）
: `jekyll clean` 清除所有生成的文件

写文章或者开发时，一切对_site有关的更改都jekyll都会自动生成，在编辑器中做出储存动作后刷新浏览器就好了。
而对_config.yml的更改需要重新build。

## 开始写博客

+ [kramdown解析器语法](http://kramdown.gettalong.org/quickref.html)
- [GFM语法糖](http://ju.outofmemory.cn/entry/149460)
- [YAML模板文件头](http://jekyll.bootcss.com/docs/frontmatter/)

写在被jekyll读取的文件头部定义YAML信息，包含各种变量，使静态页面信息可以在每次编译时有规则地变动。

* [`_config.yml`配置](http://jekyll.bootcss.com/docs/configuration/)
* [常用变量](https://jekyllrb.com/docs/variables/)
* [模板过滤器](http://jekyll.bootcss.com/docs/templates/)

## 添加主页元素

在主页中添加遍历posts的代码，设置分页并把流的布局改变成喜欢的样式(这个我就不会了)，都是模板的功劳，有机会还是要多学学高抽象层的语言。

这是jekyll主题作者的实现（看似很好懂的样子，然而我不敢改）：

~~~html
<ul class="post-list">
  \{\% for post in paginator.posts \%\}
    <li>
      <h2>
        <a class="post-link"
        href="\{\{ post.url | prepend: site.baseurl \}\}">\{\{ post.title \}\}</a>
      </h2>

      <div class="post-meta">\{\{ post.date | date: "%b %-d, %Y" \}\}</div>

      <div class="post-excerpt">
        \{\{ post.excerpt \}\}
        <p>
          <a class="post-link" href="\{\{ post.url | prepend: site.baseurl \}\}">Read More &raquo;</a>
        </p>
      </div>
    </li>
  \{\% endfor \%\}
</ul>
~~~

就是实现了这两个功能：
* 时间轴归档
* 分类检索

PS：下次再看好了...快递也忘取了..打球去.
