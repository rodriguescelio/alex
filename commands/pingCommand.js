class PingCommand {
  constructor(client) {
    this.command = 'ping';
    this.client = client;
  }

  exec(event) {
    event.channel.send('Pong!');
  }
}

module.exports = PingCommand;
