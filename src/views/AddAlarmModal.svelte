<script>
  import { createEventDispatcher } from "svelte";
  import { getNotificationsContext } from "svelte-notifications";
  import { myAlarms } from "../stores";
  import serverApi from "../utils/ServerApi";
  import { messaging } from "../utils/firebase";
  import AddAlarmByList from "./AddAlarmByList.svelte";

  export let active;

  let selectedLectureId = null;

  $: disableAddAlarm = selectedLectureId === null;

  const dispatch = createEventDispatcher();
  const closeModal = () => dispatch("close");

  const resetModal = () => {
    selectedLectureId = null;
  };

  const onLectureSelected = lectureId => {
    if (selectedLectureId === lectureId) selectedLectureId = null;
    else selectedLectureId = lectureId;
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
      const userId = await messaging.getToken();
      const alarms = await serverApi.addAlarm(userId, selectedLectureId);

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
      <p class="modal-card-title">알람 추가하기</p>

      <span class="button">
        <i class="fa fa-search" />
        <span>강의 검색</span>
      </span>

      <!-- <button class="delete" aria-label="close" on:click={closeModal} /> -->
    </header>

    <AddAlarmByList {onLectureSelected} {selectedLectureId} />

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
