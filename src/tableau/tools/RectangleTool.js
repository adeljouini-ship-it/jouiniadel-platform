export default class RectangleTool {
  constructor(ctx) {
    this.ctx = ctx;
  }

  draw(start, end, couleur, epaisseur) {
    this.ctx.save();

    this.ctx.strokeStyle = couleur;
    this.ctx.lineWidth = epaisseur;

    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);

    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);

    this.ctx.strokeRect(x, y, width, height);

    this.ctx.restore();
  }

  preview(start, end, couleur, epaisseur) {
    this.draw(start, end, couleur, epaisseur);
  }
}