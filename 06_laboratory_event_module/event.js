const { error } = require("console");
const EventEmitter = require("events");
const emitter = new EventEmitter();

emitter.on("start", () => {
  console.log("Application Started!");
});
emitter.on("data", (name, age) => {
  console.log("Data Received:", `Name: ${name}, Age: ${age}`);
});

emitter.emit("start");
emitter.emit("data", "John", 25);

emitter.on("error", (err) => {
  console.error("Error event:", err.message);
});
emitter.emit("error", new Error("Error occurred!"));
