import axios from "axios";

export default class TournamentService {
  static async list() {
    const response = await axios.get(`http://localhost:4000/admin/tournament`);
    return response.data;
  }
  static async create(data) {
    const response = await axios.post(
      `http://localhost:4000/admin/tournament/create`,
      data
    );
    return response;
  }
  static async find(id) {
    const response = await axios.get(
      `http://localhost:4000/admin/tournament/${id}`
    );
    return response.data[0];
  }
  static async destroyAll(ids) {
    const params = {
      ids
    };
    const response = await axios.delete(
      `http://localhost:4000/admin/tournament`,
      {
        params
      }
    );

    return response.data;
  }
  static async destroyAll(ids) {
    const params = {
      ids
    };
    const response = await axios.delete(
      `http://localhost:4000/admin/tournament`,
      {
        params
      }
    );

    return response.data;
  }
  static async update(data) {
    const name = data.category_name;
    const body = {
      data
    };
    const response = await axios.put(
      `http://localhost:4000/admin/tournament`,
      body
    );
    return response.data;
  }
}
