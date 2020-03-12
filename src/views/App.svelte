<script>
  import { onMount } from "svelte";
  import Notifications, { getNotificationsContext } from "svelte-notifications";
  import { myAlarms } from "../stores";
  import Navbar from "../components/Navbar.svelte";
  import AlarmCard from "../components/AlarmCard.svelte";
  import AddAlarmModal from "./AddAlarmModal.svelte";
  import serverApi from "../utils/ServerApi";
  import { messaging } from "../utils/firebase";

  const { addNotification } = getNotificationsContext();

  $: disableAdd = $myAlarms.length >= 5;

  const loadMyAlarms = async () => {
    const token = await messaging.getToken();
    const alarms = await serverApi.myAlarms(token);
    myAlarms.set(alarms);
  };

  const notifyDelete = () => {
    addNotification({
      text: "알람이 삭제됐습니다.",
      removeAfter: 5000
    });

    const audio = new Audio("iphone_notification.mp3");
    audio.play();
  };

  const notifyAlarm = notification => {
    addNotification({
      text: notification.title,
      position: "top-center",
      theme: "is-warning",
      removeAfter: 30000
    });
  };

  messaging.onMessage(payload => {
    loadMyAlarms();
    notifyAlarm(payload.notification);

    const audio = new Audio("iphone_notification.mp3");
    audio.play();
  });

  onMount(loadMyAlarms);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") loadMyAlarms();
  });

  let activeModal = true;

  const activateAddModal = () => {
    activeModal = true;
  };

  const closeModal = () => {
    activeModal = false;
  };

  const onAlarmDelete = async e => {
    const lectureId = e.detail.id;
    const token = await messaging.getToken();
    const alarms = await serverApi.deleteAlarm(token, lectureId);
    myAlarms.set(alarms);
    notifyDelete();
  };
</script>

<style>
  .container-offset {
    padding-top: 52px;
    margin: 16px;
  }
</style>

<Navbar onClickAdd={activateAddModal} {disableAdd} />

<div class="container is-fluid container-offset">
  <div class="title is-4">내가 등록한 알람 {$myAlarms.length} / 5개</div>

  <div class="columns is-tablet is-multiline">
    {#each $myAlarms as alarm}
      <AlarmCard {alarm} on:delete={onAlarmDelete} />
    {/each}
  </div>
  <AddAlarmModal active={activeModal} on:close={closeModal} />
</div>
