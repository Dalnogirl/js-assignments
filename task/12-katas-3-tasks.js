/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left,
 * right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {boolean}
 *
 * @example
 *   var puzzle = [
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ];
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false
 */
function findStringInSnakingPuzzle(_puzzle, searchStr) {
  const puzzle = _puzzle.map(i => i.split(''))
  let currentWord = searchStr[0]
  const startPoints = []
  for (let i = 0; i < puzzle.length; i++) {
    for (let j = 0; j < puzzle[0].length; j++) {
      if (puzzle[i][j] === searchStr[0]) startPoints.push([i, j])
    }
  }
  return startPoints.some(i => search(puzzle, ...i))

  function search(_puzzle, y, x) {
    if (currentWord === searchStr) return true
    const puzzle = [..._puzzle]
    while (currentWord.length < searchStr.length) {
      if (goTop()) {
        continue
      }
      if (goLeft()) {
        continue
      }
      if (goRight()) {
        continue
      }
      if (goBot()) {
        continue
      }

      if (currentWord === searchStr) return true
      currentWord = searchStr[0]
      return false
    }

    function goRight() {
      if (puzzle[y][x + 1]
        && puzzle[y][x + 1] === searchStr[currentWord.length]) {
        currentWord += puzzle[y][x + 1]
        puzzle[y][x] = undefined
        x++
        return true
      } else {
        return false
      }
    }

    function goBot() {
      if (puzzle[y + 1]
        && puzzle[y + 1][x] === searchStr[currentWord.length]) {
        currentWord += puzzle[y + 1][x]
        puzzle[y][x] = undefined
        y++
        return true
      } else {
        return false
      }
    }

    function goLeft() {
      if (puzzle[y][x - 1]
        && puzzle[y][x - 1] === searchStr[currentWord.length]) {
        currentWord += puzzle[y][x - 1]
        puzzle[y][x] = undefined
        x--
        return true
      } else {
        return false
      }
    }

    function goTop() {
      if (puzzle[y - 1]
        && puzzle[y - 1][x] === searchStr[currentWord.length]) {
        currentWord += puzzle[y - 1][x]
        puzzle[y][x] = undefined
        y--
        return true
      } else {
        return false
      }
    }

    return currentWord === searchStr
  }

}

/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 *
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from
 *    the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
  function* recursive(result) {
    if (result.length === chars.length) {
      yield result
    } else {
      for (let i = 0; i < chars.length; i++) {
        if (result.indexOf(chars[i]) < 0) yield* recursive(result + chars[i]) // compose here
      }
    }
  }

  yield* recursive('')
}

/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units
 * you have already bought, or do nothing.
 * Therefore, the most profit is the maximum difference of all pairs in a sequence
 * of stock prices.
 *
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
  let profit = 0

  while (quotes.length) {
    const maxQuote = Math.max(...quotes)
    const maxQuoteIndex = quotes.indexOf(maxQuote)
    const income = maxQuote * maxQuoteIndex
    const expense = quotes.slice(0, maxQuoteIndex).reduce((acc, item) => {
      return acc + item
    }, 0)
    profit += income - expense
    quotes = quotes.slice(maxQuoteIndex + 1)
  }

  return profit
}

/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 *
 * @class
 *
 * @example
 *
 *   var urlShortener = new UrlShortener();
 *   var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *   var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 *
 */
function UrlShortener() {
  this.urlAllowedChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    'abcdefghijklmnopqrstuvwxyz' +
    '0123456789-_.~!*\'();:@&=+$,/?#[]'
}

UrlShortener.prototype = {
  encode(url) {
    throw new Error('Not implemented')
  },

  decode(code) {
    throw new Error('Not implemented')
  }
}

module.exports = {
  findStringInSnakingPuzzle: findStringInSnakingPuzzle,
  getPermutations: getPermutations,
  getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
  UrlShortener: UrlShortener
}
