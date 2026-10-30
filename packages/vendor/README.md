# Vendored dependencies

These packages are **vendored into the monorepo**: their published code lives here,
including local modifications that were previously maintained as bun patch files
(`patches/*.patch` + `patchedDependencies` in the root `package.json`).

Because the patched code is now part of the source tree, installing this repository
requires **no patch step at all**: `bun install` resolves these packages directly from
this folder (via the `packages/vendor/*` workspace glob), and the resolved version is
guaranteed to be the one below.

Do not run `bun add`, `bun update`, or `bun pm migrate` against these packages — edit
the vendored sources here instead. If a package needs to be upgraded, re-vendor the new
version and re-apply the local modification described below.

| Vendored package | Upstream version | Used by | Local modification baked in |
| --- | --- | --- | --- |
| `@ai-sdk/openai-compatible` | 2.0.41 | core | Streaming error chunks propagate the full error object (`chunk.value.error`) instead of flattening it to `.message`, preserving error codes/details for provider diagnostics. |
| `@ff-labs/fff-bun` | 0.10.5 | core | Relative imports inside `src/` use explicit `.js` extensions so the TypeScript sources can be bundled by `Bun.build`/tsc NodeNext resolution without a bundler-specific extension shim. |
| `@modelcontextprotocol/client` | 2.3.1 | client, core | OAuth: do not forward the issuer's query string onto well-known metadata URLs; do not force `prompt=consent` for `offline_access`; tool `outputSchema` accepts loose objects with an optional `$schema` field. |
| `@npmcli/agent` | 4.0.2 | util (via make-fetch-happen) | `get proxy()` returns the proxy URL as a string (`toString()`), matching what `http-proxy-agent`/`https-proxy-agent` expect, instead of a `URL` object. |
| `@silvia-odwyer/photon-node` | 0.3.4 | cli, core | wasm-bindgen glue keeps its externref table on an internal placeholder object (safe under Bun's ESM-CJS interop), and the wasm binary path can be overridden via `globalThis.__ROMACODE_PHOTON_WASM_PATH` so the compiled CLI can load the asset it embeds. |
| `pacote` | 21.5.1 | util | Git fetcher: hosted tarball URLs use the resolved commit SHA plus a `::path:` subdirectory suffix, and extraction falls back to a real clone when the tarball download fails with an HTTP >= 400 status or a non-tarball response (`TAR_*` errors), instead of only on `Http*` error classes. |
| `solid-js` | 1.9.17 | cli, client, plugin, tui, ui | `cleanNode` snapshots `tOwned`/`owned`/`cleanups` arrays before nulling them, preventing iteration over arrays that are mutated (nulled) mid-loop — fixes sporadic cleanup crashes under the TUI renderer. Bare specifiers (`solid-js`, `solid-js/store`, `solid-js/web`) resolve to the client (non-SSR) build under the Bun runtime via a `bun` export condition, so `@opentui/solid`'s Bun entry and TUI code never load `dist/server.js` (Node/Vite resolution is unchanged; Vite dev configs alias explicitly). |
