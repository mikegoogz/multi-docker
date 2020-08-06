const keys = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const sub = redisClient.duplicate();

redisClient.on("connect", () => {
  console.log("Worker connected to Redis...");
});

function fib(index) {
  if (index < 2) return 1;
  const result = fib(index - 1) + fib(index - 2);
  return result;
}

sub.on("message", (channel, data) => {
  redisClient.hset("values", data, fib(parseInt(data)));
});
sub.subscribe("insert-index");