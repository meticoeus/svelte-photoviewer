# svelte photo-viewer

Create a Google Photos-esque image gallery.
This can be used with Vanilla JS, as well as within a Svelte project.
This is an updated fork of https://github.com/psnszsn/svelte-photoviewer converted to Typescript.

## Demo

https://meticoeus.github.io/svelte-photoviewer

## Developing

Install dependencies with `npm install`, then start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Update the library in `src/lib`.
Update the preview in `src/routes`.

## Building

To build your library:

```bash
npm run package
```

To create a production version of your showcase app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Publishing

To publish an update [npm](https://www.npmjs.com):

```bash
npm publish
```
