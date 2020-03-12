<script>
  import { onDestroy } from "svelte";
  import LectureCard from "../components/LectureCard.svelte";
  import courseMap from "../data/courses.js";
  import serverApi from "../utils/ServerApi";

  export let onLectureSelected;
  export let selectedLectureId;

  let campusSelect = "서울";
  let courseSelect = "전공";
  let selectedDepartment = "";
  let lectures = [];

  const resetModal = () => {
    console.log("on destory");
    (selectedDepartment = ""), (lectures = []), onLectureSelected(null);
  };

  $: courseMapSelect = campusSelect + courseSelect;
  $: courses = courseMap[courseMapSelect];
  $: courseMapSelect, resetModal();
  $: selectedDepartment, onLectureSelected(null);
  $: if (selectedDepartment)
    lectures = serverApi.findLectures(selectedDepartment);
</script>

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
    {#each lectures as lecture}
      <LectureCard {lecture} {selectedLectureId} {onLectureSelected} />
    {/each}

  {/await}

</section>
