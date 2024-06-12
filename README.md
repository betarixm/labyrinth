# Labyrinth

*Labyrinth* is a powerful library that enables you to generate labyrinths on static sites using cryptography, eliminating the need for an application server.

## Getting Started

Follow these steps to set up Labyrinth and start your labyrinth-building journey:

```bash
git clone https://github.com/betarixm/labyrinth.git
cd labyrinth
bun install
```

## Creating Your Labyrinth

*Labyrinth* is framework-agnostic, allowing you to build your labyrinth application with any frontend framework of your choice, such as Next.js, or Nuxt. However, we recommend using [Astro](https://astro.build) for its excellent static site generation capabilities.

To create your *Labyrinth* application, follow these steps:

1. Create a new directory for your application inside the `apps` folder.
2. In your application directory, initialize a new project using your preferred framework or Astro.
3. Install `@labyrinth/labyrinth` as a dependency in your application.

## Packages

### @labyrinth/labyrinth

The core package containing the fundamental functionality for creating labyrinth.

[View](packages/labyrinth)

### @labyrinth/react

A collection of React hooks to simplify the development of labyrinth.

[View](packages/react)

## Applications

### @labyrinth/postech-2024

The official labyrinth for the POSTECH-KAIST Science War 2024, showcasing the capabilities of *Labyrinth*.
