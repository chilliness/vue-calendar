<template>
  <div class="calendar-wrap">
    <div class="caption">
      <span class="item" @click="handleToggleMonth('prev')">
        <i class="prev"></i>
      </span>
      <time class="time">{{curYearMonth}}</time>
      <span class="item" @click="handleToggleMonth('next')">
        <i class="next"></i>
      </span>
    </div>
    <div class="container">
      <ul class="week">
        <li class="item" v-for="(item, index) in _week" :key="index">{{item}}</li>
      </ul>
      <ul class="data">
        <li class="item invalid" v-for="(item, index) in startDay" :key="index - startDay">
          <span class="text-box" v-if="isLunar">
            <span>{{prevMonthDays + 1 + index - startDay}}</span>
            <span class="lunar">{{handleLunar(prevYear, prevMonth, item)}}</span>
          </span>
          <span class="text" v-else>{{prevMonthDays + 1 + index - startDay}}</span>
        </li>
        <li class="item" v-for="(item, index) in curMonthDays" :key="index">
          <span class="text-box" :class="{active: curDay == index + 1}" v-if="isLunar">
            <span>{{item}}</span>
            <span class="lunar">{{handleLunar(curYear, curMonth, item)}}</span>
          </span>
          <span class="text" :class="{active: curDay == index + 1}" v-else>{{item}}</span>
        </li>
        <li class="item invalid" v-for="(item, index) in endDay" :key="curMonthDays + index + 1">
          <span class="text-box" v-if="isLunar">
            <span>{{item}}</span>
            <span class="lunar">{{handleLunar(nextYear, nextMonth, item)}}</span>
          </span>
          <span class="text" v-else>{{item}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import calendar from './js/calendar';

export default {
  name: 'Calendar',
  props: {
    isWest: {
      // 是否启用西方模式
      type: Boolean,
      default: true
    },
    isLunar: {
      // 是否开启农历
      type: Boolean,
      default: true
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
      curDay: 0,
      curYear: 0,
      curMonth: 0,
      prevYear: 0,
      prevMonth: 0,
      nextYear: 0,
      nextMonth: 0
    };
  },
  computed: {
    _week() {
      let arr = [...'一二三四五六日'];
      if (this.isWest) {
        arr.unshift(arr.pop());
      }
      return arr;
    }
  },
  mounted() {
    let date = new Date();
    this.curDay = date.getDate();
    this.handleFormatDate(date.getFullYear(), date.getMonth() + 1);
  },
  methods: {
    handleLunar(year, month, date) {
      let { IDayCn } = calendar.solar2lunar(year, month, date);
      return IDayCn;
    },
    handleFormatDate(year, month) {
      if (month > 12) {
        ++year;
        month = 1;
      } else if (month < 1) {
        --year;
        month = 12;
      }

      this.curYear = year;
      this.curMonth = month;

      let prevDate = new Date(year, month);
      this.prevYear = prevDate.getFullYear();
      this.prevMonth = prevDate.getMonth() - 1;

      if (this.prevMonth === 0) {
        --this.prevYear;
        this.prevMonth = 12;
      } else if (this.prevMonth === -1) {
        --this.prevYear;
        this.prevMonth = 11;
      }

      let nextDate = new Date(year, month);
      this.nextYear = nextDate.getFullYear();
      this.nextMonth = nextDate.getMonth() + 1;

      // 输出年月
      this.curYearMonth = `${year}年${String(month).padStart(2, '0')}月`;
      // 获取上月总天数
      this.prevMonthDays = this.handleMonthDays(year, month - 1);
      // 获取当前月总天数
      this.curMonthDays = this.handleMonthDays(year, month);
      // 获取下月总天数
      this.nextMonthDays = this.handleMonthDays(year, month + 1);
      this.handleStartAndEndWeek(year, month, this.curMonthDays);
    },
    handleMonthDays(year, month) {
      return new Date(year, month, 0).getDate();
    },
    handleStartAndEndWeek(year, month, monthDays) {
      this.startDay = new Date(year, month - 1, 0).getDay();
      this.endDay = 7 - new Date(year, month, 0).getDay();
      if (this.isWest) {
        this.endDay = 7 - (new Date(year, month, 0).getDay() + 1);
        if (++this.startDay === 7) {
          this.startDay = 0;
        }
      }

      if (
        Math.ceil(monthDays / 7) < 6 &&
        Math.ceil((monthDays + this.startDay + this.endDay + 7) / 7) < 7
      ) {
        if (this.startDay === 0) {
          this.startDay += 7;
        } else {
          this.endDay += 7;
        }
      }
    },
    handleToggleMonth(str = 'next') {
      let [year, month] = this.curYearMonth.match(/\d+/g);
      str === 'next' ? ++month : --month;
      this.handleFormatDate(year, month);
    }
  }
};
</script>

<style lang="scss" scoped>
.calendar-wrap {
  font-size: 16px;
  min-width: 320px;
  max-width: 640px;
  margin: 0 auto;
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
  .container {
    font-size: 14px;
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: calc(100% / 7);
      height: 40px;
      margin-top: 5px;
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
        .text-box {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
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
