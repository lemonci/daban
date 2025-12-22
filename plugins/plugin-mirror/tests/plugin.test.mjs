import { expect } from 'chai'
import { Design } from '@freesewing/core'
import { plugin } from '../src/index.mjs'

describe('Mirror Plugin Tests', () => {
  const part = {
    name: 'test',
    draft: ({ points, Point, macro, paths, Path, part, snippets, Snippet }) => {
      points.mirrorA = new Point(-100, -100)
      points.mirrorB = new Point(100, 100)
      points.a = new Point(10, 20)
      points.b = new Point(30, 40)
      points.c = new Point(10, 20)
      paths.test = new Path()
        .move(new Point(1, 2))
        .curve(new Point(10, 20), new Point(30, 40), new Point(50, 60))
      snippets.c = new Snippet('notch', points.c)
      snippets.d = new Snippet('bnotch', new Point(30, 40))
      const settings = {
        mirror: [points.mirrorA, points.mirrorB],
        points: ['a', 'b'],
        paths: ['test'],
        snippets: ['c', 'd'],
      }
      macro('mirror', settings)
      macro('mirror', { ...settings, prefix: 'test' })
      macro('mirror', { ...settings, prefix: 'reverse', reverse: true })
      macro('mirror', { ...settings, clone: false })

      return part
    },
    plugins: [plugin],
  }
  const Pattern = new Design({ parts: [part] })
  const pattern = new Pattern()
  pattern.draft()

  it('Should mirror points', () => {
    expect(pattern.parts[0].test.points.mirroredA.x).to.equal(20)
    expect(pattern.parts[0].test.points.mirroredA.y).to.equal(10)
    expect(pattern.parts[0].test.points.mirroredB.x).to.equal(40)
    expect(pattern.parts[0].test.points.mirroredB.y).to.equal(30)
  })
  it('Should mirror points with custom prefix', () => {
    expect(pattern.parts[0].test.points.testA.x).to.equal(20)
    expect(pattern.parts[0].test.points.testA.y).to.equal(10)
    expect(pattern.parts[0].test.points.testB.x).to.equal(40)
    expect(pattern.parts[0].test.points.testB.y).to.equal(30)
  })
  it('Should mirror points without cloning them', () => {
    expect(pattern.parts[0].test.points.a.x).to.equal(20)
    expect(pattern.parts[0].test.points.a.y).to.equal(10)
    expect(pattern.parts[0].test.points.b.x).to.equal(40)
    expect(pattern.parts[0].test.points.b.y).to.equal(30)
  })
  it('Should mirror snippets', () => {
    expect(pattern.parts[0].test.snippets.mirroredC.anchor.x).to.equal(20)
    expect(pattern.parts[0].test.snippets.mirroredC.anchor.y).to.equal(10)
    expect(pattern.parts[0].test.snippets.mirroredD.anchor.x).to.equal(40)
    expect(pattern.parts[0].test.snippets.mirroredD.anchor.y).to.equal(30)
    expect(pattern.parts[0].test.points.mirroredC.x).to.equal(20)
    expect(pattern.parts[0].test.points.mirroredC.y).to.equal(10)
    expect(pattern.parts[0].test.snippets.mirroredC.def).to.equal('notch')
    expect(pattern.parts[0].test.snippets.mirroredD.def).to.equal('bnotch')
  })
  it('Should mirror snippets with custom prefix', () => {
    expect(pattern.parts[0].test.snippets.testC.anchor.x).to.equal(20)
    expect(pattern.parts[0].test.snippets.testC.anchor.y).to.equal(10)
    expect(pattern.parts[0].test.snippets.testD.anchor.x).to.equal(40)
    expect(pattern.parts[0].test.snippets.testD.anchor.y).to.equal(30)
    expect(pattern.parts[0].test.points.testC.x).to.equal(20)
    expect(pattern.parts[0].test.points.testC.y).to.equal(10)
    expect(pattern.parts[0].test.snippets.testC.def).to.equal('notch')
    expect(pattern.parts[0].test.snippets.testD.def).to.equal('bnotch')
  })
  it('Should mirror snippets without cloning them', () => {
    expect(pattern.parts[0].test.snippets.c.anchor.x).to.equal(20)
    expect(pattern.parts[0].test.snippets.c.anchor.y).to.equal(10)
    expect(pattern.parts[0].test.snippets.d.anchor.x).to.equal(40)
    expect(pattern.parts[0].test.snippets.d.anchor.y).to.equal(30)
    expect(pattern.parts[0].test.points.c.x).to.equal(20)
    expect(pattern.parts[0].test.points.c.y).to.equal(10)
    expect(pattern.parts[0].test.snippets.c.def).to.equal('notch')
    expect(pattern.parts[0].test.snippets.d.def).to.equal('bnotch')
  })
  it('Should mirror paths', () => {
    expect(pattern.parts[0].test.paths.mirroredTest.ops[0].to.x).to.equal(2)
    expect(pattern.parts[0].test.paths.mirroredTest.ops[0].to.y).to.equal(1)
    expect(pattern.parts[0].test.paths.mirroredTest.ops[1].cp1.x).to.equal(20)
    expect(pattern.parts[0].test.paths.mirroredTest.ops[1].cp1.y).to.equal(10)
    expect(pattern.parts[0].test.paths.mirroredTest.ops[1].cp2.x).to.equal(40)
    expect(pattern.parts[0].test.paths.mirroredTest.ops[1].cp2.y).to.equal(30)
    expect(pattern.parts[0].test.paths.mirroredTest.ops[1].to.x).to.equal(60)
    expect(pattern.parts[0].test.paths.mirroredTest.ops[1].to.y).to.equal(50)
  })
  it('Should mirror paths with custom prefix', () => {
    expect(pattern.parts[0].test.paths.testTest.ops[0].to.x).to.equal(2)
    expect(pattern.parts[0].test.paths.testTest.ops[0].to.y).to.equal(1)
    expect(pattern.parts[0].test.paths.testTest.ops[1].cp1.x).to.equal(20)
    expect(pattern.parts[0].test.paths.testTest.ops[1].cp1.y).to.equal(10)
    expect(pattern.parts[0].test.paths.testTest.ops[1].cp2.x).to.equal(40)
    expect(pattern.parts[0].test.paths.testTest.ops[1].cp2.y).to.equal(30)
    expect(pattern.parts[0].test.paths.testTest.ops[1].to.x).to.equal(60)
    expect(pattern.parts[0].test.paths.testTest.ops[1].to.y).to.equal(50)
  })
  it('Should mirror paths in reverse', () => {
    expect(pattern.parts[0].test.paths.reverseTest.ops[0].to.x).to.equal(60)
    expect(pattern.parts[0].test.paths.reverseTest.ops[0].to.y).to.equal(50)
    expect(pattern.parts[0].test.paths.reverseTest.ops[1].cp1.x).to.equal(40)
    expect(pattern.parts[0].test.paths.reverseTest.ops[1].cp1.y).to.equal(30)
    expect(pattern.parts[0].test.paths.reverseTest.ops[1].cp2.x).to.equal(20)
    expect(pattern.parts[0].test.paths.reverseTest.ops[1].cp2.y).to.equal(10)
    expect(pattern.parts[0].test.paths.reverseTest.ops[1].to.x).to.equal(2)
    expect(pattern.parts[0].test.paths.reverseTest.ops[1].to.y).to.equal(1)
  })
  it('Should mirror paths without cloning them', () => {
    expect(pattern.parts[0].test.paths.test.ops[0].to.x).to.equal(2)
    expect(pattern.parts[0].test.paths.test.ops[0].to.y).to.equal(1)
    expect(pattern.parts[0].test.paths.test.ops[1].cp1.x).to.equal(20)
    expect(pattern.parts[0].test.paths.test.ops[1].cp1.y).to.equal(10)
    expect(pattern.parts[0].test.paths.test.ops[1].cp2.x).to.equal(40)
    expect(pattern.parts[0].test.paths.test.ops[1].cp2.y).to.equal(30)
    expect(pattern.parts[0].test.paths.test.ops[1].to.x).to.equal(60)
    expect(pattern.parts[0].test.paths.test.ops[1].to.y).to.equal(50)
  })
})
