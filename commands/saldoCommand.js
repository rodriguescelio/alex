class SaldoCommand {
  constructor(client) {
    this.client = client;
    this.i18n = client.i18n.saldo;
    this.command = this.i18n.command;
  }

  async exec(event) {
    await this.client.bankService.register(event.author.id);
    const balance = await this.client.bankService.getBalance(event.author.id);
    event.reply(this.i18n.message.replace('{{B}}', balance));
  }
}

module.exports = SaldoCommand;
