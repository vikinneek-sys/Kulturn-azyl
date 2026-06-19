# Kulturní azyl — Next.js + Payload CMS starter

Starter pro kulturní magazín s redakčním systémem.

Stack:

- **Next.js / React / TypeScript** — veřejný web
- **Payload CMS** — administrace, články, média, uživatelé, role
- **SQLite** — lokální databáze pro vývoj
- **Lexical rich text editor** — texty článků

## Co už je hotové

Veřejný web:

- Úvodní stránka
- Rubriky:
  - Hudba
  - Malba / grafika
  - Literatura
  - Divadlo / performance
- Detail článku
- Redakce
- O projektu
- Kontakt
- Základní tmavý magazínový design

CMS:

- `/admin`
- Uživatelé
- Média
- Rubriky
- Články
- Stránky
- Role:
  - `admin`
  - `editor`
  - `redaktor`

Workflow:

- Redaktor může psát články.
- Redaktor může upravovat vlastní články.
- Redaktor se nemůže sám publikovat jako král vesmíru.
- Editor/Admin může upravovat a publikovat všechny články.

## Instalace

Doporučeně použij `pnpm`.

```bash
pnpm install
cp .env.example .env
pnpm seed
pnpm dev
```

Pak otevři:

```txt
http://localhost:3000
```

Administrace:

```txt
http://localhost:3000/admin
```

Seed vytvoří admin účet:

```txt
email: admin@kulturniazyl.cz
heslo: ChangeMe123!
```

Po prvním přihlášení heslo změň. Tohle není dekorace, to je zámek od baráku.

## Jak vytvořit redaktora

1. Přihlas se jako admin na `/admin`.
2. Otevři **Uživatelé**.
3. Vytvoř nového uživatele.
4. Nastav mu roli `redaktor` nebo `editor`.
5. Pošli mu přístupové údaje.

## Jak přidat článek

1. V CMS otevři **Články**.
2. Dej **Create New**.
3. Vyplň titulek, slug, perex, rubriku, autora a text.
4. Redaktor nastaví stav `Ke schválení`.
5. Editor zkontroluje a nastaví `Publikováno`.

## Struktura projektu

```txt
src/
  app/
    (frontend)/        veřejný web
    (payload)/         Payload admin + API
  collections/         CMS modely: Users, Articles, Categories, Media, Pages
  components/          React komponenty webu
  lib/                 helpery pro Payload, datum a rich text
  payload.config.ts    hlavní konfigurace Payload CMS
scripts/
  seed.ts              založení admina, rubrik a demo článku
```

## Produkce

Lokálně běží SQLite jako soubor `payload.db`. Pro produkci bych řešil jednu z těchto variant:

- Turso / vzdálená SQLite databáze
- Postgres
- vlastní VPS/Coolify s persistentním diskem

Na Vercelu nepoužívej lokální souborovou SQLite databázi jako produkční úložiště. Serverless prostředí ti může lokální soubory po deployi zahodit. A to je přesně ten typ zábavy, kterou nechceš.

## Další logické kroky

- Automatické generování slugů z titulku
- Náhled článku před publikací
- Newsletter
- Vyhledávání
- Kalendář akcí
- Podcast sekce
- SEO metadata pro články
- Kontaktní formulář
- Lepší renderování rich textu včetně obrázků uvnitř textu
