#!/usr/bin/env bash
# render-winget.sh <sign-windows dir> <sign-desktop-windows-installer dir> <out dir>: writes the WinGet manifests for
# Anomaly.RomaCode and Anomaly.RomaCode.Desktop. Submission to microsoft/winget-pkgs is paused until the packages
# are accepted, so the workflow only uploads them.
. "$(dirname "$0")/lib.sh"

cli=$1 desktop=$2 out=$3
sum() { sha256 "$1" | cut -c1-64 | tr a-f A-F; }
base="https://romacode.dev/files/bin/$ROMACODE_VERSION"
date=$(date -u +%F)
header() {
  printf '# yaml-language-server: $schema=https://aka.ms/winget-manifest.%s.1.12.0.schema.json\n\nPackageIdentifier: %s\nPackageVersion: %s\n' \
    "$2" "$1" "$ROMACODE_VERSION"
}
footer() { printf 'ManifestType: %s\nManifestVersion: 1.12.0\n' "$1"; }
manifests() {
  local id=$1 name=$2 description=$3 moniker=$4
  shift 4
  mkdir -p "$out/$id"
  { header "$id" version; echo "DefaultLocale: en-US"; footer version; } > "$out/$id/$id.yaml"
  { header "$id" installer; printf '%s\n' "$@" "ReleaseDate: $date"; footer installer; } > "$out/$id/$id.installer.yaml"
  {
    header "$id" defaultLocale
    printf '%s\n' "PackageLocale: en-US" "Publisher: RomaCode" "PublisherUrl: https://anoma.ly/" \
      "PublisherSupportUrl: https://github.com/reddata997327/romacode-cli/issues" "PrivacyUrl: https://romacode.dev/legal/privacy-policy" \
      "PackageName: $name" "PackageUrl: https://romacode.dev/" "License: MIT" "LicenseUrl: https://github.com/reddata997327/romacode-cli/blob/HEAD/LICENSE" \
      "ShortDescription: $description" "Moniker: $moniker" "Tags:" "- ai" "- coding-agent" "- developer-tools" \
      "Documentations:" "- DocumentLabel: Docs" "  DocumentUrl: https://romacode.dev/v2/docs"
    footer defaultLocale
  } > "$out/$id/$id.locale.en-US.yaml"
}

manifests Anomaly.RomaCode "RomaCode CLI" "The open source AI coding agent for the terminal." romacode \
  "InstallerType: zip" "NestedInstallerType: portable" "NestedInstallerFiles:" \
  "- RelativeFilePath: romacode.exe" "  PortableCommandAlias: romacode" "Commands:" "- romacode" "Installers:" \
  "- Architecture: x64" "  InstallerUrl: $base/romacode-windows-x64-baseline.zip" "  InstallerSha256: $(sum "$cli/romacode-windows-x64-baseline.zip")" \
  "- Architecture: arm64" "  InstallerUrl: $base/romacode-windows-arm64.zip" "  InstallerSha256: $(sum "$cli/romacode-windows-arm64.zip")"

# The display name and uninstall key match what the NSIS installer registers for ai.romacode.desktop.
manifests Anomaly.RomaCode.Desktop "RomaCode" "The open source AI coding agent as a desktop app." romacode-desktop \
  "InstallerType: nullsoft" "Scope: user" "UpgradeBehavior: install" "ProductCode: d074f30d-5f88-5885-b075-be1348cc7676" \
  "Protocols:" "- romacode" "Installers:" \
  "- Architecture: x64" "  InstallerUrl: $base/romacode-desktop-win-x64.exe" "  InstallerSha256: $(sum "$desktop/romacode-desktop-win-x64.exe")" \
  "- Architecture: arm64" "  InstallerUrl: $base/romacode-desktop-win-arm64.exe" "  InstallerSha256: $(sum "$desktop/romacode-desktop-win-arm64.exe")"
tail -n +1 "$out"/*/*
