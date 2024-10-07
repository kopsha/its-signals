# It's signals, Jerry. It's signals

[![npmjs publish](https://github.com/kopsha/its-signals/actions/workflows/release.yaml/badge.svg)](https://github.com/kopsha/its-signals/actions/workflows/release.yaml)
[![npm version](https://badge.fury.io/js/its-signals.svg)](https://badge.fury.io/js/its-signals)

---

_-- I can't believe: WE ALREADY DISCUSSED THIS!_  
_-- Yeah, but how could you be so sure?_  
_-- 'Cause it's **signals**, Jerry. It's **signals**! Don't you know it.. all
  right._  
  _Did she even ask you, what you were doin' tomorrow night, if you were busy?_  
_-- No._  
_-- She calls you today and she doesn't make a plan for tomorrow? What is that?
  It's Saturday night!_  
_-- Yeah._  
_-- What is that? It's ridiculous! You don't even know, what hotel she's
  staying at, you can't call her.  
  That's a **signal**, Jerry, That's a **SIGNAL**!_  
_-- Maybe you're right._  
_-- Maybe I'm right? Of course I'm right._

[![It's signals Jerry, signals!](https://img.youtube.com/vi/IXvuWfLF06A/0.jpg)](https://youtu.be/IXvuWfLF06A)


## Motivation

In JavaScript, while event handling is ubiquitous, many libraries deviate from
the well-established patterns found in other languages, such as the observer
pattern or the signal-slot mechanism popularized by frameworks like Qt in C++.
This divergence can make these libraries feel awkward and unintuitive to use.
The lack of standardized patterns for asynchronous programming often leads to
fragmented approaches and increased complexity in managing events.

This signals module aims to bridge this gap by introducing a straightforward and
safe event handling mechanism that aligns with these time-tested patterns. By
adopting a familiar interface for connecting, emitting, and disconnecting signals
and slots, it simplifies the process of building responsive and maintainable
applications in JavaScript.


## Usage guide

The `Signal` class provides a way to manage asynchronous event-driven communication
in your application. You can create signals that emit values, and connect slots
(functions or other signals) that respond to those emissions.

### Creating a Signal

To create a new signal instance, simply instantiate the `Signal` class:

```javascript
const signal = new Signal()
```

You can create a signal from a DOM element that triggers events using the static
`Signal.fromEvent` method:

```javascript
const button = document.getElementById("myButton")
const clickSignal = Signal.fromEvent(button, "click")
```

This creates a signal that listens to the `"click"` event on the specified
`element`. When the event occurs, the signal emits the `value` of the event's
target (i.e., `e.target.value`).

> **Note:** The element must be an instance of `EventTarget`.


### Connecting Signals with Slots

Slots may be any handler functions or other `Signal` instances that you can
connect to a signal. When the signal is emitted, all connected slots are scheduled
to be invoked asynchronously with the emitted arguments.


To connect a function as a slot:

```javascript
function slot(value) {
    console.log("Received:", value)
}

signal.connect(slot)
```

You can connect another `Signal` instance as a slot. This effectively chains the
signals so that emitting the first signal will cause the connected signal to emit
as well.

```javascript
const signalA = new Signal()
const signalB = new Signal()

signalA.connect(signalB)
```

### Trigger Mechanics

To trigger (_emit_) a signal and invoke its all connected slots, simply call:

```javascript
signal.emit(value)
```

The `emit` method schedules each connected slot to be called asynchronously
using `queueMicrotask`, ensuring that the slots are invoked after the current
execution context completes.


### Passing Arguments

All arguments passed to `emit` are forwarded to the connected slots:

```javascript
signal.emit(arg1, arg2, arg3)
```

Each slot will receive these arguments:

```javascript
function slot(a, b, c) {
    console.log(a, b, c)
}
```

### Disconnecting Slots

To disconnect a specific slot:

```javascript
signal.disconnect(slot)
```

After disconnection, the slot will no longer be invoked when the signal is emitted.

To disconnect all slots:

```javascript
signal.disconnect()
```

This clears all connected slots from the signal.

### Checking Connection Status

You can check if the signal has any connected slots using the `isConnected` method:

```javascript
if (signal.isConnected()) {
    // Signal has at least one connected slot
}
```

This method returns a boolean indicating whether there are any slots connected.

### Examples

```javascript
const signal = new Signal()

function slot(value) {
    console.log("Slot received:", value)
}

signal.connect(slot)
signal.emit("Hello, world!")
// Output: Slot received: Hello, world!
```

#### Connecting Multiple Slots

```javascript
const signal = new Signal()

function slot1(value) {
    console.log("Slot 1 received:", value)
}

function slot2(value) {
    console.log("Slot 2 received:", value)
}

signal.connect(slot1)
signal.connect(slot2)
signal.emit(42)
// Output:
// Slot 1 received: 42
// Slot 2 received: 42
```

### Disconnecting Slots

```javascript
const signal = new Signal()

function slot(value) {
    console.log("This will not be logged")
}

signal.connect(slot)
signal.disconnect(slot)
signal.emit("Test")
// No output, as the slot has been disconnected
```

### Using `Signal.fromEvent`

```javascript
const userInput = document.getElementById("nameInput")
const inputChangedSignal = Signal.fromEvent(userInput, "input")

function handleNameChange(value) {
    console.log("New user name:", value)
}

inputChangedSignal.connect(handleNameChange)
// When typing 'John' in the text input, "New user name: John" will be logged
```

> **Note:** When a signal is connected to a DOM Element and the event occurs, the
> `e.target.value` is passed as argument to the connected slots.


## Conclusion

The `Signal` class provides a flexible and straightforward way to implement
event-driven communication in your application. By allowing functions and other
signals to be connected as slots, you can create complex and decoupled
architectures with ease.


**Key Points:**

- Use `signal.connect(slot)` to connect functions or other signals.
- Emit values using `signal.emit(...args)`.
- Slots are invoked asynchronously to prevent blocking the main execution thread.
- Manage connections using `signal.disconnect(slot)` and `signal.disconnect()`.
- Check connection status with `signal.isConnected()`.

