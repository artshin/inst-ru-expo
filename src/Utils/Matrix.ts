import seedrandom from 'seedrandom'

type SequenceDirection = 'horizontal' | 'vertical'

export type MatrixField = { label: string; index: number }
export class Sequence {
  values: MatrixField[]

  constructor(length: number) {
    this.values = new Array(length).fill({ label: '_', index: -1 })
  }
}

const MatrixValues = ['E9', '1C', 'BD', '7A', '55', 'FF']

function randomValue(seededRNG: seedrandom.PRNG): string {
  const min = Math.ceil(0)
  const max = Math.floor(MatrixValues.length - 1)
  const index = Math.floor(seededRNG() * (max - min + 1)) + min
  return MatrixValues[index]
}

function getRandomInt(
  min: number,
  max: number,
  seededRNG: seedrandom.PRNG
): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(seededRNG() * (max - min + 1)) + min
}

const MinSequenceLength = 2
const MaxSequenceLength = 5

export class Matrix {
  size: number
  values: string[]
  seededRNG: seedrandom.PRNG

  constructor(size: number) {
    this.size = size
    this.values = new Array(Math.pow(this.size, 2))
    this.seededRNG = seedrandom(Date.now().toString(), { entropy: true })

    for (let idx = 0; idx < this.values.length; idx++) {
      const value = randomValue(this.seededRNG)
      this.values[idx] = value
    }
  }

  sequenceForValueAtIndex(
    index: number,
    direction: 'vertical' | 'horizontal'
  ): Sequence {
    let startIndex = 0
    let step = 0
    let limit = 0
    let result = new Sequence(this.size)

    if (direction === 'vertical') {
      startIndex = index % this.size
      step = this.size
      limit = this.values.length
    } else {
      startIndex = index - (index % this.size)
      step = 1
      limit = startIndex + this.size
    }

    for (let idx = startIndex, jdx = 0; idx < limit; idx += step, jdx++) {
      result.values[jdx] = { label: this.values[idx], index: idx }
    }

    return result
  }

  generateRandomSequences(count: number): Sequence[] {
    const sequences: Sequence[] = []
    let totalSequenceLength = 0

    for (let i = 0; i < count; i++) {
      const length: number = getRandomInt(
        MinSequenceLength,
        MaxSequenceLength,
        this.seededRNG
      )
      totalSequenceLength += length
      sequences.push(new Sequence(length))
    }

    const totalSequenceIndexes = this.recursiveRandomSequence(
      null,
      null,
      'horizontal',
      totalSequenceLength
    )

    let totalIdx = 0
    sequences.forEach((sequence) => {
      for (let i = 0; i < sequence.values.length; i++, totalIdx++) {
        const valueIndex = totalSequenceIndexes[totalIdx]
        sequence.values[i] = {
          label: this.values[valueIndex],
          index: valueIndex,
        }
      }
    })

    return sequences
  }

  recursiveRandomSequence = (
    rowIndex: number | null = null,
    columnIndex: number | null = null,
    direction: SequenceDirection = 'horizontal',
    length: number = 4,
    usedIndexes: Set<number> = new Set<number>()
  ): number[] => {
    if (length === 0) {
      return []
    }

    let row = rowIndex || 0
    let column = columnIndex || 0
    let result: number[] = []
    const nextDirection = direction === 'vertical' ? 'horizontal' : 'vertical'

    // no previous row and column means we pick the first row
    if (rowIndex == null && columnIndex == null) {
      column = getRandomInt(0, this.size - 1, this.seededRNG)
    } else if (direction === 'vertical') {
      row = getRandomInt(0, this.size - 1, this.seededRNG)
    } else if (direction === 'horizontal') {
      column = getRandomInt(0, this.size - 1, this.seededRNG)
    }

    const matrixIndex = this.getMatrixIndex(row, column)
    const nextPossibleSequence = this.sequenceForValueAtIndex(
      matrixIndex,
      nextDirection
    )
    const remainingValues = nextPossibleSequence.values.filter(
      ({ index }) => !usedIndexes.has(index)
    ).length

    if (usedIndexes.has(matrixIndex) || remainingValues < 2) {
      // perform search in the place again
      result = [
        ...result,
        ...this.recursiveRandomSequence(
          rowIndex,
          columnIndex,
          direction,
          length,
          usedIndexes
        ),
      ]
    } else {
      usedIndexes.add(matrixIndex)
      result.push(matrixIndex)
      result = [
        ...result,
        ...this.recursiveRandomSequence(
          row,
          column,
          nextDirection,
          length - 1,
          usedIndexes
        ),
      ]
    }

    return result
  }

  getMatrixIndex(row: number, column: number): number {
    return row * this.size + column
  }

  getMatrixSequence = (
    valueIndex: number,
    selectMode: SequenceDirection
  ): Sequence => {
    let startIndex = 0
    let step = 0
    let limit = 0

    const sequence = new Sequence(this.size)

    if (selectMode === 'vertical') {
      startIndex = valueIndex % this.size
      step = this.size
      limit = this.values.length
    } else {
      startIndex = valueIndex - (valueIndex % this.size)
      step = 1
      limit = startIndex + this.size
    }

    const values: MatrixField[] = []
    for (let idx = startIndex; idx < limit; idx += step) {
      values.push({ label: this.values[idx], index: idx })
    }

    return { ...sequence, values }
  }
}
