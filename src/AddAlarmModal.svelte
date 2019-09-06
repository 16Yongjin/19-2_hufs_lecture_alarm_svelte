<script>
  import { createEventDispatcher } from "svelte";
  import { myAlarms } from "./stores.js";
  import LectureCard from "./LectureCard.svelte";
  import courseMap from "./courses.js";
  import serverApi from "./ServerApi";
  import { messaging } from "./firebase";
  import { getNotificationsContext } from "svelte-notifications";

  export let active;

  let campusSelect = "서울";
  let courseSelect = "전공";
  let selectedDepartment = "";
  let lectures = [];
  let selectedLectureIndex = null;

  const resetModal = () => {
    (selectedDepartment = ""), (lectures = []), (selectedLectureIndex = null);
  };

  $: courseMapSelect = campusSelect + courseSelect;
  $: courses = courseMap[courseMapSelect];
  $: courseMapSelect, resetModal();
  $: selectedDepartment, (selectedLectureIndex = null);
  $: if (selectedDepartment)
    lectures = serverApi.findLectures(selectedDepartment);
  $: disableAddAlarm = !selectedDepartment || selectedLectureIndex === null;

  const dispatch = createEventDispatcher();

  const closeModal = () => dispatch("close");

  const onLectureSelected = e => {
    if (selectedLectureIndex === e.detail) selectedLectureIndex = null;
    else selectedLectureIndex = e.detail;
  };

  const { addNotification } = getNotificationsContext();
  const notifyAdd = () => {
    addNotification({
      text: "알람이 등록되었습니다.",
      removeAfter: 4000
    });
  };

  const notifyError = () => {
    addNotification({
      text: "알람 등록에 실패했습니다.",
      theme: "is-danger",
      removeAfter: 4000
    });
  };

  const addAlarm = async () => {
    if (disableAddAlarm) return;

    if ($myAlarms.length >= 5) {
      return addNotification({
        text: "알람은 5개까지 등록할 수 있습니다.",
        theme: "is-warning",
        removeAfter: 4000
      });
    }

    try {
      const lecture = (await lectures)[selectedLectureIndex];
      const user = await messaging.getToken();
      const alarms = await serverApi.addAlarm(user, lecture.id);

      myAlarms.set(alarms);

      resetModal();
      closeModal();
      notifyAdd();
    } catch (e) {
      console.error(e);
      notifyError();
    }
  };
</script>

<style>
  .modal-margin {
    padding: 0 16px;
  }
</style>

<div class="modal" class:is-active={active}>
  <div class="modal-background" on:click={closeModal} />

  <div class="modal-card modal-margin animated fadeInUp">
    <header class="modal-card-head">
      <p class="modal-card-title">알람 추가 하기</p>
      <button class="delete" aria-label="close" on:click={closeModal} />
    </header>
    <section class="modal-card-body">

      <div class="level is-mobile">
        <div class="level-right">
          <div class="level-item">
            <p class="subtitle is-6">캠퍼스:</p>
          </div>
          <div class="level-item">
            <div class="field">
              <span class="control">
                <span
                  class="button is-rounded"
                  class:is-primary={campusSelect === '서울'}
                  on:click={() => (campusSelect = '서울')}>
                  <p>서울</p>
                </span>
              </span>
              <span class="control">
                <span
                  class="button is-rounded"
                  class:is-primary={campusSelect === '글로벌'}
                  on:click={() => (campusSelect = '글로벌')}>
                  <p>글로벌</p>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="level is-mobile">
        <div class="level-left">
          <div class="level-item">
            <p class="subtitle is-6">과정:</p>
          </div>
          <div class="level-item">
            <div class="field">
              <span class="control">
                <span
                  class="button is-rounded"
                  class:is-primary={courseSelect === '전공'}
                  on:click={() => (courseSelect = '전공')}>
                  <p>전공</p>
                </span>
              </span>
              <span class="control">
                <span
                  class="button is-rounded"
                  class:is-primary={courseSelect === '교양'}
                  on:click={() => (courseSelect = '교양')}>
                  <p>교양</p>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="level" style="width: 100%;">
        <div class="level-left">
          <div class="level-item">
            <div class="select is-rounded" style="width: 100%;">
              <select bind:value={selectedDepartment} style="width: 100%;">
                <option disabled selected value="" style="width: 100%;">
                  {courseSelect}를 선택하세요.
                </option>
                {#each courses as course}
                  <option value={course[1]}>{course[0]}</option>
                {/each}
              </select>
            </div>
          </div>
        </div>
      </div>

      {#await lectures then lectures}

        {#if lectures.length}
          <p class="subtitle is-6">강의를 선택하세요</p>
        {/if}
        {#each lectures as lecture, index}
          <LectureCard
            {lecture}
            {index}
            {selectedLectureIndex}
            on:select={onLectureSelected} />
        {/each}

      {/await}

    </section>
    <footer class="modal-card-foot">
      <button
        class="card-footer-item button is-success"
        on:click={addAlarm}
        disabled={disableAddAlarm}>
        추가
      </button>
      <button
        class="card-footer-item button"
        on:click={() => (closeModal(), resetModal())}>
        취소
      </button>
    </footer>
  </div>
</div>
