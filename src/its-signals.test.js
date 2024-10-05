import { test } from "uvu"
import * as assert from "uvu/assert"

import Signal from "#src/its-signals"

test("Connect and Emit", () => {
    const signal = new Signal()
    let receiverCalled = false
    const receiver = {
        handleEvent(value) {
            console.log("it was called")
            receiverCalled = true
            assert.is(value, 42, "Receiver did not receive the correct value")
        },
    }

    signal.connect(receiver, receiver.handleEvent)
    signal.emit(42)
    console.log("should be called")

    Promise.resolve().then(() => {
        console.log("asserting the call")
        assert.is(receiverCalled, true, "Receiver should have been called")
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

    return new Promise(resolve => {
        process.nextTick(() => {
            assert.is(
                receiverCalled,
                false,
                "Receiver should not have been called after disconnect"
            )
            resolve()
        })
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

// Run all the tests
test.run()
