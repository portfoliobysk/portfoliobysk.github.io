

# 当サイトについて
S.Kのプロフィール並びにポートフォリオサイトになります。

# 要件定義
## 当サイトの目的
S.Kの経歴、スキルを知ってもらうために制作しました。

## 対象ユーザー
- S.Kについて知りたい人。
- ポートフォリオサイトを作りたいと考えていて参考にしたい人。
- 個人でのWebサイト制作の参考にしたい人。

## 各ブランチの説明
- main
  - リリース用ブランチです。こちらをご覧ください。
- develop
  - 開発用ブランチです。mainブランチのファイルをご覧ください。

# 設計
## サイトマップ
```mermaid
graph LR
    A[TOP] --> B[PortFolio];
    B --> C[HTML道場];
    B --> D[JavaScript道場];
```
## 詳細サイトマップ
|ページ名|コンテンツ|概要|
|------|-----|-----|
|TOP     |About    |このサイトの概要。
|        |Profile  |自己紹介、スキル、学習に利用したサイトや書籍の紹介。
|        |PortFolio|作品の一覧。
|HTML道場|          |   |
|JavaScript道場|    |   |

## ワイヤーフレーム
### Topページ
<img src="docs/Wireframe - TopPage.svg">

## モックアップ
鋭意制作中

## フォルダ構成
- docs
 - ページ制作時の設計書、ワイヤーフレーム、モックアップを置いています。
- images
 - サイトで使用される画像を置いています。
- portfolio
 - ポートフォリオ作品のページを置いています。
- scripts
 - スクリプトファイル（JavaScript、TypeScript）を置いてます。
- styles
 - CSSファイルをまとめています。
  - base
   - 全てのページのベースとなるCSSファイルを置いています。
  - components
   - 例えばカードスタイルなど、共通部品として利用するCSSファイルを置いてます。
  - layout
   - ヘッダー、フッターなど共通部品として使えるレイアウト用のCSSファイルを置いています。
  - pages
   - 特有のレイアウトや装飾が必要なページのCSSファイルを置いています。

# Lisence
This project is licensed under the MIT License, see the LICENSE file for details
