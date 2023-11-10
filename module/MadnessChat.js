import MadnessDice from "./MadnessDice.js";

export default class MadnessChat {

  static addChatListeners(html) {
    html.on('click', 'button.skill-attack', MadnessChat.onSkillAttack)
  }

  static onSkillAttack(event) {
    const card = event.currentTarget.closest('.skill');
    const attacker = game.actors.get(card.dataset.ownerId);
    const skill = attacker.items.get(card.dataset.itemId);
    MadnessDice.attack(attacker, 'skill', skill);
  }

}