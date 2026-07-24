export default class History {
  constructor(max = 50) {
    this.max = max;
    this.states = [];
    this.index = -1;
  }

  push(state) {
    this.states = this.states.slice(0, this.index + 1);

    this.states.push(state);

    if (this.states.length > this.max) {
      this.states.shift();
    }

    this.index = this.states.length - 1;
  }

  undo() {
    if (!this.canUndo()) return null;

    this.index--;

    return this.states[this.index];
  }

  redo() {
    if (!this.canRedo()) return null;

    this.index++;

    return this.states[this.index];
  }

  current() {
    if (this.index < 0) return null;

    return this.states[this.index];
  }

  canUndo() {
    return this.index > 0;
  }

  canRedo() {
    return this.index < this.states.length - 1;
  }

  clear() {
    this.states = [];
    this.index = -1;
  }
}