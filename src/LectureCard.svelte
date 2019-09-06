<script>
  import { createEventDispatcher } from "svelte";

  export let lecture;
  export let index;
  export let selectedLectureIndex;

  $: selected = index === selectedLectureIndex;

  const dispatch = createEventDispatcher();
  const onSelected = () => dispatch("select", index);
</script>

<style>
  .box {
    margin-bottom: 0.8rem !important;
  }
</style>

<div class="box" class:has-background-primary={selected} on:click={onSelected}>
  <div class="content">
    <p>
      <strong>{lecture.name}</strong>
      <br />
      <small>{lecture.professor} 교수님 / {lecture.time}</small>
    </p>
  </div>

</div>
