#!/usr/bin/env bash
# render-aur.sh <build-npm dir> <aur dir>: writes PKGBUILD, .SRCINFO and the romacode2 shim for romacode-beta.
# The package installs the published npm tarballs, so their hashes come from the build-npm artifact.
# LICENSE comes from the AUR repository itself.
. "$(dirname "$0")/lib.sh"

npm=$1 aur=$2
name=romacode-beta
pkgver="${ROMACODE_VERSION//-/.}"
if dry_run && [ ! -f "$aur/LICENSE" ]; then printf 'MIT License\n' > "$aur/LICENSE"; fi
test -s "$aur/LICENSE" || die "The AUR repository has no LICENSE"
printf '#!/bin/sh\nexec "$(dirname "$0")/romacode" "$@"\n' > "$aur/romacode2"
sum() { sha256 "$1" | cut -c1-64; }
x64=$(sum "$npm/romacode-cli-linux-x64-baseline-$ROMACODE_VERSION.tgz")
arm64=$(sum "$npm/romacode-cli-linux-arm64-$ROMACODE_VERSION.tgz")
x64_url="https://registry.npmjs.org/@romacode/cli-linux-x64-baseline/-/cli-linux-x64-baseline-$ROMACODE_VERSION.tgz"
arm64_url="https://registry.npmjs.org/@romacode/cli-linux-arm64/-/cli-linux-arm64-$ROMACODE_VERSION.tgz"
license=$(sum "$aur/LICENSE")
shim=$(sum "$aur/romacode2")

# Stripping a compiled Bun executable can damage its embedded application.
cat > "$aur/PKGBUILD" <<PKGBUILD
# Maintainer: Dax <mail@thdxr.com>
pkgname=$name
pkgver=$pkgver
pkgrel=1
pkgdesc='RomaCode beta - the AI coding agent for the terminal'
url='https://github.com/reddata997327/romacode-cli'
arch=('x86_64' 'aarch64')
license=('MIT')
depends=('glibc' 'gcc-libs' 'ripgrep')
provides=('romacode' 'romacode2')
conflicts=('romacode' 'romacode2')
options=('!strip' '!debug')
source=('LICENSE' 'romacode2')
sha256sums=('$license' '$shim')
source_x86_64=('$name-$pkgver-x86_64.tgz::$x64_url')
sha256sums_x86_64=('$x64')
source_aarch64=('$name-$pkgver-aarch64.tgz::$arm64_url')
sha256sums_aarch64=('$arm64')

package() {
  install -Dm755 "\$srcdir/package/bin/romacode" "\$pkgdir/usr/bin/romacode"
  install -Dm755 "\$srcdir/romacode2" "\$pkgdir/usr/bin/romacode2"
  install -Dm644 "\$srcdir/LICENSE" "\$pkgdir/usr/share/licenses/\$pkgname/LICENSE"
}
PKGBUILD

# What makepkg --printsrcinfo prints for the PKGBUILD above.
t=$'\t'
cat > "$aur/.SRCINFO" <<SRCINFO
pkgbase = $name
${t}pkgdesc = RomaCode beta - the AI coding agent for the terminal
${t}pkgver = $pkgver
${t}pkgrel = 1
${t}url = https://github.com/reddata997327/romacode-cli
${t}arch = x86_64
${t}arch = aarch64
${t}license = MIT
${t}depends = glibc
${t}depends = gcc-libs
${t}depends = ripgrep
${t}provides = romacode
${t}provides = romacode2
${t}conflicts = romacode
${t}conflicts = romacode2
${t}options = !strip
${t}options = !debug
${t}source = LICENSE
${t}source = romacode2
${t}sha256sums = $license
${t}sha256sums = $shim
${t}source_x86_64 = $name-$pkgver-x86_64.tgz::$x64_url
${t}sha256sums_x86_64 = $x64
${t}source_aarch64 = $name-$pkgver-aarch64.tgz::$arm64_url
${t}sha256sums_aarch64 = $arm64

pkgname = $name
SRCINFO
cat "$aur/PKGBUILD" "$aur/.SRCINFO"
