I had to add vue-meta package manually since there's an error in vue-meta.d.ts:

```ts
/// <reference path="./ssr.d.ts" />
```

it should be:

```ts
/// <reference path="../ssr/index.d.ts" />
```

...and [it's not been fixed](https://github.com/nuxt/vue-meta/issues/693).
