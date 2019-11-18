import ApiShape, { Coordinate, CanvasSize } from '@/services/models/shapeModel';
import Konva from 'konva';

export default abstract class ShapeFactory {
  public static CreateKonvaShape(props: ApiShape | CanvasSize): Konva.Shape | null {
    if (props instanceof ApiShape) {
      return this.CreateShapeFromData(props);
    }

    if (props instanceof CanvasSize) {
      return this.CreateRandomRectangle(props);
    }

    return null;
  }

  /// Based on the coordinates of the shape we get the size of the transformation box
  private static CalculateTransformerSize(coordinates: Coordinate[]) {
    const xCoordinates: number[] = coordinates.map((o) => o.x);
    const yCoordinates: number[] = coordinates.map((o) => o.y);

    const width = Math.max(...xCoordinates) - Math.min(...xCoordinates);
    const height = Math.max(...yCoordinates) - Math.min(...yCoordinates);
    return { width, height };
  }

  /// Create a Konva shape from a baseShape
  private static CreateShapeFromData(baseShape: ApiShape): Konva.Shape {
    const shape = new Konva.Shape({
      name: baseShape.getId.toString(),
      fill: baseShape.getColor,
      stroke: baseShape.getColor,
      strokeWidth: 1,
      draggable: true,
      /// Based on the coordinates of the shape we draw it line by line
      sceneFunc(context) {
        context.moveTo(baseShape.getCoordinates[0].x, baseShape.getCoordinates[0].y);
        context.beginPath();
        baseShape.getCoordinates.map((point) => context.lineTo(point.x, point.y));
        context.closePath();
        context.fillStrokeShape(this);
        },
      });

    const transformerSize = this.CalculateTransformerSize(baseShape.getCoordinates);
    shape.getSelfRect = () => {
      return {
        x: baseShape.getCoordinates[0].x,
        y: baseShape.getCoordinates[0].y,
        width: transformerSize.width,
        height: transformerSize.height,
      };
    };

    return shape;
  }

  private static CreateRandomRectangle(CanvasSize: CanvasSize): Konva.Rect {
    const rectangle = new Konva.Rect({
      x: Math.floor(Math.random() * CanvasSize.width) + 1,
      y: Math.floor(Math.random() * CanvasSize.height) + 1,
      width: Math.floor(Math.random() * 200) + 1,
      height: Math.floor(Math.random() * 200) + 1,
      name: (Math.random() * 100).toString(),
      fill: Konva.Util.getRandomColor(),
      stroke: 'black',
      strokeWidth: 0,
      draggable: true,
    });

    return rectangle;
  }
}



