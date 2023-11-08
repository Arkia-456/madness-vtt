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
    return {
      actor: baseData.actor,
      system: baseData.actor.system,
      weapons: baseData.items.filter(item => item.type === 'weapon'),
      config: CONFIG.madness
    }
  }

  activateListeners(html) {

    if (this.actor.isOwner) {
  
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

}