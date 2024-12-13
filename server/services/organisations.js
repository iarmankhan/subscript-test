const knex = require("../database/connection");

const organisationsService = {
  getOrganisations: async (userId) => {
    const organisations = await knex("organizations")
      .select("*")
      .where("created_by", userId);
    return organisations;
  },

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

  getOrganisation: async (orgId, userId) => {
    const organisation = await knex("organizations")
      .select([
        "organizations.*",
        "org_members.id as org_member_id",
        "org_members.role as org_member_role",
        "org_members.status as org_member_status",
        "org_members.user_id as org_member_user_id",
      ])
      .leftJoin("org_members", "organizations.id", "org_members.org_id")
      .where("organizations.id", orgId)
      .andWhere("org_members.user_id", userId)
      .first();

    if (!organisation) {
      return null;
    }

    return organisation;
  },

  deleteOrganisation: async (orgId) => {
    await knex.transaction(async (trx) => {
      // Delete all comments
      await trx("comments").where("org_id", orgId).delete();

      const organisation = await knex("organizations")
        .where("id", orgId)
        .delete();

      await trx("org_members").where("org_id", orgId).delete();
    });

    return organisation;
  },

  getMembers: async (orgId) => {
    const members = await knex("org_members")
      .select("*")
      .where("org_id", orgId);
    return members;
  },

  addMember: async (orgId, userId, role) => {
    const existingMember = await knex("org_members")
      .where("org_id", orgId)
      .andWhere("user_id", userId)
      .first();

    if (existingMember && existingMember.status === "active") {
      throw new Error("Member already exists");
    }

    if (existingMember && existingMember.status === "inactive") {
      await knex("org_members")
        .where("org_id", orgId)
        .andWhere("user_id", userId)
        .update({ status: "active" });
    } else {
      const member = await knex("org_members").insert({
        org_id: orgId,
        user_id: userId,
        role,
      });
    }

    return member;
  },

  deactivateMember: async (orgId, userId) => {
    const member = await knex("org_members")
      .where("org_id", orgId)
      .andWhere("user_id", userId)
      .update({ status: "inactive" });
    return member;
  },
};

module.exports = organisationsService;
