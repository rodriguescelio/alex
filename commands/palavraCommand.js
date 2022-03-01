const { Op } = require('sequelize');
const moment = require('moment');
const axios = require('axios');
const { parse } = require('node-html-parser');
const { RIGHT, WRONG } = require('../models/enum/wordDayAnswerStatusEnum');

class PalavraCommand {
  constructor(client) {
    this.client = client;
    this.i18n = client.i18n.palavra;
    this.command = this.i18n.command;
    this.args = [
      { name: 'guess', defaultOption: true },
    ];

    this.emojiMap = {
      a: '🇦',
      b: '🇧',
      c: '🇨',
      d: '🇩',
      e: '🇪',
      f: '🇫',
      g: '🇬',
      h: '🇭',
      i: '🇮',
      j: '🇯',
      k: '🇰',
      l: '🇱',
      m: '🇲',
      n: '🇳',
      o: '🇴',
      p: '🇵',
      q: '🇶',
      r: '🇷',
      s: '🇸',
      t: '🇹',
      u: '🇺',
      v: '🇻',
      w: '🇼',
      x: '🇽',
      y: '🇾',
      z: '🇿',
    };
  }

  getDate(h, m, s) {
    return moment().hour(h).minute(m).second(s).millisecond(0);
  }

  findWord() {
    return this.client.databaseService.models.wordDay.findOne({
      where: {
        createdAt: {
          [Op.between]: [this.getDate(0, 0, 0), this.getDate(23, 59, 59)],
        },
      },
    });
  }

  normalize(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  getMeaningString(meaning, word) {
    const meanings = meaning.querySelectorAll('> span:not(.cl)').map(it => it.innerText);
    let meaningString = meanings.find(it => this.normalize(it).indexOf(this.normalize(word)) === -1);

    if (!meaningString) {
      meaningString = meanings[0];
      const end = meaningString.indexOf(';');
      if (end !== -1) {
        meaningString = meaningString.substr(0, end);
      }
    }

    return meaningString;
  }

  async getNewWord() {
    const html = parse(await axios.get(process.env.WORDS_API_URL).then(r => r.data));
    let word = html.querySelector('[data="palavra"]').nextElementSibling.innerText.toLowerCase();

    try {
      const dicioWord = this.normalize(word);
      const checkDicio = parse(await axios.get(process.env.DICIO_URL.replace('%s', dicioWord)).then(r => r.data));
      const meaning = checkDicio.querySelector('.significado');
      if (meaning.classList.contains('word-nf')) {
        word = null;
      } else {
        word = { word, meaning: this.getMeaningString(meaning, word) };
      }
    } catch (e) {
      word = null;
    }

    return word;
  }

  async createWord() {
    let retry = 0;
    let word = null;

    do {
      word = await this.getNewWord();
      retry++;
    } while(word === null && retry < 3);

    if (word) {
      await this.client.databaseService.models.wordDay.create(word);
    }

    return word;
  }

  async printWord(event, wordDay) {
    const mask = wordDay.word.split('').map(() => '🔳').join(' ');
    await event.channel.send(
      `${this.i18n.message}\nDica: ${wordDay.meaning}\n${mask}`
    );
  }

  getEmojiWord(word) {
    return this.normalize(word).split('').map(l => this.emojiMap[l]).join(' ');
  }

  async checkAnswer(event, wordDay, guess) {
    let right = false;

    if (this.normalize(guess) === this.normalize(wordDay.word)) {
      right = true;

      await this.client.databaseService.models.wordDay.update({ answeredUserId: event.author.id }, { where: { id: wordDay.id } });
      await this.client.bankService.register(event.author.id);
      await this.client.bankService.credit(event.author.id, 200, this.i18n.bankLabel);

      event.reply(`${this.i18n.right}\n${this.getEmojiWord(wordDay.word)}`);
    } else {
      await event.reply(this.i18n.wrong);
    }

    await this.client.databaseService.models.wordDayAnswer.create({
      wordId: wordDay.id,
      userId: event.author.id,
      status: right ? RIGHT : WRONG,
    });
  }

  async exec(event, args) {
    let wordDay = await this.findWord();

    if (!wordDay) {
      await this.printWord(event, await this.createWord());
      return;
    }

    if (wordDay.answeredUserId) {
      const user = await this.client.users.fetch(wordDay.answeredUserId);
      await event.reply(`${this.i18n.alreadyAnswered.replace('{{U}}', user.username)}\n${this.getEmojiWord(wordDay.word)}`);
    } else if (args.guess) {
      const lastGuessUser = await this.client.databaseService.models.wordDayAnswer.findOne({
        where: {
          wordId: wordDay.id,
          userId: event.author.id,
        },
        order: [['createdAt', 'DESC']]
      });

      if (!lastGuessUser || moment().diff(moment(lastGuessUser.createdAt)) >= 120000) {
        await this.checkAnswer(event, wordDay, args.guess);
      } else {
        await event.reply(this.i18n.nextTry.replace('{{H}}', moment(lastGuessUser.createdAt).add(2, 'minutes').format('HH:mm:ss')));
      }
    } else {
      await this.printWord(event, wordDay);
    }
  }
}

module.exports = PalavraCommand;
