---
"@nulfrost/leaflet-loader-astro": minor
---

Added the ability to use a handle or did when specifying a repo for leafletStaticLoader and leafletLiveLoader


```ts
import { defineLiveCollection} from "astro:content";
import { leafletLiveLoader } from "leaflet-loader-astro";

const documents = defineLiveCollection({
	loader: leafletLiveLoader({ repo: "dane.computer" }), // or repo: did:plc:qttsv4e7pu2jl3ilanfgc3zn, both work!
});

export const collections = { documents };
```