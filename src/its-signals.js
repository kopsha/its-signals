export default class Signal {
    #slots = []

    static fromEvent(element, event) {
        console.assert(element instanceof EventTarget)
        let instance = new Signal()
        element.addEventListener(event, e => instance.emit(e.target.value))
        return instance
    }

    isConnected() {
        return Boolean(this.#slots.length)
    }

    connect(slot) {
        if (slot instanceof Signal) {
            slot = slot.emit
        } else if (slot instanceof Function) {
            // TODO: check if bounding this is necessary here
        } else {
            throw new Error("Expected a slot method or a Signal instance.")
        }

        const alreadyConnected = this.#slots.some(si => si === slot)
        if (alreadyConnected) {
            // NOTE: ignore multiple connections for now
            console.warn(`${slot.name} is already connected to signal.`)
        } else {
            this.#slots.push(slot)
        }
    }

    emit(...args) {
        for (const slot of this.#slots) {
            queueMicrotask(() => slot(...args))
        }
    }

    disconnect(slot = null) {
        if (slot) {
            this.#slots = this.#slots.filter(si => si !== slot)
        } else {
            this.#slots = []
        }
    }
}
