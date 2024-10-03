class Signal {
    constructor() {
        this.slots = []
    }

    connect(receiver, slot) {
        if (typeof slot === "function") {
            const alreadyConnected = this.slots.some(
                s => s.slot === slot && s.receiver === receiver
            )
            if (alreadyConnected) {
                console.warn(`${slot.name} is already connected to this signal.`)
            } else {
                const boundSlot = slot.bind(receiver)
                this.slots.push({ receiver, slot, boundSlot })
            }
        } else {
            console.error(
                `${slot.name} is not a valid function of ${receiver.constructor.name}.`
            )
        }
    }

    emit(...args) {
        this.slots.forEach(({ boundSlot }) => {
            queueMicrotask(() => boundSlot(...args))
        })
    }

    disconnect(receiver, slot) {
        if (receiver && slot) {
            this.slots = this.slots.filter(s => s.receiver !== receiver || s.slot !== slot)
        } else if (receiver) {
            this.slots = this.slots.filter(s => s.receiver !== receiver)
        } else {
            this.slots = []
        }
    }
}

class Button extends Signal {
    constructor(htmlElement) {
        super()
        this.htmlElement = htmlElement
        this.htmlElement.addEventListener("click", () => {
            const now = Date.now()
            this.emit("Hello from button", now)
            console.log("suppose the emitter code is finished")
        })
    }
}

class App {
    #counter = 0

    constructor(button) {
        button.connect(this, this.onButtonClicked)
    }

    onButtonClicked(...messages) {
        this.#counter++
        console.log("Signal received:", messages, this.#counter, "times.")
    }
}
