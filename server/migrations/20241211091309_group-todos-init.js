/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.transaction(async (trx) => {
    // Users tables
    await trx.schema.createTable("users", (table) => {
      table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()"));
      table.primary("id");
      table.string("name").notNullable();
      table.string("email").unique().notNullable();
      table.string("password_hash").notNullable();
      table.timestamps(true, true);
    });

    // Organiations tables
    await trx.schema.createTable("organizations", (table) => {
      table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()"));
      table.primary("id");
      table.string("name").notNullable();
      table.text("description").nullable();
      table.uuid("created_by").references("id").inTable("users");
      table.timestamps(true, true);
    });

    // OrgMembers table
    await trx.schema.createTable("org_members", (table) => {
      table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()"));
      table.primary("id");
      table.uuid("org_id").references("id").inTable("organizations");
      table.uuid("user_id").references("id").inTable("users");

      table.enum("role", ["admin", "member"]).notNullable();
      table
        .enum("status", ["active", "inactive"])
        .defaultTo("active")
        .notNullable();

      table.timestamps(true, true);
    });

    // Projects table
    await trx.schema.createTable("projects", (table) => {
      table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()"));
      table.primary("id");
      table.uuid("org_id").references("id").inTable("organizations");
      table.string("name").notNullable();
      table.text("description").nullable();
      table.uuid("created_by").references("id").inTable("org_members");
      table.timestamps(true, true);
    });

    // ProjectMembers table
    await trx.schema.createTable("project_members", (table) => {
      table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()"));
      table.primary("id");
      table.uuid("project_id").references("id").inTable("projects");
      table.uuid("org_member_id").references("id").inTable("org_members");

      // Unique constraint
      table.unique(["project_id", "org_member_id"]);

      table.timestamps(true, true);
    });

    // Tasks table
    await trx.schema.createTable("tasks", (table) => {
      table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()"));
      table.primary("id");
      table.uuid("project_id").references("id").inTable("projects");
      table.string("title").notNullable();
      table.text("description").nullable();
      table.enum("status", ["todo", "in_progress", "done"]).defaultTo("todo");
      table.uuid("created_by").references("id").inTable("users");
      table.timestamps(true, true);
    });

    // Task Assignees table
    await trx.schema.createTable("task_assignees", (table) => {
      table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()"));
      table.primary("id");
      table.uuid("task_id").references("id").inTable("tasks");
      table
        .uuid("project_member_id")
        .references("id")
        .inTable("project_members");

      // Unique constraint
      table.unique(["task_id", "project_member_id"]);

      table.timestamps(true, true);
    });

    // Comments table
    await trx.schema.createTable("comments", (table) => {
      table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()"));
      table.primary("id");
      table.uuid("task_id").references("id").inTable("tasks");
      table.text("content").notNullable();
      table.uuid("created_by").references("id").inTable("users");
      table.timestamps(true, true);
    });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.transaction(async (trx) => {
    await trx.schema.dropTable("comments");
    await trx.schema.dropTable("task_assignees");
    await trx.schema.dropTable("tasks");
    await trx.schema.dropTable("project_members");
    await trx.schema.dropTable("projects");
    await trx.schema.dropTable("org_members");
    await trx.schema.dropTable("organizations");
    await trx.schema.dropTable("users");
  });
};
