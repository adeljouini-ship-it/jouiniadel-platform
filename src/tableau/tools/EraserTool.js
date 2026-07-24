export default class EraserTool {
  constructor(ctx) {
    this.ctx = ctx;
    this.isErasing = false;
  }

  start(point, epaisseur) {
    this.isErasing = true;

    this.ctx.save();

    this.ctx.globalCompositeOperation =
      "destination-out";

    this.ctx.lineWidth = epaisseur * 5;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    this.ctx.beginPath();
    this.ctx.moveTo(point.x, point.y);
  }

  move(point, epaisseur) {
    if (!this.isErasing) return;

    this.ctx.lineWidth = epaisseur * 5;

    this.ctx.lineTo(point.x, point.y);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(point.x, point.y);
  }

  end() {
    if (!this.isErasing) return;

    this.ctx.closePath();
    this.ctx.restore();

    this.isErasing = false;
  }

  cancel() {
    this.end();
  }
}