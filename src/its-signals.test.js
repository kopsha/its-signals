import { test, expect, vi } from "vitest"
import Signal from "#src/its-signals"

test("New instance is not connected", async () => {
    const instance = new Signal()
    expect(instance.isConnected()).toBe(false)
})

test("Can connect with valid slot", async () => {
    const signal = new Signal()
    const receiver = vi.fn()
    signal.connect(receiver)
    expect(signal.isConnected()).toBe(true)
})

test("Can connect with another signal", async () => {
    const signal = new Signal()
    const repeat = new Signal()
    signal.connect(repeat)
    expect(signal.isConnected()).toBe(true)
    expect(repeat.isConnected()).toBe(false)
})

test("Cannot connect without receiver", async () => {
    const signal = new Signal()
    expect(() => signal.connect()).toThrowError()
    expect(signal.isConnected()).toBe(false)
})

test("Cannot connect with invalid receiver slot", async () => {
    const signal = new Signal()
    const receiver = new Object()
    expect(() => signal.connect(receiver)).toThrowError()
    expect(signal.isConnected()).toBe(false)
})

test("Multiple connects same slots are acceptable", async () => {
    const signal = new Signal()
    const receiver = vi.fn()

    signal.connect(receiver)
    expect(signal.isConnected()).toBe(true)

    signal.connect(receiver)
    expect(signal.isConnected()).toBe(true)
})

test("Emit will invoke only the connected slots", async () => {
    const signal = new Signal()
    const leftSlot = vi.fn()
    const rightSlot = vi.fn()
    const freeSlot = vi.fn()

    signal.connect(leftSlot)
    signal.connect(rightSlot)

    signal.emit(42)

    await Promise.resolve().then(() => {
        expect(leftSlot.mock.calls.length).toBe(1)
        expect(leftSlot.mock.lastCall).toStrictEqual([42])
        expect(rightSlot.mock.calls.length).toBe(1)
        expect(rightSlot.mock.lastCall).toStrictEqual([42])
        expect(freeSlot.mock.calls.length).toBe(0)
    })
})

test("Disconnected slots will not be invoked", async () => {
    const signal = new Signal()
    const leftSlot = vi.fn()
    const rightSlot = vi.fn()

    signal.connect(leftSlot)
    signal.connect(rightSlot)

    signal.disconnect(leftSlot)
    signal.emit(42)

    await Promise.resolve().then(() => {
        expect(leftSlot.mock.calls.length).toBe(0)
        expect(rightSlot.mock.calls.length).toBe(1)
    })
})

test("Disconnect will remove all slots", async () => {
    const signal = new Signal()
    const leftSlot = vi.fn()
    const rightSlot = vi.fn()

    signal.connect(leftSlot)
    signal.connect(rightSlot)

    signal.disconnect()
    signal.emit(42)

    await Promise.resolve().then(() => {
        expect(leftSlot.mock.calls.length).toBe(0)
        expect(rightSlot.mock.calls.length).toBe(0)
    })
})

test("Can create instance from element", async () => {
    const element = new EventTarget()
    const instance = Signal.fromEvent(element, "click")
    expect(instance.isConnected()).toBe(false)
})

test("Event linked signal will trigger slot on dispatch event", async () => {
    const element = new EventTarget()
    const instance = Signal.fromEvent(element, "click")
    const clickSlot = vi.fn()
    instance.connect(clickSlot)

    element.dispatchEvent(new Event("click"))

    await Promise.resolve().then(() => {
        expect(clickSlot.mock.calls.length).toBe(1)
        // NOTE: Can't assert yet the passed value, mocked target element is empty
    })
})
