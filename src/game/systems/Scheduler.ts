type ScheduledMethod = { atTime: number; method: () => void; id?: string };

/**
 * Scheduler - schedules arrow methods
 *
 * @description
 * ---
 * General purpose of this class is to :
 * - reduce amount of async,await and delayedCalls in game logic
 * - solutions that are based on awaiting promises do not include game pause logic
 */
export class Scheduler {
  private _timer = 0;
  private methods: ScheduledMethod[] = [];
  private state = {
    started: false,
  };

  constructor() {}

  start() {
    this.state.started = true;
  }

  update(delta: number) {
    if (!this.state.started) return;

    this._timer += delta;
    if (this.methods.length === 0) return;

    const methodIdxToRemove: number[] = [];
    this.methods.forEach((methodObj, idx) => {
      if (methodObj.atTime <= this.timer) {
        methodObj.method();
        methodIdxToRemove.push(idx);
      }
    });

    this.methods = this.methods.filter(
      (_, idx) => !methodIdxToRemove.includes(idx),
    );
  }

  scheduleMethod(method: () => void, msDelay: number, id?: string) {
    this.methods.push({ method: method, atTime: this.timer + msDelay, id: id });
  }

  removeScheduledMethods(id: string) {
    this.methods = this.methods.filter(
      (m) => !(m.id !== undefined && m.id === id),
    );
  }

  isMethodScheduled(id: string): boolean {
    return (
      this.methods.filter((m) => m.id !== undefined && m.id === id).length > 0
    );
  }

  get awaitingMethods() {
    return this.methods;
  }

  get awaitMethodCount() {
    return this.methods.length;
  }

  get timer() {
    return this._timer;
  }
}
