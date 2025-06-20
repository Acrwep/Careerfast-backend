const pool = require("../config/dbConfig");

const RoleModel = {
  getRoles: async () => {
    try {
      const query = `SELECT id, name FROM role WHERE is_active = 1`;
      const [roles] = await pool.query(query);
      return roles;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = RoleModel;
