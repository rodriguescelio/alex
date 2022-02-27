class TradeCommand {
  constructor(client) {
    this.client = client;
    this.i18n = client.i18n.trade;
    this.command = this.i18n.command;
    this.args = [
      { name: 'value', type: Number, defaultOption: true }
    ];
  }

  async exec(event, args) {
    if (!args.value) {
      event.reply(this.i18n.invalid);
      return;
    }

    await this.client.bankService.register(event.author.id);
    const balance = await this.client.bankService.getBalance(event.author.id);

    if (balance < args.value) {
      event.reply(this.i18n.noBalance);
    } else {
      const value = Math.round((Math.random() * (args.value * 2)) -  args.value);
      if (value < 0) {
        const positiveValue = value * -1;
        await this.client.bankService.debit(event.author.id, positiveValue, 'Trade');
        event.reply(this.i18n.lose.replace('{{V}}', positiveValue));
      } else {
        await this.client.bankService.credit(event.author.id, value, 'Trade');
        event.reply(this.i18n.win.replace('{{V}}', value));
      }
    }
  }
}

module.exports = TradeCommand;
