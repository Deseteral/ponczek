/**
 * Data structure for efficient counting down time.
 */
export class Timer {
  private active = false;
  private timeMs: number;
  private datetimeMsWhenTimerWasSet: number;

  /**
   * Returns time in milliseconds since timer was set.
   */
  public get millisecondsSinceStart(): number {
    return (Date.now() - this.datetimeMsWhenTimerWasSet);
  }

  /**
   * Returns whether the timer is active.
   * When inactive - `Timer#check` method will always return `false` and `Timer#getProgress` will always return `0`.
   */
  public isActive(): boolean {
    return this.active;
  }

  /**
   * Sets the timer for given time (in milliseconds) and activates it.
   */
  public set(timeMs: number): void {
    this.timeMs = timeMs;
    this.datetimeMsWhenTimerWasSet = Date.now();
    this.active = true;
  }

  /**
   * Returns `true` when timer had it's set time elapsed,
   * or `false` then the timer is still counting down.
   */
  public check(): boolean {
    return this.active && (this.millisecondsSinceStart >= this.timeMs);
  }

  /**
   * Deactivates the timer.
   */
  public disable(): void {
    this.active = false;
  }

  /**
   * Returns `true` when timer had it's set time elapsed.
   * If that is the case immediatly set new time.
   * Returns `false` then the timer is still counting down.
   */
  public checkSet(timeMs: number): boolean {
    if (this.check()) {
      this.set(timeMs);
      return true;
    }

    return false;
  }

  /**
   * Returns a number in range [0, 1] indicating completion progress of this timer.
   */
  public getProgress(): number {
    if (this.timeMs === -1 || !this.active) return 0;

    const progress = this.millisecondsSinceStart / this.timeMs;
    return progress > 1 ? 1 : progress;
  }
}
