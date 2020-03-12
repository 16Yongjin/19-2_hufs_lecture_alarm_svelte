class ServerApi {
  request(...args) {
    return fetch(...args).then(res =>
      res.ok ? res.json() : Promise.reject(new Error(res.statusText))
    );
  }

  constructor(baseUrl) {
    console.log("initialize serverapi");
    this.baseUrl = baseUrl;
  }

  myAlarms(user) {
    return this.request(`${this.baseUrl}/users/${user}`);
  }

  addAlarm(userId, lectureId) {
    const body = JSON.stringify({ userId, lectureId });
    const headers = { "Content-Type": "application/json" };

    console.log(body);

    return this.request(`${this.baseUrl}/users`, {
      method: "POST",
      headers,
      body
    });
  }

  deleteAlarm(userId, lectureId) {
    return this.request(`${this.baseUrl}/users/${userId}/${lectureId}`, {
      method: "DELETE"
    });
  }

  findLectures(courseId) {
    return this.request(`${this.baseUrl}/lectures/${courseId}`);
  }

  searchLectures(query) {
    return this.request(
      `${this.baseUrl}/lectures/search?name=${encodeURIComponent(query)}`
    );
  }
}

// const serverApi = new ServerApi('https://api.lecture.hufs.app')
const serverApi = new ServerApi("http://localhost:3000");

export default serverApi;
