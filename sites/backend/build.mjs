/* This script will build the backend with esbuild */
import esbuild from 'esbuild'
import pkg from './package.json' with { type: 'json' }

// Create banner based on package info
const banner = `/**
 * ${pkg.name} | v${pkg.version}
 * ${pkg.description}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * @license ${pkg.license}
 */`

// Shared esbuild options
const options = {
  banner: {
    js: `// See: https://github.com/evanw/esbuild/issues/1921
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
import __path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = __path.dirname(__filename);

${banner}
`,
  },
  bundle: true,
  entryPoints: ['src/index.mjs'],
  format: 'esm',
  outfile: 'dist/index.mjs',
  external: ['./local-config.mjs', './sluglist.mjs'],
  metafile: process.env.VERBOSE ? true : false,
  minify: process.env.NO_MINIFY ? false : true,
  sourcemap: true,
  platform: 'node',
  target: 'node22',
}

// Let esbuild generate the build
const build = async () => {
  const result = await esbuild.build(options).catch((err) => {
    console.log(err)
    process.exit(1)
  })

  if (process.env.VERBOSE) {
    const info = await esbuild.analyzeMetafile(result.metafile)
    console.log(info)
  }
}
build()
