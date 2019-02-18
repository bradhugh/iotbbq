// https://gist.github.com/ranwahle/e78a8859ff78bdd68055017fc5875fcb

const MILLISECONDS_IN_A_SECOND = 1000;
const SECONDS_IN_A_MINUTE = 60;
const MINUTES_IN_AN_HOUR = 60;
const HOURS_IN_A_DAY = 24;
const DAYS_IN_A_WEEK = 7;

const MILLISECONDS_IN_A_MINUTE = MILLISECONDS_IN_A_SECOND * SECONDS_IN_A_MINUTE;
const MILLISECONDS_IN_AN_HOUR = MILLISECONDS_IN_A_MINUTE * MINUTES_IN_AN_HOUR;
const MILLISECONDS_IN_A_DAY = MILLISECONDS_IN_AN_HOUR * HOURS_IN_A_DAY;
const MILLISECONDS_IN_A_WEEK = MILLISECONDS_IN_A_DAY * DAYS_IN_A_WEEK;


export class TimeSpan {

  private _milliseconds; number;
  private _totalMilliSeconds: number;
  private _seconds: number;
  private _minutes: number;
  private _hours: number;
  private _days: number;

  constructor(milliSeconds: number = 0) {
    this._seconds = 0;
    this._minutes = 0;
    this._hours = 0;
    this._days = 0;

    this.milliseconds = milliSeconds;
  }

  static Subtract(date1: any, date2: any) {
    const milliSeconds: number = date1 - date2;

    return new TimeSpan(milliSeconds);
  }

  static Day(): TimeSpan {
    return new TimeSpan(MILLISECONDS_IN_A_DAY);
  }
  static Hour(): TimeSpan { return new TimeSpan(MILLISECONDS_IN_AN_HOUR); }
  static Week(): TimeSpan { return new TimeSpan(MILLISECONDS_IN_A_WEEK) };
  static Month(): TimeSpan {
    const now: any = new Date();
    const aMonthAgo: any = new Date();
    aMonthAgo.setMonth(aMonthAgo.getMonth() - 1);
    return new TimeSpan(now - aMonthAgo);
  }

  toString(): string {
    let str = '';
    if (this.days) {
      str += `${this.days}.${Math.abs(this.hours).toString().padStart(2, '0')}`;
    } else {
      str += this.hours;
    }

    str += `:${Math.abs(this.minutes).toString().padStart(2, '0')}:${Math.abs(this.seconds).toString().padStart(2, '0')}`;
    return str;
  }

  addTo(date: Date): Date {
    console.log('add ' + this.totalMilliSeconds, this);
    date.setMilliseconds(date.getMilliseconds() + this.totalMilliSeconds);

    return date;
  }

  subtractFrom(date: Date): Date {
    date.setMilliseconds(date.getMilliseconds() - this.totalMilliSeconds);

    return date;
  }

  get days(): number {
    return this._days;
  }

  set days(value: number) {
    if (isNaN(value)) {
      value = 0;
    }
    this._days = value;
    this.calcMilliSeconds();
  }

  get hours(): number {
    return this._hours;
  }

  set hours(value: number) {
    if (isNaN(value)) {
      value = 0;
    }
    this._hours = value;
    this.calcMilliSeconds();
  }

  get minutes(): number {
    return this._minutes;
  }

  set minutes(value: number) {
    if (isNaN(value)) {
      value = 0;
    }
    this._minutes = value;
    this.calcMilliSeconds();
  }

  get seconds(): number {
    return this._seconds;
  }

  set seconds(value: number) {
    this._seconds = value;
    this.calcMilliSeconds();
  }

  get milliseconds(): number {
    return this._milliseconds;
  }

  set milliseconds(value: number) {
    if (isNaN(value)) {
      value = 0;
    }
    this._milliseconds = value;
    this.calcMilliSeconds();
  }

  get totalMilliSeconds() {
    return this._totalMilliSeconds;
  }

  get totalSeconds() {
    return Math.round(this._totalMilliSeconds / MILLISECONDS_IN_A_SECOND);
  }

  get totalMinutes() {
    return Math.round(this._totalMilliSeconds / MILLISECONDS_IN_A_MINUTE);
  }

  get totalHours() {
    return Math.round(this._totalMilliSeconds / MILLISECONDS_IN_AN_HOUR);
  }

  roundValue(origValue, maxValue) {
    return { modulu: origValue % maxValue, addition: Math.floor(origValue / maxValue) };
  }

  calcMilliSeconds() {

    const newMilliSecond = this.roundValue(this._milliseconds, MILLISECONDS_IN_A_SECOND);
    this._milliseconds = newMilliSecond.modulu;
    this._seconds += newMilliSecond.addition;

    const newSecond = this.roundValue(this._seconds, SECONDS_IN_A_MINUTE);
    this._seconds = newSecond.modulu;
    this._minutes += newSecond.addition;

    const newminutes = this.roundValue(this._minutes, MINUTES_IN_AN_HOUR);
    this._minutes = newminutes.modulu;
    this._hours += newminutes.addition;

    const newDays = this.roundValue(this._hours, HOURS_IN_A_DAY);
    this._hours = newDays.modulu;
    this._days += newDays.addition;

    this._totalMilliSeconds = this.days * MILLISECONDS_IN_A_DAY +
      this.hours * MILLISECONDS_IN_AN_HOUR +
      this.minutes * MILLISECONDS_IN_A_MINUTE +
       this.seconds * MILLISECONDS_IN_A_SECOND + this.milliseconds;
  }
}
