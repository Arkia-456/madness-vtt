export default class MadnessCharacterSheet extends ActorSheet {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/madness/templates/sheets/character-sheet.hbs'
    });
  }

  getData() {
    const baseData = super.getData();
    return {
      actor: baseData.actor,
      data: baseData.actor.system,
      weapons: baseData.items.filter(item => item.type === 'weapon'),
      config: CONFIG.madness
    }
  }

}