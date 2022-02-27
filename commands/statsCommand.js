const { MessageEmbed } = require('discord.js');
const moment = require('moment');

class StatsCommand {
  constructor(client) {
    this.client = client;
    this.i18n = client.i18n.stats;
    this.command = this.i18n.command;
  }

  dateToString(date) {
    return moment(date.substr(0, 19)).format('DD/MM/YYYY HH:mm:ss');
  }

  async exec(event) {
    const stats = await this.client.databaseService.models.commandsStatistic.findAll({ raw: true, order: [['createdAt', 'DESC']] });

    const ranking = stats.reduce((result, it) => {
      if (result.commands[it.command]) {
        result.commands[it.command]++;
      } else {
        result.commands[it.command] = 1;
      }

      if (result.users[it.user]) {
        result.users[it.user]++;
      } else {
        result.users[it.user] = 1;
      }

      return result;
    }, { users: {}, commands: {} });

    const commandKeys = Object.keys(ranking.commands);
    commandKeys.sort((a, b) => ranking.commands[b] - ranking.commands[a]);

    const commands = commandKeys.map(it => `!${it} - ${ranking.commands[it]}x`).join('\n');

    const userKeys = Object.keys(ranking.users);
    userKeys.sort((a, b) => ranking.users[b] - ranking.users[a]);

    const userData = await Promise.all(userKeys.map(it => this.client.users.fetch(it)));
    const users = userData.map(it => `${it.username} - ${ranking.users[it.id]}x`).join('\n');

    const mostExecutedByUser = userKeys.map(userId => {
      const statsUser = stats.filter(it => it.user === userId)
        .reduce((result, it) => {
          if (result[it.command]) {
            result[it.command]++;
          } else {
            result[it.command] = 1;
          }
          return result;
        }, {});

      const userKeys = Object.keys(statsUser);
      userKeys.sort((a, b) => statsUser[b] - statsUser[a]);

      return { userId, command: userKeys[0], count: statsUser[userKeys[0]] };
    });

    const mostExecuted = mostExecutedByUser.map(
      userStats => `${userData.find(it => it.id.toString() === userStats.userId).username} - !${userStats.command} - ${userStats.count}x`
    ).join('\n');

    const lastExecuteds = Array.from(Array(10), (_, k) => stats[k] || null).filter(it => !!it).map(
      it => `${this.dateToString(it.createdAt)} - !${it.command} - ${userData.find(u => u.id.toString() === it.user).username}`
    ).join('\n');

    const message = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(this.i18n.title)
      .addFields(
        { name: this.i18n.commands, value: commands, inline: true },
        { name: this.i18n.users, value: users, inline: true },
        { name: this.i18n.mostExec, value: mostExecuted, inline: true },
        { name: this.i18n.lastExec, value: lastExecuteds },
      );

    event.reply({ embeds: [message] });
  }
}

module.exports = StatsCommand;
