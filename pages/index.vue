<template>
  <div>
    <!-- <p>{{ isNotLoggedIn }}</p> -->
    <!-- <h2 v-if="!isNotLoggedIn">Bienvenido: {{ user.email }}</h2> -->
    <v-row justify="end">
      <v-dialog
        v-if="isNotLoggedIn"
        v-model="dialog"
        persistent
        max-width="350px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon>
            <v-icon>mdi-login</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Login</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="login.email"
                    label="Correo electronico"
                    type="email"
                    required
                    :disabled="loading"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="login.password"
                    label="Contraseña"
                    type="password"
                    required
                    :disabled="loading"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              :disabled="loading"
              @click="dialog = false"
            >
              Cerrar
            </v-btn>
            <v-btn color="blue darken-1" text :loading="loading" @click="logIn">
              Iniar Sesión
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn v-if="!isNotLoggedIn" icon @click="logOut">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-row>
    <v-row v-if="!isNotLoggedIn" justify="end">
      <v-dialog v-model="eventForm" persistent max-width="350px">
        <v-card>
          <v-card-text class="pt-6">
            <v-container>
              <form-event
                v-model="event"
                @save="handleCreate"
                @update="handleUpdate"
                @close="close"
              ></form-event>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row class="fill-height" justify="center" align="center">
      <v-col cols="12">
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              HOY
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small> mdi-chevron-left </v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small> mdi-chevron-right </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right> mdi-menu-down </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>DÍA</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>SEMANA</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>MES</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 DIAS</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-sheet :height="height">
          <v-calendar
            ref="calendar"
            v-model="value"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :type="type"
            locale="es-VE"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @click:day="addEvent($event, 'day')"
            @click:time="addEvent($event, 'day')"
            @change="updateRange"
          ></v-calendar>
          <template v-slot:day-body="{ date, week }">
            <div
              class="v-current-time"
              :class="{ first: date === week[0].date }"
              :style="{ top: nowY }"
            ></div>
          </template>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card
              color="grey lighten-4"
              min-width="350px"
              flat
              :loading="loading"
              :disabled="loading"
            >
              <v-toolbar :color="selectedEvent.color" dark>
                <v-btn
                  v-if="!isNotLoggedIn"
                  icon
                  @click="handleEdit(selectedEvent)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="!isNotLoggedIn"
                  icon
                  @click="handleDelete(selectedEvent.uid)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.details"></span>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="secondary" @click="selectedOpen = false">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import FormEvent from '~/components/FormEvent.vue'
export default {
  components: { FormEvent },
  layout: 'full-width',
  middleware: 'auth',
  data: () => ({
    login: {
      email: '',
      password: '',
    },
    event: {},
    height: 600,
    eventForm: false,
    loading: false,

    focus: '',
    dialog: false,
    value: '',
    ready: false,
    type: 'week',
    typeToLabel: {
      month: 'MES',
      week: 'SEMANA',
      day: 'DÍA',
      '4day': '4 DIAS',
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: [
      'blue',
      'indigo',
      'deep-purple',
      'cyan',
      'green',
      'orange',
      'grey darken-1',
    ],
    names: [
      'Meeting',
      'Holiday',
      'PTO',
      'Travel',
      'Event',
      'Birthday',
      'Conference',
      'Party',
    ],
  }),
  async fetch() {
    await this.getEvent()
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
    ...mapGetters({
      isNotLoggedIn: 'isNotLoggedIn',
    }),
    cal() {
      return this.ready ? this.$refs.calendar : null
    },
    nowY() {
      return this.cal ? this.cal.timeToY(this.cal.times.now) + 'px' : '-10px'
    },
  },
  mounted() {
    // this.$refs.calendar.checkChange()
    this.ready = true
    this.scrollToTime()
    this.updateTime()
    // alert(
    //   'La resolución de tu pantalla es: ' + screen.width + ' x ' + screen.height
    // )
    // document.querySelector('body')
    const height = document.querySelector('body').clientHeight
    this.height = (85 * height) / 100 - 64
    console.log(height)
  },
  methods: {
    async logIn() {
      this.loading = true
      try {
        const { email, password } = this.login
        await this.$fire.auth.signInWithEmailAndPassword(email, password)
        this.login = {
          email: '',
          password: '',
        }
        this.dialog = false
      } catch ({ message }) {
        this.message = message
      }
      this.loading = false
    },
    async logOut() {
      await this.$fire.auth.signOut()
      this.$store.dispatch('onAuthStateChangedAction', { authUser: null })
    },

    async handleCreate({ complete, id }) {
      if (complete) {
        const doc = await this.$fire.firestore
          .collection('events')
          .doc(id)
          .get()
        this.events.push(doc.data())
        this.eventForm = false
      }
    },
    handleUpdate({ complete, event }) {
      if (complete) {
        const index = this.events.findIndex(
          (element) => element.uid === event.uid
        )
        this.$set(this.events, index, event)
        this.eventForm = false
      }
    },
    handleEdit(payload) {
      this.eventForm = true
      this.event = { ...payload }
      this.selectedOpen = false
    },
    async handleDelete(uid) {
      this.loading = true
      const index = this.events.findIndex((el) => el.uid === uid)
      await this.$fire.firestore.collection('events').doc(uid).delete()
      this.events.splice(index, 1)
      this.loading = false
      this.selectedOpen = false
    },
    addEvent({ date, hour, time }) {
      if (!this.isNotLoggedIn) {
        this.event.startDate = date
        time !== '' && (this.event.startHour = `${hour}:00`)
        this.eventForm = true
      }
    },
    addTime(event, text) {
      // this.event.startDate = date
      // this.eventForm = true
      console.log(event)
      console.log(text)
    },
    viewDay({ date }) {
      this.focus = date
      this.type = 'day'
    },
    async getEvent() {
      const events = await this.$fire.firestore.collection('events').get()
      events.forEach((doc) => console.log(doc))
      events.forEach((doc) => this.events.push({ uid: doc.id, ...doc.data() }))
      // console.log())
    },
    close(e) {
      this.eventForm = e
      this.event = {}
    },
    getEventColor(event) {
      return event.color
    },
    setToday() {
      this.focus = ''
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => {
          this.selectedOpen = true
        }, 10)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    updateRange({ start, end }) {
      // const events = []
      // const min = new Date(`${start.date}T00:00:00`)
      // const max = new Date(`${end.date}T23:59:59`)
      // const days = (max.getTime() - min.getTime()) / 86400000
      // const eventCount = this.rnd(days, days + 20)
      // for (let i = 0; i < eventCount; i++) {
      //   const allDay = this.rnd(0, 3) === 0
      //   const firstTimestamp = this.rnd(min.getTime(), max.getTime())
      //   const first = new Date(firstTimestamp - (firstTimestamp % 900000))
      //   const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
      //   const second = new Date(first.getTime() + secondTimestamp)
      //   events.push({
      //     name: this.names[this.rnd(0, this.names.length - 1)],
      //     start: first,
      //     end: second,
      //     color: this.colors[this.rnd(0, this.colors.length - 1)],
      //     timed: !allDay,
      //   })
      // }
      // this.events = events
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },

    getCurrentTime() {
      return this.cal
        ? this.cal.times.now.hour * 60 + this.cal.times.now.minute
        : 0
    },
    scrollToTime() {
      const time = this.getCurrentTime()
      const first = Math.max(0, time - (time % 30) - 30)

      this.cal.scrollToTime(first)
    },
    updateTime() {
      setInterval(() => this.cal.updateTimes(), 60 * 1000)
    },
  },
}
</script>
<style lang="scss">
.v-current-time {
  height: 2px;
  background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.first::before {
    content: '';
    position: absolute;
    background-color: #ea4335;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: -6.5px;
  }
}
</style>
