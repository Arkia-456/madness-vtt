export default class MadnessItem extends Item {
  chatTemplate = {
    skill: 'systems/madness/templates/chat/skill-chat.hbs',
  };

  async roll() {
    const cardData = {
      ...this,
      id: this.id,
      ownerId: this.actor.id,
      owner: game.actors.get(this.actor.id)
    };
    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: await renderTemplate(this.chatTemplate[this.type], cardData)
    };
    return ChatMessage.create(chatData);
  }
}