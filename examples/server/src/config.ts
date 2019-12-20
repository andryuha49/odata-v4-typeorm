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
  db: {
    host: {
      doc: 'Database host name/IP',
      format: '*',
      default: 'localhost',
      env: 'db_host'
    },
    port: {
      doc: 'Database port number',
      format: Number,
      default: 5432,
      env: 'db_port'
    },
    database: {
      doc: 'Database name',
      format: String,
      default: 'demo_ov4typeorm_posts',
      env: 'db_database'
    },
    username: {
      doc: 'Connection user name',
      format: String,
      default: 'postgres',
      env: 'db_username'
    },
    password: {
      doc: 'Connection user password',
      format: String,
      default: 'q1w2e3R4',
      env: 'db_password'
    },
    name: {
      doc: 'Connection name',
      format: String,
      default: 'default'
    },
    type: {
      doc: 'Connection type',
      format: String,
      default: 'postgres'
    },
    synchronize: {
      doc: 'Connection synchronize type',
      format: Boolean,
      default: false
    },
    logging: {
      doc: 'Enable logging',
      format: Boolean,
      default: true
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
const filePath = './config.json';
if (fs.existsSync(filePath)) {
  config.loadFile(filePath);
}

// Perform validation
config.validate({allowed: 'strict'});

export default config.get();