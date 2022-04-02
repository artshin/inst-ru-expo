import Colors from '@app/Utils/Colors'
import { Matrix, Sequence, MatrixField } from '@app/Utils/Matrix'
import React, { useMemo, useState } from 'react'
import { View, ViewProps } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HoverTouchable } from './HoverButton'
import { Button, Card, Modal, Text } from '@ui-kitten/components'
import { useNavigation } from '@react-navigation/native'

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

  const MatrixCell = ({ field, style }: { field: MatrixField } & ViewProps) => {
    let backgroundColor = Colors.racingGreen
    let color = Colors.white
    let disabled = false
    let opacity = 0.6

    if (currentCells.has(field.index)) {
      backgroundColor = Colors.oceanGreen
      opacity = 1
    }

    if (solutionSequence.values.find((el) => el.index === field.index)) {
      backgroundColor = Colors.orange
      disabled = true
    }

    if (highlightedCells.has(field.index)) {
      backgroundColor = 'darkcyan'
    }

    return (
      <HoverTouchable
        style={[
          style,
          {
            padding: 4,
            flex: 1,
            aspectRatio: 1,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor,
            borderRadius: 4,
            opacity,
          },
        ]}
        onPress={() => onCellPress(field)}
        onHoverEnter={() => onCellHoverEnter(field)}
        onHoverLeave={() => onCellHoverLeave(field)}
        hover={false}
        disabled={disabled}
      >
        <Text style={{ color }} category={'h6'}>
          {/* {field.index + '-' + field.label} */}
          {field.label}
        </Text>
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
      }}
    >
      {matrixValueRows.map((row, idx) => (
        <View
          key={'row' + idx}
          style={{
            flexDirection: 'row',
          }}
        >
          {row.map((el, jdx) => (
            <MatrixCell
              key={el.label + el.index}
              field={el}
              style={{
                marginRight: jdx === row.length - 1 ? 0 : 8,
                marginBottom: idx === matrixValueRows.length - 1 ? 0 : 8,
              }}
            />
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
                width: 44,
                height: 44,
                marginRight: 8,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: Colors.oceanGreen,
                borderRadius: 4,
              }}
            >
              <Text style={{ color: Colors.honeyDew }}>{el.label}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

const SequenceField = ({
  sequence,
  style,
}: { sequence: Sequence } & ViewProps) => {
  return (
    <View
      style={[
        style,
        {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      {sequence.values.map((el, idx) => (
        <View
          key={el.label + idx}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 44,
            height: 44,
            borderWidth: 1,
            borderColor: Colors.oceanGreen,
            borderRadius: 8,
            marginRight: 8,
          }}
        >
          <Text style={{ color: Colors.honeyDew }}>{el.label}</Text>
        </View>
      ))}
    </View>
  )
}

type SelectMode = 'vertical' | 'horizontal'

export default function BreachGrid() {
  const navigation = useNavigation()
  const [gameCount, setGameCount] = useState(1)
  const [matrixSize, setMatrixSize] = useState(5)
  const [solutionSize, setSolutionSize] = useState(6)
  const [selectMode, setSelectMode] = useState<SelectMode>('vertical')
  const [solutionSequence, setSolutionSequence] = useState<Sequence>(
    new Sequence(solutionSize)
  )

  const matrix = useMemo(() => new Matrix(matrixSize), [matrixSize, gameCount])

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

  const onExitPress = () => {
    navigation.goBack()
  }

  const onPlayAgainPress = () => {
    setGameCount(gameCount + 1)
    setSolutionSequence(new Sequence(solutionSize))
    setPuzzleSequences(matrix.generateRandomSequences(3))
  }

  const solutionFilled =
    solutionSequence.values.find((el) => el.index === -1) === undefined
  const allPuzzleSequencesSolved = puzzleSequences.length === 0
  const isGameOver = solutionFilled || allPuzzleSequencesSolved

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: Colors.darkJungleGreen,
        justifyContent: 'flex-start',
      }}
    >
      {/* <Text style={{ fontSize: 24, color: Colors.honeyDew }} category="h1">
        {'Breach Protocol'}
      </Text> */}
      <Text
        style={{ fontSize: 16, marginTop: 4, color: Colors.honeyDew }}
        category={'h1'}
      >
        {'Find sequences'}
      </Text>

      <PuzzleSequences sequences={puzzleSequences} />

      <MatrixGrid
        matrix={matrix}
        currentSequence={currentSequence}
        selectMode={selectMode}
        solutionSequence={solutionSequence}
        onCellPress={onMatrixCellPress}
      />

      <SequenceField
        sequence={solutionSequence}
        style={{ flex: 1, marginTop: 16 }}
      />

      <Modal
        visible={isGameOver}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <Card disabled={true} style={{ backgroundColor: Colors.oceanGreen }}>
          <Text category={'h4'} style={{ textAlign: 'center' }}>
            Game Over
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 32 }}>
            <Button
              style={{
                backgroundColor: Colors.orange,
                marginRight: 16,
                paddingHorizontal: 16,
                borderColor: Colors.honeyDew,
              }}
              onPress={onExitPress}
            >
              Exit
            </Button>
            <Button
              style={{
                backgroundColor: Colors.racingGreen,
                paddingHorizontal: 16,
                borderColor: Colors.honeyDew,
              }}
              onPress={onPlayAgainPress}
            >
              Play Again
            </Button>
          </View>
        </Card>
      </Modal>
    </SafeAreaView>
  )
}
