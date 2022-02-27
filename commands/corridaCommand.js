class SaldoCommand {
  constructor(client) {
    this.client = client;
    this.i18n = client.i18n.corrida;
    this.command = this.i18n.command;
    this.args = [
      { name: 'time', alias: 't', type: Number },
      { name: 'value', alias: 'v', type: Number },
    ];

    this.trackSize = 50;
  }

  getNextHorseToWalk(length) {
    let horseToWalk;
    do {
      horseToWalk = Math.round(Math.random() * length);
    } while(horseToWalk > length - 1);
    return horseToWalk;
  }

  async race(event, usersIn, betValue) {
    const race = usersIn.map(() => 0);
    await Promise.all(usersIn.map(userId => this.client.bankService.debit(userId, betValue, this.i18n.bankLabelBet)));

    let message;

    const run = async () => {
      const bays = race.map(
        (it, index) => `${index + 1}| ${Array.from(Array(this.trackSize), (_, i) => i === it ? '🏇' : '-').join('')}🏆`
      );

      const messageBody = `\`\`\`${bays.join('\n')}\`\`\``;

      try {
        if (message) {
          message = await event.channel.messages.fetch(message.id);
          await message.edit(messageBody);
        } else {
          throw new Error('noMessage');
        }
      } catch (e) {
        message = await event.channel.send(messageBody);
      }

      const winner = race.findIndex(it => it === this.trackSize - 1);
      if (winner === -1) {
        setTimeout(() => {
          race[this.getNextHorseToWalk(usersIn.length)]++;
          run();
        }, 500);
      } else {
        const prize = betValue * usersIn.length;
        await this.client.bankService.credit(usersIn[winner], prize, this.i18n.bankLabelPrize);
        await event.channel.send(
          this.i18n.winnerMessage.replace('{{WINNER}}', usersIn[winner]).replace('{{PRIZE}}', prize)
        );
      }
    };

    run();
  }

  async startRace(event, message, betValue) {
    const reactions = await message.reactions.resolve('✅').users.fetch();
    const users = Array.from(reactions.keys()).filter(it => it !== message.author.id);
    
    if (users.length === 0) {
      message.reply(this.i18n.cancel);
    } else {
      let noBalance = [];
      let usersIn = [];

      await Promise.all(
        users.map(async user => {
          await this.client.bankService.register(user);
          const balance = await this.client.bankService.getBalance(user);

          if (balance < betValue) {
            noBalance.push(this.i18n.noBalance.replace('{{USER}}', user));
          } else {
            usersIn.push(user);
          }
        })
      );

      if (noBalance.length) {
        message.reply(noBalance.join('\n'));
      }

      if (usersIn.length === 0) {
        message.reply(this.i18n.cancel);
      } else {
        await event.channel.send(
          usersIn.map((user, index) => this.i18n.bay.replace('{{N}}', index + 1).replace('{{U}}', user)).join('\n')
        );
        await this.race(event, usersIn, betValue);
      }
    }
  }

  async exec(event, args) {
    if (!args.time || !args.value) {
      event.reply(this.i18n.invalid);
      return;
    }

    const message = await event.channel.send(
      this.i18n.message.replace('{{U}}', event.author.username).replace('{{T}}', args.time).replace('{{V}}', args.value)
    );
    message.react('✅');

    setTimeout(() => this.startRace(event, message, args.value), args.time * 1000);
  }
}

module.exports = SaldoCommand;
