import axios from 'axios';
import Constants from '../shared/constants';
import ApiShape from './models/shapeModel';


export abstract class ShapesService {

  public static async getShapes(): Promise<ApiShape[]> {
    const url = '/shapes.json';
    const response = await this.usersAxios.get(url);
    const data = response.data.map((shapeDto: any) => new ApiShape(shapeDto));
    return data;
  }

  private static usersAxios = axios.create({
    baseURL: Constants.SHAPESURL,
    timeout: Constants.TIMEOUT,
  });
}
