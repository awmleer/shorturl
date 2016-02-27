# **shorturl**
其实的确网上有类似的网站，比如百度短网址什么的，然而还是自己再造个轮子吧。。

## 基本完成

## 关于配置
假设域名是`s.zjuqsc.com`
node挂在3000端口
敲`s.zjuqsc.com`默认进的是`index.html`

## 关于数据库
使用的是MySQL
database是`shorturl`，里面有一个数据表是`url`
一共有四个栏位：
1. id                   类型int
2. longurl        类型text
3. shorturl      类型varchar
4. datetime    类型datetime

## 功能特性
长网址缩成短网址，同时支持多个网页打包到一个短网址里面