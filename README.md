# nem-catapult-react-example

このレポジトリの紹介記事

[https://coiners.jp/posts/684486524146](https://coiners.jp/posts/684486524146)

## 利用しているライブラリ

-  react: ^16.8.6 
-  react-dom: ^16.8.6
-  react-scripts: 3.0.1
-  react-router-dom: ^5.0.1
-  nem2-sdk: ^0.13.1
-  rxjs: ^6.5.2
-  @material-ui/core: ^4.3.1
-  @material-ui/icons: ^4.2.1

## dockerの起動

このリポジトリはdockerのcatapult-service-bootstrapを利用して開発しています。あらかじめそちらのセットアップを完了しておいてください。

詳しくはこちらの記事を参照。

[Docker catapult-service-bootstrapの起動と動作確認
](https://coiners.jp/posts/284251256389)

## セットアップ

node jsライブラリをインストール。

```bash
yarn install
```

プロジェクトルートに`.env`ファイルを作成する。

```bash
touch .env
```

`.env`に必要な環境変数を記述する。

`REACT_APP_PRIVATE_KEY`はdockerのcataplut-api-serverと被らないように3001にする。

`REACT_APP_PRIVATE_KEY`はnemesisユーザーのものを利用する。プライベートキーの確認はnem2-cliで登録してあれば、`nem2-cli profile list`でわかる。

`REACT_APP_NETWORK_GENERATION_HASH`は下のコマンドで帰ってきたjsonの中からgenerationHashの値をコピペする。

```bash
curl http://localhost:3000/block/1
```

`.env`

```bash
PORT=3001
REACT_APP_PRIVATE_KEY="nemesisユーザーのプライベートキー"
REACT_APP_NETWORK_GENERATION_HASH="ジェネレーションハッシュ"
```

## サーバーの起動

下のコマンドでサーバーを起動

```bash
yarn run start
```

`http://localhost:3001`にアクセス。

Enjoy NEM catapult with React!