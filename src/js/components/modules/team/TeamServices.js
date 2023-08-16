import axios from 'axios';

export default class TeamService {
  static async list() {
    const response = await axios.get(`http://localhost:4000/admin/team`);
    return response.data;
  }

  static async create(data) {
    const response = await axios.post(`http://localhost:4000/admin/team`, data);
    return response;
  }

  static async find(id) {
    const response = await axios.get(`http://localhost:4000/admin/team/${id}`);
    return response.data[0];
  }

  static async findTeamName() {
    const response = await axios.get(`http://localhost:4000/api/alreadyTeamPresent`);
    return response.data;
  }

  static async destroyAll(ids) {
    const params = {
      ids,
    };
    const response = await axios.delete(`http://localhost:4000/admin/team`, {
      params,
    });

    return response.data;
  }

  static async update(data) {
    const name = data.team_name;
    const body = {
      data,
    };
    const response = await axios.put(`http://localhost:4000/admin/team/${name}`, body);
    return response.data;
  }
}
