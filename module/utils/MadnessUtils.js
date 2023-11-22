export default class MadnessUtils {
  static convertToInt(val) {
    return parseInt(val) || 0;
  }
  static capitalizeFirstLetter(string) {
    return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
  }
  static getActorAndItemFromCard(card) {
    const actor = game.actors.get(card.dataset.ownerId);
    return {
      actor: actor,
      item: actor.items.get(card.dataset.itemId)
    }
  }
}