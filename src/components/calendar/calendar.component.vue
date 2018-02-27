<template>
  <div class="calendar-wrap">
    <div class="caption">
      <span class="item" @click="onToggleMonth('prev')">
        <i class="prev"></i>
      </span>
      <time class="time">{{curYearMonth}}</time>
      <span class="item" @click="onToggleMonth('next')">
        <i class="next"></i>
      </span>
    </div>
    <main class="main">
      <ul class="week">
        <li class="item" v-for="(item, index) of week" :key="index">{{item}}</li>
      </ul>
      <ul class="data">
        <li class="item invalid" v-for="(item, index) of startDay" :key="index - startDay">
          <span class="text">{{prevMonthDays + 1 + index - startDay}}</span>
        </li>
        <li class="item" v-for="(item, index) of curMonthDays" :key="index">
          <span class="text" :class="{active: curDay == index + 1}">{{item}}</span>
        </li>
        <li class="item invalid" v-for="(item, index) of endDay" :key="curMonthDays + index + 1">
          <span class="text">{{item}}</span>
        </li>
      </ul>
    </main>
  </div>
</template>

<script>
export default {
  props: {
    isWest: {
      // 是否启用西方模式
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prevMonthDays: 0,
      curMonthDays: 0,
      nextMonthDays: 0,
      curYearMonth: '',
      startDay: 0,
      endDay: 0,
      curDay: 0
    };
  },
  computed: {
    week() {
      let arr = [...'一二三四五六日'];
      if (this.isWest) {
        arr.unshift(arr.pop());
      }
      return arr;
    }
  },
  created() {
    let date = new Date();
    this.curDay = date.getDate();
    this.onFormatDate(date.getFullYear(), date.getMonth() + 1);
  },
  methods: {
    onFormatDate(year, month) {
      month > 12 && (++year, (month = 1));
      month < 1 && (--year, (month = 12));
      // 输出年月
      this.curYearMonth = `${year}年${month.toString().padStart(2, 0)}月`;
      // 获取上月总天数
      this.prevMonthDays = this.onMonthDays(year, month - 1);
      // 获取当前月总天数
      this.curMonthDays = this.onMonthDays(year, month);
      // 获取下月总天数
      this.nextMonthDays = this.onMonthDays(year, month + 1);
      this.onStartAndEndWeek(year, month);
    },
    onMonthDays(year, month) {
      // 获取指定月份总天数
      let date = new Date(year, month, 0);
      return date.getDate();
    },
    onStartAndEndWeek(year, month) {
      this.startDay = new Date(year, month - 1, 0).getDay();
      this.endDay =
        new Date(year, month, 0).getDay() &&
        7 - new Date(year, month, 0).getDay();
      if (this.isWest) {
        this.endDay = 7 - (new Date(year, month, 0).getDay() + 1);
        if (++this.startDay == 7) {
          this.startDay = 0;
        }
      }
    },
    onToggleMonth(str = 'next') {
      let [year, month] = this.curYearMonth.match(/\d+/g);
      str == 'next' ? ++month : --month;
      this.onFormatDate(year, month);
    }
  }
};
</script>

<style lang="scss" scoped>
.calendar-wrap {
  font-size: 16px;
  .caption {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 50px;
    color: #fff;
    background: #17b68d;
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      cursor: pointer;
    }
    .prev,
    .next {
      position: relative;
      width: 12px;
      height: 12px;
      border-top: 1px solid #fff;
      border-left: 1px solid #fff;
    }
    .prev {
      right: -3px;
      transform: rotate(-45deg);
    }
    .next {
      right: 3px;
      transform: rotate(135deg);
    }
    .time {
      padding: 0 25px;
    }
  }
  .main {
    font-size: 14px;
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 0 0 calc(100% / 7);
      width: calc(100% / 7);
      height: 40px;
    }
    .week {
      display: flex;
      align-items: center;
      .item {
        color: #17b68d;
      }
    }
    .data {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .item {
        &.invalid {
          color: #ccc;
        }
        .text {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          &.active {
            color: #fff;
            background: #17b68d;
          }
        }
      }
    }
  }
}
</style>
