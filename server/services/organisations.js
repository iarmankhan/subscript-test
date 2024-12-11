const knex = require("../database/connection");

const organisationsService = {
  createOrganisation: async (userId, name, description) => {
    const organisations = await knex("organizations")
      .insert({
        name,
        description,
        created_by: userId,
      })
      .returning("*");

    if (!organisations?.length) {
      throw new Error("Failed to create organisation");
    }

    const orgId = organisations[0].id;

    // Add org member
    await knex("org_members").insert({
      org_id: orgId,
      user_id: userId,
      role: "admin",
    });

    return organisations[0];
  },
};

module.exports = organisationsService;
