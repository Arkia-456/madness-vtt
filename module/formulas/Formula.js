export default class Formula {

  _raw;

  constructor(formula) {
    this._raw = formula;
  }

  compute(props, options = {}) {
    try {
      let computedFormula = this._handleTextVars(this._raw, props, options);
      this._computed = this._handleTextOperators(computedFormula);
      return this;
    } catch (error) {
      console.error(error);
      if (CONFIG.debug.custom) alert(error);
    }
  }

  evaluate() {
    return eval(this._computed);
  }

  get computed() {
    return this._computed;
  }

  _handleTextOperators(formula) {
    const mathTokens = Object.getOwnPropertyNames(Math);
    const operatorRegex = /_\w+\(/g;
    const operators = formula.matchAll(operatorRegex);
    let operator = operators.next();

    while (!operator.done) {
      const operatorValue = operator.value[0].substring(1).slice(0, -1);
      if (!mathTokens.includes(operatorValue)) {
        throw new Error(`Error in formula ${formula}. Unknown Math operator : ${operatorValue}.`);
      }
      formula = formula.replace(operator.value[0].slice(0, -1), `Math['${operatorValue}']`);
      operator = operators.next();
    }

    return formula;
  }

  _handleTextVars(formula, props, options) {
    const textVarRegex = /@{.*?}/g;
    const textVars = formula.matchAll(textVarRegex);
    let textVar = textVars.next();

    while (!textVar.done) {
      let textValue = textVar.value[0].substring(2).slice(0, -1);
      if (options.key) {
        textValue = textValue.replace('key', options.key);
      }
      let resolvedPath = this._resolveObjectPath(textValue, props, '.');
      if (resolvedPath === undefined) {
        if (options.ignoreUnknownPath){
          resolvedPath = options.fallbackValue || 0;
        } else {
          throw new Error(`Error in formula ${formula}. Unknown path ${textValue} in props.`);
        }
      }
      formula = formula.replace(textVar.value[0], resolvedPath);
      textVar = textVars.next();
    }

    return formula;
  }

  _resolveObjectPath(path, object, separator = '.') {
    const properties = Array.isArray(path) ? path : path.split(separator);
    return properties.reduce((prev, curr) => prev?.[curr], object);
  }

}