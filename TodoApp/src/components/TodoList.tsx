import {StyleSheet, Text, View, TouchableOpacity, Modal} from 'react-native'
import React, {useState} from 'react'
import {colors} from '../constants'
import TodoModal from './TodoModal'
import {ListsProps} from '../../App'
import Icon from 'react-native-vector-icons/AntDesign'

interface TodoListProps {
  list: ListsProps
  updateList: (list: ListsProps) => void
  deleteList: (id: string) => void
}

const TodoList = ({list, updateList, deleteList}: TodoListProps) => {
  const completedCount = list.todos.filter(todo => todo.completed).length
  const remainingCount = list.todos.length - completedCount

  const [showListVisible, setShowListVisible] = useState(false)

  const toggleListModal = () => setShowListVisible(!showListVisible)

  return (
    <View>
      <Modal
        animationType="slide"
        visible={showListVisible}
        onRequestClose={toggleListModal}>
        <TodoModal
          list={list}
          closeModal={toggleListModal}
          updateList={updateList}
        />
      </Modal>

      <TouchableOpacity
        style={[styles.listContainer, {backgroundColor: list.color}]}
        onPress={toggleListModal}>
        <TouchableOpacity
          style={styles.deleteListBtn}
          onPress={() => deleteList(list.id)}>
          <Icon name="delete" size={24} color={colors.white} />
        </TouchableOpacity>

        <Text style={styles.listTitle} numberOfLines={1}>
          {list.name}
        </Text>

        <View style={styles.detailsContainer}>
          <View style={styles.deckContainer}>
            <Text style={styles.count}>{remainingCount}</Text>
            <Text style={styles.subtitle}>Remaining</Text>
          </View>
          <View style={styles.deckContainer}>
            <Text style={styles.count}>{completedCount}</Text>
            <Text style={styles.subtitle}>Completed</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default TodoList

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 22,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginVertical: 10,
    alignItems: 'center',
    width: 270,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 5,
  },
  deckContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  count: {
    fontSize: 35,
    fontWeight: '200',
    color: colors.white,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.white,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteListBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
})
