import { test } from "uvu"
import * as assert from "uvu/assert"

import Signal from "#src/its-signals"

test("Connect and Emit", () => {
    const signal = new Signal()
    let receiverCalled = false
    const receiver = {
        handleEvent(value) {
            receiverCalled = true
            assert.is(value, 42, "Slot received incorrect value.")
        },
    }

    signal.connect(receiver, receiver.handleEvent)
    signal.emit(42)

    // Ensure that the assertion waits for the emit to resolve
    return Promise.resolve().then(() => {
        assert.is(receiverCalled, true, "Slot was not invoked.")
    })
})

test("Disconnect", () => {
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

    // Ensure the assertion runs after the microtask queue is processed
    return Promise.resolve().then(() => {
        assert.is(
            receiverCalled,
            false,
            "Slot was invoked after disconnect."
        )
    })
})

test("Invalid Arguments", () => {
    const signal = new Signal()
    try {
        signal.connect(null, null)
    } catch (error) {
        assert.is(
            error.message,
            "Expected both receiver and slot arguments.",
            "Did not throw with expected message for null arguments"
        )
    }
})

test.run()
