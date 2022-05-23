import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useContext
} from 'react';
import { TouchableOpacity, View, Text, Image, TextInput } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';

import { auth, database } from '../config/firebase';
import { AuthenticatedUserContext } from '../App';

export default function Chat({ navigation }) {
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthenticatedUserContext)
  const [text, setText] = useState('')
  const [zinutes, setZinutes] = useState([])
  const [showSend, setShowSend] = useState(false)
  const onSignOut = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10
          }}
          onPress={onSignOut}
        >
          <Text>Logout</Text>
        </TouchableOpacity>
      )
    });
  }, [navigation]);

  useEffect(() => {
    const collectionRef = collection(database, 'chats');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      setMessages(
        querySnapshot.docs.map(doc => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    setZinutes(messages.reverse())

    console.log(messages); console.log(user)
  }, [messages])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(database, 'chats'), {
      _id,
      createdAt,
      text,
      user
    });
  }, []);
  return (
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      {zinutes.map(item => (
        <View key={new Date(item.createdAt).getTime()}
          style={[styles.messagesContainer, user.email == item.user._id ? styles.mano : '']}>

          <Image source={item.user.avatar}
            style={styles.tinyLogo} />
          <View style={styles.userInfo}>
            {/* <Text  >
              {item.user._id}
            </Text> */}

            <View style={[styles.message, user.email == item.user._id ? styles.myMessage : '']}>
              <Text>
                {item.text}
              </Text>
              {/* datos */}
              <Text style={styles.time}>
                {new Date().getFullYear() != new Date(item.createdAt).getFullYear() ? new Date(item.createdAt).getFullYear() + '-' : ''}
                {new Date().getDate() != new Date(item.createdAt).getDate() ? new Date(item.createdAt).getMonth() + '-' + new Date(item.createdAt).getDate() : ''}
              </Text>
              {new Date().getFullYear() == new Date(item.createdAt).getFullYear() &&
                new Date().getMonth() == new Date(item.createdAt).getMonth() &&
                new Date().getDate() == new Date(item.createdAt).getDate() ?
                <Text style={styles.time}>  {new Date(item.createdAt).getHours()}:
                  {new Date(item.createdAt).getMinutes()}</Text>
                : ''
              }
            </View>
          </View>
        </View>
      ))}
      <View style={styles.sender}>
        <TextInput
          style={styles.typing}
          defaultValue={text}

          placeholder={'Type a message...'}
          onChange={(value) => {
            setText(value.currentTarget.value)
            if (value.currentTarget.value) {
              setShowSend(true)
            } else {
              setShowSend(false)
            }
          }} />
        <View style={showSend ? "" : { display: 'none' }}>
          <TouchableOpacity onPress={() => {
            onSend({
              createdAt: new Date(),
              text: text,
              user: {
                _id: user.email
              }
            })
          }}> Send</TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = {
  tinyLogo: {
    width: 40,
    height: 40,
    alignSelf: 'center'
  },
  messagesContainer: {
    margin: 20,
    flexDirection: 'row'
  },
  userInfo: {
    marginLeft: 20,
    marginRight: 20,

  },
  mano: {
    flexDirection: "row-reverse"
  },
  message: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#d3d3d3',
    borderRadius: 20

  },
  time: {
    fontSize: 12,
    color: 'grey',
    alignSelf: 'flex-end'
  },
  sender: {
    padding: 20,
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  typing: {
    flex: 1,
    border: 'none',
    outlineStyle: 'none'
  }
}