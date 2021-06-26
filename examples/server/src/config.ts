import convict from 'convict';
import fs from 'fs';

// Define a schema
const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  http: {
    ip: {
      doc: 'The IP address to bind.',
      format: 'ipaddress',
      default: '127.0.0.1',
      env: 'http_ip',
      arg: 'http_ip'
    },
    port: {
      doc: 'The port to bind.',
      format: 'port',
      default: 3001,
      env: 'http_port',
      arg: 'http_port'
    }
  },
  logger: {
    level: {
      doc: 'The application logger level.',
      format: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
      default: 'debug',
      env: 'logger_level',
      arg: 'logger_level'
    }
  }
});

// Load environment dependent configuration
const env = config.get('env');
const filePath = `${__dirname}/config.${env}.json`;
if (fs.existsSync(filePath)) {
  config.loadFile(filePath);
}

// Perform validation
config.validate({allowed: 'strict'});

export default config.get();