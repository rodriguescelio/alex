class CleanCommand {
  constructor(client) {
    this.client = client;
    this.command = 'clean';
  }

  async exec(event) {
    const messages = await event.channel.messages.fetch();
    const batch = messages.filter(it => it.author.id === this.client.user.id && it.deletable);
    event.channel.bulkDelete(batch);
  }
}

module.exports = CleanCommand;
