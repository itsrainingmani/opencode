// test-latest.ts
import { Installation } from "../src/installation"

// Test each method explicitly
for (const method of ["scoop", "choco", "npm", "brew", "bun"] as const) {
  try {
    const latest = await Installation.latest(method)
    console.log(`${method}: ${latest}`)
  } catch (e) {
    console.log(`${method}: failed -`, e)
  }
}
