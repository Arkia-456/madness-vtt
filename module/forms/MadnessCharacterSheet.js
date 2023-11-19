import MadnessDice from '../utils/MadnessDice.js';
import MadnessUtils from '../utils/MadnessUtils.js';

export default class MadnessCharacterSheet extends ActorSheet {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/madness/templates/sheets/character-sheet.hbs',
      classes: ['madness', 'sheet']
    });
  }

  itemContextMenu = [
    {
      name: game.i18n.localize('madness.sheet.details'),
      icon: '<i class="fas fa-eye"></i>',
      callback: this._onContextMenuItemView.bind(this)
    },
    {
      name: game.i18n.localize('madness.sheet.delete'),
      icon: '<i class="fas fa-trash"></i>',
      condition: this._isOwner.bind(this),
      callback: this._onContextMenuItemDelete.bind(this)
    },
  ];

  getData() {
    const baseData = super.getData();
    const sheetData = {
      actor: baseData.actor,
      system: baseData.actor.system,
      skills: baseData.items.filter(item => item.type === 'skill'),
      weapons: baseData.items.filter(item => item.type === 'weapon'),
      config: CONFIG.madness
    };
    return sheetData;
  }

  activateListeners(html) {

    if (this.actor.isOwner) {
      html.find('.item-roll').click(this._onItemRoll.bind(this));
      html.find('.stat-roll').click(this._onStatRoll.bind(this));
      html.find('.item-create').click(this._onItemCreate.bind(this));
  
      new ContextMenu(html, '.item', this.itemContextMenu);
    }

    super.activateListeners(html);
  }

  _isOwner() {
    return this.actor.isOwner;
  }

  _onContextMenuItemView(element) {
    const item = this.actor.items.get(element.data('item-id'));
    item.sheet.render(true);
  }

  _onContextMenuItemDelete(element) {
    const itemId = element.data('item-id');
    return this.actor.deleteEmbeddedDocuments('Item', [itemId]);
  }

  _onStatRoll(event) {
    MadnessDice.statCheck({
      statValue: MadnessUtils.convertToInt(event.currentTarget.dataset.statvalue),
      modValue: MadnessUtils.convertToInt(event.currentTarget.dataset.modvalue),
      statName: event.currentTarget.dataset.statName
    });
  }

  _onItemRoll(event) {
    const element = event.currentTarget;
    const itemId = element.closest('.item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    item.roll();
  }

  async _onItemCreate(event) {
    event.preventDefault();
    const element = event.currentTarget;
    let defaultName = `madness.sheet.new${MadnessUtils.capitalizeFirstLetter(element.dataset.type||'item')}`;
    const itemData = {
      name: game.i18n.localize(defaultName),
      type: element.dataset.type
    };
    const [itemDocument] = await this.actor.createEmbeddedDocuments('Item', [itemData]);
    itemDocument.sheet.render(true);
  }

}