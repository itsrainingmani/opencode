// test-method.ts
import { Installation } from "../src/installation"

const method = await Installation.method()
console.log("Detected method:", method)
console.log("Exec path:", process.execPath)
