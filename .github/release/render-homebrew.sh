#!/usr/bin/env bash
# render-homebrew.sh <sign-macos dir> <build-archives dir> <tap dir>: writes Formula romacode-v2.rb with the
# hashes of the signed macOS and the Linux archives.
. "$(dirname "$0")/lib.sh"

macos=$1 archives=$2 tap=$3
sum() { sha256 "$1" | cut -c1-64; }
base="https://romacode.dev/files/bin/$ROMACODE_VERSION"
cat > "$tap/romacode-v2.rb" <<FORMULA
# typed: false
# frozen_string_literal: true

class RomacodeV2 < Formula
  desc "RomaCode V2 - the AI coding agent for the terminal"
  homepage "https://github.com/reddata997327/romacode-cli"
  version "$ROMACODE_VERSION"
  license "MIT"

  depends_on "ripgrep"
  conflicts_with "romacode", because: "both install an romacode binary"

  on_macos do
    if Hardware::CPU.arm?
      url "$base/romacode-darwin-arm64.zip"
      sha256 "$(sum "$macos/romacode-darwin-arm64.zip")"
    else
      url "$base/romacode-darwin-x64-baseline.zip"
      sha256 "$(sum "$macos/romacode-darwin-x64-baseline.zip")"
    end
  end

  on_linux do
    if Hardware::CPU.arm?
      url "$base/romacode-linux-arm64.tar.gz"
      sha256 "$(sum "$archives/romacode-linux-arm64.tar.gz")"
    else
      url "$base/romacode-linux-x64-baseline.tar.gz"
      sha256 "$(sum "$archives/romacode-linux-x64-baseline.tar.gz")"
    end
  end

  def install
    bin.install "romacode"
  end
end
FORMULA
cat "$tap/romacode-v2.rb"
