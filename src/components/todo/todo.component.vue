<template>
  <div class="todo-wrap">
    <div class="caption">
      <span class="item" @click="onToggleMonth('prev')">
        <i class="prev"></i>
      </span>
      <time class="time">{{curYearMonth}}</time>
      <span class="item" @click="onToggleMonth('next')">
        <i class="next"></i>
      </span>
    </div>
    <main class="main todo-main">
      <ul class="week">
        <li class="item" v-for="(item, index) of week" :key="index">{{item}}</li>
      </ul>
      <ul class="data clear">
        <li class="item invalid" v-for="(item, index) of startDay" :key="index - startDay">
          <div class="text-box">
            <span class="text">{{prevMonthDays + 1 + index - startDay}}</span>
          </div>
        </li>
        <li class="item" v-for="(item, index) of curMonthDays" :key="index">
          <div class="text-box">
            <span class="text" :class="{active: curDay == index + 1}">{{item.date}}</span>
            <p class="todo" :class="{on: index == isItem.index && isIndex == _index}" v-for="(_item, _index) of item.todo" :key="_index" @click="onToggleTodo(item.todo[_index], index, _index, $event)">{{_item.title}}</p>
          </div>
          <div class="todo-item" :class="{left: isShowLeft, top: isShowTop}" v-if="index == isItem.index && isIndex == isItem._index" :style="posTop">
            <h2 class="title">{{isItem.desc.caption}}</h2>
            <div class="time">{{'时间：' + isItem.desc.time}}</div>
            <div class="author-box">
              <span class="author">{{'作者：' + isItem.desc.author}}</span>
              <span class="job">{{isItem.desc.job}}</span>
            </div>
            <div class="link-box">
              <a class="link" :href="isItem.desc.link">查看GitHub</a>
              <span class="view">
                已查看
                <span class="strong">{{isItem.desc.num}}</span>
                次
              </span>
            </div>
          </div>
        </li>
        <li class="item invalid" v-for="(item, index) of endDay" :key="curMonthDays + index + 1">
          <div class="text-box">
            <span class="text">{{item}}</span>
          </div>
        </li>
      </ul>
    </main>
  </div>
</template>

<script>
const todoObj = {
  title: '备忘录',
  desc: {
    caption: '我的github项目',
    time: '2018.02.27　　2018.03.27',
    author: 'shaw',
    job: '前端开发',
    num: 369,
    link: 'https://github.com/chilliness'
  }
};

export default {
  props: {
    isWest: {
      // 是否启用西方模式
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      prevMonthDays: 0,
      curMonthDays: [],
      nextMonthDays: 0,
      curYearMonth: '',
      startDay: 0,
      endDay: 0,
      curDay: 0,
      posTop: null,
      isItem: {},
      isIndex: -1,
      isShowLeft: false,
      isShowTop: false
    };
  },
  computed: {
    week() {
      let arr = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
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
    onToggleTodo(item, index, _index, ev) {
      let parent = ev.target.parentNode.getBoundingClientRect();
      let top = ev.target.getBoundingClientRect().top - parent.top + 'px';
      let right = parent.right + 330;
      let bottom = ev.target.getBoundingClientRect().top + 213;
      let todoEl = document.querySelector('.todo-main').getBoundingClientRect();
      // 判断现实层应该是在左边还是右边
      this.isShowLeft = right > todoEl.right;
      // 判断现实层应该是在下边还是上边
      this.isShowTop = bottom > todoEl.bottom;
      if (this.isShowTop) {
        bottom =
          parent.bottom - ev.target.getBoundingClientRect().bottom + 'px';
        this.posTop = { bottom };
      } else {
        this.posTop = { top };
      }
      if (this.isIndex == _index && this.isItem.index == index) {
        this.isIndex = -1;
      } else {
        this.isIndex = _index;
      }
      this.isItem = { ...item, index, _index };
    },
    onFormatDate(year, month) {
      month > 12 && (++year, (month = 1));
      month < 1 && (--year, (month = 12));
      // 输出年月
      this.curYearMonth = `${year}年${month.toString().padStart(2, 0)}月`;
      // 获取当前月总天数
      let allDays = this.onMonthDays(year, month);
      this.curMonthDays = [];
      for (let i = 0; i < allDays; i++) {
        let item = { date: i + 1 };
        if (Math.random() > 0.5) {
          item.todo = [todoObj];
          if (Math.random() > 0.5) {
            item.todo.push(todoObj);
          }
        }
        this.curMonthDays.push(item);
      }
      // 获取上月总天数
      this.prevMonthDays = this.onMonthDays(year, month - 1);
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
      this.isIndex = -1;
      let [year, month] = this.curYearMonth.match(/\d+/g);
      str == 'next' ? ++month : --month;
      this.onFormatDate(year, month);
    }
  }
};
</script>

<style lang="scss" scoped>
.todo-wrap {
  font-size: 16px;
  min-width: 117px;
  .caption {
    display: flex;
    justify-content: center;
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
      border: 1px solid #fff;
      border-radius: 50%;
      box-sizing: border-box;
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
      flex: 0 0 calc(100% / 7);
      width: calc(100% / 7);
      color: #6f6f6f;
      box-sizing: border-box;
    }
    .week {
      display: flex;
      align-items: center;
      border-left: 1px solid #e8ecef;
      .item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        color: #333;
        border-right: 1px solid #fff;
        background: #e8ecef;
        &:last-child {
          border-right: 0 none;
        }
      }
    }
    .data {
      border-left: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
      .item {
        position: relative;
        float: left;
        padding-top: calc(100% / 7);
        border-top: 1px solid #e5e5e5;
        border-right: 1px solid #e5e5e5;
        &.invalid {
          color: #ccc;
        }
        .text-box {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          padding: 39px 6px;
          overflow: hidden;
          .text {
            position: absolute;
            right: 10px;
            top: 10px;
          }
          .todo {
            position: relative;
            line-height: 19px;
            margin-top: 6px;
            padding: 5px 10px;
            font-size: 12px;
            color: #666;
            cursor: pointer;
            border-radius: 2px;
            background: #f2f2f2;
            &.on {
              color: #0a7b5d;
              background: #c6ede3;
            }
          }
        }
        .todo-item {
          position: absolute;
          left: 100%;
          top: 0;
          z-index: 9;
          width: 318px;
          height: 213px;
          padding: 22px 30px 26px;
          border: 1px solid #17b68c;
          transform: translateX(15px);
          background: #fff;
          box-shadow: 0 2px 10px #ccc;
          box-sizing: border-box;
          &::before {
            content: '';
            position: absolute;
            left: -8px;
            top: 4px;
            width: 14px;
            height: 14px;
            border-left: 1px solid #17b68c;
            border-top: 1px solid #17b68c;
            transform: rotate(-45deg);
            background: #fff;
          }
          &.left {
            left: initial;
            right: 100%;
            transform: translateX(-15px);
            &::before {
              left: initial;
              right: -8px;
              transform: rotate(135deg);
            }
          }
          &.top {
            top: initial;
            &::before {
              top: initial;
              bottom: 4px;
            }
          }
          .title {
            font-size: 16px;
            color: #333;
          }
          .time {
            margin-top: 12px;
            font-size: 12px;
            color: #666;
          }
          .author-box {
            line-height: 24px;
            margin-top: 17px;
            font-size: 14px;
            color: #666;
            .job {
              margin-left: 16px;
              color: #17b68c;
            }
          }
          .link-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 25px;
            padding-top: 25px;
            border-top: 1px dashed #bababa;
            .link {
              padding: 6px 16px;
              font-size: 16px;
              color: #fff;
              border-radius: 2px;
              background: #17b68c;
            }
            .view {
              font-size: 14px;
              color: #666;
            }
            .strong {
              font-weight: bold;
              color: #17b68c;
            }
          }
        }
      }
    }
  }
}
</style>
