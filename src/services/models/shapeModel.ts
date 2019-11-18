import { ICanvasSize, IShape, ICoordinate } from './interfaces';


export class CanvasSize implements ICanvasSize {
  public width: number = 0;
  public height: number = 0;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

export class Coordinate implements ICoordinate {
  public x: number = 0;
  public y: number = 0;
}

export class ShapeDTO implements IShape {
  public id: number = 0;
  public coordinates: Coordinate[] = [];
  public color: string = '';
  public label: string = '';
}

export default class ApiShape extends ShapeDTO {
  constructor(dto: ShapeDTO) {
    super();
    Object.assign(this, dto);
  }

  get getColor(): string { return this.color; }
  get getLabel(): string { return this.label; }
  get getId(): number { return this.id; }
  get getCoordinates(): Coordinate[] { return this.coordinates; }
}
