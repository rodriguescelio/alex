class RankingCommand {
  constructor(client) {
    this.client = client;
    this.i18n = client.i18n.ranking;
    this.command = this.i18n.command;
  }

  async exec(event) {
    const users = await this.client.databaseService.models.bank.findAll({ attributes: ['userId'], group: 'userId' });
    
    const usersData = await Promise.all(users.map(({ userId }) => this.client.users.fetch(userId)));
    const balances = await Promise.all(
      usersData.map(async user => ({ user: user.username, balance: await this.client.bankService.getBalance(user.id) }))
    );

    balances.sort((a, b) => (b.balance - a.balance));

    const message = balances.map((it, index) => `${index + 1}º - P$ ${it.balance} - ${it.user}`).join('\n');

    await event.channel.send(`\`\`\`${message}\`\`\``);
  }
}

module.exports = RankingCommand;
