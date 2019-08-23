<template>
  <div id="app">
    <ul class="nav-bar">
      <router-link tag="li" class="item-box" activeClass="active" :to="item.url" v-for="(item, index) in navList" :key="index">{{item.text}}</router-link>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      navList: [
        { url: '/calendar', text: '日　历' },
        { url: '/todo', text: '备忘录' }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.nav-bar {
  position: fixed;
  left: 0;
  top: 50%;
  z-index: 9;
  transform: translateY(-50%);
  background: #fff;
  .item-box {
    padding: 10px;
    cursor: pointer;
    border-right: 5px solid #ccc;
    transition: 0.3s;
    &.active {
      border-color: #17b68d;
    }
  }
}
</style>
