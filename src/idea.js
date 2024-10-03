class Signal {
    constructor() {
        this.slots = [];
    }

    connect(slot) {
        if (typeof slot === 'function') {
            this.slots.push(slot);
        } else {
            console.error('Slot must be a function');
        }
    }

    emit(...args) {
        this.slots.forEach(slot => slot(...args));
    }
}

class Button {
    constructor(element) {
        this.clicked = new Signal();
        this.element = element
        this.element.addEventListener("click", () => this.onClick())
    }

    onClick() {
        console.log('Emit click signal');
        this.clicked.emit('hello from button');
    }
}

class App {
    constructor() {
        this.button = new Button(document.getElementById("testButton"));
        this.button.clicked.connect(this.onButtonClicked);
    }

    onButtonClicked(message) {
        console.log('Slot received message:', message);
    }
}


