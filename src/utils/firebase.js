import firebase from 'firebase/app'
import 'firebase/messaging'

const firebaseConfig = {
  apiKey: 'AIzaSyD4tn_AXY6q-RfIqhD26HAxnsnTy5xlQo4',
  projectId: 'lecturealer',
  messagingSenderId: '99989017353'
}

firebase.initializeApp(firebaseConfig)

if (!firebase.messaging.isSupported()) {
  alert('알람을 사용할 수 없습니다.\n지원되지 않는 브라우저입니다.')
}

const messaging = firebase.messaging()

messaging
  .requestPermission()
  .then(() => {
    console.log('permission granted')
    return messaging.getToken()
  })
  .then(token => {
    console.log(token)
  })
  .catch(() => {
    alert(
      '알람을 사용할 수 없습니다. 지원되지 않는 브라우저거나 알람 허용을 하지 않았습니다.'
    )
  })

export { messaging }
