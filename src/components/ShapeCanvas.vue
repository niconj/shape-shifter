<template>
  <section>
    <div class="canvas" id="container"></div>
    <section class="action-panel">
      <div class="action-button" id="random" @click="addRandomRect()" title="Add rectangle">
        <img src="../assets/randomRectangle.svg">
      </div>
      <div class="action-button" id="delete" @click="deleteShape()" title="Delete shape">
        <img src="../assets/delete.svg">
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import { Action, Getter, Mutation } from 'vuex-class';
import { Component, Vue, Watch } from 'vue-property-decorator';
import ShapeFactory from '@/factories/shapeFactory';
import Konva from 'konva';
import shapes from '@/store/modules/shapesModule';
import Shape, { CanvasSize } from '@/services/models/shapeModel';

@Component
export default class ShapeCanvas extends Vue {

  @Mutation(`ShapesModule/addShape`) public addShape: any;
  @Mutation(`ShapesModule/updateShape`) public updateShape: any;
  @Mutation(`ShapesModule/removeShape`) public removeShape: any;
  @Action(`ShapesModule/fetchShapes`) public fetchShapes: any;
  @Getter(`ShapesModule/getShapes`) public getShapes: any;

  private stage: Konva.Stage | any;
  private layer: Konva.Layer | any;
  private transformer: Konva.Transformer | any;
  private selectedShape: Konva.Shape | any;

  public mounted() {
    this.fetchShapes();
    this.attachDeleteBehaviour();
    this.attachMovementBehavior();
    this.initCanvas();
  }

  @Watch('getShapes')
  public onShapesUpdated(konvaShapes: Konva.Shape[]) {
    konvaShapes.forEach((shape) => { this.layer.add(shape); });
    this.layer.add(this.transformer);
    this.stage.add(this.layer);
    this.layer.batchDraw();
  }

  /// Creates and initializes the required objects for the Canvas
  private initCanvas() {
    this.stage = new Konva.Stage({
      container: 'container',
      width: window.innerWidth,
      height: window.innerHeight / 1.5,
    });

    this.stage.on('mousedown', this.handleStageMouseDown);

    this.layer = new Konva.Layer();
    this.transformer = new Konva.Transformer({
      ref: 'transfrormer',
      borderDash: [6, 6],
      borderEnabled: true,
      borderStroke: 'blue',
      padding: 2,
      rotationSnaps: [0, 90, 180, 270],
      anchorCornerRadius: 5,
    });
  }

  /// Creates randomly located rectangle
  private addRandomRect() {
    const canvasSize = new CanvasSize(this.stage.getWidth(), this.stage.getHeight());
    const rectangle = ShapeFactory.CreateKonvaShape(canvasSize);
    this.addShape(rectangle);
  }

  /// Handles the delete button action
  private attachDeleteBehaviour() {
    window.addEventListener('keydown', (e) => {
      const key = e.key;
      if ((key === 'Backspace' || key === 'Delete')) {
        this.deleteShape();
      }
    });
  }

  /// Handles left-right button actions
  private attachMovementBehavior() {
    window.addEventListener('keydown', (e) => {
      const key = e.key;
      if ((key === 'ArrowRight') || (key === 'ArrowLeft')) {
        const selectedShape = this.getSelectedShape();
        if (selectedShape) {
          const delta = key === 'ArrowRight' ? 5 : -5;
          selectedShape.x(selectedShape.x() + delta);
          this.updateShape(selectedShape);
        }
      }
    });
  }


  private handleStageMouseDown(e: any) {
    // clicked on stage - cler selection
    if (e.target === e.target.getStage()) {
      this.updateTransformer();
      return;
    }

    // clicked on transformer - do nothing
    const clickedOnTransformer =
      e.target.getParent().className === 'Transformer';
    if (clickedOnTransformer) {
      return;
    }

    // find clicked rect by its name
    const storedShapes = this.getShapes as Konva.Shape[];
    this.selectedShape = storedShapes.find((shape) => shape === e.target);
    this.updateTransformer();
  }

  private getSelectedShape(): Konva.Shape | null {
    const transformerNode = this.transformer.getStage();
    const stage = transformerNode.getStage();

    if (this.selectedShape) {
      return stage.findOne('.' + this.selectedShape.name());
    }

    return null;
  }

  private deleteShape() {
    const selectedShape = this.getSelectedShape();
    if (selectedShape) {
      this.transformer.detach();
      this.removeShape(selectedShape);
      selectedShape.destroy();
    }
  }

  private updateTransformer() {
    const selectedShape = this.getSelectedShape();
    // do nothing if selected node is already attached
    if (selectedShape === this.transformer.node) {
      return;
    }

    if (selectedShape) {
      // attach to another node
      this.transformer.attachTo(selectedShape);
    } else {
      // remove transformer
      this.transformer.detach();
    }

    this.transformer.getLayer().draw();
  }
}
</script>

<style lang="scss">
@import "../scss/_variables.scss";

  .canvas {
    margin: auto;
    border: 2px solid $color-gray;
    background: white;
  }

  .action-panel {
    display: flex;
    justify-content: space-evenly;
    padding: 30px 0px;

    .action-button {
      width: 100px;
      padding: 10px;
      cursor: pointer;
      background: $color-white;
      border: 2px solid $color-gray;
      border-radius: 20%;

      img {
        width: 100%;
      }
    }

    .action-button:hover {
      box-shadow: 3px 3px $color-gray;
    }
  }
</style>
