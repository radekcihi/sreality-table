/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.js');

/** @type {import("next").NextConfig} */
const config = {
  rewrites: async () => {
    return [
      {
        source: '/api/estates',
        destination: 'https://www.sreality.cz/api/cs/v2/estates',
      },
    ];
  },
};

export default config;
