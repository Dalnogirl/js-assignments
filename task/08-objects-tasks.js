/** ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width
  this.height = height
  Rectangle.prototype.getArea = () => {
    return this.width * this.height
  }
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj)
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
  return Object.assign(Object.create(proto), JSON.parse(json))
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and
 * pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and
 * implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear
 * and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify() =>
 *    '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify() =>
 *    'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify() =>
 *      'div#main.container.draggable + table#data ~ tr:nth-of-type(even) td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class cssSelectorBuilder {
  constructor() {
    this.result = ''
    this.order = []// array consists of selectors in call order;
  }

  element(str) {
    const order = this.order.concat(['element'])
    str = this.result + `${str}`

    return this.createNextBuilder(str, order)
  }

  id(str) {
    const order = this.order.concat(['id'])
    str = this.result + `#${str}`

    return this.createNextBuilder(str, order)
  }

  class(str) {
    const order = this.order.concat(['class'])
    str = this.result + `.${str}`

    return this.createNextBuilder(str, order)
  }

  attr(str) {
    const order = this.order.concat(['attr'])
    str = this.result + `[${str}]`

    return this.createNextBuilder(str, order)
  }

  pseudoClass(str) {
    const order = this.order.concat(['pseudoClass'])
    str = this.result + `:${str}`

    return this.createNextBuilder(str, order)
  }

  pseudoElement(str) {
    const order = this.order.concat(['pseudoElement'])
    str = this.result + `::${str}`

    return this.createNextBuilder(str, order)
  }

  createNextBuilder(initStr, order) {
    const nextBuilder = new cssSelectorBuilder()
    nextBuilder.result += initStr
    nextBuilder.order = order

    this.checkRepeats(order) //if smth wrong it throws err
    this.checkOrder(order)   //if smth wrong it throws err

    return nextBuilder
  }

  checkRepeats(order) {
    if (!order) return
    const condElem = order.filter(elem => elem === 'element').length > 1
    const condId = order.filter(elem => elem === 'id').length > 1
    const condPseudoElem = order.filter(
      elem => elem === 'pseudoElement').length > 1

    if (condElem || condId || condPseudoElem) {
      throw new Error(
        'Element, id and pseudo-element should not ' +
        'occur more then one time inside the selector')
    }
  }

  checkOrder(order) {
    if (!order) return
    const rightOrder = [
      'element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement'
    ]
    const indexOrder = order.map(elem => rightOrder.indexOf(elem))
    for (let i = 0; i < indexOrder.length - 1; i++) {

      const curr = indexOrder[i]
      const next = indexOrder[i + 1]

      if ((next - curr) < 0) {
        throw new Error(
          'Selector parts should be arranged in the following order:' +
          ' element, id, class, attribute, pseudo-class, pseudo-element')
      }
    }
  }

  combine(obj1, separator, obj2) {
    const selector1 = obj1.stringify()
    const selector2 = obj2.stringify()
    const newSelector = selector1 + ' ' + separator + ' ' + selector2

    return this.createNextBuilder(newSelector)
  }

  stringify() {
    const res = this.result
    this.result = ''
    this.order = []
    return res
  }
}

const _cssSelectorBuilder = new cssSelectorBuilder()

module.exports = {
  Rectangle: Rectangle,
  getJSON: getJSON,
  fromJSON: fromJSON,
  cssSelectorBuilder: _cssSelectorBuilder
}
