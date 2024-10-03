class Signal {
    constructor() {
        this.slots = []
    }

    connect(receiver, slot) {
        if (
            typeof receiver[slot.name] === "function" &&
            slot === receiver[slot.name]
        ) {
            this.slots.push(slot.bind(receiver))
        } else {
            console.error(
                `${slot.name} is not a valid function on the receiver ${receiver.constructor.name}.`,
            )
        }
    }

    emit(...args) {
        this.slots.forEach((slot) => slot(...args))
    }
}

class Button extends Signal {
    constructor(htmlElement) {
        super()
        this.htmlElement = htmlElement
        this.htmlElement.addEventListener("click", () => {
            const now = Date.now()
            this.emit("Hello from button", now)
        })
    }
}

class App {
    constructor(button) {
        button.connect(this, this.onButtonClicked)
    }

    onButtonClicked(...messages) {
        console.log("Signal received:", messages)
    }
}
