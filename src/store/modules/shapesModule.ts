import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { ShapeState } from '@/store/interfaces/shapes';
import { ShapesService } from '@/services/shapesService';
import ShapeFactory from '@/factories/shapeFactory';
import ApiShape from '@/services/models/shapeModel';

const namespaced: boolean = true;

const state: ShapeState = {
  shapes: [],
};

const getters: GetterTree<ShapeState, any> = {
  ['getShapes'] : () => state.shapes,
};

const mutations: MutationTree<ShapeState> = {
  ['setShapes']: (state, shapes) => {
    const konvaShapes = shapes.map((shape: ApiShape) => ShapeFactory.CreateKonvaShape(shape));
    state.shapes = konvaShapes;
  },
  ['addShape']: (state, shape) => { state.shapes.push(shape); },
  ['updateShape']: (state, shape) => {
    const existingShapeIndex = state.shapes.indexOf(shape);
    if (existingShapeIndex > -1) {
      state.shapes.splice(existingShapeIndex, 1);
      state.shapes.push(shape);
    }
  },
  ['removeShape']: (state, shape) => { state.shapes.splice(state.shapes.indexOf(shape), 1); },
};

const actions: ActionTree<ShapeState, any> = {
  ['fetchShapes']: ({ commit }) => {
    ShapesService.getShapes().then((shapes) => {
      commit('setShapes', shapes);
    });
  },
};

export default {
  namespaced,
  state,
  getters,
  mutations,
  actions,
};
