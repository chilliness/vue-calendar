<template>
  <div class="todo-wrap">
    <div class="caption-box frowc">
      <span class="btn btn-prev frowc" @click="handleInit(prevYM)"></span>
      <span class="text frowc">{{ currYM }}</span>
      <span class="btn btn-next frowc" @click="handleInit(nextYM)"></span>
    </div>
    <div class="ctx-box">
      <ul class="week-box frow">
        <li class="item-box frowc" v-for="(item, i) in cNavs" :key="i">
          {{ item }}
        </li>
      </ul>
      <div class="list-box frow" :ref="(el) => el && (target = el)">
        <div
          class="item-box"
          :class="{ invalid: !item.flag }"
          v-for="(item, i) in list"
          :key="i"
        >
          <div class="lunar" v-if="isLunar">{{ item.lunar }}</div>
          <div
            class="text"
            :class="{ active: isMark && item.flag && item.text === currD }"
          >
            {{ item.text }}
          </div>
          <p
            class="todo elps"
            :class="{ active: obj === item1 }"
            @click="handleView(item1, $event)"
            v-for="(item1, i1) in item.todo"
            :key="i1"
          >
            {{ item1.name }}
          </p>
        </div>
        <div class="todo-box" :class="{ hidden: !obj.title }" :style="css">
          <div class="todo-inner">
            <i class="sign" :style="css.pos"></i>
            <h2 class="title">{{ obj.title }}</h2>
            <div class="time frow">{{ "时间：" + obj.time }}</div>
            <div class="author frow">{{ "作者：" + obj.author }}</div>
            <div class="link-box frow">
              <a class="view frow" :href="obj.url">查看GitHub</a>
              <span class="flex"></span>
              <span>已查看 369 次</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toRefs, reactive, computed, onMounted } from "vue";
import calendar from "./js/calendar";

export default {
  name: "Todo",
  props: {
    // 是否启用西方模式
    isWest: {
      type: Boolean,
      default: true,
    },
    // 是否开启农历
    isLunar: {
      type: Boolean,
      default: true,
    },
    // 是否标注今天
    isMark: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    let todo = {
      name: "备忘录",
      title: "我的github项目",
      author: "shaw",
      time: "2022.08.10",
      url: "https://github.com/chilliness",
    };
    let vm = reactive({
      target: null,
      list: [],
      currYM: "",
      prevYM: "",
      nextYM: "",
      currD: "",
      obj: {},
      css: {},
    });
    vm.cNavs = computed(() => {
      let arr = [..."一二三四五六日"];
      props.isWest && arr.unshift(arr.pop());
      return arr.map((item) => "周" + item);
    });

    vm.handleDateMark = (strDate = "2022-08", isWest = false) => {
      let { zh, en, zhPad, enPad } = [
        { zh: "日", en: "Sun", zhPad: 6, enPad: 0 },
        { zh: "一", en: "Mon", zhPad: 0, enPad: 1 },
        { zh: "二", en: "Tue", zhPad: 1, enPad: 2 },
        { zh: "三", en: "Wed", zhPad: 2, enPad: 3 },
        { zh: "四", en: "Thu", zhPad: 3, enPad: 4 },
        { zh: "五", en: "Fri", zhPad: 4, enPad: 5 },
        { zh: "六", en: "Sat", zhPad: 5, enPad: 6 },
      ][new Date(strDate).getDay()];
      let [year, month] = strDate.split("-");
      let cDays = new Date(+year, +month, 0).getDate();

      // 上个月多少天
      let [pY, pM, pDays] = strDate.split("-");
      pM = --pM ? +pM : 12;
      pY = pM !== 12 ? +pY : --pY;
      pDays = new Date(pY, pM, 0).getDate();

      // 下个月多少天
      let [nY, nM, nDays] = strDate.split("-");
      nM = ++nM !== 13 ? +nM : 1;
      nY = nM !== 1 ? +nY : ++nY;
      nDays = new Date(nY, nM, 0).getDate();

      let pPad = isWest ? enPad : zhPad;
      let nPad = 42 - cDays - pPad;

      let pDate = [pY, String(pM).padStart(2, 0)].join("-");
      let cDate = [year, String(month).padStart(2, 0)].join("-");
      let nDate = [nY, String(nM).padStart(2, 0)].join("-");

      return {
        zh,
        en,
        pPad,
        nPad,
        pDays,
        cDays,
        nDays,
        pDate,
        cDate,
        nDate,
        isWest,
        cDay: String(new Date().getDate()).padStart(2, 0),
        cList: [pPad, cDays, nPad].reduce((prev, item, index) => {
          let date = [pDate, cDate, nDate][index];
          let temp = [];
          for (let i = 0; i < item; i++) {
            let text = !index ? pDays + i + 1 - item : i + 1;
            temp.push({
              text,
              date: [date, String(text).padStart(2, 0)].join("-"),
            });
          }
          return prev.concat([temp]);
        }, []),
      };
    };
    vm.handleInit = (strDate = "2022-08") => {
      let { cDate, pDate, nDate, cDay, cList } = vm.handleDateMark(
        strDate,
        props.isWest
      );
      vm.currYM = cDate.replace(/(\d+)-(\d+)/g, "$1年$2月");
      vm.prevYM = pDate;
      vm.nextYM = nDate;
      vm.currD = +cDay;
      vm.list = cList.flat().map((item) => {
        let { IMonthCn, IDayCn } = calendar.solar2lunar(
          ...item.date.match(/\d+/g)
        );
        item.lunar = IMonthCn + IDayCn;
        item.flag = item.date.includes(cDate);
        if (item.flag && Math.random() > 0.5) {
          let str = JSON.stringify(todo);
          item.todo = [JSON.parse(str)];
          Math.random() > 0.5 && item.todo.push(JSON.parse(str));
        }
        return item;
      });
      vm.obj = {};
    };
    vm.handleView = (todo, { target }, css = {}) => {
      let {
        pos = {},
        parentNode,
        offsetLeft: left,
        offsetTop: top,
        offsetWidth: tWidth,
        offsetHeight: tHeight,
      } = target;
      let {
        offsetWidth,
        offsetHeight,
        lastChild: { offsetWidth: sWidth, offsetHeight: sHeight },
      } = vm.target;
      left += parentNode.offsetLeft;
      top += parentNode.offsetTop;

      if (left < offsetWidth / 2) {
        left = left + tWidth + "px";
        pos.left = "-5px";
      } else {
        left = left - sWidth + "px";
        pos.right = "-5px";
      }

      if (top < offsetHeight / 2) {
        top = top + "px";
        pos.top = "5px";
      } else {
        top = top - sHeight + tHeight + "px";
        pos.bottom = "5px";
      }
      vm.obj = vm.obj === todo ? {} : todo;
      vm.css = { left, top, pos };
    };

    onMounted(vm.handleInit);

    return { ...toRefs(vm) };
  },
};
</script>

<style lang="scss" scoped>
.todo-wrap {
  $val: 1024px;
  font-size: 16px;
  width: $val;
  margin: 0 auto;
  padding-bottom: 50px;
  .caption-box {
    height: 50px;
    color: #fff;
    background: #17b68d;
    .btn {
      width: 30px;
      height: 30px;
      cursor: pointer;
      border: 2px solid;
      border-radius: 50%;
      &::after {
        content: "";
        padding: 6px;
        border-top: 2px solid;
        border-left: 2px solid;
      }
    }
    .btn-prev::after {
      transform: translateX(25%) rotate(-45deg);
    }
    .btn-next::after {
      transform: translateX(-25%) rotate(135deg);
    }
    .text {
      width: 150px;
    }
  }
  .ctx-box {
    font-size: 14px;
    .item-box {
      flex: 0 0 calc(100% / 7);
      color: #6f6f6f;
      box-sizing: border-box;
    }
    .week-box {
      .item-box {
        position: relative;
        height: 40px;
        color: #333;
        background: #e8ecef;
        &:nth-of-type(n + 2)::after {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          border-left: 1px solid #fff;
        }
      }
    }
    .list-box {
      position: relative;
      flex-wrap: wrap;
      &::after {
        content: "";
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        color: #e8ecef;
        border-left: 1px solid;
        pointer-events: none;
      }
      .item-box {
        position: relative;
        flex: 0 0 calc($val / 7);
        height: calc($val / 7);
        overflow: hidden;
        &.invalid {
          color: #ccc;
        }
        &::after {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          color: #e8ecef;
          border-left: 1px solid;
          border-bottom: 1px solid;
          pointer-events: none;
        }
        .lunar {
          position: absolute;
          left: 10px;
          top: 10px;
          font-size: 12px;
        }
        .text {
          position: absolute;
          right: 10px;
          top: 10px;
          &.active {
            top: 5px;
            font-size: 20px;
            color: #0a7b5d;
          }
        }
        .todo {
          margin: 6px 6px 0;
          padding: 5px 10px;
          font-size: 12px;
          color: #666;
          cursor: pointer;
          border-radius: 2px;
          background: #f2f2f2;
          &:nth-of-type(1) {
            margin-top: 35px;
          }
          &.active {
            color: #0a7b5d;
            background: #c6ede3;
          }
        }
      }
      .todo-box {
        position: absolute;
        z-index: 9;
        width: 250px;
        padding: 0 15px;
        font-size: 14px;
        color: #666;
        pointer-events: none;
        .todo-inner {
          position: relative;
          padding: 15px;
          pointer-events: auto;
          &::before {
            content: "";
            position: absolute;
            left: 1px;
            top: 1px;
            right: 1px;
            bottom: 1px;
            z-index: -1;
            background: #fff;
          }
          &::after {
            content: "";
            position: absolute;
            left: 1px;
            top: 1px;
            right: 1px;
            bottom: 1px;
            z-index: -3;
            box-shadow: 0 0 0 1px #17b68d;
          }
          .sign {
            content: "";
            position: absolute;
            z-index: -2;
            padding: 6px;
            border: 1px solid #17b68d;
            transform: rotate(45deg);
            background: #fff;
          }
          .title {
            padding-bottom: 5px;
            font-size: 16px;
            color: #333;
          }
          .time,
          .author {
            height: 20px;
            margin-top: 5px;
          }
          .link-box {
            height: 30px;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px dashed;
            .view {
              padding: 5px 10px;
              color: #fff;
              background: #17b68d;
            }
          }
        }
      }
    }
  }
}
</style>
