const pino = require("pino");
const pretty= require("pino-pretty");
const streams = [
  {    
    level: "trace", // support logging of all levels to this location
    stream: process.stdout, // logs to the standard output
  },
  { 
    level: "trace", // support logging of all levels to this location   
    stream: pino.destination("logs/server-log"), // log to this file
  },
  pretty(),
];
const logger = pino(
    {
      level: "info", // minimum level to log
    },
    pretty(),
    pino.multistream(streams)
  );

module.exports = logger