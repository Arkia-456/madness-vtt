import MadnessDice from '../MadnessDice.js';
import MadnessUtils from '../MadnessUtils.js';

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
  
      new ContextMenu(html, '.weapon-card', this.itemContextMenu);
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
    MadnessDice.taskCheck({
      statValue: MadnessUtils.convertToInt(event.currentTarget.dataset.statvalue),
      modValue: MadnessUtils.convertToInt(event.currentTarget.dataset.modvalue)
    });
  }


  _onItemRoll(event) {
    const element = event.currentTarget;
    const itemId = element.closest('.item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    item.roll();
  }
}