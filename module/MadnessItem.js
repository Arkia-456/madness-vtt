export default class MadnessItem extends Item {

  async roll() {
    const cardData = {
      ...this,
      id: this.id,
      ownerId: this.actor.id,
      owner: game.actors.get(this.actor.id)
    };
    const template = 'systems/madness/templates/chat/item-chat.hbs';
    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: await renderTemplate(template, cardData)
    };
    return ChatMessage.create(chatData);
  }
}