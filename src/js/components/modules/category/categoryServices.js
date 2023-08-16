import axios from "axios";

export default class CategoryService {
  static async list() {
    const response = await axios.get(`http://localhost:4000/admin/category`);
    return response.data;
  }
  static async find(id) {
    const response = await axios.get(
      `http://localhost:4000/admin/category/${id}`
    );
    return response.data[0];
  }
  static async destroyAll(ids) {
    const params = {
      ids
    };
    const response = await axios.delete(
      `http://localhost:4000/admin/category`,
      {
        params
      }
    );

    return response.data;
  }
  static async create(data) {
    const body = {
      data
    };
    const response = await axios.post(
      `http://localhost:4000/admin/category`,
      body
    );

    return response.data;
  }
  static async update(data) {
    const name = data.category_name;
    const body = {
      data
    };
    const response = await axios.put(
      `http://localhost:4000/admin/category/${name}`,
      body
    );

    return response.data;
  }
}
