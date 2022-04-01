import { Matrix, Sequence, MatrixField } from '@app/Utils/Matrix'
import React, { useMemo, useState } from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HoverTouchable } from './HoverButton'

const MatrixGrid = ({
  currentSequence,
  matrix,
  solutionSequence,
  selectMode,
  onCellPress,
}: {
  currentSequence: Sequence
  solutionSequence: Sequence
  matrix: Matrix
  selectMode: SelectMode
  onCellPress: (MatrixField: MatrixField) => void
}) => {
  const cellSize = 64 // can be calculated according to screen size
  const [selectedCell, setSelectedCell] = useState<MatrixField | null>(null)

  const onCellHoverEnter = (field: MatrixField) => setSelectedCell(field)

  const onCellHoverLeave = (field: MatrixField) => setSelectedCell(null)

  const highlightedCells: Set<number> = useMemo(() => {
    if (selectedCell === null) {
      return new Set()
    }

    if (solutionSequence.values.includes(selectedCell)) {
      return new Set()
    }

    const sequence = matrix
      .getMatrixSequence(selectedCell.index, selectMode)
      .values.map((el) => el.index)
    return new Set(sequence)
  }, [selectedCell])

  const currentCells = new Set([
    ...currentSequence.values.map((el) => el.index),
  ])

  const MatrixCell = ({ field }: { field: MatrixField }) => {
    let backgroundColor = 'gray'
    let disabled = false
    if (currentCells.has(field.index)) {
      backgroundColor = 'aquamarine'
    }

    if (solutionSequence.values.find((el) => el.index === field.index)) {
      backgroundColor = 'green'
      disabled = true
    }

    if (highlightedCells.has(field.index)) {
      backgroundColor = 'darkcyan'
    }

    return (
      <HoverTouchable
        style={{
          padding: 4,
          // flex: 1,
          aspectRatio: 1,
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor,
          marginRight: 8,
        }}
        onPress={() => onCellPress(field)}
        onHoverEnter={() => onCellHoverEnter(field)}
        onHoverLeave={() => onCellHoverLeave(field)}
        hover={false}
        disabled={disabled}
      >
        <Text>{field.index + '-' + field.label}</Text>
      </HoverTouchable>
    )
  }

  const chunkSize = matrix.size
  let matrixValueRows: MatrixField[][] = []
  for (let i = 0; i < matrix.values.length; i += chunkSize) {
    const chunk = matrix.values
      .slice(i, i + chunkSize)
      .map((el, idx) => ({ label: el, index: idx + i }))
    matrixValueRows = [...matrixValueRows, chunk]
  }

  return (
    <View
      style={{
        flexDirection: 'column',
        marginTop: 16,
        flex: 1,
      }}
    >
      {matrixValueRows.map((row, idx) => (
        <View
          key={'row' + idx}
          style={{
            flex: 1,
            flexDirection: 'row',
            marginBottom: idx === matrixValueRows.length - 1 ? 0 : 8,
          }}
        >
          {row.map((el) => (
            <MatrixCell key={el.label + el.index} field={el} />
          ))}
        </View>
      ))}
    </View>
  )
}

const PuzzleSequences = ({ sequences }: { sequences: Sequence[] }) => {
  return (
    <View style={{ alignItems: 'flex-start' }}>
      {sequences.map((sequence, index) => (
        <View
          key={`seq-${index}`}
          style={{
            flexDirection: 'row',
            marginTop: 16,
          }}
        >
          {sequence.values.map((el, idx) => (
            <View
              key={idx + el.label}
              style={{
                width: 40,
                height: 40,
                marginRight: 8,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
              }}
            >
              <Text>{el.label}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

type SelectMode = 'vertical' | 'horizontal'

export default function BreachGrid() {
  const [matrixSize, setMatrixSize] = useState(5)
  const [solutionSize, setSolutionSize] = useState(6)
  const [selectMode, setSelectMode] = useState<SelectMode>('vertical')
  const [solutionSequence, setSolutionSequence] = useState<Sequence>(
    new Sequence(solutionSize)
  )

  const matrix = useMemo(() => new Matrix(matrixSize), [matrixSize])
  // const puzzleSequences = useMemo(
  //   () => ,
  //   [matrix]
  // )

  const [puzzleSequences, setPuzzleSequences] = useState<Sequence[]>(
    matrix.generateRandomSequences(3)
  )
  const [currentSequence, setCurrentSequence] = useState(
    matrix.getMatrixSequence(0, 'horizontal')
  )

  const onMatrixCellPress = (field: MatrixField) => {
    if (solutionSequence.values.find((el) => el.index === field.index)) {
      return
    }
    const solutionIndex = solutionSequence.values.findIndex(
      (entry) => entry.index === -1
    )
    const newValues = [...solutionSequence.values]

    if (solutionIndex === -1) {
      return
    }

    const updatedPuzzleSequences = puzzleSequences
      .map((el) => {
        if (el.values[0].label === field.label) {
          return {
            ...el,
            values:
              el.values.length > 1 ? el.values.slice(1, el.values.length) : [],
          }
        }
        return el
      })
      .filter((el) => el.values.length > 0)

    newValues[solutionIndex] = field

    setPuzzleSequences(updatedPuzzleSequences)
    setCurrentSequence(matrix.getMatrixSequence(field.index, selectMode))
    setSelectMode(selectMode === 'vertical' ? 'horizontal' : 'vertical')
    setSolutionSequence({ ...solutionSequence, values: newValues })
  }

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{
        flex: 1,
        padding: 16,
        // alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <Text style={{ fontSize: 24 }}>{'Breach Protocol'}</Text>
      <Text style={{ fontSize: 16, marginTop: 4 }}>{'Find sequences'}</Text>

      <PuzzleSequences sequences={puzzleSequences} />

      <MatrixGrid
        matrix={matrix}
        currentSequence={currentSequence}
        selectMode={selectMode}
        solutionSequence={solutionSequence}
        onCellPress={onMatrixCellPress}
      />

      <View
        style={{
          flexDirection: 'row',
          marginTop: 16,
        }}
      >
        {solutionSequence.values.map((el, idx) => (
          <View
            key={el.label + idx}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 40,
              height: 40,
              borderWidth: 1,
              marginRight: 8,
            }}
          >
            <Text style={{}}>{el.label}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  )
}
