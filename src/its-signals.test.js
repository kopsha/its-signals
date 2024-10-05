import assert from "assert"
import Signal from "./its-signals"

const signal = new Signal()
assert(signal instanceof Signal, "Signal should be an instance of Signal")

console.log("All tests passed!")
