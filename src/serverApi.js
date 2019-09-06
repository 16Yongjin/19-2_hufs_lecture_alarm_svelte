class ServerApi {
  request(...args) {
    return fetch(...args).then(res =>
      res.ok ? res.json() : Promise.reject(new Error(res.statusText))
    )
  }

  constructor(baseUrl) {
    console.log('initialize serverapi')
    this.baseUrl = baseUrl
  }

  myAlarms(user) {
    return this.request(`${this.baseUrl}/myalarm/${user}`)
  }

  addAlarm(id, lectureId) {
    const body = JSON.stringify({ user: { id }, lectureId })

    console.log(body)

    return this.request(`${this.baseUrl}/myalarm`, { method: 'POST', body })
  }

  deleteAlarm(user, lectureId) {
    return fetch(`${this.baseUrl}/myalarm/${user}/${lectureId}`, {
      method: 'DELETE'
    }).then(res => res.json())
  }

  findLectures(courseId) {
    return this.request(`${this.baseUrl}/lectures/${courseId}`)
  }
}

// const serverApi = new ServerApi('https://api.lecture.hufs.app')
const serverApi = new ServerApi('http://localhost:8080')

export default serverApi
