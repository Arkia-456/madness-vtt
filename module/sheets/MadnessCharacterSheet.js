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
    }
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
      html.find('.item-delete').click(this._onItemDelete.bind(this));
  
      new ContextMenu(html, '.weapon-card', this.itemContextMenu);
    }

    super.activateListeners(html);
  }

  _onContextMenuItemView(element) {
    const item = this.actor.items.get(element.data('item-id'));
    item.sheet.render(true);
  }

  _onItemDelete(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest('.item').dataset.itemId;
    return this.actor.deleteEmbeddedDocuments('Item', [itemId])
  }

}