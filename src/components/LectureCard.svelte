<script>
  export let lecture;
  export let selectedLectureId;
  export let onLectureSelected;

  $: selected = lecture.id === selectedLectureId;
</script>

<style>
  .box {
    margin-bottom: 0.8rem !important;
  }
</style>

<div
  class="box"
  class:has-background-primary={selected}
  on:click={() => onLectureSelected(lecture.id)}>
  <div class="content">
    <p>
      <strong>{lecture.name}</strong>
      <br />
      <small>{lecture.professor} / {lecture.time}</small>
    </p>
  </div>

</div>
