export default class PenTool {
  constructor(ctx) {
    this.ctx = ctx;
    this.isDrawing = false;
  }

  start(point, couleur, epaisseur) {
    this.isDrawing = true;

    this.ctx.save();

    this.ctx.strokeStyle = couleur;
    this.ctx.lineWidth = epaisseur;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.globalCompositeOperation = "source-over";

    this.ctx.beginPath();
    this.ctx.moveTo(point.x, point.y);
  }

  move(point, pressure = 1, epaisseur = 4) {
    if (!this.isDrawing) return;

    this.ctx.lineWidth = Math.max(
      1,
      epaisseur * pressure
    );

    this.ctx.lineTo(point.x, point.y);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(point.x, point.y);
  }

  end() {
    if (!this.isDrawing) return;

    this.ctx.closePath();
    this.ctx.restore();

    this.isDrawing = false;
  }

  cancel() {
    this.end();
  }
}