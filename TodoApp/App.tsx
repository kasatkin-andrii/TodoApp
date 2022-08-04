import React, {useEffect, useState} from 'react'
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
  Alert,
  ActivityIndicator,
  BackHandler,
} from 'react-native'
import {colors} from './src/constants'
import Icon from 'react-native-vector-icons/Entypo'
import TodoList from './src/components/TodoList'
import AddListModal, {AddListProps} from './src/components/AddListModal'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

export interface ListsProps {
  id: string
  color: string
  name: string
  todos: TodosProps[]
}

export interface TodosProps {
  title: string
  completed: boolean
}

const App = () => {
  const [addTodoVisible, setAddTodoVisible] = useState(false)
  const [lists, setLists] = useState<ListsProps[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    SignInAnonym()
  }, [])

  useEffect(() => {
    getLists()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lists])

  const SignInAnonym = async () => {
    try {
      await auth().signInAnonymously()
    } catch (error) {
      Alert.alert(
        'Error',
        'Something went wrong check your internet connection!',
        [
          {
            text: 'OK',
            onPress: () => {
              BackHandler.exitApp()
            },
          },
        ],
      )
    }
  }

  const getLists = async () => {
    const querySnapshot = await refLists()

    const tempList: ListsProps[] = [] as ListsProps[]
    querySnapshot.forEach(documentSnapshot => {
      //console.log('List ID: ', documentSnapshot.id, documentSnapshot.data())
      const list: ListsProps = {
        id: documentSnapshot.id,
        color: documentSnapshot.data().color,
        name: documentSnapshot.data().name,
        todos: documentSnapshot.data().todos,
      }
      tempList.push(list)
    })

    tempList.sort()

    setLists([...tempList])

    //querySnapshot()
    setLoading(false)
  }

  const refLists = async () =>
    await firestore()
      .collection('users')
      .doc(getUserId())
      .collection('lists')
      .get()

  const getUserId = () => {
    return auth().currentUser?.uid
  }

  const toggleAddTodoModal = () => {
    setAddTodoVisible(!addTodoVisible)
  }

  const addList = async (listItem: AddListProps) => {
    try {
      await firestore()
        .collection('users')
        .doc(getUserId())
        .collection('lists')
        .add(listItem)
    } catch (error) {
      Alert.alert(
        'Error',
        'Something went wrong check your internet connection!',
        [
          {
            text: 'OK',
            onPress: () => {
              BackHandler.exitApp()
            },
          },
        ],
      )
    }
  }

  const updateList = async (list: ListsProps) => {
    try {
      await firestore()
        .collection('users')
        .doc(getUserId())
        .collection('lists')
        .doc(list.id)
        .update(list)
    } catch (error) {
      Alert.alert(
        'Error',
        'Something went wrong check your internet connection!',
        [
          {
            text: 'OK',
            onPress: () => {
              BackHandler.exitApp()
            },
          },
        ],
      )
    }
  }

  const deleteList = async (id: string) => {
    try {
      await firestore()
        .collection('users')
        .doc(getUserId())
        .collection('lists')
        .doc(id)
        .delete()
    } catch (error) {
      Alert.alert(
        'Error',
        'Something went wrong check your internet connection!',
        [
          {
            text: 'OK',
            onPress: () => {
              BackHandler.exitApp()
            },
          },
        ],
      )
    }
  }

  const renderList = (list: ListsProps) => (
    <TodoList list={list} updateList={updateList} deleteList={deleteList} />
  )

  if (loading) {
    return (
      <View style={styles.root}>
        <ActivityIndicator size={'large'} color={colors.blue} />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.root}>
      <Modal
        animationType="slide"
        visible={addTodoVisible}
        onRequestClose={toggleAddTodoModal}>
        <AddListModal closeModal={toggleAddTodoModal} addList={addList} />
      </Modal>
      <View style={styles.container}>
        <View style={styles.divider} />
        <Text style={styles.title}>
          Todo <Text style={styles.titleList}>List</Text>
        </Text>
        <View style={styles.divider} />
      </View>
      <View style={styles.addListContainer}>
        <TouchableOpacity style={styles.addList} onPress={toggleAddTodoModal}>
          <Icon name="plus" size={16} color={colors.blue} />
        </TouchableOpacity>
        <Text style={styles.add}>Add List</Text>
      </View>
      <View style={styles.todoListContainer}>
        <FlatList
          data={lists}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => renderList(item)}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.ListsContainer}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  container: {
    flexDirection: 'row',
    marginTop: 10,
  },
  divider: {
    backgroundColor: colors.lightBlue,
    height: 1.5,
    flex: 1,
    alignSelf: 'center',
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: colors.black,
    paddingHorizontal: 50,
  },
  titleList: {
    fontWeight: '300',
    color: colors.blue,
  },
  addListContainer: {
    marginVertical: 20,
  },
  addList: {
    borderWidth: 2,
    borderColor: colors.lightBlue,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  add: {
    color: colors.blue,
    fontWeight: '600',
    fontSize: 14,
    marginTop: 8,
  },
  todoListContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: colors.lightBlue,
    paddingHorizontal: 13,
  },
  ListsContainer: {
    paddingHorizontal: 32,
  },
})

export default App
