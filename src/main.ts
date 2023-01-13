import { type Plugin, createFilter } from "vite";
import { type Options, transform } from "@swc/core";

export type swcPluginOptions = {
  staticThreshold?: number;
  customElementPatterns?: string[];
};

const DEFAUTL_OPTIONS = {
  isModule: true,
  jsc: {
    target: "es2022",
    parser: {
      syntax: "typescript",
      tsx: true,
    },
    experimental: {
      plugins: [["@westhide/swc-plugin-vue-jsx", {} as swcPluginOptions]],
    },
  },
} satisfies Options;

export default function (opts: Options = DEFAUTL_OPTIONS) {
  const filter = createFilter(/\.[jt]sx$/);

  return {
    name: "vite-plugin-vue-jsx-swc",

    config() {
      return {
        esbuild: {
          include: /\.ts$/,
        },
        define: {
          __VUE_OPTIONS_API__: true,
          __VUE_PROD_DEVTOOLS__: false,
        },
      };
    },

    async transform(src, id) {
      if (filter(id)) {
        return transform(src, opts);
      } else {
        return null;
      }
    },
  } as Plugin;
}
