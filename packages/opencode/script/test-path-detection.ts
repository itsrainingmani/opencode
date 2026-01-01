// test-path-detection.ts
// Tests the path-based detection logic for installation methods

import path from "path"

function detectMethodFromPath(execPath: string, platform: string): string | null {
  const exec = execPath.toLowerCase()

  // curl-based installation paths
  if (exec.includes(path.join(".opencode", "bin"))) return "curl"
  if (exec.includes(path.join(".local", "bin"))) return "curl"

  // Windows package managers
  if (platform === "win32") {
    if (exec.includes(path.join("scoop", "shims").toLowerCase())) return "scoop"
    if (exec.includes(path.join("chocolatey", "bin").toLowerCase())) return "choco"
  }

  return null
}

const testCases: Array<{ path: string; platform: string; expected: string | null }> = [
  // Scoop paths (Windows)
  { path: "C:\\Users\\Mani\\scoop\\shims\\opencode.exe", platform: "win32", expected: "scoop" },
  { path: "C:\\Users\\Mani\\scoop\\shims\\opencode.cmd", platform: "win32", expected: "scoop" },
  { path: "D:\\scoop\\shims\\opencode.exe", platform: "win32", expected: "scoop" },

  // Chocolatey paths (Windows)
  { path: "C:\\ProgramData\\chocolatey\\bin\\opencode.exe", platform: "win32", expected: "choco" },
  { path: "C:\\ProgramData\\Chocolatey\\bin\\opencode.exe", platform: "win32", expected: "choco" },

  // curl-based paths (cross-platform)
  { path: "C:\\Users\\Mani\\.opencode\\bin\\opencode.exe", platform: "win32", expected: "curl" },
  { path: "/home/user/.opencode/bin/opencode", platform: "linux", expected: "curl" },
  { path: "/Users/mani/.opencode/bin/opencode", platform: "darwin", expected: "curl" },
  { path: "/home/user/.local/bin/opencode", platform: "linux", expected: "curl" },
  { path: "/Users/mani/.local/bin/opencode", platform: "darwin", expected: "curl" },

  // Paths that should NOT match (fall through to command-based detection)
  { path: "C:\\Program Files\\nodejs\\opencode.cmd", platform: "win32", expected: null },
  { path: "/usr/local/bin/opencode", platform: "linux", expected: null },
  { path: "C:\\Users\\Mani\\AppData\\Roaming\\npm\\opencode.cmd", platform: "win32", expected: null },
  { path: "/opt/homebrew/bin/opencode", platform: "darwin", expected: null },

  // Scoop path on non-Windows should not match
  { path: "/home/user/scoop/shims/opencode", platform: "linux", expected: null },
]

console.log("Testing path-based installation method detection\n")

let passed = 0
let failed = 0

for (const { path: testPath, platform, expected } of testCases) {
  const result = detectMethodFromPath(testPath, platform)
  const success = result === expected
  const status = success ? "✓" : "✗"

  if (success) {
    passed++
    console.log(`${status} [${platform}] ${testPath}`)
    console.log(`  => ${result ?? "(fallback to command detection)"}`)
  } else {
    failed++
    console.log(`${status} [${platform}] ${testPath}`)
    console.log(`  => ${result ?? "(null)"} (expected: ${expected ?? "(null)"})`)
  }
}

console.log(`\nResults: ${passed} passed, ${failed} failed`)
process.exit(failed > 0 ? 1 : 0)
