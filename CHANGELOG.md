# leaflet-loader-astro

## 1.3.0

### Minor Changes

- eb3bc4b: Add iframe block

## 1.2.0

### Minor Changes

- f920153: Add support for blockquotes

### Patch Changes

- 8922bb1: Add JSDoc comments for available loader options for leafletStaticLoader and leafletLiveLoader

## 1.1.0

### Minor Changes

- 6d70cc6: Added support for these leaflet blocks:

  - ul/li
  - math
  - code
  - img
  - hr

  the only remaining block to implement is "website", though I haven't thought of a good way to output that yet. stay tuned for a further release

- 5524ce5: Added the ability to use a handle or did when specifying a repo for leafletStaticLoader and leafletLiveLoader

  ```ts
  import { defineLiveCollection } from "astro:content";
  import { leafletLiveLoader } from "leaflet-loader-astro";

  const documents = defineLiveCollection({
    loader: leafletLiveLoader({ repo: "dane.computer" }), // or repo: did:plc:qttsv4e7pu2jl3ilanfgc3zn, both work!
  });

  export const collections = { documents };
  ```

## 1.0.0

### Major Changes

- b4309c0: This is the initial release for `leaflet-loader-astro`
