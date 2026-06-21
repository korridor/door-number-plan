# Door Number Plan / Türnummernplan

A free, privacy-friendly web tool for creating printable building directories. The generated plans help emergency workers, delivery drivers, service providers, and guests find the correct floor and door number in multi-story buildings.

The application runs entirely in the browser. Addresses, door numbers, and other plan data are never uploaded to a server.

## Features

- English and German routes at `/en/` and `/de/`
- Live A4 landscape preview
- Client-side PDF generation
- Ordered floors, door numbers, and elevators
- Color and black-and-white output
- Automatic pagination for larger buildings
- Local browser storage
- Shareable plan links
- No external CDN resources

## Technology

- [Astro](https://astro.build/)
- [Vue 3](https://vuejs.org/) with TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- [jsPDF](https://github.com/parallax/jsPDF)
- Locally bundled Fontsource fonts

## Development

Requirements:

- Node.js
- pnpm

Install dependencies and start the development server:

```sh
pnpm install
pnpm dev
```

The site is then available at `http://localhost:4321`.

## Checks and production build

```sh
pnpm exec astro check
pnpm build
```

The static production output is written to `dist/`.

## Privacy

Plan data is stored in the user's browser using `localStorage`. Data is included in a URL only when the user explicitly clicks the share button.

## License

Licensed under the [MIT License](LICENSE).
