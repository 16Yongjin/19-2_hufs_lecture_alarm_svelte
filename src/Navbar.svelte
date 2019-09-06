<script>
  export let onClickAdd;
  export let disableAdd;
</script>

<style>
  .bottom-shadow {
    box-shadow: 0 2px 5px grey;
  }
</style>

<nav class="navbar level is-mobile is-fixed-top bottom-shadow">

  <div class="level-left navbar-item">
    <a class="level-item " href="/">
      <img
        src="noti-icon.png"
        alt="강의 빈자리 알람 아이콘"
        width="28"
        height="28" />
    </a>
    <p class="level-item title is-4">강의 빈자리 알람</p>
  </div>

  <div class="level-right navbar-item">
    <p class="level-item">
      <button class="button" disabled={disableAdd} on:click={onClickAdd}>
        <span />
        <span class="icon is-large">
          <i class="fas fa-plus" />
        </span>
        <span class="is-hidden-mobile">알람 추가</span>

      </button>
    </p>
  </div>

</nav>
