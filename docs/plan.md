# GamesName Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a game name generator website (gamesname) that replicates the UI/UX of the yvideos project, deployed on Cloudflare Pages, using Agnes AI free API for name generation, with multi-language support.

**Architecture:** Astro 7 static site with Cloudflare Pages Functions for API proxying. Frontend i18n via JSON language packs. Agnes AI (`agnes-2.0-flash`) generates creative game names through a secured backend proxy.

**Tech Stack:** Astro 7, @astrojs/cloudflare, Tailwind CSS v4, TypeScript, wrangler

---

## File Structure

```
gamesname/
├── package.json
├── astro.config.mjs
├── tsconfig.json
├── wrangler.toml
├── .gitignore
├── public/
│   ├── favicon.svg
│   └── manifest.json
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro          # Generate page (home)
│   │   ├── types.astro          # Browse by game type
│   │   ├── styles.astro         # Browse name styles
│   │   ├── history.astro        # History & favorites
│   │   ├── profile.astro        # Settings & about
│   │   └── api/
│   │       └── generate.ts      # CF Pages Function - AI proxy
│   ├── components/
│   │   ├── BottomNav.astro
│   │   ├── PromptBox.astro
│   │   └── NameCard.astro
│   ├── lib/
│   │   ├── i18n.ts
│   │   └── prompt.ts
│   └── i18n/
│       ├── en.json
│       ├── zh.json
│       ├── ja.json
│       ├── ko.json
│       └── es.json
```

---

## Task 1: Project Scaffold & Config Files

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `wrangler.toml`
- Create: `.gitignore`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "gamesname",
  "version": "1.0.0",
  "description": "AI-powered game name generator",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.9",
    "@astrojs/cloudflare": "^14.0.0-beta.2",
    "@astrojs/sitemap": "^3.7.3",
    "@tailwindcss/vite": "^4.3.1",
    "astro": "^7.0.0-beta.4",
    "tailwindcss": "^4.3.1",
    "vite": "^8.0.16"
  },
  "devDependencies": {
    "typescript": "^6.0.3",
    "wrangler": "^4.100.0"
  }
}
```

- [ ] **Step 2: Create astro.config.mjs**

```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  compressHTML: true,
  site: 'https://gamesname.pages.dev',
  adapter: cloudflare({
    platformProxy: {
      enabled: false,
    },
    imageService: 'passthrough',
    prerenderEnvironment: 'node',
  }),
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
      cssCodeSplit: true,
      minify: true,
    },
  },
  trailingSlash: 'ignore',
});
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

- [ ] **Step 4: Create wrangler.toml**

```toml
name = "gamesname"
compatibility_date = "2026-06-20"

[vars]
AGNES_BASE_URL = "https://apihub.agnes-ai.com/v1"
```

- [ ] **Step 5: Create .gitignore**

```
node_modules/
dist/
.astro/
.env
.env.local
.DS_Store
```

- [ ] **Step 6: Install dependencies**

Run: `npm install`
Expected: dependencies installed successfully

- [ ] **Step 7: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json wrangler.toml .gitignore
git commit -m "chore: project scaffold and config files"
```

---

## Task 2: i18n Language Packs

**Files:**
- Create: `src/i18n/en.json`
- Create: `src/i18n/zh.json`
- Create: `src/i18n/ja.json`
- Create: `src/i18n/ko.json`
- Create: `src/i18n/es.json`
- Create: `src/lib/i18n.ts`

- [ ] **Step 1: Create src/i18n/en.json**

```json
{
  "site": {
    "name": "GamesName",
    "description": "AI-powered game name generator"
  },
  "nav": {
    "generate": "Generate",
    "types": "Types",
    "styles": "Styles",
    "profile": "Profile"
  },
  "generate": {
    "title": "Game Name Generator",
    "placeholder": "Describe your game character, guild, or team...",
    "button": "Generate Names",
    "generating": "Generating...",
    "gameType": "Game Type",
    "category": "Category",
    "style": "Style",
    "outputLang": "Output Language",
    "count": "Count"
  },
  "nameCard": {
    "copy": "Copy",
    "copied": "Copied!",
    "favorite": "Favorite",
    "meaning": "Meaning"
  },
  "types": {
    "title": "Browse by Game Type",
    "rpg": "RPG",
    "fps": "FPS",
    "moba": "MOBA",
    "mmorpg": "MMORPG",
    "strategy": "Strategy",
    "sandbox": "Sandbox",
    "racing": "Racing",
    "fighting": "Fighting"
  },
  "styles": {
    "title": "Browse by Style",
    "epic": "Epic",
    "funny": "Funny",
    "dark": "Dark",
    "mythology": "Mythology",
    "fantasy": "Fantasy",
    "scifi": "Sci-Fi",
    "nature": "Nature",
    "mystery": "Mystery"
  },
  "history": {
    "title": "History",
    "favorites": "Favorites",
    "clear": "Clear All",
    "empty": "No history yet"
  },
  "profile": {
    "title": "Settings",
    "language": "Language",
    "theme": "Theme",
    "about": "About",
    "version": "Version 1.0.0"
  },
  "categories": {
    "character": "Character",
    "guild": "Guild",
    "team": "Team",
    "pet": "Pet",
    "mount": "Mount",
    "weapon": "Weapon",
    "clan": "Clan"
  },
  "errors": {
    "generateFailed": "Failed to generate names. Please try again.",
    "rateLimited": "Too many requests. Please wait a moment."
  }
}
```

- [ ] **Step 2: Create src/i18n/zh.json**

```json
{
  "site": {
    "name": "GamesName",
    "description": "AI驱动的游戏取名生成器"
  },
  "nav": {
    "generate": "生成",
    "types": "类型",
    "styles": "风格",
    "profile": "我的"
  },
  "generate": {
    "title": "游戏取名生成器",
    "placeholder": "描述你的游戏角色、公会或战队...",
    "button": "生成名字",
    "generating": "生成中...",
    "gameType": "游戏类型",
    "category": "类别",
    "style": "风格",
    "outputLang": "输出语言",
    "count": "数量"
  },
  "nameCard": {
    "copy": "复制",
    "copied": "已复制!",
    "favorite": "收藏",
    "meaning": "含义"
  },
  "types": {
    "title": "按游戏类型浏览",
    "rpg": "角色扮演",
    "fps": "射击",
    "moba": "MOBA",
    "mmorpg": "大型多人在线",
    "strategy": "策略",
    "sandbox": "沙盒",
    "racing": "竞速",
    "fighting": "格斗"
  },
  "styles": {
    "title": "按风格浏览",
    "epic": "史诗",
    "funny": "搞笑",
    "dark": "暗黑",
    "mythology": "神话",
    "fantasy": "奇幻",
    "scifi": "科幻",
    "nature": "自然",
    "mystery": "神秘"
  },
  "history": {
    "title": "历史记录",
    "favorites": "收藏",
    "clear": "清空全部",
    "empty": "暂无记录"
  },
  "profile": {
    "title": "设置",
    "language": "语言",
    "theme": "主题",
    "about": "关于",
    "version": "版本 1.0.0"
  },
  "categories": {
    "character": "角色",
    "guild": "公会",
    "team": "战队",
    "pet": "宠物",
    "mount": "坐骑",
    "weapon": "武器",
    "clan": "氏族"
  },
  "errors": {
    "generateFailed": "生成失败，请重试。",
    "rateLimited": "请求过于频繁，请稍后再试。"
  }
}
```

- [ ] **Step 3: Create src/i18n/ja.json, ko.json, es.json**

Follow same structure as en.json with Japanese, Korean, Spanish translations.

- [ ] **Step 4: Create src/lib/i18n.ts**

```typescript
import en from '../i18n/en.json';
import zh from '../i18n/zh.json';
import ja from '../i18n/ja.json';
import ko from '../i18n/ko.json';
import es from '../i18n/es.json';

const messages: Record<string, any> = { en, zh, ja, ko, es };

export type Locale = 'en' | 'zh' | 'ja' | 'ko' | 'es';
export const defaultLocale: Locale = 'en';
export const supportedLocales: Locale[] = ['en', 'zh', 'ja', 'ko', 'es'];

export function getLocale(url: URL): Locale {
  const pathLang = url.pathname.split('/')[1];
  if (supportedLocales.includes(pathLang as Locale)) return pathLang as Locale;
  const cookieLang = url.searchParams.get('lang');
  if (cookieLang && supportedLocales.includes(cookieLang as Locale)) return cookieLang as Locale;
  return defaultLocale;
}

export function t(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value = messages[locale] || messages[defaultLocale];
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) break;
  }
  return typeof value === 'string' ? value : key;
}

export function getMessages(locale: Locale) {
  return messages[locale] || messages[defaultLocale];
}
```

- [ ] **Step 5: Commit**

```bash
git add src/i18n/ src/lib/i18n.ts
git commit -m "feat: add i18n language packs and utilities"
```

---

## Task 3: Layout Component

**Files:**
- Create: `src/layouts/Layout.astro`

- [ ] **Step 1: Create src/layouts/Layout.astro**

Replicate yvideos Layout.astro structure with:
- Pink theme (#ec4899)
- SEO meta tags
- PWA manifest
- OG/Twitter cards
- Inline critical CSS (same pattern as yvideos)
- lang attribute based on locale
- i18n integration

```astro
---
import type { Locale } from '../lib/i18n';

interface Props {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  isHome?: boolean;
  locale?: Locale;
}

const { title, description, keywords, canonical, isHome = false, locale = 'en' } = Astro.props;
const siteName = 'GamesName';
const siteUrl = 'https://gamesname.pages.dev';
const finalTitle = title ? `${title} | ${siteName}` : `${siteName} - AI Game Name Generator`;
const finalDesc = description || 'Generate creative game names with AI. Characters, guilds, teams, pets, and more.';
---
<!doctype html>
<html lang={locale}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#ec4899" />
    <meta name="description" content={finalDesc} />
    {keywords && <meta name="keywords" content={keywords} />}
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href={canonical || siteUrl} />
    <link rel="manifest" href="/manifest.json" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content={siteName} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta property="og:title" content={finalTitle} />
    <meta property="og:description" content={finalDesc} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical || siteUrl} />
    <meta property="og:site_name" content={siteName} />
    <meta property="og:image" content={`${siteUrl}/og-image.png`} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={finalTitle} />
    <meta name="twitter:description" content={finalDesc} />
    <title>{finalTitle}</title>
    <style is:inline>
      /* Same critical CSS pattern as yvideos, adapted for gamesname */
      *,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:currentColor}
      html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-tap-highlight-color:transparent}
      body{margin:0;line-height:inherit;background-color:#f9fafb;color:#1f2937;min-height:100vh;overscroll-behavior:none}
      h1,h2,h3,h4,h5,h6,p{margin:0}
      a{color:inherit;text-decoration:inherit}
      button{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0;background:transparent;cursor:pointer}
      .flex{display:flex}.grid{display:grid}.block{display:block}.hidden{display:none}
      .flex-col{flex-direction:column}.items-center{align-items:center}.justify-center{justify-content:center}.justify-between{justify-content:space-between}
      .flex-1{flex:1}.flex-shrink-0{flex-shrink:0}
      .grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}
      .grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}
      @media(min-width:40rem){.sm\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(min-width:48rem){.md\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}}
      .gap-2{gap:.5rem}.gap-3{gap:.75rem}.gap-4{gap:1rem}
      .p-2{padding:.5rem}.p-3{padding:.75rem}.p-4{padding:1rem}
      .px-2{padding-left:.5rem;padding-right:.5rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}
      .py-2{padding-top:.5rem;padding-bottom:.5rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}
      .pt-4{padding-top:1rem}.pb-20{padding-bottom:5rem}
      .mt-1{margin-top:.25rem}.mt-2{margin-top:.5rem}.mt-3{margin-top:.75rem}.mt-4{margin-top:1rem}
      .mb-2{margin-bottom:.5rem}.mb-3{margin-bottom:.75rem}.mb-4{margin-bottom:1rem}
      .mx-auto{margin-left:auto;margin-right:auto}
      .w-full{width:100%}.h-full{height:100%}
      .min-h-screen{min-height:100vh}
      .bg-white{background-color:#fff}.bg-gray-50{background-color:#f9fafb}.bg-gray-100{background-color:#f3f4f6}.bg-gray-200{background-color:#e5e7eb}
      .bg-pink-50{background-color:#fdf2f8}.bg-pink-500{background-color:#ec4899}.bg-pink-600{background-color:#db2777}.bg-pink-700{background-color:#be185d}
      .text-white{color:#fff}.text-gray-500{color:#6b7280}.text-gray-600{color:#4b5563}.text-gray-700{color:#374151}.text-gray-800{color:#1f2937}
      .text-pink-500{color:#ec4899}.text-pink-600{color:#db2777}.text-pink-700{color:#be185d}
      .text-xs{font-size:.75rem;line-height:1rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-base{font-size:1rem;line-height:1.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-xl{font-size:1.25rem;line-height:1.75rem}
      .font-medium{font-weight:500}.font-bold{font-weight:700}
      .text-center{text-align:center}
      .truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}
      .border{border-width:1px}.border-t{border-top-width:1px}.border-b{border-bottom-width:1px}
      .border-gray-100{border-color:#f3f4f6}.border-gray-200{border-color:#e5e7eb}
      .rounded{border-radius:.25rem}.rounded-lg{border-radius:.5rem}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}
      .line-clamp-1{-webkit-line-clamp:1;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}
      .line-clamp-2{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}
      .relative{position:relative}.absolute{position:absolute}.fixed{position:fixed}.sticky{position:sticky}
      .inset-0{top:0;right:0;bottom:0;left:0}.top-0{top:0}.right-0{right:0}.bottom-0{bottom:0}.left-0{left:0}
      .z-10{z-index:10}.z-50{z-index:50}
      .overflow-hidden{overflow:hidden}.overflow-x-auto{overflow-x:auto}
      .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}.no-scrollbar::-webkit-scrollbar{display:none}
      .shadow-sm{box-shadow:0 1px 2px 0 rgba(0,0,0,.05)}.shadow-md{box-shadow:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -2px rgba(0,0,0,.1)}
      .transition-colors{transition-property:color,background-color,border-color;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}
      .transition-all{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}
      .duration-300{transition-duration:.3s}
      .hover\:bg-gray-50:hover{background-color:#f9fafb}.hover\:bg-gray-200:hover{background-color:#e5e7eb}
      .hover\:bg-pink-50:hover{background-color:#fdf2f8}.hover\:bg-pink-600:hover{background-color:#db2777}
      .hover\:text-pink-500:hover{color:#ec4899}.hover\:text-pink-700:hover{color:#be185d}
      .group:hover .group-hover\:scale-105{transform:scale(1.05)}
      .group:hover .group-hover\:text-pink-700{color:#be185d}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
      .animate-pulse{animation:pulse 2s cubic-bezier(.4,0,.6,1) infinite}
      .cursor-pointer{cursor:pointer}.select-none{user-select:none}
      .backdrop-blur-sm{backdrop-filter:blur(4px)}.bg-white\/95{background-color:rgba(255,255,255,.95)}
      .safe-bottom{padding-bottom:env(safe-area-inset-bottom)}
      .leading-tight{line-height:1.25}
    </style>
  </head>
  <body class="min-h-screen bg-gray-50 safe-bottom">
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: add Layout component with critical CSS"
```

---

## Task 4: Bottom Navigation

**Files:**
- Create: `src/components/BottomNav.astro`

- [ ] **Step 1: Create src/components/BottomNav.astro**

Replicate yvideos BottomNav.astro with gamesname labels:

```astro
---
import { getLocale, t, type Locale } from '../lib/i18n';

interface Props {
  locale?: Locale;
}

const { locale = 'en' } = Astro.props;
const currentPath = Astro.url.pathname;

const items = [
  { label: t(locale, 'nav.generate'), href: '/' },
  { label: t(locale, 'nav.types'), href: '/types' },
  { label: t(locale, 'nav.styles'), href: '/styles' },
  { label: t(locale, 'nav.profile'), href: '/profile' },
];
---

<nav class="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-100 safe-bottom">
  <div class="max-w-screen-xl mx-auto flex items-center justify-around h-14">
    {items.map(item => {
      const isActive = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href));
      return (
        <a 
          href={item.href} 
          class={`text-sm font-medium transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${isActive ? 'text-pink-700' : 'text-gray-500 hover:text-pink-700'}`}
        >
          {item.label}
        </a>
      );
    })}
  </div>
</nav>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/BottomNav.astro
git commit -m "feat: add BottomNav component"
```

---

## Task 5: PromptBox Component

**Files:**
- Create: `src/components/PromptBox.astro`

- [ ] **Step 1: Create src/components/PromptBox.astro**

Replicate yvideos SearchBox.astro pattern, adapted for name generation:

```astro
---
import { t, type Locale } from '../lib/i18n';

interface Props {
  locale?: Locale;
}

const { locale = 'en' } = Astro.props;
---

<div class="relative">
  <input
    id="prompt-input"
    type="text"
    placeholder={t(locale, 'generate.placeholder')}
    class="w-full h-12 pl-4 pr-4 bg-gray-100 border-0 rounded-xl text-base text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-pink-500 transition-all"
    autocomplete="off"
    enterkeyhint="search"
  />
</div>

<div class="mt-3 flex flex-wrap gap-2">
  <!-- Game Type Select -->
  <select id="game-type" class="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-pink-500">
    <option value="">{t(locale, 'generate.gameType')}</option>
    <option value="rpg">{t(locale, 'types.rpg')}</option>
    <option value="fps">{t(locale, 'types.fps')}</option>
    <option value="moba">{t(locale, 'types.moba')}</option>
    <option value="mmorpg">{t(locale, 'types.mmorpg')}</option>
    <option value="strategy">{t(locale, 'types.strategy')}</option>
    <option value="sandbox">{t(locale, 'types.sandbox')}</option>
    <option value="racing">{t(locale, 'types.racing')}</option>
    <option value="fighting">{t(locale, 'types.fighting')}</option>
  </select>

  <!-- Category Select -->
  <select id="category" class="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-pink-500">
    <option value="">{t(locale, 'generate.category')}</option>
    <option value="character">{t(locale, 'categories.character')}</option>
    <option value="guild">{t(locale, 'categories.guild')}</option>
    <option value="team">{t(locale, 'categories.team')}</option>
    <option value="pet">{t(locale, 'categories.pet')}</option>
    <option value="mount">{t(locale, 'categories.mount')}</option>
    <option value="weapon">{t(locale, 'categories.weapon')}</option>
    <option value="clan">{t(locale, 'categories.clan')}</option>
  </select>

  <!-- Style Select -->
  <select id="style" class="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-pink-500">
    <option value="">{t(locale, 'generate.style')}</option>
    <option value="epic">{t(locale, 'styles.epic')}</option>
    <option value="funny">{t(locale, 'styles.funny')}</option>
    <option value="dark">{t(locale, 'styles.dark')}</option>
    <option value="mythology">{t(locale, 'styles.mythology')}</option>
    <option value="fantasy">{t(locale, 'styles.fantasy')}</option>
    <option value="scifi">{t(locale, 'styles.scifi')}</option>
    <option value="nature">{t(locale, 'styles.nature')}</option>
    <option value="mystery">{t(locale, 'styles.mystery')}</option>
  </select>

  <!-- Output Language -->
  <select id="output-lang" class="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-pink-500">
    <option value="en">English</option>
    <option value="zh">中文</option>
    <option value="ja">日本語</option>
    <option value="ko">한국어</option>
    <option value="es">Español</option>
  </select>

  <!-- Count -->
  <select id="count" class="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-pink-500">
    <option value="10">10</option>
    <option value="15">15</option>
    <option value="20">20</option>
  </select>
</div>

<button id="generate-btn" class="mt-4 w-full h-12 bg-pink-600 text-white font-medium rounded-xl hover:bg-pink-700 transition-colors flex items-center justify-center gap-2">
  <span id="btn-text">{t(locale, 'generate.button')}</span>
</button>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PromptBox.astro
git commit -m "feat: add PromptBox component with filters"
```

---

## Task 6: NameCard Component

**Files:**
- Create: `src/components/NameCard.astro`

- [ ] **Step 1: Create src/components/NameCard.astro**

Replicate yvideos VideoCard.astro pattern, adapted for name display:

```astro
---
import { t, type Locale } from '../lib/i18n';

interface Props {
  name: string;
  meaning: string;
  style: string;
  category: string;
  locale?: Locale;
  index?: number;
}

const { name, meaning, style, category, locale = 'en', index = 0 } = Astro.props;
---

<div class="group bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer" data-name={name} data-meaning={meaning}>
  <div class="flex items-start justify-between">
    <div class="flex-1 min-w-0">
      <h3 class="text-lg font-bold text-gray-800 group-hover:text-pink-700 transition-colors truncate">{name}</h3>
      <p class="mt-1 text-sm text-gray-500 line-clamp-2">{meaning}</p>
    </div>
    <div class="flex flex-col gap-2 ml-3 flex-shrink-0">
      <button class="copy-btn w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-pink-50 hover:text-pink-600 transition-colors" data-name={name} title={t(locale, 'nameCard.copy')}>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
      </button>
      <button class="fav-btn w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-pink-50 hover:text-pink-600 transition-colors" data-name={name} data-meaning={meaning} title={t(locale, 'nameCard.favorite')}>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
      </button>
    </div>
  </div>
  <div class="mt-3 flex flex-wrap gap-1.5">
    <span class="px-2 py-0.5 text-xs bg-pink-50 text-pink-600 rounded-full">{style}</span>
    <span class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">{category}</span>
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/NameCard.astro
git commit -m "feat: add NameCard component"
```

---

## Task 7: AI Prompt Builder

**Files:**
- Create: `src/lib/prompt.ts`

- [ ] **Step 1: Create src/lib/prompt.ts**

```typescript
export interface GenerateParams {
  prompt?: string;
  gameType: string;
  category: string;
  style: string;
  outputLang: string;
  count: number;
}

export function buildPrompt(params: GenerateParams): string {
  const { prompt, gameType, category, style, outputLang, count } = params;
  
  let systemPrompt = `You are an expert game name generator. Your task is to generate creative, unique, and memorable game names.`;
  
  let userPrompt = `Generate ${count} ${style} style ${category} names`;
  
  if (gameType) {
    userPrompt += ` for ${gameType} games`;
  }
  
  if (prompt) {
    userPrompt += `. The user described: "${prompt}"`;
  }
  
  userPrompt += `. Output the names in ${outputLang} language.`;
  
  userPrompt += `

Requirements:
- Each name must be unique and creative
- Provide a brief meaning or lore explanation for each name (in ${outputLang})
- Format as a numbered list: "1. Name | Meaning"
- Output ONLY the numbered list, no extra text`;

  return userPrompt;
}

export function parseNames(text: string): Array<{ name: string; meaning: string }> {
  const names: Array<{ name: string; meaning: string }> = [];
  const lines = text.split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    // Match patterns like "1. Name | Meaning" or "1. Name - Meaning" or "1. Name: Meaning"
    const match = line.match(/^\d+\.\s*(.+?)(?:\s*[\|\-:]\s*(.+))?$/);
    if (match) {
      const name = match[1].trim();
      const meaning = match[2]?.trim() || '';
      if (name) {
        names.push({ name, meaning });
      }
    }
  }
  
  return names;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/prompt.ts
git commit -m "feat: add AI prompt builder and response parser"
```

---

## Task 8: API Route (CF Pages Function)

**Files:**
- Create: `src/pages/api/generate.ts`

- [ ] **Step 1: Create src/pages/api/generate.ts**

```typescript
import type { APIRoute } from 'astro';
import { buildPrompt } from '../../lib/prompt';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { prompt, gameType, category, style, outputLang, count } = body;

    const apiKey = import.meta.env.AGNES_API_KEY;
    const baseUrl = import.meta.env.AGNES_BASE_URL || 'https://apihub.agnes-ai.com/v1';

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userPrompt = buildPrompt({ prompt, gameType, category, style, outputLang, count });

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'agnes-2.0-flash',
        messages: [
          { role: 'system', content: 'You are an expert game name generator. Generate creative, unique, and memorable game names with meanings.' },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: 'AI service error', details: errorText }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content || '';

    return new Response(JSON.stringify({ 
      success: true, 
      data: generatedText,
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error', details: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/api/generate.ts
git commit -m "feat: add AI generation API route"
```

---

## Task 9: Home Page (Generate)

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create src/pages/index.astro**

Replicate yvideos index.astro pattern with PromptBox + NameCard grid:

```astro
---
import Layout from '../layouts/Layout.astro';
import BottomNav from '../components/BottomNav.astro';
import PromptBox from '../components/PromptBox.astro';
import { getLocale, t } from '../lib/i18n';

export const prerender = true;

const locale = getLocale(Astro.url);
const pageTitle = t(locale, 'generate.title');
const pageDesc = t(locale, 'site.description');
---

<Layout
  title={pageTitle}
  description={pageDesc}
  isHome={true}
  locale={locale}
>
  <!-- Header -->
  <div class="bg-white/95 backdrop-blur-sm border-b border-gray-100">
    <div class="max-w-screen-xl mx-auto px-3 py-3">
      <h1 class="text-xl font-bold text-gray-800">{t(locale, 'site.name')}</h1>
      <p class="text-sm text-gray-500 mt-0.5">{t(locale, 'site.description')}</p>
    </div>
  </div>

  <!-- Prompt Box -->
  <div class="bg-white border-b border-gray-100">
    <div class="max-w-screen-xl mx-auto px-3 py-4">
      <PromptBox locale={locale} />
    </div>
  </div>

  <!-- Results -->
  <main class="max-w-screen-xl mx-auto px-3 pt-4 pb-20">
    <div id="results-loading" class="hidden">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map(() => (
          <div class="bg-white rounded-xl border border-gray-100 p-4">
            <div class="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            <div class="mt-2 h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div class="mt-3 flex gap-2">
              <div class="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div class="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div id="results-empty" class="text-center py-20">
      <p class="text-gray-500">{t(locale, 'history.empty')}</p>
    </div>
    <div id="results-grid" class="hidden grid grid-cols-1 md:grid-cols-2 gap-3"></div>
  </main>

  <BottomNav locale={locale} />

  <script is:inline>
    (function() {
      const btn = document.getElementById('generate-btn');
      const btnText = document.getElementById('btn-text');
      const loading = document.getElementById('results-loading');
      const empty = document.getElementById('results-empty');
      const grid = document.getElementById('results-grid');

      function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
      }

      function createNameCard(name, meaning, style, category) {
        return `
          <div class="group bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer">
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-bold text-gray-800 group-hover:text-pink-700 transition-colors truncate">${escapeHtml(name)}</h3>
                <p class="mt-1 text-sm text-gray-500 line-clamp-2">${escapeHtml(meaning)}</p>
              </div>
              <div class="flex flex-col gap-2 ml-3 flex-shrink-0">
                <button class="copy-btn w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-pink-50 hover:text-pink-600 transition-colors" data-name="${escapeHtml(name)}" title="Copy">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                </button>
                <button class="fav-btn w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-pink-50 hover:text-pink-600 transition-colors" data-name="${escapeHtml(name)}" data-meaning="${escapeHtml(meaning)}" title="Favorite">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                </button>
              </div>
            </div>
            <div class="mt-3 flex flex-wrap gap-1.5">
              <span class="px-2 py-0.5 text-xs bg-pink-50 text-pink-600 rounded-full">${escapeHtml(style)}</span>
              <span class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">${escapeHtml(category)}</span>
            </div>
          </div>
        `;
      }

      function parseNames(text) {
        const names = [];
        const lines = text.split('\n').filter(line => line.trim());
        for (const line of lines) {
          const match = line.match(/^\d+\.\s*(.+?)(?:\s*[\|\-:]\s*(.+))?$/);
          if (match) {
            names.push({ name: match[1].trim(), meaning: match[2]?.trim() || '' });
          }
        }
        return names;
      }

      function saveToHistory(names, params) {
        try {
          const history = JSON.parse(localStorage.getItem('gamesname_history') || '[]');
          history.unshift({ names, params, timestamp: Date.now() });
          if (history.length > 50) history.pop();
          localStorage.setItem('gamesname_history', JSON.stringify(history));
        } catch (e) {}
      }

      async function generate() {
        const prompt = document.getElementById('prompt-input').value;
        const gameType = document.getElementById('game-type').value;
        const category = document.getElementById('category').value;
        const style = document.getElementById('style').value;
        const outputLang = document.getElementById('output-lang').value;
        const count = document.getElementById('count').value;

        if (!gameType && !category && !style && !prompt) {
          alert('Please select at least one filter or enter a description');
          return;
        }

        btn.disabled = true;
        btnText.textContent = 'Generating...';
        loading.classList.remove('hidden');
        empty.classList.add('hidden');
        grid.classList.add('hidden');

        try {
          const resp = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, gameType, category, style, outputLang, count: parseInt(count) }),
          });

          const result = await resp.json();

          if (!result.success) {
            throw new Error(result.error || 'Generation failed');
          }

          const names = parseNames(result.data);
          
          if (names.length === 0) {
            empty.classList.remove('hidden');
            loading.classList.add('hidden');
            return;
          }

          const styleLabel = document.getElementById('style').options[document.getElementById('style').selectedIndex].text;
          const categoryLabel = document.getElementById('category').options[document.getElementById('category').selectedIndex].text;

          grid.innerHTML = names.map(n => createNameCard(n.name, n.meaning, styleLabel, categoryLabel)).join('');
          
          saveToHistory(names, { prompt, gameType, category, style, outputLang, count });

          loading.classList.add('hidden');
          grid.classList.remove('hidden');

          // Attach copy handlers
          grid.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
              e.stopPropagation();
              const name = this.dataset.name;
              navigator.clipboard.writeText(name).then(() => {
                this.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
                setTimeout(() => {
                  this.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>';
                }, 1500);
              });
            });
          });

          // Attach favorite handlers
          grid.querySelectorAll('.fav-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
              e.stopPropagation();
              const name = this.dataset.name;
              const meaning = this.dataset.meaning;
              try {
                const favs = JSON.parse(localStorage.getItem('gamesname_favorites') || '[]');
                if (!favs.find(f => f.name === name)) {
                  favs.unshift({ name, meaning, timestamp: Date.now() });
                  localStorage.setItem('gamesname_favorites', JSON.stringify(favs));
                }
                this.innerHTML = '<svg class="w-4 h-4" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>';
              } catch (e) {}
            });
          });

        } catch (err) {
          alert('Failed to generate names: ' + err.message);
          loading.classList.add('hidden');
          empty.classList.remove('hidden');
        } finally {
          btn.disabled = false;
          btnText.textContent = 'Generate Names';
        }
      }

      btn.addEventListener('click', generate);
      document.getElementById('prompt-input').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') generate();
      });
    })();
  </script>
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add home page with name generator"
```

---

## Task 10: Types Page

**Files:**
- Create: `src/pages/types.astro`

- [ ] **Step 1: Create src/pages/types.astro**

Replicate yvideos discover.astro pattern with game type categories:

```astro
---
import Layout from '../layouts/Layout.astro';
import BottomNav from '../components/BottomNav.astro';
import { getLocale, t } from '../lib/i18n';

export const prerender = true;

const locale = getLocale(Astro.url);

const gameTypes = [
  { key: 'rpg', icon: '⚔️' },
  { key: 'fps', icon: '🔫' },
  { key: 'moba', icon: '🏰' },
  { key: 'mmorpg', icon: '🌍' },
  { key: 'strategy', icon: '♟️' },
  { key: 'sandbox', icon: '🧱' },
  { key: 'racing', icon: '🏎️' },
  { key: 'fighting', icon: '🥊' },
];

const CAT_COLORS = [
  'bg-red-50 text-red-600 hover:bg-red-100',
  'bg-blue-50 text-blue-600 hover:bg-blue-100',
  'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
  'bg-purple-50 text-purple-600 hover:bg-purple-100',
  'bg-green-50 text-green-600 hover:bg-green-100',
  'bg-orange-50 text-orange-600 hover:bg-orange-100',
  'bg-pink-50 text-pink-600 hover:bg-pink-100',
  'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
];
---

<Layout
  title={t(locale, 'types.title')}
  description="Browse game names by game type"
  locale={locale}
>
  <main class="max-w-screen-xl mx-auto pb-20">
    <div class="bg-white border-b border-gray-100">
      <div class="px-3 py-3">
        <h1 class="text-xl font-bold text-gray-800">{t(locale, 'types.title')}</h1>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 p-3">
      {gameTypes.map((type, i) => (
        <a href={`/?type=${type.key}`} class={`flex flex-col items-center gap-2 px-4 py-6 rounded-xl transition-colors ${CAT_COLORS[i % CAT_COLORS.length]}`}>
          <span class="text-3xl">{type.icon}</span>
          <span class="text-sm font-medium">{t(locale, `types.${type.key}`)}</span>
        </a>
      ))}
    </div>
  </main>

  <BottomNav locale={locale} />
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/types.astro
git commit -m "feat: add game types browsing page"
```

---

## Task 11: Styles Page

**Files:**
- Create: `src/pages/styles.astro`

- [ ] **Step 1: Create src/pages/styles.astro**

Replicate yvideos discover.astro pattern with name styles:

```astro
---
import Layout from '../layouts/Layout.astro';
import BottomNav from '../components/BottomNav.astro';
import { getLocale, t } from '../lib/i18n';

export const prerender = true;

const locale = getLocale(Astro.url);

const styles = [
  { key: 'epic', icon: '⚡' },
  { key: 'funny', icon: '😄' },
  { key: 'dark', icon: '🌑' },
  { key: 'mythology', icon: '🏛️' },
  { key: 'fantasy', icon: '🐉' },
  { key: 'scifi', icon: '🚀' },
  { key: 'nature', icon: '🌿' },
  { key: 'mystery', icon: '🔮' },
];

const STYLE_COLORS = [
  'bg-pink-50 text-pink-600 hover:bg-pink-100',
  'bg-blue-50 text-blue-600 hover:bg-blue-100',
  'bg-green-50 text-green-600 hover:bg-green-100',
  'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
  'bg-purple-50 text-purple-600 hover:bg-purple-100',
  'bg-red-50 text-red-600 hover:bg-red-100',
  'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
  'bg-teal-50 text-teal-600 hover:bg-teal-100',
];
---

<Layout
  title={t(locale, 'styles.title')}
  description="Browse game names by style"
  locale={locale}
>
  <main class="max-w-screen-xl mx-auto pb-20">
    <div class="bg-white border-b border-gray-100">
      <div class="px-3 py-3">
        <h1 class="text-xl font-bold text-gray-800">{t(locale, 'styles.title')}</h1>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 p-3">
      {styles.map((style, i) => (
        <a href={`/?style=${style.key}`} class={`flex flex-col items-center gap-2 px-4 py-6 rounded-xl transition-colors ${STYLE_COLORS[i % STYLE_COLORS.length]}`}>
          <span class="text-3xl">{style.icon}</span>
          <span class="text-sm font-medium">{t(locale, `styles.${style.key}`)}</span>
        </a>
      ))}
    </div>
  </main>

  <BottomNav locale={locale} />
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/styles.astro
git commit -m "feat: add name styles browsing page"
```

---

## Task 12: History Page

**Files:**
- Create: `src/pages/history.astro`

- [ ] **Step 1: Create src/pages/history.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
import BottomNav from '../components/BottomNav.astro';
import { getLocale, t } from '../lib/i18n';

export const prerender = true;

const locale = getLocale(Astro.url);
---

<Layout
  title={t(locale, 'history.title')}
  description="Your generated game names history"
  locale={locale}
>
  <main class="max-w-screen-xl mx-auto pb-20">
    <div class="bg-white border-b border-gray-100">
      <div class="px-3 py-3 flex items-center justify-between">
        <h1 class="text-xl font-bold text-gray-800">{t(locale, 'history.title')}</h1>
        <button id="clear-btn" class="text-sm text-pink-600 hover:text-pink-700">{t(locale, 'history.clear')}</button>
      </div>
    </div>

    <!-- Favorites Section -->
    <div class="bg-white mt-2">
      <div class="px-3 py-2 border-b border-gray-100">
        <span class="text-sm font-medium text-gray-800">{t(locale, 'history.favorites')}</span>
      </div>
      <div id="favorites-list" class="p-3 space-y-2"></div>
    </div>

    <!-- History Section -->
    <div class="bg-white mt-2">
      <div class="px-3 py-2 border-b border-gray-100">
        <span class="text-sm font-medium text-gray-800">{t(locale, 'history.title')}</span>
      </div>
      <div id="history-list" class="p-3 space-y-2"></div>
    </div>
  </main>

  <BottomNav locale={locale} />

  <script is:inline>
    (function() {
      function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
      }

      function renderFavorites() {
        const container = document.getElementById('favorites-list');
        try {
          const favs = JSON.parse(localStorage.getItem('gamesname_favorites') || '[]');
          if (favs.length === 0) {
            container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">No favorites yet</p>';
            return;
          }
          container.innerHTML = favs.map(f => `
            <div class="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div class="flex-1 min-w-0">
                <span class="font-medium text-gray-800">${escapeHtml(f.name)}</span>
                <p class="text-xs text-gray-500 mt-0.5">${escapeHtml(f.meaning || '')}</p>
              </div>
              <button class="copy-btn ml-2 w-8 h-8 flex items-center justify-center rounded-lg bg-white hover:bg-pink-50 hover:text-pink-600 transition-colors" data-name="${escapeHtml(f.name)}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </button>
            </div>
          `).join('');
        } catch (e) {
          container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">Error loading favorites</p>';
        }
      }

      function renderHistory() {
        const container = document.getElementById('history-list');
        try {
          const history = JSON.parse(localStorage.getItem('gamesname_history') || '[]');
          if (history.length === 0) {
            container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">No history yet</p>';
            return;
          }
          container.innerHTML = history.map(h => `
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-gray-400">${new Date(h.timestamp).toLocaleDateString()}</span>
                <span class="text-xs text-pink-600">${h.names.length} names</span>
              </div>
              <div class="flex flex-wrap gap-1">
                ${h.names.slice(0, 5).map(n => `<span class="px-2 py-0.5 text-xs bg-white rounded-full text-gray-700">${escapeHtml(n.name)}</span>`).join('')}
                ${h.names.length > 5 ? `<span class="px-2 py-0.5 text-xs bg-white rounded-full text-gray-400">+${h.names.length - 5}</span>` : ''}
              </div>
            </div>
          `).join('');
        } catch (e) {
          container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">Error loading history</p>';
        }
      }

      document.getElementById('clear-btn').addEventListener('click', function() {
        if (confirm('Clear all history and favorites?')) {
          localStorage.removeItem('gamesname_history');
          localStorage.removeItem('gamesname_favorites');
          renderFavorites();
          renderHistory();
        }
      });

      renderFavorites();
      renderHistory();
    })();
  </script>
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/history.astro
git commit -m "feat: add history and favorites page"
```

---

## Task 13: Profile Page

**Files:**
- Create: `src/pages/profile.astro`

- [ ] **Step 1: Create src/pages/profile.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
import BottomNav from '../components/BottomNav.astro';
import { getLocale, t, supportedLocales, type Locale } from '../lib/i18n';

export const prerender = true;

const locale = getLocale(Astro.url);

const languages = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'es', label: 'Español' },
];
---

<Layout
  title={t(locale, 'profile.title')}
  description="Settings and preferences"
  locale={locale}
>
  <main class="max-w-screen-xl mx-auto pb-20">
    <div class="bg-white border-b border-gray-100">
      <div class="px-3 py-3">
        <h1 class="text-xl font-bold text-gray-800">{t(locale, 'profile.title')}</h1>
      </div>
    </div>

    <!-- Language -->
    <div class="bg-white mt-2">
      <div class="px-3 py-2 border-b border-gray-100">
        <span class="text-sm font-medium text-gray-800">{t(locale, 'profile.language')}</span>
      </div>
      <div class="p-3">
        <div class="flex flex-wrap gap-2">
          {languages.map(lang => (
            <a 
              href={`?lang=${lang.code}`} 
              class={`px-3 py-1.5 text-sm rounded-full transition-colors ${lang.code === locale ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {lang.label}
            </a>
          ))}
        </div>
      </div>
    </div>

    <!-- About -->
    <div class="bg-white mt-2">
      <div class="px-3 py-2 border-b border-gray-100">
        <span class="text-sm font-medium text-gray-800">{t(locale, 'profile.about')}</span>
      </div>
      <div class="p-3">
        <p class="text-sm text-gray-600">GamesName - AI-powered game name generator</p>
        <p class="text-xs text-gray-400 mt-1">{t(locale, 'profile.version')}</p>
        <p class="text-xs text-gray-400 mt-2">Powered by Agnes AI</p>
      </div>
    </div>
  </main>

  <BottomNav locale={locale} />
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/profile.astro
git commit -m "feat: add profile/settings page"
```

---

## Task 14: Public Assets

**Files:**
- Create: `public/favicon.svg`
- Create: `public/manifest.json`

- [ ] **Step 1: Create public/favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#ec4899"/>
  <text x="50" y="65" font-size="50" text-anchor="middle" fill="white" font-family="Arial">G</text>
</svg>
```

- [ ] **Step 2: Create public/manifest.json**

```json
{
  "name": "GamesName",
  "short_name": "GamesName",
  "description": "AI-powered game name generator",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f9fafb",
  "theme_color": "#ec4899",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    }
  ]
}
```

- [ ] **Step 3: Commit**

```bash
git add public/
git commit -m "feat: add favicon and manifest"
```

---

## Task 15: Build & Test

- [ ] **Step 1: Build the project**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 2: Test locally**

Run: `npm run preview`
Expected: Site runs on localhost

- [ ] **Step 3: Fix any build errors**

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "build: successful build and test"
```

---

## Task 16: Deploy to GitHub

- [ ] **Step 1: Add remote and push**

```bash
git remote add origin https://github.com/YOUR_USERNAME/gamesname.git
git branch -m main
git push -u origin main
```

- [ ] **Step 2: Configure Cloudflare Pages**

1. Go to Cloudflare Dashboard → Pages
2. Create a project, connect to GitHub repo `gamesname`
3. Build settings:
   - Framework preset: Astro
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Add environment variable:
   - `AGNES_API_KEY` = your Agnes AI API key
5. Deploy

---

## Spec Coverage Check

| Requirement | Task |
|---|---|
| Astro 7 + CF adapter | Task 1 |
| Tailwind CSS v4 | Task 1 |
| Pink theme (#ec4899) | Task 3 |
| Bottom nav (4 tabs) | Task 4 |
| Generate page with filters | Task 5, 9 |
| Name cards with copy/favorite | Task 6, 9 |
| Types browsing page | Task 10 |
| Styles browsing page | Task 11 |
| History/favorites page | Task 12 |
| Profile/settings page | Task 13 |
| Multi-language (en/zh/ja/ko/es) | Task 2 |
| Agnes AI API integration | Task 7, 8 |
| API key security (CF Functions) | Task 8 |
| Local storage for history/favorites | Task 9, 12 |
| PWA manifest | Task 14 |

---

Plan complete. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
