Discord上で動く画像編集用ボットです.
動かす際はDiscordのアクセストークンは環境変数: DISCORD_TOKENに渡してあげ, node index.jsで起動できます.

botを招待したサーバーに画像をアップロードすると 300×300のWebPに画像を変換します.
画像と当時にメッセージにマークダウンを送信すると, 下記画像のように文字と背景画像を合成したサムネイルを生成します.

![cap1](https://user-images.githubusercontent.com/31952653/163977143-076d5864-edfa-431f-87d1-002266075f11.PNG)

またCloudFlare PagesをAPIからジェネレートすることができるようなコマンドも受け付けるようになってます
環境変数: CLOUD_FLARE_KEYにCloudFlare PagesのAPIキーを渡して起動します.

```
@ImageBuilder .rebuild
```

とメンションを飛ばすとジェネレートが走ります
