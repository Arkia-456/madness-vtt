export default class MadnessItemSheet extends ItemSheet {

  get template() {
    return `systems/madness/templates/items/${this.item.type}-sheet.hbs`;
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['madness', 'sheet', 'item'],
      width: 800,
      height: 600,
      resizable: true,
    });
  }

  async getData(options) {
    const context = super.getData(options);
    const item = context.item;

    // System configuration
    context.config = CONFIG.madness;

    // Item rendering data
    foundry.utils.mergeObject(context, {
      system: item.system,
      effects: item.effects
    });

    
    context.descriptionHTML = await TextEditor.enrichHTML(item.system.description, {
      secrets: item.isOwner,
      async: true,
      relativeTo: this.item,
    });
    
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (this.isEditable) {
      html.find('.effect-control').click(this._onEffectControl.bind(this));
    }
  }

  _onEffectControl(event) {
    event.preventDefault();
    const owner = this.item;
    const a = event.currentTarget;
    const tr = a.closest('tr');
    const effect = tr.dataset.effectId ? owner.effects.get(tr.dataset.effectId) : null;
    switch(a.dataset.action) {
      case 'create':
        return this._createActiveEffect(owner);
      case 'edit':
        return effect.sheet.render(true);
      case 'delete':
        return effect.delete();
    }
  }

  _createActiveEffect(owner) {
    return owner.createEmbeddedDocuments('ActiveEffect', [{
      label: 'New effect',
      icon: 'icons/svg/aura.svg',
      origin: owner.uuid,
      disabled: true
    }]);
  }

}