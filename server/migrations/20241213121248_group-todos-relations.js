/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.transaction(async (trx) => {
    await trx.schema.alterTable("tasks", (table) => {
      table.dropForeign("project_id");
      table
        .foreign("project_id")
        .references("id")
        .inTable("projects")
        .onDelete("CASCADE");
    });

    await trx.schema.alterTable("task_assignees", (table) => {
      table.dropForeign("task_id");
      table
        .foreign("task_id")
        .references("id")
        .inTable("tasks")
        .onDelete("CASCADE");

      table.dropForeign("project_member_id");
      table
        .foreign("project_member_id")
        .references("id")
        .inTable("project_members")
        .onDelete("CASCADE");
    });

    await trx.schema.alterTable("comments", (table) => {
      table.dropForeign("task_id");
      table
        .foreign("task_id")
        .references("id")
        .inTable("tasks")
        .onDelete("CASCADE");
    });

    await trx.schema.alterTable("org_members", (table) => {
      table.dropForeign("org_id");
      table
        .foreign("org_id")
        .references("id")
        .inTable("organizations")
        .onDelete("CASCADE");
    });

    await trx.schema.alterTable("projects", (table) => {
      table.dropForeign("org_id");
      table
        .foreign("org_id")
        .references("id")
        .inTable("organizations")
        .onDelete("CASCADE");
    });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
