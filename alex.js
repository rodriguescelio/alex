const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');

class Alex extends AkairoClient {
  constructor() {
    super();
    this.commandHandler = new CommandHandler(this, { directory: './commands', prefix: '!' });
    this.listenerHandler = new ListenerHandler(this, { directory: './listeners' });

    this.commandHandler.useListenerHandler(this.listenerHandler);

    this.commandHandler.loadAll();
    this.listenerHandler.loadAll();
  }
}

module.exports = Alex;
