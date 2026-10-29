export const available = true

export async function resolveBinary() {
  return process.env.ROMACODE_PTY_BIN || "romacode-pty"
}
