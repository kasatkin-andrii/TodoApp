import {
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native'
import React, {useState} from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import IconPlus from 'react-native-vector-icons/Entypo'
import IconSquareOutline from 'react-native-vector-icons/Ionicons'
import {colors} from '../constants'
import {ListsProps, TodosProps} from '../../App'

interface TodoModalProps {
  list: ListsProps
  closeModal: () => void
  updateList: (list: ListsProps) => void
}

const TodoModal = ({list, closeModal, updateList}: TodoModalProps) => {
  const {name, color, todos} = list

  const [newTodo, setNewTodo] = useState('')

  const taskCount = todos.length
  const completedCount = todos.filter(({completed}) => completed).length

  const toggleTodoCompleted = (index: number) => {
    let tempList = list
    tempList.todos[index].completed = !tempList.todos[index].completed

    updateList(tempList)
  }

  const addTodo = () => {
    let tempList = list

    if (!tempList.todos.some(todo => todo.title === newTodo)) {
      tempList.todos.push({title: newTodo, completed: false})

      updateList(tempList)
    }

    setNewTodo('')
    Keyboard.dismiss()
  }

  const deleteTodo = (index: number) => {
    const tempList = list

    list.todos.splice(index, 1)
    updateList(tempList)
  }

  const renderTodo = (todo: TodosProps, index: number) => (
    <View style={[styles.rootTodoContainer, {borderColor: color}]}>
      <View style={styles.todoContainerStyle}>
        <TouchableOpacity onPress={() => toggleTodoCompleted(index)}>
          <IconSquareOutline
            name={todo.completed ? 'ios-square' : 'ios-square-outline'}
            size={27}
            color={color}
            style={styles.iconSquare}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.todo,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              textDecorationLine: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? colors.gray : colors.black,
            },
          ]}>
          {todo.title}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          deleteTodo(index)
        }}>
        <View style={[styles.deleteBtn, {backgroundColor: color}]}>
          <Icon name="delete" size={24} color={colors.white} />
        </View>
      </TouchableOpacity>
    </View>
  )

  return (
    <KeyboardAvoidingView style={styles.root} behavior="padding">
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
          <Icon name="close" size={24} color={colors.black} />
        </TouchableOpacity>

        <View
          style={[styles.section, styles.header, {borderBottomColor: color}]}>
          <View>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.taskCount}>
              {completedCount} of {taskCount} tasks
            </Text>
          </View>
        </View>

        <View style={[styles.section, styles.body]}>
          <FlatList
            data={todos}
            renderItem={({item, index}) => renderTodo(item, index)}
            keyExtractor={item => item.title}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={[styles.section, styles.footer]}>
          <TextInput
            style={[styles.input, {borderColor: color}]}
            value={newTodo}
            onChangeText={setNewTodo}
          />
          <TouchableOpacity
            style={[styles.addTodo, {backgroundColor: color}]}
            onPress={addTodo}>
            <IconPlus name="plus" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default TodoModal

const styles = StyleSheet.create({
  root: {flex: 1},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 10,
  },
  section: {
    flex: 1,
    alignSelf: 'stretch',
  },
  header: {
    justifyContent: 'flex-end',
    marginLeft: 64,
    borderBottomWidth: 3,
    marginBottom: 10,
    paddingTop: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.black,
  },
  taskCount: {
    marginTop: 4,
    marginBottom: 16,
    color: colors.gray,
    fontWeight: '600',
  },
  todoContainer: {
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  footer: {
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    marginRight: 10,
    paddingHorizontal: 8,
    color: colors.black,
  },
  addTodo: {
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todoContainerStyle: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
  },
  todo: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 16,
    width: 180,
  },
  deleteBtn: {
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    marginRight: 5,
    borderRadius: 15,
  },
  rootTodoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    marginHorizontal: 15,
    marginVertical: 5,
  },
  iconSquare: {width: 32},
  body: {
    flex: 5,
    marginVertical: 16,
  },
})
