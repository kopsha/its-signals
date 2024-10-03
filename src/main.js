class Signal {
    #slots = []

    connect(receiver, slot) {
        if (typeof slot !== "function") {
            throw new Error(`${slot.name} is not a function of ${receiver.constructor.name}.`)
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

    emit(...args) {
        this.#slots.forEach(({ boundSlot }) => {
            queueMicrotask(() => boundSlot(...args))
        })
    }

    disconnect({ receiver = null, slot = null }) {
        if (receiver && slot) {
            this.#slots = this.#slots.filter(s => s.receiver !== receiver || s.slot !== slot)
        } else if (receiver) {
            this.#slots = this.#slots.filter(s => receiver !== s.receiver)
        } else {
            this.#slots = []
        }
    }
}

class App {
    #counter = 0

    onAgeChanged(...messages) {
        this.#counter++
        console.log("age changed:", messages, this.#counter, "times.")
    }

    onAction(...messages) {
        this.#counter++
        console.log("new action:", messages, this.#counter, "times.")
    }
}
