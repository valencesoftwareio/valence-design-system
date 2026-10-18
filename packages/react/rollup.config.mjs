import { existsSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import postcssUrl from 'postcss-url';

const sourceRoot = fileURLToPath(new URL('./src/', import.meta.url));
const resolveInternalImport = {
  name: 'resolve-internal-import',
  resolveId(source) {
    if (!source.startsWith('#src/')) {
      return null;
    }

    const path = `${sourceRoot}${source.slice(5)}`;

    return [path, `${path}.ts`, `${path}.tsx`].find(existsSync);
  },
};

export default {
  input: {
    index: 'src/index.ts',
    'icons/index': 'src/icons/index.ts',
  },
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    '@internationalized/date',
    '@radix-ui/react-select',
    'lucide-react',
    'react-aria-components',
    '@valencesoftwareio/tokens',
    '@valencesoftwareio/types',
  ],
  output: {
    dir: 'dist',
    entryFileNames: '[name].js',
    format: 'es',
  },
  plugins: [
    resolveInternalImport,
    esbuild({ target: 'es2022', jsx: 'automatic' }),
    postcss({
      extract: 'index.css',
      to: 'dist/index.css',
      modules: { generateScopedName: '[name]_[local]_[hash:6]' },
      plugins: [postcssImport(), postcssUrl({ url: 'copy', assetsPath: 'fonts', useHash: true })],
    }),
  ],
};
