export class Timer {
  private timeMs: number;
  private datetimeMsWhenTimerWasSet: number;

  /*
   * Time in milliseconds since timer was set.
   */
  get millisecondsSinceStart(): number {
    return (Date.now() - this.datetimeMsWhenTimerWasSet);
  }

  /*
   * Sets the timer for given time in milliseconds.
   */
  set(timeMs: number): void {
    this.timeMs = timeMs;
    this.datetimeMsWhenTimerWasSet = Date.now();
  }

  /*
   * Returns true when timer had it's set time elapsed.
   * Returns false then the timer is still counting down.
   */
  check(): boolean {
    return (this.millisecondsSinceStart >= this.timeMs);
  }

  /*
   * Returns true when timer had it's set time elapsed.
   * If that is the case immediatly set new time.
   * Returns false then the timer is still counting down.
   */
  checkSet(timeMs: number): boolean {
    if (this.check()) {
      this.set(timeMs);
      return true;
    }

    return false;
  }

  /*
   * Returns a number in range [0, 1] indicating completion progress of this timer.
   */
  getProgress(): number {
    if (this.timeMs === -1) return 0;

    const progress = this.millisecondsSinceStart / this.timeMs;
    return progress > 1 ? 1 : progress;
  }
}
