---
title: "WP+GCEからHugo+Netlifyへの移行"
date: 2017-10-11T19:00:21+09:00
draft: true
tags: ["code"]
image: hugo.png
---

![image](hugo.png" width="100%)

## 静的サイトジェネレーターへの移行

性能・HTTPS 対応などなどについて無料 IaaS と WordPress を越えるものを探していたところ、静的サイトジェネレーターという存在を発見。

編集こそ、Markdown の作成で開発者向けではあるものの、HTML 直打ちに比べるとテーマの適用やレイアウトのテンプレート化・ページングやタグページの生成などなど、圧倒的なメリットを得られる…

最終的に公開されるものは静的ファイルだけなので当然性能も良いしサーバの性能もそこまで必要ない。有名なツールはいくつかあったが、生成スピードと Golang に興味があったこともあって[Hugo](https://gohugo.io/)を選択。特徴は以下の通り。

- 超速ビルド（1 記事 1msec 程度）
- ローカルサーバ機能（hugo serve）コマンド打てばローカルですぐに検証できる
- ドキュメントが割としっかりしている
- テーマそこそこいっぱい

## ホスティングは Netlify

静的ファイル配信に IaaS 使うのはあまりにもアホらしいのでホスティングを探す。\
定番は S3 や CloudStrage の静的 WEB サイト配信機能を使うことだが、CDN が有料だったりリダイレクトを維持できなかったりと少し課題あり。

そんな中 Netlify というすごいサービスがあることを知る。

> HTTPS の静的コンテンツをホストするなら s3 より Netlify が俺の求めていたものだった
> https://qiita.com/shogomuranushi/items/6ab5bc29923b3f82c9ed

- 1 クリックで SSL（Let's encrypt の証明書を自動取得・更新）
- HTTP/2 対応
- CDN 標準装備
- Git から更新検知して自動ビルド(！)
- リダイレクト設定可能（独自記法）
- 独自ドメイン利用可能（SSL も OK）
- **ここまで全部無料**

要件全部満たしていたので即決！
以下は備忘録なので細かい手順は省いて設定とやったことのみダラダラと記載していく。

## WordPress のデータを Hugo 用にエクスポートする

[WordPress to Hugo Exporter](https://github.com/SchumacherFM/wordpress-to-hugo-exporter)という WordPress プラグインを利用。WP のプラグインディレクトリに置いて、管理画面にログインして有効化する。あとは 1 クリックで画像と記事の.md ファイルを ZIP でダウンロードできる。以上！

Markdown の仕様上、広告などのインデントが深いとコード記述扱いされてしまうので VSCode の置換を使ってシコシコ修正する。

タグやカテゴリ、パーマリンクなどは Hugo 用のヘッダー部分が作成されており、そこに格納されている。サンプルは以下の通り。

```
---
title: 格安サイコンbryton Rider310を使ってみた
author: gen
type: post
date: 2017-09-27T11:26:26+00:00
#url: /2017/09/rider310review.html
thumbnail: DSC_7899.jpg
categories:
  - 未分類
tags:
  - インプレ
  - ガジェット
```

サムネイルは能動的に設定しないと作ってくれなかったので、自分で全記事に対して作成した…\
url は所謂パーマリンク設定がそのまま反映される。hugo では基本的に記事が`/post/記事名/`になってしまうが、この項目に設定をしておけば過去の URL を維持できる。

## Hugo インストール、動作

Chocolatey 経由で Go と Hugo をインストールする。
作業したいディレクトリ上で`hugo new site`を打てばよろしくディレクトリ構造を作ってくれる。

WP からダウンロードした Markdown ファイルを`/post/`へ、画像ファイルは`/static/`へそれぞれ移動。
作業ディレクトリに`config.toml`に WEB サイトの情報を投入して準備完了。（エクスポート時に作られた yaml ファイルでも可）

自分の場合はこんな感じ。

```
#website setting
title = "幻想サイクル"
baseURL = "http://blog.gensobunya.net/"
languageCode = "ja-jp"
canonifyURLs = false
relativeURLs = true
theme = "mainroad"
googleAnalytics = "UA-xxxxxxx-x"

#system
contentDir = "content"
layoutDir = "layouts"
publishDir = "public"
buildDrafts = false
hasCJKLanguage = true
defaultLayout = "post"
```

検証は`hugo serve`コマンドを打てば localhost:1313 上にサイトが展開される。
リンクも実際の URL ではなく localhost によろしく変換されてくれるので便利。

`hugo`コマンドで`/static/`に実際の HTML が生成されるが、Netlify の場合はこの作業を Git にアップロードした後勝手にやってくれるので、ローカルで実施する必要はない。gitignore にぶち込んでおく。

テーマは`/themes/`ディレクトリに移動して公式からテーマファイルを Clone してくるスタイル。Clone したらテーマのフォルダ名を`config.toml`に記載すればビルドの際に記載したテーマが適用される。\
普段と違うテーマを試したい時はビルド時に引数で渡してやれば引数のテーマでビルドされる。

## Netlify 用設定

リポジトリのルートディレクトリに`netlify.toml`を作成して Hugo のバージョンを記載する（しないと古いバージョンをビルドに使うためエラーになる）

自分の場合 v0.27.1 を使っていたので下記の通り記載。

```
[context.production.environment]
  HUGO_VERSION = "0.27.1"
```

ここまで書いたら、Github, Gitlab, bitbucket のどれかにリポジトリを作ってプッシュしておく。

Netlify の会員登録をして、作ったリポジトリと連携すれば自動的にサイトのビルドが実施されてデプロイまで行われる。先程ローカルにあったサイトが生成されていることを確認して終わりだ。

## リダイレクト

[公式ドキュメント](https://www.netlify.com/docs/redirects/)によると WEB サイトのルートに`_redirect`を作ってそこに記述する。

Hugo の場合、サイトビルド時に変換してほしくないファイルは`/static/`以下に置くことになっているので、画像ファイルなどと一緒にここに配置すれば OK。

Blogger の頃のパラメータと、パーマリンクを維持するために以下の設定を記入。

```
# START paramater 301 redirect
/*param1=:value1   /:splat  301!
# END paramater 301 redirect

# START page 301 redirect
/:year/:month/:date/:slug /:year/:month/:slug 301!
# END page 301 redirect
```

`:year`などのいかにも YYYY を検知してくれそうなプレースホルダーが用意されているが、スラッシュの間ならなんでも認識してしまう罠があった。問い合わせてみたところ仕様らしい。

コンテンツと設定の移行作業はこれで全て完了。
あとは独自ドメインの設定をして DNS を切り替えれば Netlify のサーバーからサイトが配信される。

Cloudflare を辞める場合、一旦ネームサーバーを Google に返す必要があるので NS レコードを変更して 1 日待つ必要がある。\
24h 後にあらためて Google Domains で Netlify のサーバーに CNAME を向けて移行の全作業が終了。

Cloudflare 上で予め Netlify にアクセスを向けておけば移行時間を減らせるかもしれないが、Cloudflare 経由で Netlify から配信することは推奨されていないようなのでやめておいた。
