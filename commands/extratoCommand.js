const { DEBIT } = require('../models/enum/bankOperationEnum');

class ExtratoCommand {
  constructor(client) {
    this.client = client;
    this.i18n = client.i18n.extrato;
    this.command = this.i18n.command;
  }

  async exec(event) {
    await this.client.bankService.register(event.author.id);
    const records = await this.client.bankService.getStatement(event.author.id);
    const message = records.map(
      it => `${it.date} - P$ ${it.operation === DEBIT ? '-' : '+'}${it.value} - ${it.description}`
    ).join('\n');
    await event.author.send(`\`\`\`${message}\`\`\``);
    event.react('✅');
  }
}

module.exports = ExtratoCommand;
