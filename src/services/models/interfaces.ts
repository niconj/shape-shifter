export interface ICoordinate {
  x: number;
  y: number;
}

export interface ICanvasSize {
  width: number;
  height: number;
}

export interface IShape {
  id: number;
  coordinates: ICoordinate[];
  color: string;
  label: string;
}

export interface RequestShapeInterface {
  data: IShape[];
}
