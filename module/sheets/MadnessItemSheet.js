export default class MadnessItemSheet extends ItemSheet {

  get template() {
    return `systems/madness/templates/sheets/${this.item.type}-sheet.hbs`;
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['madness', 'sheet']
    });
  }

  getData() {
    const baseData = super.getData();
    console.log(baseData);
    return {
      user: game.user,
      item: baseData.item,
      system: baseData.item.system,
      config: CONFIG.madness
    }
  }

}