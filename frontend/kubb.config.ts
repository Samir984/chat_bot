import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginTs } from "@kubb/plugin-ts";

export default defineConfig({
  name: "chatbot",
  root: ".",
  input: {
    path: "http://127.0.0.1:8000/api/openapi.json",
  },
  output: {
    path: "./src/gen",
    clean: true,
  },
  plugins: [pluginOas(), pluginTs()],
});
