# Nuxt Redirect ⤳ Nuxt **dynamic pages** syntax for quick development!

[![npm version][npm-version-src]][npm-version-href]
[![Dependencies][dep-src]][dep-href]
[![Standard JS][standard-js-src]][standard-js-href]

> Nuxt module to dynamically redirect initial requests

[📖 **Release Notes**](./CHANGELOG.md)

## Features

Redirecting URLs is an often discussed topic, especially when it comes to
SEO. We have created a package that uses a similar syntax as dynamic paging
in NuxtJs to perform redirect. 

## Setup

1. Add the `nuxt-redirect` dependency with `yarn` or `npm` to your project
2. Add `nuxt-redirect` to the `modules` section of `nuxt.config.js`:
3. Configure it:

```js
{
  modules: [
    ['redirect-module', {
      // Redirect option here
    }]
  ]
}
```

### Using top level options

```js
{
  modules: [
    'redirect-module'
  ],
  redirect: [
    // Redirect options here
  ]
}
```

## Options

### `rules`

- Default: `[]`

Rules of your redirects an array of object `{ from: string, to: string | function}`

### `onDecode`

- Default: `(req, res, next) => decodeURI(req.url)`

You can set decode.

### `onDecodeError`

- Default: `(error, req, res, next) => next(error)`

You can set callback when there is an error in the decode.

### `statusCode`

- Default: `302`

You can set the default statusCode which gets used when no statusCode is defined on the rule itself.

## Usage

Simply add the links you want to redirect as objects to the module option array:

```js
redirect: [
  { from: '/oldurl', to: '/newurl' }
]
```

You can set up a custom status code as well. By default, it's *302*!

```js
redirect: [
  { from: '/myoldurl', to: '/mynewurl', statusCode: 301 }
]
```

We can also build dynamic redirects using a similar syntax as nuxt dynamic paging

```js
redirect: [
  { from: '/account_holders/_user_id', to: '/users/_user_id/profile' }, 
  { from: '/account_holders/_user_id/_post_id', to: '/users/_user_id/posts/_post_id' } 
]
```

Furthermore you can use a function to create your `to` url as well:
The `from` rule and the `req` of the middleware will be provided as arguments.
The function can also be *async*!

```js
redirect: [
  {
    from: '/someUrlHere/_user_id',
    to: (from, req) => {
      const to = someFunction(from,req)
      return to
    }
  }
]
```

And if you really need more power... okay! You can also use a factory function
to generate your redirects:

```js
redirect: async () => {
  const someThings = await axios.get("/myApi") // It'll wait!
  return someThings.map(coolTransformFunction)
}
```

Now, if you want to customize your redirects, how your decode is done
or when there is some error in the decode, you can also:

```js
redirect: {
  rules: [
    { from: '^/myoldurl', to: '/mynewurl' }
  ],
  onDecode: (req, res, next) => decodeURI(req.url),
  onDecodeError: (error, req, res, next) => next(error)
}
```

**ATTENTION**: The factory function **must** return an array with redirect
objects (as seen above).

## Gotchas

The redirect module will not work in combination with `nuxt generate`.
Redirects are realized through a server middleware, which can only react when there is a server running.

## License

[MIT License](./LICENSE)

Copyright (c) Aryan Gupta <https://www.linkedin.com/in/aryan-gupta-3a7033146/>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/badge/npm%40latest-1.0.2-yellowgreen?style=flat-square
[npm-version-href]: https://www.npmjs.com/package/nuxt-redirect
[standard-js-src]: https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square
[standard-js-href]: https://standardjs.com
[dep-src]: https://status.david-dm.org/gh/WebWorksDesigners/nuxt-redirect.svg?style=flat-square
[dep-href]: https://david-dm.org/WebWorksDesigners/nuxt-redirect

