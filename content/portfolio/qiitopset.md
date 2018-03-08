---
title: "Chrom拡張作りました：QiiTopSet"
date: 2018-03-08T21:07:25+09:00
draft: false
tags: ["code", ""]
image: "/img/qiitopset/code.jpg"
---
# タグフィードを最初に見たいんだ！

Qiitaのデザイン変更に伴って、qiita.comへアクセスした際にqiita.com/trendへリダイレクトされる仕様が追加されて幾星霜。
最初は面白かったのですが、やはり興味のある分野に関する記事を探す頻度のほうが高いわけでしてアクセス即タグフィードクリック生活をしていましした。

時間の無駄なのでブックマークをタグフィードのURLに変更しようかと思いましたが、それでは面白くないのでChrome拡張で実装してみました。
普段仕事でコードを書いているわけではないので、記法の古さや使い回しにくさ、そもそもの可読性に難がある可能性大です。

オプション画面からリダイレクト先をタグフィードとタイムラインで切り替え可能です。

インストールはこちらから！
[Chrome web store - QiiTopSet](https://chrome.google.com/webstore/detail/qiitopset/ipgbemcljflegiekgghabajhbaihmhlm)

#Code

[Github - QiiTopSet](https://github.com/gensobunya/QiiTopSet)

##本体

Chrome ExtensionのAPIが全て非同期処理でコールバックを呼ぶ前提になっているので、中々苦戦しました。
`chrome.storage.local.get` のコールバック関数内にすべての処理を書くことで、設定取得→リダイレクト処理の順番で処理させることに成功しています。


```JavaScript:trendIgnore.js
//Qiitaのトップをタグフィードにリダイレクトする
'use strict';

const qiitaBaseUrl = "https://qiita.com/";

chrome.storage.local.get({"redirectPage": "tag-feed" }, (items)=>{

	let redirectFullUrl = qiitaBaseUrl + items.redirectPage;

	chrome.webRequest.onBeforeRequest.addListener( (detail) =>{
		return {redirectUrl : redirectFullUrl};
	},
		{urls: ["*://qiita.com/trend"]}, //リクエスト先がtrendになった場合発火
		["blocking"]
	)
	console.log("redirect to "+ qiitaBaseUrl + items.redirectPage);

	//設定変更を監視
	chrome.storage.onChanged.addListener((newItems)=>{
		redirectFullUrl = qiitaBaseUrl + newItems.redirectPage.newValue;
		console.log("change redirect url to" + redirectFullUrl);
		})
	}
)
```

ただし、この方法だとChrome起動時に設定が変更された場合、リダイレクト処理に反映されないので`chrome.storage.onChanged`を使って変更検知のロジックを入れています。
オプション画面で設定しないと設定用のオブジェクトそのものが`undefined`になってしまいますが、`chrome.storage.local.get({"redirectPage": "tag-feed" }`と記述することでnullの場合の初期値を設定できます。

`chrome.storage.local`ではなく`chrome.storage.sync`を使っていれば同一Googleアカウントで設定を同期できますが、テストが面倒なので実施していません。

##オプション用のページ

あまり面白みはありません。公式サンプルをちょいちょいと改造しただけです。

```HTML:options.html
<!DOCTYPE html>
<html>
<head><title></title></head>
<body>

リダイレクト先:
<select id="redirectTo">
 <option value="tag-feed">タグフィード</option>
 <option value="timeline">タイムライン</option>
</select>

<div id="status"></div>
<button id="save">Save</button>

<script src="options.js"></script>
</body>
</html>
```

Chrome.storageAPIを使ってローカルストレージにオプションをオブジェクトとして保存しています。


```JavaScript:options.js
'use strict';

const storage = chrome.storage.local;

// options.htmlからリダイレクト先を取得してobjectに格納
function save_options() {
	const page = {
		redirectPage : document.getElementById('redirectTo').value
	};

// オブジェクトをchrome.storage.localに保存
	storage.set(page,function() {
			let status = document.getElementById('status');
			status.textContent = 'Saved!'; //ボタン押したらフィードバック
			console.log('option saved as ' + page.redirectPage);

			setTimeout(function() {
				status.textContent = '';
				}, 750); //フィードバックを消す
		  }
	);
}

// 初期表示は保存されている内容を表示する
function restore_options() {
	storage.get({
		redirectPage: "timeline" //getデータが無い時のための初期値
	},function(items) {
		document.getElementById('redirectTo').value = items.redirectPage;
	});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',save_options);
```
