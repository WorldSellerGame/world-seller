# Qivan

## Getting Started

Ensure you have NodeJS v18 (needed for structuredClone).

1. `npm i`
2. `npm run load:content`

## Running the Game

`npm start`


## Development-related Topics

### Reloading Game Content

`npm run load:content`

### Creating a New Page

`npx @ionic/cli g page pages/[page-name]`

### Creating a New Service

`npx @ionic/cli g service services/[service-name]`

### Creating a New Data Store

1. Create the 5 files in any category in `stores/`
1. Add the store to `stores/index.ts`
1. Add the migrations file to `stores/migrations.ts`

### Adding a New SVG

1. Find the SVG [here](https://seiyria.com/gameicons-font/).
1. Copy the SVG locally to `src/assets/icon`.
1. Remove the SVGs `fill` attribute.
