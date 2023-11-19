export default class MadnessUtils {
  static convertToInt(val) {
    return parseInt(val) || 0;
  }
  static capitalizeFirstLetter(string) {
    return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
  }
}