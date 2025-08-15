# Leaflet Astro Loader

This loader is for [leaflet.pub](https://leaflet.pub/). It fetches leaflet document records from your personal data server to then be used on your astro site.

There are two different types of loaders you can use from this package:

- **Static Loader:** Fetches data at build time and is served statically on your website
- **Live Loader (experimental astro feature):** Fetches data on each request. **Note**: This package does not provide any caching mechanisms for the live loader. So to avoid slamming your PDS (or someone elses PDS) with requests it's probably a good idea to set up some sort of cache either using cache headers or some other means.

## Installation

```bash
npm install @nulfrost/leaflet-loader-astro
```

## Usage

<details>
<summary>Build-time loader: leafletStaticLoader **(recommended)**</summary>

```ts
// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { leafletStaticLoader } from "@nulfrost/leaflet-loader-astro";

const documents = defineCollection({
	loader: leafletStaticLoader({ repo: "did:plc:qttsv4e7pu2jl3ilanfgc3zn" }), // or repo: dane.is.extraordinarily.cool
});

export const collections = { documents };
```

```ts
// src/pages/index.astro
---
import { getCollection } from "astro:content";

const documents = await getCollection("documents");
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>Astro</title>
	</head>
	<body>
		<h1>Astro + Leaflet.pub</h1>
		<ul>
			{documents.map(document => <li>
				<a href={`/blogs/${document.id}`}>{document.data.title}</a>
			</li>)}
		</ul>
	</body>
</html>
```

```ts
// src/pages/blog/[blog].astro
---
import { getCollection, getEntry } from "astro:content";
import { render } from "astro:content";

export async function getStaticPaths() {
	const documents = await getCollection("documents");
	return documents.map((document) => ({
		params: { blog: document.id },
		props: document,
	}));
}

const document = await getEntry("documents", Astro.params.blog);

if (!document) {
	throw new Error(`Document with id "${Astro.params.blog}" not found`);
}

const { Content } = await render(document);
---

<Content />
```
</details>

<details>
<summary>Live loader: leafletLiveLoader</summary>

```ts
// astro.config.mjs

// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	experimental: {
		liveContentCollections: true, // make sure to enable this
	},
});
```

```ts
// src/live.config.ts
import { defineLiveCollection, z } from "astro:content";
import { leafletLiveLoader } from "@nulfrost/leaflet-loader-astro";

const documents = defineLiveCollection({
	loader: leafletLiveLoader({ repo: "did:plc:qttsv4e7pu2jl3ilanfgc3zn" }), // or repo: dane.is.extraordinarily.cool
});

export const collections = { documents };
```

```ts
// src/pages/index.astro
---
import { getLiveCollection } from "astro:content";

export const prerender = false;

const documents = await getLiveCollection("documents");
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>Astro</title>
	</head>
	<body>
		<h1>Astro + Leaflet.pub</h1>
		<ul>
			{documents.map(document => <li>
				<a href={`/blogs/${document.id}`}>{document.data.title}</a>
			</li>)}
		</ul>
	</body>
</html>
```

```ts
// src/pages/blog/[blog].astro
---
import { getLiveEntry } from "astro:content";
import { render } from "astro:content";

export const prerender = false;

const document = await getLiveEntry("documents", Astro.params.blog);

if (!document) {
	throw new Error(`Document with id "${Astro.params.blog}" not found`);
}

const { Content } = await render(document?.entry);
---

<Content />
```

</details>

## Loader Options

### Static Loader

```ts
leafletStaticLoader()
```

`repo`: This can be either your DID (did:plc:qttsv4e7pu2jl3ilanfgc3zn) or your handle (dane.is.extraordinarily.cool)

`limit`: How many leaflet documents to return when calling `getCollection`. The default is 50 and the range is from 1 to 100.

`reverse`: Whether or not to return the leaflet documents in reverse order. By default this is false.

### Live Loader

```ts
leafletLiveLoader()
```

`repo`: This can be either your DID (did:plc:qttsv4e7pu2jl3ilanfgc3zn) or your handle (dane.is.extraordinarily.cool)

> [!NOTE]
> `getLiveCollection` supports a second argument where you can add additional filters, similar to the options you have access to for `leafletStaticLoader`

```ts
getLiveCollection()
```

`limit`: How many leaflet documents to return when calling `getCollection`. The default is 50 and the range is from 1 to 100.

`reverse`: Whether or not to return the leaflet documents in reverse order. By default this is false.


## License

MIT

For questions, contributions, and support, please open an issue on GitHub.