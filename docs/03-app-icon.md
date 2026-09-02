# App Icon / App Icon

> 站点路由：`/brand/app-icon` · 产物：`packages/brand/dist/app-icon/{ios,android,web,universal}/` · 生成脚本：`packages/brand/scripts/build-assets.mjs`

## 1. 原则 / Principles

- 基于 `mark`（66 × 66 圆角方块，`rx = 24%`，`#1677FF`，白色 TP 字形）。
- **图标本体即圆角方块**。iOS 系统会自动裁切圆角，因此 iOS 导出为**直角方形、无 alpha**，不要再叠一层圆角。
- Android adaptive icon：字形居中于 108 dp 画布内的 66 dp 安全区；背景为纯 `#1677FF`。
- Web maskable：字形缩至 66% 安全区。
- 不得在图标上添加文字、角标、阴影或渐变。

## 2. iOS 规格 / iOS

目录 `app-icon/ios/`，文件名 `AppIcon-<size>.png`（附 `Contents.json`，整目录即 `AppIcon.appiconset`），全部为 sRGB PNG。

| 尺寸（px） | 用途 |
|---|---|
| 1024 | App Store（**无 alpha，直角方形**） |
| 180 | iPhone @3x |
| 167 | iPad Pro @2x |
| 152 | iPad @2x |
| 120 | iPhone @2x / Spotlight @3x |
| 87 | Settings @3x |
| 80 | Spotlight @2x |
| 76 | iPad @1x |
| 60 | Notification @3x |
| 58 | Settings @2x |
| 40 | Spotlight @1x / Notification @2x |
| 29 | Settings @1x |
| 20 | Notification @1x |

## 3. Android 规格 / Android

目录 `app-icon/android/`。

| 文件 | 尺寸 | 说明 |
|---|---|---|
| `ic_launcher_foreground.png` / `.svg` | 432 × 432（108 dp @4x）/ 108 dp | 字形居中于 66 dp 安全区，透明背景 |
| `ic_launcher_background.png` | 432 × 432 | 纯 `#1677FF` |
| `ic_launcher-512.png` | 512 | Google Play 商店图标（圆角方块） |
| `ic_launcher-192.png` | 192 | xxxhdpi |
| `ic_launcher-144.png` | 144 | xxhdpi |
| `ic_launcher-96.png` | 96 | xhdpi |
| `ic_launcher-72.png` | 72 | hdpi |
| `ic_launcher-48.png` | 48 | mdpi |

`ic_launcher.xml` 示例：

```xml
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
  <background android:drawable="@color/tp_color_blue_500" />
  <foreground android:drawable="@mipmap/ic_launcher_foreground" />
</adaptive-icon>
```

## 4. Web / PWA 规格 / Web

目录 `app-icon/web/`。

| 文件 | 尺寸 | 说明 |
|---|---|---|
| `favicon.ico` | 16 / 32 / 48 | 多尺寸 ICO |
| `favicon-32.png` · `favicon-16.png` | 32 / 16 | `<link rel="icon">` |
| `apple-touch-icon.png` | 180 | iOS 添加到主屏 |
| `icon-192.png` · `icon-512.png` | 192 / 512 | `manifest.json` |
| `icon-maskable-512.png` | 512 | `purpose: "maskable"`，字形缩至 66% |
| `icon.svg` | 矢量 | 现代浏览器首选 |

`manifest.json` 片段：

```json
{
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "theme_color": "#1677FF",
  "background_color": "#FAFBFF"
}
```

## 5. 通用 / Universal

目录 `app-icon/universal/`：`tp-vpn-icon-1024.png`、`tp-vpn-icon-512.png`、`tp-vpn-icon-256.png`、`tp-vpn-icon-128.png`、`tp-vpn-icon-64.png`、`tp-vpn-icon-32.png`（带圆角、透明背景）。用于桌面端、文档、演示。

## 6. 社交图 / Social

目录 `social/`。

| 文件 | 尺寸 | 内容 |
|---|---|---|
| `og-default.png` | 1200 × 630 | 左侧横版 Logo + 右侧纯 `#1677FF → #4096FF` 渐变块 |
| `avatar-1024.png` | 1024 × 1024 | mark 居中于白底圆内 |
| `twitter-header-1500x500.png` | 1500 × 500 | 横幅 |

## 7. 导出清单 / Export Checklist

- [ ] iOS 13 档，1024 无 alpha
- [ ] Android adaptive foreground / background + legacy 6 档
- [ ] Web favicon.ico + 2 PNG favicon + apple-touch-icon + 192 / 512 / maskable-512 + icon.svg
- [ ] 通用 6 档
- [ ] 社交 3 张
- [ ] `packs/tp-vpn-app-icons.zip` 打包上述全部
- [ ] 所有 PNG 为 sRGB、8-bit；ICO 含 16 / 32 / 48
