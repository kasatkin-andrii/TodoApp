import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import React, {useState} from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import {colors, backgroundColors} from '../constants'
import {TodosProps} from '../../App'

interface AddListModalProps {
  closeModal: () => void
  addList: (listItem: AddListProps) => void
}

export interface AddListProps {
  name: string
  color: string
  todos: TodosProps[]
}

const AddListModal = ({closeModal, addList}: AddListModalProps) => {
  const [name, setName] = useState('')
  const [color, setColor] = useState(backgroundColors[0])

  const createTodoList = () => {
    const list: AddListProps = {name, color, todos: []}

    addList(list)

    setName('')
    setColor(backgroundColors[0])
    closeModal()
  }

  const renderColors = () =>
    backgroundColors.map(colorItem => (
      <TouchableOpacity
        key={colorItem}
        style={[styles.colorSelect, {backgroundColor: colorItem}]}
        onPress={() => setColor(colorItem)}
      />
    ))

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
        <Icon name="close" size={24} color={colors.black} />
      </TouchableOpacity>

      <View style={styles.createTodoListContainer}>
        <Text style={styles.title}>Create Todo List</Text>

        <TextInput
          style={styles.input}
          placeholder="List Name?"
          value={name}
          onChangeText={setName}
        />

        <View style={styles.colorContainer}>{renderColors()}</View>

        <TouchableOpacity
          style={[styles.createBtn, {backgroundColor: color}]}
          onPress={createTodoList}>
          <Text style={styles.createBtnText}>Create!</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default AddListModal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 24,
    right: 24,
  },
  createTodoListContainer: {
    alignSelf: 'stretch',
    marginHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.black,
    alignSelf: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.blue,
    borderRadius: 6,
    height: 50,
    marginTop: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    color: colors.black,
  },
  createBtn: {
    marginTop: 24,
    height: 50,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtnText: {
    color: colors.white,
    fontWeight: '600',
  },
  colorSelect: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
})
