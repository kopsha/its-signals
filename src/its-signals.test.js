import assert from "assert"
import { JSDOM } from "jsdom"
import Signal from "#src/its-signals"


// Test: Signal instance creation
function testSignalInstanceCreation() {
  const signal = new Signal();
  assert(signal instanceof Signal, 'Signal should be an instance of Signal');
  console.log('✅ testSignalInstanceCreation passed');
}

// Test: Connect a receiver and slot
function testConnectReceiverAndSlot() {
  const signal = new Signal();
  const receiver = { value: 0 };
  const slot = function (val) { this.value = val; };

  signal.connect(receiver, slot);
  assert.strictEqual(signal.isConnected(), true, 'Signal should be connected');
  console.log('✅ testConnectReceiverAndSlot passed');
}

// Test: Emit signal and invoke slot
function testEmitSignal() {
  const signal = new Signal();
  const receiver = { value: 0 };
  const slot = function (val) { this.value = val; };

  signal.connect(receiver, slot);
  signal.emit(42);

  setImmediate(() => {
    assert.strictEqual(receiver.value, 42, 'Slot should update receiver value on emit');
    console.log('✅ testEmitSignal passed');
  });
}

// Test: Disconnect a receiver and slot
function testDisconnectReceiverAndSlot() {
  const signal = new Signal();
  const receiver = { value: 0 };
  const slot = function (val) { this.value = val; };

  signal.connect(receiver, slot);
  signal.disconnect(slot, receiver);

  assert.strictEqual(signal.isConnected(), false, 'Signal should be disconnected');
  console.log('✅ testDisconnectReceiverAndSlot passed');
}

// Test: Disconnect all slots
function testDisconnectAllSlots() {
  const signal = new Signal();
  const receiver1 = { value: 0 };
  const receiver2 = { value: 0 };
  const slot = function (val) { this.value = val; };

  signal.connect(receiver1, slot);
  signal.connect(receiver2, slot);
  signal.disconnect();

  assert.strictEqual(signal.isConnected(), false, 'Signal should disconnect all receivers');
  console.log('✅ testDisconnectAllSlots passed');
}

// Test: Signal creation from an event
function testFromEvent() {
  const dom = new JSDOM('<!DOCTYPE html><input type="text" value="test">');
  const input = dom.window.document.querySelector('input');

  const signal = Signal.fromEvent(input, 'input');
  const receiver = { value: '' };
  const slot = function (val) { this.value = val; };

  signal.connect(receiver, slot);

  // Simulate input event
  input.value = 'new value';
  input.dispatchEvent(new dom.window.Event('input'));

  setImmediate(() => {
    assert.strictEqual(receiver.value, 'new value', 'Signal should emit when input event occurs');
    console.log('✅ testFromEvent passed');
  });
}

// Test: Error when connecting invalid arguments
function testConnectInvalidArguments() {
  const signal = new Signal();
  assert.throws(() => {
    signal.connect(null, null);
  }, /Expected both receiver and slot arguments/, 'Should throw error when both arguments are invalid');

  const receiver = { value: 0 };
  assert.throws(() => {
    signal.connect(receiver, 'notAFunction');
  }, /notAFunction is not a function of Object/, 'Should throw error when slot is not a function');

  console.log('✅ testConnectInvalidArguments passed');
}

// Run All Tests
function runTests() {
  testSignalInstanceCreation();
  testConnectReceiverAndSlot();
  testEmitSignal();
  testDisconnectReceiverAndSlot();
  testDisconnectAllSlots();
  testFromEvent();
  testConnectInvalidArguments();
}

runTests();

