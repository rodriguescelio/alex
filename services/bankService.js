const moment = require('moment');
const { DEBIT, CREDIT } = require('../models/enum/bankOperationEnum');

class BankService {

  constructor({ databaseService, i18n }) {
    this.databaseService = databaseService;
    this.i18n = i18n;
  }

  async register(userId) {
    const exists = await this.databaseService.models.bank.count({ where: { userId } });
    if (exists === 0) {
      await this.credit(userId, 500, this.i18n.bank.initial);
    }
  }

  async credit(userId, value, description) {
    await this.databaseService.models.bank.create({ userId, value, description, operation: CREDIT });
  }

  async debit(userId, value, description) {
    await this.databaseService.models.bank.create({ userId, value, description, operation: DEBIT });
  }

  async getBalance(userId) {
    const items = await this.databaseService.models.bank.findAll({ where: { userId }, order: [['createdAt', 'ASC']] });

    const balance = items.reduce((total, it) => {
      if (it.operation === DEBIT) {
        total -= it.value;
      } else if (it.operation === CREDIT) {
        total += it.value;
      }
      return total;
    }, 0);

    return balance;
  }

  async getStatement(userId) {
    const items = await this.databaseService.models.bank.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
    return items.map(
      it => ({
        date: moment(it.createdAt).format('DD/MM/YYYY HH:mm:ss'),
        operation: it.operation,
        value: it.value,
        description: it.description,
      })
    );
  }

  async checkReward(userId) {
    let result = true;
    const lastReward = await this.databaseService.models.bankReward.findOne({ where: { userId }, order: [['createdAt', 'DESC']] });

    if (lastReward) {
      const lastRewardData = moment(lastReward.createdAt);
      const diff = moment.duration(moment().diff(lastRewardData));

      if (diff.asHours() < 24) {
        const nextReward = moment().add(86400 - diff.asSeconds(), 'seconds');
        result = nextReward.format('DD/MM/YYYY HH:mm:ss');
      }
    }

    return result;
  }

  async getReward(userId) {
    const canReward = await this.checkReward(userId);

    if (canReward === true) {
      const reward = Math.round(Math.random() * 100);

      await this.databaseService.models.bankReward.create({ userId });
      await this.credit(userId, reward, this.i18n.bank.reward);

      return reward;
    }

    return canReward;
  }
}

module.exports = BankService;
