import MadnessActor from "./MadnessActor.js";
import MadnessDice from "./MadnessDice.js";

export default class MadnessChat {

  static addChatListeners(html) {
    html.on('click', 'button.item-crit', MadnessChat.onItemCritic)
    html.on('click', 'button.item-attack', MadnessChat.onItemAttack)
  }

  static onItemCritic(event) {
    const card = event.currentTarget.closest('.item');
    const attacker = game.actors.get(card.dataset.ownerId);
    const item = attacker.items.get(card.dataset.itemId);
    MadnessDice.rollCritDice(attacker, 'item', item);
  }

  static onItemAttack(event) {
    const card = event.currentTarget.closest('.item');
    const attacker = game.actors.get(card.dataset.ownerId);
    const item = attacker.items.get(card.dataset.itemId);
    MadnessDice.attack(attacker, 'item', item);
  }

  static addChatMessageContextOptions(html, options) {
    const canDefend = (li) => canvas.tokens.controlled.length && li.find('.task-check.attack').length;
    options.push(
      {
        name: game.i18n.localize('madness.chat.actions.defend'),
        icon: '<i class="fas fa-shield-alt"></i>',
        condition: canDefend,
        callback: (li) => MadnessChat.defend(li)
      },
      {
        name: game.i18n.localize('madness.chat.actions.dodge'),
        icon: '<i class="fas fa-person-running"></i>',
        condition: canDefend,
        callback: (li) => MadnessChat.defend(li, true)
      }
    );
    return options;
  }

  static async defend(attack, dodge = false) {
    const [item] = attack.find('.attack').find('.item');
    const itemDamage = parseInt(item.dataset.itemDamage)
    const defenders = [...canvas.tokens.controlled];
    const [defender] = defenders;
    const defenderActor = defender.actor;

    const finalOutcome = MadnessChat._calculateOutcome(itemDamage, defenderActor)

    const template = 'systems/madness/templates/chat/attack-success.hbs';
    
    const templateData = {
      damage: finalOutcome,
      actor: defenderActor,
      ...await defenderActor.applyDamage(finalOutcome)
    }
    defender.refresh();
    ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ defenderActor }),
      content: await renderTemplate(template, templateData)
    });
  }

  static _calculateOutcome(damage, actor) {
    const reducedDamage = actor.calculateDamageReduction(damage);
    const outcome = actor.calculateArmorReduction(reducedDamage);
    return Math.ceil(outcome);
  }

}