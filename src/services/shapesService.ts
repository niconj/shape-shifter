import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry'
import Constants from '../shared/constants';
import ApiShape from './models/shapeModel';



export class ShapesService {
  public static async getShapes(): Promise<ApiShape[]> {
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

    const url = '/shapes.json';

    const response = await this.usersAxios.get(url);
    const data = response.data.map((shapeDto: any) => new ApiShape(shapeDto));
    return data;
  }

  private static usersAxios = axios.create({
    baseURL: Constants.SHAPESURL,
    timeout: Constants.TIMEOUT,
  });

  public base: AxiosInstance;

  constructor() {
    this.base = axios.create({
      baseURL: Constants.SHAPESURL,
      timeout: Constants.TIMEOUT,
    });

    /// Retry up to 3 times if an enpoint returns a time-out exception
    axiosRetry(this.base, {
      retries: 3,
      shouldResetTimeout: true,
      retryCondition: (error) => error.code === 'ECONNABORTED',
    });
  }
}
