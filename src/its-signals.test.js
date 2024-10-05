import { test, expect } from "vitest"
import Signal from "#src/its-signals"

test("Connect and Emit", async () => {
    const signal = new Signal()
    let receiverCalled = false
    const receiver = {
        handleEvent(value) {
            receiverCalled = true
            expect(value).toBe(42)
        },
    }

    signal.connect(receiver, receiver.handleEvent)
    signal.emit(42)

    // Wait for the microtask queue to resolve and make assertions
    await Promise.resolve().then(() => {
        expect(receiverCalled).toBe(true)
    })
})

test("Disconnect", async () => {
    const signal = new Signal()
    let receiverCalled = false
    const receiver = {
        handleEvent(value) {
            receiverCalled = true
        },
    }

    signal.connect(receiver, receiver.handleEvent)
    signal.disconnect(receiver.handleEvent, receiver)
    signal.emit(42)

    // Wait for the microtask queue to resolve and check the assertion
    await Promise.resolve().then(() => {
        expect(receiverCalled).toBe(false)
    })
})

test("Invalid Arguments", () => {
    const signal = new Signal()
    try {
        signal.connect(null, null)
    } catch (error) {
        expect(error.message).toBe("Expected both receiver and slot arguments.")
    }
})
