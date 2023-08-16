import axios from "axios";

export default class SponsorServices {
  static async list() {
    const response = await axios.get(`http://localhost:4000/admin/sponsor`);
    return response.data;
  }
  static async create(data) {
    const response = await axios.post(
      `http://localhost:4000/admin/sponsor`,
      data
    );
    return response;
  }
  static async find(id) {
    const response = await axios.get(
      `http://localhost:4000/admin/sponsor/${id}`
    );
    return response.data[0];
  }
  static async findEmail() {
    const response = await axios.get(
      `http://localhost:4000/admin/sponsor/new`
    );
    return response.data;
  }
  static async destroyAll(ids) {
    const params = {
      ids
    };
    const response = await axios.delete(`http://localhost:4000/admin/sponsor`, {
      params
    });

    return response.data;
  }
  static async destroyAll(ids) {
    const params = {
      ids
    };
    const response = await axios.delete(`http://localhost:4000/admin/sponsor`, {
      params
    });

    return response.data;
  }
  static async update(data) {
    const body = {
      data
    };
    const response = await axios.put(
      `http://localhost:4000/admin/sponsor`,
      body
    );

    return response.data;
  }
}
