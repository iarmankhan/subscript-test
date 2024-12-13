/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
``;
const bcrypt = require("bcrypt");
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("org_members").del();
  await knex("organizations").del();
  await knex("users").del();

  const DUMMY_PASSWORD = "password";

  const passwordHash = await bcrypt.hash(DUMMY_PASSWORD, 10);

  await knex("users").insert([
    { name: "Admin", email: "admin@example.com", password_hash: passwordHash },
    {
      name: "Member",
      email: "member@example.com",
      password_hash: passwordHash,
    },
    {
      name: "Inactive",
      email: "inactive@example.com",
      password_hash: passwordHash,
    },
    {
      name: "Another Member",
      email: "anotherMember@example.com",
      password_hash: passwordHash,
    },
  ]);

  const users = await knex("users").select("*");

  // Create organisations
  const organisations = await knex("organizations").insert([
    {
      name: "Organisation 1",
      description: "Organisation 1",
      created_by: users[0].id,
    },
    {
      name: "Organisation 2",
      description: "Organisation 2",
      created_by: users[3].id,
    },
  ]);

  const orgs = await knex("organizations").select("*");

  // Create organisation members
  await knex("org_members").insert([
    { org_id: orgs[0].id, user_id: users[0].id, role: "admin" },
    { org_id: orgs[0].id, user_id: users[1].id, role: "member" },
    {
      org_id: orgs[0].id,
      user_id: users[2].id,
      role: "member",
      status: "inactive",
    },
    { org_id: orgs[1].id, user_id: users[3].id, role: "admin" },
  ]);
};
