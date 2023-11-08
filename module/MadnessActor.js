import MadnessUtils from './MadnessUtils.js';

export default class MadnessActor extends Actor {

  prepareData() {
    super.prepareData();
    const stats = this.system.stats;
    this._calculateTotalPrimaryStats(stats);
  }

  _calculateTotalPrimaryStats(stats) {
    for (const [key, value] of Object.entries(stats)) {
      if (value.primary) {
        stats[key].total = MadnessUtils.convertToInt(stats[key].base) + MadnessUtils.convertToInt(stats[key].mod)
      }
    }
  }

}