const sum = require('../lib/sum')


test('This test ' + 'adds 1 + 2 to equal 3', () => {
     expect(sum(1, 2)).toBe(3)
})
module.exports = sum;