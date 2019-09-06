import App from './Main.svelte'
import fontawesome from '@fortawesome/fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import 'bulma/css/bulma.css'
import 'animate.css/animate.css'
import './firebase'

fontawesome.library.add(solid)

const app = new App({
  target: document.body,
  props: {
    name: 'world'
  }
})

export default app
