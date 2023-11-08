export default class MadnessItemSheet extends ItemSheet {

  get template() {
    return `systems/madness/templates/sheets/${this.item.type}-sheet.hbs`;
  }

  getData() {
    const baseData = super.getData();
    console.log(baseData);
    return {
      item: baseData.item,
      system: baseData.item.system,
      config: CONFIG.madness
    }
  }

}