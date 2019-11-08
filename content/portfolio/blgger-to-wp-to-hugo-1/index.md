---
title: "BloggerやめてWordpressに移行したけど結局Hugoにした"
date: 2017-10-07T12:52:17+09:00
draft: true
tags: ["Code"]
image: hugo.png
#url: "/2017/10/blgger-to-wp-to-hugo-1"
---

![image](hugo.png" width="100%)

## まずは Blogger をやめたかった

かなり長い間 Blogger でブログを書いてきたのですが、最近不満が目立つようになってきました。主な点は下記の 2 点。

- エディターが変な HTML を生成する
- 独自ドメインの HTTPS 化ができない

特に前者はうっかりすると改行を全て`<div>`タグで出力するというおぞましい仕様。

HTTPS 化は当の Google が検索順位を落としたりしているにも関わらず Blogger が対応してくれないため。世の中常時 HTTPS の流れに乗りたいという意図。サービスの対応を待っているのも嫌になったので、サービスを乗り換えることにしました。

## とりあえず Wordpress

まずは手頃で慣れているサービスとして WordPress を検討。要件は無料で独自ドメイン SSL できること、性能がそこまで落ちないこと。

GCP にも興味があって並行して調べていたところ、下記の通り GCE（EC2 みたいなもの）でほぼ無料で Wordpress が運用できることを知りました。

> [GCE で WordPress がほぼ無料運用できるようになったので改めてまとめる](https://yukari-n.info/posts/gce-wordpress/)\
> https://yukari-n.info/posts/gce-wordpress/

自分でサーバー運用するので、当然 SSL も可能。
興味のあった GCP サービスということもあってまずはこれで移行することに。

ブログ移行が主な目的なので、勉強はそこそこにして Wordpress は[1 クリックデプロイ](https://console.cloud.google.com/launcher/details/click-to-deploy-images/wordpress)を利用して f1-micro インスタンスに設置。無料枠を使うために US リージョンにするのを忘れない。

インスタンスの性能がショボいので、最終的には CDN を使ってほぼ全てのページをキャッシュして通信量・インスタンスの不具合を減らす方向に持っていきます。

## GCP すごい

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">GCEのすごいところ<br><br>ターミナルソフト←いらない<br>ユーザーの作成←いらない<br>sudo権限付与←いらない<br>ssh鍵の生成←いらない<br>ssh鍵の転送←いらない<br>GCP用sdkのインストール←いらない</p>&mdash; ゲン (@gen_sobunya) <a href="https://twitter.com/gen_sobunya/status/910320028464988160?ref_src=twsrc%5Etfw">September 20, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

まずは GCP の機能に感動。SSH するのにブラウザから 1 クリックで証明書を自動作成してインスタンスに登録して SSH できる…

さすがに WEB アプリなのでちょっと遅いが、大抵の作業は事足りる上に Android の Console アプリからも同じことができる。
環境構築いらないじゃん…という気持でしたが色々 WordPress のファイルをいじらなければならないところがあるので、ローカル用に GCP SDK をインストールして Git リポジトリをこれまた GCP 上の「Google cloud repository」に作成。

リポジトリの認証も Google アカウントで完結。なんて楽なんだすごいぞ GCP。

## データの移行

データの移行には「[Blogger importer extended](https://ja.wordpress.org/plugins/blogger-importer-extended/)」を使いました。
使い方は下記の記事を参考に。自動で画像・タグ・記事内容・パーマリンクを取り込んでくれます。※

> [blogger から WordPress への移行リダイレクトまで](https://web-memo.fragmentnews.com/blogger-wordpress-279.html)\
> https://web-memo.fragmentnews.com/blogger-wordpress-279.html

ただし、パーマリンクで取り込んでくれるのは一番最後のファイル名のみなので予め WordPress 側のパーマリンクを"/yyyy/mm/ファイル名.html"に変更しておく必要があります。
絶対リンクも WordPress 設定のサイト URL に置き換えられるので、移行中に IP アドレスが設定されている場合、あとでまとめて置き換えることになります。[Search Regex](https://ja.wordpress.org/plugins/search-regex/)を使えば一発で全記事のソースを置換できます。

### パーマリンク不備

あとから気がついたのですが、WordPress は同じファイル名になるポストのファイル名を勝手に書き換えます。
Blogger は全角文字のみのタイトル記事は全て「blog-post.html」になるため、自分のようにパーマリンクに気を使っていないと同じファイル名が大量に生成され、blog-post-3.html や blog-pos4.html という不完全な記事が生まれます。

importer extended のバグなのでしょうが、普通の記事も末尾の 1 文字が消えていたりすることがあるので、全部見直すハメになりました。つらい。

さらにさらに、Blogger はたまに/yyyy/mm/dd/postname.html というディレクトリ構成の記事もあることが発覚。
こちらはどうしようもないので.htaccess に書いて対処することに。

```
# START page 301 redirect
<IfModule mod_rewrite.c>
RewriteEngine on
RewriteCond %{REQUEST_URI} !(^/wp.*/.*$)
RewriteRule ^([0-9]{4})/([0-9]{2})/([0-9]{2})/(.*\.html)$ /$1/$2/$4 [R=301,L]
</IfModule>
# END page 301 redirect
```

念のため管理画面やリソースは除外しています。
ひとまずこれでコンテンツは移行完了。

この時点で DNS を新しいインスタンスの IP に向けて外部向けにも新サイトにアクセスを振り向ける。

残りは CDN と SSL。

<div class="amazlet-box" style="margin-bottom:0px;"><div class="amazlet-image" style="float:left;margin:0px 12px 1px 0px;"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/4798137146/gensobunya-22/ref=nosim/" name="amazletlink" target="_blank"><img src="https://images-fe.ssl-images-amazon.com/images/I/51TXapj99DL._SL160_.jpg" alt="プログラマのためのGoogle Cloud Platform入門 サービスの全体像からクラウドネイティブアプリケーション構築まで" style="border: none;" /></a></div><div class="amazlet-info" style="line-height:120%; margin-bottom: 10px"><div class="amazlet-name" style="margin-bottom:10px;line-height:120%"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/4798137146/gensobunya-22/ref=nosim/" name="amazletlink" target="_blank">プログラマのためのGoogle Cloud Platform入門 サービスの全体像からクラウドネイティブアプリケーション構築まで</a><div class="amazlet-powered-date" style="font-size:80%;margin-top:5px;line-height:120%">posted with <a href="http://www.amazlet.com/" title="amazlet" target="_blank">amazlet</a> at 17.10.07</div></div><div class="amazlet-detail">阿佐 志保 中井 悦司 <br />翔泳社 <br />売り上げランキング: 12,847<br /></div><div class="amazlet-sub-info" style="float: left;"><div class="amazlet-link" style="margin-top: 5px"><a href="http://www.amazon.co.jp/exec/obidos/ASIN/4798137146/gensobunya-22/ref=nosim/" name="amazletlink" target="_blank">Amazon.co.jpで詳細を見る</a></div></div></div><div class="amazlet-footer" style="clear: left"></div></div>