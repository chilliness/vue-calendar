<template>
  <div>
    <div class="nav-box">
      <div
        class="item-box frowc"
        :class="{ active: $route.name === item.name }"
        @click="$router.push({ name: item.name })"
        v-for="(item, i) in listNav"
        :key="i"
      >
        {{ item.text }}
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { toRefs, reactive } from "vue";

export default {
  name: "App",
  setup(props) {
    let vm = reactive({
      listNav: [
        { text: "日　历", name: "calendar" },
        { text: "备忘录", name: "todo" },
      ],
    });

    return { ...toRefs(vm) };
  },
};
</script>

<style lang="scss" scoped>
.nav-box {
  position: fixed;
  left: 0;
  top: 50%;
  z-index: 9;
  font-size: 14px;
  transform: translate3d(-60px, -50%, 0);
  transition: 0.3s;
  background: #fff;
  &:hover {
    transform: translate3d(0, -50%, 0);
  }
  .item-box {
    width: 60px;
    height: 30px;
    cursor: pointer;
    border-right: 5px solid #ccc;
    &.active {
      border-color: #17b68d;
    }
  }
}
</style>
