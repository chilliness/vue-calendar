<template>
  <div class="comp-wrap">
    <div class="caption-box frow">
      <span class="btn btn-prev frowc" @click="handleInit(prevYM)"></span>
      <span class="text frowc">{{ currYM }}</span>
      <span class="btn btn-next frowc" @click="handleInit(nextYM)"></span>
    </div>
    <div class="ctx-box">
      <ul class="week-box frow">
        <li class="item-box frowc" v-for="(item, i) in cNavs" :key="i">{{ item }}</li>
      </ul>
      <div class="list-box frow">
        <div class="item-box frowc" :class="{ invalid: !item.flag }" v-for="(item, i) in list" :key="i">
          <div class="text-box fcolc" :class="{ active: isMark && item.flag && item.text === currD }">
            <div class="text">{{ item.text }}</div>
            <div class="lunar" v-if="isLunar">{{ item.lunar }}</div>
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
    let vm = reactive({
      list: [],
      currYM: "",
      prevYM: "",
      nextYM: "",
      currD: "",
    });

    vm.cNavs = computed(() => {
      let arr = [..."一二三四五六日"];
      props.isWest && arr.unshift(arr.pop());
      return arr;
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
            temp.push({ text, date: [date, String(text).padStart(2, 0)].join("-") });
          }
          return prev.concat([temp]);
        }, []),
      };
    };
    vm.handleInit = (strDate = "2022-08") => {
      let { cDate, pDate, nDate, cDay, cList } = vm.handleDateMark(strDate, props.isWest);
      vm.currYM = cDate.replace(/(\d+)-(\d+)/g, "$1年$2月");
      vm.prevYM = pDate;
      vm.nextYM = nDate;
      vm.currD = +cDay;
      vm.list = cList.flat().map((item) => {
        let { IDayCn } = calendar.solar2lunar(...item.date.match(/\d+/g));
        item.lunar = IDayCn;
        item.flag = item.date.includes(cDate);
        return item;
      });
    };

    onMounted(vm.handleInit);

    return { ...toRefs(vm) };
  },
};
</script>

<style lang="scss" scoped>
.comp-wrap {
  font-size: 16px;
  min-width: 320px;
  max-width: 640px;
  margin: 0 auto;
  .caption-box {
    justify-content: space-around;
    height: 50px;
    color: #fff;
    background: #17b68d;
    .btn {
      width: 30px;
      height: 30px;
      cursor: pointer;
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
      width: calc(100% / 7);
      height: 40px;
      margin-top: 5px;
    }
    .week-box {
      .item-box {
        color: #17b68d;
      }
    }
    .list-box {
      flex-wrap: wrap;
      .item-box {
        &.invalid {
          color: #ccc;
        }
        .text-box {
          width: 40px;
          height: 40px;
          &.active {
            color: #fff;
            background: #17b68d;
          }
          .lunar {
            margin-top: 5px;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
