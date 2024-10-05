export default class Signal {
    #slots = []

    static fromEvent(element, event) {
        console.assert(element instanceof EventTarget)
        let instance = new Signal()
        element.addEventListener(event, e => instance.emit(e.target.value))
        return instance
    }

    connect(receiver, slot) {
        if (!receiver || !slot) {
            throw new Error("Expected both receiver and slot arguments.")
        } else if (typeof slot !== "function") {
            throw new Error(`${slot} is not a function of ${receiver.constructor.name}.`)
        }

        const alreadyConnected = this.#slots.some(
            s => s.slot === slot && s.receiver === receiver
        )
        if (alreadyConnected) {
            // NOTE: ignore multiple connections for now
            console.warn(`${slot.name} is already connected to ${this.costructor.name} signal.`)
        }
        const boundSlot = slot.bind(receiver)
        this.#slots.push({ receiver, slot, boundSlot })
    }

    isConnected() {
        return boolean(this.#slots)
    }

    emit(...args) {
        this.#slots.forEach(({ boundSlot }) => {
            queueMicrotask(() => boundSlot(...args))
        })
    }

    disconnect(slot = null, receiver = null) {
        if (receiver && slot) {
            this.#slots = this.#slots.filter(s => s.receiver !== receiver || s.slot !== slot)
        } else if (receiver) {
            this.#slots = this.#slots.filter(s => receiver !== s.receiver)
        } else {
            this.#slots = []
        }
    }
}

class InterestedHandler {
    finished = new Signal()
    #left = 0
    #right = 0

    constructor() {
        this.finished.connect(this, this.onFinished)
    }

    onAgeChanged(...messages) {
        this.#left++
        console.log("age changed:", messages, this.#left, "times.")
        if (this.#left && this.#right) {
            this.finished.emit()
            this.finished.disconnect()
        }
    }

    onReaction(...messages) {
        this.#right++
        console.log("new action:", messages, this.#right, "times.")
        if (this.#left && this.#right) {
            this.finished.emit()
            this.finished.disconnect()
        }
    }

    onFinished(...messages) {
        console.log("finished...")
    }
}
