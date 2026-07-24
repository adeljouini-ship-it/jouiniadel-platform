export default class LineTool {
  constructor(ctx) {
    this.ctx = ctx;
  }

  draw(start, end, couleur, epaisseur) {
    this.ctx.save();

    this.ctx.strokeStyle = couleur;
    this.ctx.lineWidth = epaisseur;
    this.ctx.lineCap = "round";

    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();

    this.ctx.restore();
  }

  preview(start, end, couleur, epaisseur) {
    this.draw(start, end, couleur, epaisseur);
  }
}