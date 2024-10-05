import assert from "assert"
import Signal from "#src/its-signals"

function testConnectAndEmit() {
    console.log("Test: Connect and Emit")

    const signal = new Signal()
    let receiverCalled = false
    const receiver = {
        handleEvent(value) {
            receiverCalled = true
            assert.strictEqual(value, 42, "Receiver did not receive the correct value")
        },
    }

    signal.connect(receiver, receiver.handleEvent)
    signal.emit(42)
    process.nextTick(() => {
        assert.strictEqual(receiverCalled, true, "Receiver should have been called")
        console.log("Test: Connect and Emit Passed\n")
    })
}

function testDisconnect() {
    console.log("Test: Disconnect")

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
    assert.strictEqual(
        receiverCalled,
        false,
        "Receiver should not have been called after disconnect"
    )
    console.log("Test: Disconnect Passed\n")
}

function testInvalidArguments() {
    console.log("Test: Invalid Arguments")

    const signal = new Signal()
    try {
        signal.connect(null, null)
    } catch (error) {
        assert.strictEqual(
            error.message,
            "Expected both receiver and slot arguments.",
            "Did not throw with expected message for null arguments"
        )
    }

    console.log("Test: Invalid Arguments Passed\n")
}

// Running all tests
testConnectAndEmit()
testDisconnect()
testInvalidArguments()
