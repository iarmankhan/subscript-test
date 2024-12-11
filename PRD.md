
# Common features

- Users management
  - Permissions
- Organisations management
  - Projects management
    - Task management
      - Assignees
      - Comments
      - Timeline

## DB Schema

- Users
  - id -- PK -- uuid
  - name -- varchar
  - email -- varchar
  - password_hash -- varchar
  - created_at -- timestampz
  - updated_at -- timestampz
- Organisations
  - id -- PK -- uuid
  - name -- varchar
  - description -- text
  - created_by -- FK -- users.id
  - created_at -- timestampz
  - updated_at -- timestampz
- OrgMembers
  - id -- PK -- uuid
  - org_id -- FK -- organisations.id
  - user_id -- FK -- users.id
  - status (ACTIVE, INACTIVE) -- enum
  - role (ADMIN, MANAGER, USER) -- enum
  - created_at -- timestampz
  - updated_at -- timestampz
- Projects
  - id -- PK -- uuid
  - org_id -- FK -- organisation.id
  - name -- varchar
  - description -- text
  - created_by -- FK -- orgmembers.id
  - created_at -- timestampz
  - updated_at -- timestampz
- ProjectsMembers
  - id -- PK -- uuid
  - project_id -- FK -- projects.id
  - org_member_id -- FK -- orgmembers.id
  - created_at -- timestampz
  - updated_at -- timestampz
- Tasks
  - id -- PK -- uuid
  - project_id -- FK -- projects.id
  - title -- varchar
  - description -- text
  - status (OPEN, IN_PROGRESS, CLOSED) -- enum
  - created_by -- FK -- users.id
  - created_at -- timestampz
  - updated_at -- timestampz
- TasksAssignees
  - id -- PK -- uuid
  - task_id -- FK -- tasks.id
  - project_member_id -- FK -- projects_members.id
  - created_at -- timestampz
- Comments
  - id -- PK -- uuid
  - task_id -- FK -- tasks.id
  - content -- text
  - created_at -- timestampz
  - updated_at -- timestampz

## API design

1. Authentication

- POST /login
- email
- password
- POST /register
- name
- email
- password

2. Users

- GET /me
- Returns the currently logged in user
- PATCH /me
- Allows user to update their own profile
- body:
- name
- password

3. Organisations

- POST /organisations
- This will allow currently logged in user to create a new org
- body:
- name
- description
- DELETE /organisations/:orgId
- this will allow org admin to delete the org
- GET /organisations
- This will return orgs which logged in user is part of
- GET /organisations/:orgId
- This will return a specific org
- POST /organisations/members
- This will allow admin to add new members to the org
- body:
- user_id
- DELETE /organisations/members/:memberId
- This will allow admin to remove members from the org
- Internally we can do the soft delete (deactivate the user)

4. Projects

- POST /organisations/:orgId/projects
- This will allow user to create a project for some org
- body:
- name
- description
- GET /orgnaisations/:orgId/projects
- This will list all the projects for some org
- GET /organisations/:orgId/projects/:projectId
- This will return details of a specific project
- DELETE /organisations/:orgId/projects/:projectId
- This will allow admin to delete the project
- PATCH /organisations/:orgId/projects/:projectId
- This will allow admin to update the project
- POST /organisations/:orgId/projects/:projectId/members
- This will allow us to add new member to the project
- body:
- org_member_id -- uuid
- DELETE /organisations/:orgId/projects/:projectId/members/:memberId
- This will remove the member from the project

5. Tasks

- base url: /organisations/:orgId/projects/:projectId

- POST /tasks
- this will create a task in the specified project
- body:
- title
- description
- PATCH /tasks/:taskId
- update a task
- body:
- title
- description
- status
- DELETE /tasks/:taskId
- delete a task
- GET /tasks
- List down all tasks
- GET /tasks/:taskId
- List specific task
- POST /tasks/:taskId/assignees
- Add assignee to the task
- body:
- project_member_id: uuid
- DELETE /tasks/:taskId/assignees/:assignee_id
- Remove assignee from the task

- POST /tasks/:taskId/comments
- Add a new comment
- body:
- content
- DELETE /tasks/:tasksId/comments/:commentId
- Delete a comment
