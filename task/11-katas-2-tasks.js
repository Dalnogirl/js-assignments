/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist
 * in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account
 * that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it
 * into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(str) {
  const par = str.split('\n').slice(0, 3)
  const kek = []
  let res = ''
  for (let i = 0; i < par[0].length - 1; i += 3) {
    kek.push(
      par[0].slice(i, i + 3) + par[1].slice(i, i + 3) + par[2].slice(i, i + 3))
  }

  const presets = {
    '     |  |': '1',
    ' _  _||_ ': '2',
    ' _  _| _|': '3',
    '   |_|  |': '4',
    ' _ |_  _|': '5',
    ' _ |_ |_|': '6',
    ' _   |  |': '7',
    ' _ |_||_|': '8',
    ' _ |_| _|': '9',
    ' _ | ||_|': '0'
  }
  for (const num of kek) {
    res += presets[num]
  }
  return res
}

/**
 * Returns the string, but with line breaks inserted at just the right places to make
 * sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>
 *      'The String global object',
 *      'is a constructor for',
 *      'strings, or a sequence of',
 *      'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>
 *      'The String',
 *      'global',
 *      'object is a',
 *      'constructor',
 *      'for strings,',
 *      'or a',
 *      'sequence of',
 *      'characters.'
 */
function* wrapText(text, columns) {
  const result = []
  text.split(' ').reduce((acc, item, index, arr) => {
    if (acc.length <= columns) {
      if (acc.length + item.length < columns) {
        acc += ` ${item}`
      } else {
        result.push(acc === '' ? item : acc)
        acc = item
      }
    }
    if (index === arr.length - 1) result.push(acc ? acc : item)
    return acc
  }, '')
  while (result.length) yield result.shift().trim()
}

/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
  StraightFlush: 8,
  FourOfKind: 7,
  FullHouse: 6,
  Flush: 5,
  Straight: 4,
  ThreeOfKind: 3,
  TwoPairs: 2,
  OnePair: 1,
  HighCard: 0
}

function getPokerHandRank(hand) {
  class Get {
    constructor(hand) {
      this._ranks = 'A234567891JQKA'
      this.suits = []
      this.ranks = {
        count: [],
        values: [],
        sorted: []
      }

      for (const v of hand) {
        if (this.ranks.values.indexOf(v[0]) < 0) {
          this.ranks.values.push(v[0])
          this.ranks.count.push(1)
        } else {
          this.ranks.count[this.ranks.values.indexOf(v[0])]++
        }

        if (this.suits.indexOf(v.slice(-1)) < 0) this.suits.push(v.slice(-1))
      }
      this.ranks.sorted = this.ranks.values.sort(
        (a, b) => this._ranks.indexOf(a) - this._ranks.indexOf(b)
      )
      if (this.ranks.sorted[0] === 'A'
        && this.ranks.sorted[1] !== '2') {
        this.ranks.sorted.splice(0, 1)
        this.ranks.sorted.push('A')
      }
    }

    getCount(cnt) {
      let res = 0
      for (const v of this.ranks.count) if (v === cnt) res++
      return res
    }

    isFlush() {
      return this.suits.length === 1
    }

    isStraight() {
      if (this.ranks.sorted.length < 5) return false
      for (let i = 1; i < 5; i++) {
        if (
          this._ranks.indexOf(this.ranks.sorted[i - 1]) + 1 !==
          this._ranks.indexOf(this.ranks.sorted[i]) &&
          this._ranks.indexOf(this.ranks.sorted[i - 1]) + 1 !==
          this._ranks.lastIndexOf(this.ranks.sorted[i])
        ) {
          return false
        }
      }
      return true
    }
  }

  hand = new Get(hand)

  if (hand.isFlush() && hand.isStraight()) {
    return PokerRank.StraightFlush
  } else if (hand.getCount(4)) {
    return PokerRank.FourOfKind
  } else if (hand.getCount(3) && hand.getCount(2)) {
    return PokerRank.FullHouse
  } else if (hand.isFlush()) {
    return PokerRank.Flush
  } else if (hand.isStraight()) {
    return PokerRank.Straight
  } else if (hand.getCount(3)) {
    return PokerRank.ThreeOfKind
  } else if (hand.getCount(2) === 2) {
    return PokerRank.TwoPairs
  } else if (hand.getCount(2)) {
    return PokerRank.OnePair
  } else {
    return PokerRank.HighCard
  }
}

/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +,
 * vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 *
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 *
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+        '+------------+\n'+
 *    '|            |\n'+        '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+   =>   '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+        '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'         '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
  const a = figure.split('\n')
  const answer = []
  const check = function bar(n, m) {
    let i
    let j
    for (i = m; ; i++) {
      if (a[n - 1][i] === undefined || a[n - 1][i] === ' ' || a[n] ===
        undefined) {
        return
      }
      if (a[n][i] !== ' ') break
    }
    const w = i
    for (j = n; ; j++) {
      if (a[j] === undefined || a[j][w] === ' ') return
      if (a[j][w - 1] !== ' ') break
    }
    const h = j
    for (i = w - 1; ; i--) {
      if (a[h][i] === undefined || a[h][i] === ' ' || a[h - 1] ===
        undefined) {
        return
      }
      if (a[h - 1][i] !== ' ') break
    }
    if (i + 1 !== m) return
    for (j = h - 1; ; j--) {
      if (a[j] === undefined || a[j][m - 1] === ' ') return
      if (a[j][m] !== ' ') break
    }
    if (j + 1 !== n) return
    n = h - n
    m = w - m
    answer.push(
      '+' + '-'.repeat(m) + '+\n' + ('|' + ' '.repeat(m) + '|\n').repeat(n) +
      '+' + '-'.repeat(m) + '+\n')
  }

  a.pop()
  a.forEach((v, i) => v.split('').forEach((v, j) => {
    if (v === '+') check(i + 1, j + 1)
  }))
  for (const item of answer) {
    yield item
  }
}

module.exports = {
  parseBankAccount: parseBankAccount,
  wrapText: wrapText,
  PokerRank: PokerRank,
  getPokerHandRank: getPokerHandRank,
  getFigureRectangles: getFigureRectangles
}
