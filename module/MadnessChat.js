import MadnessDice from "./MadnessDice.js";

export default class MadnessChat {

  static addChatListeners(html) {
    html.on('click', 'button.skill-crit', MadnessChat.onSkillCritic)
    html.on('click', 'button.skill-attack', MadnessChat.onSkillAttack)
  }

  static onSkillCritic(event) {
    const card = event.currentTarget.closest('.skill');
    const attacker = game.actors.get(card.dataset.ownerId);
    const skill = attacker.items.get(card.dataset.itemId);
    MadnessDice.rollCritDice(attacker, 'skill', skill);
  }

  static onSkillAttack(event) {
    const card = event.currentTarget.closest('.skill');
    const attacker = game.actors.get(card.dataset.ownerId);
    const skill = attacker.items.get(card.dataset.itemId);
    MadnessDice.attack(attacker, 'skill', skill);
  }

  static addChatMessageContextOptions(html, options) {
    const canDefend = (li) => canvas.tokens.controlled.length && li.find('.statCheck.attack').length;
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
    const outcome = itemDamage;
    const actor = defender.actor;

    if (outcome < 0) {
      ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor }),
        content: await renderTemplate('systems/madness/templates/chat/attack-fail.hbs', {
          blocker: defender
        })
      });
    } else {
      const template = 'systems/madness/templates/chat/attack-success.hbs';
      
      const templateData = {
        damage: outcome,
        actor: actor,
        ...await actor.applyDamage(outcome)
      }
      defender.refresh();
      ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor }),
        content: await renderTemplate(template, templateData)
      });
    }
  }

}