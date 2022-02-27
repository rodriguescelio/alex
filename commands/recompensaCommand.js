class RecompensaCommand {
  constructor(client) {
    this.client = client;
    this.i18n = client.i18n.recompensa;
    this.command = this.i18n.command;
  }

  async exec(event) {
    await this.client.bankService.register(event.author.id);
    const reward = await this.client.bankService.getReward(event.author.id);

    if (typeof reward === 'string') {
      event.reply(this.i18n.next.replace('{{R}}', reward));
    } else {
      event.reply(this.i18n.value.replace('{{V}}', reward));
    }
  }
}

module.exports = RecompensaCommand;
