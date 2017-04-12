'use strict';
/*
* 传入参数props
*defaultValue 显示最近的一天有课日期
* onChange
* */
import React from 'react';
import './date-time.scss';
import moment from 'moment';

// 组件
module.exports = React.createClass({
  // 状态初始化
  getInitialState: function() {
    return {
      text: moment(this.props.defaultValue).format('YYYY-MM-DD') || '',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      date: new Date().getDate(),
      day: new Date().getDay(),
      isShowed: this.props.isShowed
    }
  },
  componentWillReceiveProps(nextProps) {
    if(this.props.isShowed != nextProps.isShowed) {
      this.setState({
        isShowed: nextProps.isShowed
      })
    }
    if(this.props.defaultValue !== nextProps.defaultValue) {
      this.update(nextProps.defaultValue)
    }
  },

  // 加载后
  componentDidMount: function() {
    this.update(this.props.defaultValue);
  },
  update: function(value) {
    if(!value) return;
    let text = '';
    let date = new Date();
    if (value) {
      date = new Date(value);
      text = '';
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let theDate = date.getDate();
      text += year;
      text += '-';
      text += month < 10 ? `0${month}` : month;
      text += '-';
      text += theDate < 10 ? `0${theDate}` : theDate;
    }
    this.setState({
      text: text,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: date.getDate(),
      day: date.getDay()
    });
  },

  // 渲染
  render: function() {
    let self = this;
    let year = this.state.year;
    let month = this.state.month < 10 ? `0${this.state.month}` : this.state.month;
    //let date = this.state.date;
    let dates = this.calcDates(year, month);
    if (this.state.date > this.getTotDays(year, month)) {
      this.setState({
        date: this.getTotDays(year, month)
      });
    }
    return (
      <div className={`component-common-form-datetime component-common-form-datetime-${this.props.type}`}>
        <div className="text" onClick={this.toggle}   style={{borderBottomWidth: this.state.isShowed ? '2px' : '0'}}>
          <div
            className="title"
            >
            {this.props.title}
          </div>
          <div className="option">
            <span>{this.state.text}</span>
            <span>{`星期${['日', '一', '二', '三', '四', '五', '六'][this.state.day]}`}</span>
          </div>
        </div>
        <div ref="content" className="content" style={{display: this.state.isShowed ? 'block' : 'none'}}>
          <div className="date">
            <div className="header">
              <span className="fa fa-chevron-circle-left" onClick={self.changeToPrevMonth}></span>
              <span>{moment(year + '-' + month).format('YYYY-MM')}</span>
              <span className="fa fa-chevron-circle-right" onClick={self.changeToNextMonth}></span>
            </div>

            <div className="body">
              <div className="row">
                <span>一</span>
                <span>二</span>
                <span>三</span>
                <span>四</span>
                <span>五</span>
                <span>六</span>
                <span>日</span>
              </div>

              {dates.map(function(row ,index) {
                return (
                  <div key={index} className="row">
                    {row.map(function(column) {
                      let columnDay = year + '-' + month + '-' + (column.date < 10 ? `0${column.date}` : column.date);
                      let choose =self.props.flagTime && self.props.flagTime.length > 0 ? (self.props.type == 'start'
                        ? (self.props.flagTime > columnDay && columnDay > self.state.text)
                        : (self.props.flagTime < columnDay && columnDay < self.state.text)) : undefined;
                      return (
                        <span
                          key={`col-${year}-${month}-${column.date}`}
                          className={
                            (column.available ? '' : 'unavailable') + ' ' +
                            (column.available && self.state.text === columnDay ? 'active' : '') + ' ' +
                            (column.available && self.props.flagTime == columnDay  ? 'flag-time' : '') + ' ' +
                            (column.available && choose ? 'choose' : '')
                          }
                          onClick={self.chooseDate(column)}
                          >
                          {column.date}
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    )
  },
  chooseDate: function(date) {
    return ()=> {
      if (!date.available) return;
      let text = '';
      let value = {};
      text += this.state.year;
      text += '-';
      text += this.state.month < 10 ? `0${this.state.month}` : this.state.month;
      text += '-';
      text += date.date < 10 ? `0${date.date}` : date.date;
      this.setState({
        text: text,
        date: date.date,
        day: new Date(text).getDay(),
        isShowed: true
      });

      if (this.props.onChange) {
        let self = this;
        setTimeout(function() {
          self.props.onChange(text);
        }, 10);
      }
    }
  },

  // 改变年月
  changeDate: function() {
    this.setState({
      year: parseInt(this.refs.year.value),
      month: parseInt(this.refs.month.value)
    });
  },

  // 改变时间
  changeTime: function() {
    this.setState({
      hour: parseInt(this.refs.hour.value),
      minute: parseInt(this.refs.minute.value),
      second: this.refs.second && parseInt(this.refs.second.value) || '00'
    });
  },

  // 切换到上个月
  changeToPrevMonth: function() {
    this.setState({
      year: this.state.month === 1 ? this.state.year - 1 : this.state.year,
      month: this.state.month === 1 ? 12 : this.state.month - 1
    });
  },

  // 切换到下个月
  changeToNextMonth: function() {
    this.setState({
      year: this.state.month === 12 ? this.state.year + 1 : this.state.year,
      month: this.state.month === 12 ? 1 : this.state.month + 1
    });
  },
  getTotDays: function(year, month) {
    year = parseInt(year);
    month = parseInt(month);

    let totDays = 31;
    if (month === 4 || month === 6 || month === 9 || month === 11) {
      totDays = 30;
    }
    if (month === 2) {
      totDays = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 29 : 28;
    }
    return totDays;
  },

  // 计算日历表
  calcDates: function(year, month) {
    let dates = [];

    // 获取本月和上月天数
    let totDays = this.getTotDays(year, month);
    let totDaysLastMonth = this.getTotDays(month === 1 ? year - 1 : year, month - 1 < 1 ? 12 : month - 1);

    // 获取本月第一天是星期几
    let firstDay = moment(`${year}-${month}-01`).format('d');
    firstDay = firstDay - 1 < 0 ? 6 : firstDay - 1;

    // 计算每一天的日期
    let cntDay = 0;
    let available = true;
    for (let i = 0; i < 6; i++) {
      dates.push([]);

      if (i === 0) {
        for (let j = firstDay - 1; j >= 0; j --) {
          dates[i].push({
            available: false,
            date: totDaysLastMonth - j,
            choosed: false
          });
        }

        for (let j = firstDay; j < 7; j++) {
          dates[i].push({
            available: true,
            date: ++cntDay
          });
        }
      }
      else {
        for (let j = 0; j < 7; j ++) {
          dates[i].push({
            available: available,
            date: ++cntDay
          });

          if (cntDay >= totDays) {
            cntDay = 0;
            available = false;
          }
        }
      }
    }


    if (this.props.flagTime && this.props.flagTime.length !== 0) {
      for (let i = 0; i < dates.length; i++) {
        for (let j = 0; j < dates[i].length; j++) {
          /*if(this.props.type == 'start') {
            if (dates[i][j].available &&
              moment(year + '-' + month + '-' + dates[i][j].date).format('YYYY-MM-DD') > moment(this.props.flagTime).format('YYYY-MM-DD')) {
              dates[i][j].available = false;
            }
          }*/
          if(this.props.type == 'end') {
            if (dates[i][j].available &&
              moment(year + '-' + month + '-' + (dates[i][j].date < 10 ? `0${dates[i][j].date}`:dates[i][j].date)).format('YYYY-MM-DD') < moment(this.props.flagTime).format('YYYY-MM-DD')) {
              dates[i][j].available = false;
            }
          }
        }
      }
    }

    // 返回
    return dates;
  },

  // 确定选择


  // 清空
  clear: function() {
    this.setState({
      text: '全部',
      isShowed: false
    });

    if (this.props.onChange) {
      let self = this;
      setTimeout(function() {
        self.props.onChange(text);
      }, 10);
    }
  },

  // 切换显示
  toggle: function() {
    let show = (this.props.type == 'start') ? true : false ;
    this.props.handleClick(show);

  },

  // 获取值
  getValue: function() {
    return this.state.text === '全部' ? '' : this.state.text;
  }
});
