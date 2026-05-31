const { EventEmitter } = require('events');

const bus = new EventEmitter();
bus.setMaxListeners(0);

function subscribe(eventName, listener) {
  bus.on(eventName, listener);
  return () => bus.off(eventName, listener);
}

function publishTableOrderCreated(order) {
  bus.emit('table-order-created', {
    ...order,
    createdAt: new Date().toISOString()
  });
}

module.exports = {
  subscribe,
  publishTableOrderCreated
};
