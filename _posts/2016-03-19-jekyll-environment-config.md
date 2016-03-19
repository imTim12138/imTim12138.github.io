---
layout: post
title:  "用jekyll生成文章页面"
date:  2016-03-19 11:37:13
categories: jekyll
permalink: /archivers/environment
---

# 怎样用jekyll生成文章页面
---
终于搭完了 `ruby-gem&DevKit + jekyll + git` 的博客环境，有点曲折。而生成站点之后发现，想读懂这么多高层次的代码很难，看的少导致很不习
惯。索性查查教程，总结一下工具的使用方法，顺便了解下jekyll的原理。

## [jekyll目录结构](http://jekyll.bootcss.com/docs/structure/)
 * 我的工程目录文件树
{% highlight %}
.
├─css
├─images
├─js
├─_includes
├─_layouts
├─_posts
│  └─_site
│      └─archivers
├─_sass
└─_site
    ├─about
    ├─archivers
    ├─category
    ├─css
    ├─editor
    ├─images
    └─js
{% endhighlight %}
> `./_posts` 原始博文存放路径
> `./_layouts` 模板存放路径
> `./_includes` 页面元素文件包含
`./site`用于本地调试，所以添加到了.gitignore列表
> `./images`存放图片资源
> `./favicon.ico`浏览器标签图标
> `./js`
> 等会直接拷贝到`./site`下调试

## [jekyll命令, `_config.yml`配置](http://jekyll.bootcss.com/docs/configuration/)
[`_path`中添加markdown/html文件](http://kramdown.gettalong.org/quickref.html)
* [YAML模板文件头](http://jekyll.bootcss.com/docs/frontmatter/)
```
layout: post
title: "用jekyll生成文章页面"
date：2016-03-16 19:58:28 +0800
categories:  master update
```
写在被读取文件头部的YAML信息，定义了变量，使静态页面信息可以在每次编译时有规则地变动。
* [配置命令](https://jekyllrb.com/docs/configuration/)
* [常用变量](https://jekyllrb.com/docs/variables/)
* [模板过滤器](http://jekyll.bootcss.com/docs/templates/)

## 添加主页元素
* 文件流
```
  <ul class="post-list">
    {% for post in site.posts %}
      <li>
        <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>

        <h2>
          <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
        </h2>
      </li>
    {% endfor %}
  </ul>
```
在主页中添加遍历posts的代码，设置分页并把流的布局改变成喜欢的样式
* 时间轴归档
* 标签检索
