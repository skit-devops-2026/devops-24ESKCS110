# DevVault

# Database Design Document

---

# 1. Introduction

DevVault uses **MongoDB** as its database because it stores data in JSON-like documents, making it a good fit for JavaScript applications built with the MERN stack.

The backend uses **Mongoose** to define schemas, validate data, and interact with MongoDB.

---

# 2. Database Collections

The application will use the following collections:

- Users
- Notes
- Resources
- CodeSnippets
- BugLogs
- Projects (Optional)

---

# 3. Collection Design

## 3.1 Users

Stores user account information.

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| _id | ObjectId | Yes | Unique user ID |
| name | String | Yes | Full name |
| email | String | Yes | User email (unique) |
| password | String | Yes | Hashed password |
| profileImage | String | No | Profile picture URL |
| createdAt | Date | Yes | Account creation time |
| updatedAt | Date | Yes | Last update time |

---

## 3.2 Notes

Stores personal technical notes.

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| _id | ObjectId | Yes | Note ID |
| userId | ObjectId | Yes | Owner of the note |
| projectId | ObjectId | No | Related project |
| title | String | Yes | Note title |
| content | String | Yes | Note content |
| tags | Array<String> | No | Keywords |
| favorite | Boolean | No | Favorite note |
| archived | Boolean | No | Archived note |
| createdAt | Date | Yes | Creation date |
| updatedAt | Date | Yes | Last update |

---

## 3.3 Resources

Stores external learning resources.

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| _id | ObjectId | Yes | Resource ID |
| userId | ObjectId | Yes | Owner |
| projectId | ObjectId | No | Related project |
| title | String | Yes | Resource title |
| type | String | Yes | YouTube, GitHub, Blog, PDF, Website, etc. |
| url | String | Yes | Resource link |
| description | String | No | Short description |
| tags | Array<String> | No | Keywords |
| favorite | Boolean | No | Favorite resource |
| archived | Boolean | No | Archived resource |
| createdAt | Date | Yes | Creation date |
| updatedAt | Date | Yes | Last update |

---

## 3.4 CodeSnippets

Stores reusable code.

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| _id | ObjectId | Yes | Snippet ID |
| userId | ObjectId | Yes | Owner |
| projectId | ObjectId | No | Related project |
| title | String | Yes | Snippet title |
| language | String | Yes | Programming language |
| description | String | No | Short explanation |
| code | String | Yes | Source code |
| tags | Array<String> | No | Keywords |
| favorite | Boolean | No | Favorite snippet |
| archived | Boolean | No | Archived snippet |
| createdAt | Date | Yes | Creation date |
| updatedAt | Date | Yes | Last update |

---

## 3.5 BugLogs

Stores solved bugs and their solutions.

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| _id | ObjectId | Yes | Bug ID |
| userId | ObjectId | Yes | Owner |
| projectId | ObjectId | No | Related project |
| title | String | Yes | Bug title |
| error | String | Yes | Error message |
| cause | String | Yes | Root cause |
| solution | String | Yes | Solution |
| technology | String | Yes | Related technology |
| resourceLink | String | No | Helpful documentation |
| tags | Array<String> | No | Keywords |
| favorite | Boolean | No | Favorite bug |
| archived | Boolean | No | Archived bug |
| createdAt | Date | Yes | Creation date |
| updatedAt | Date | Yes | Last update |

---

## 3.6 Projects (Optional)

Projects group related notes, resources, snippets, and bug logs.

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| _id | ObjectId | Yes | Project ID |
| userId | ObjectId | Yes | Owner |
| title | String | Yes | Project name |
| description | String | No | Project description |
| status | String | Yes | Planned, Active, Completed |
| createdAt | Date | Yes | Creation date |
| updatedAt | Date | Yes | Last update |

---

# 4. Collection Relationships

```

User
│
├── Notes
├── Resources
├── CodeSnippets
├── BugLogs
└── Projects

Project (Optional)
│
├── Notes
├── Resources
├── CodeSnippets
└── BugLogs

```

Each user owns their own data.

Projects are optional and are used only when users want to group related information.

---

# 5. Common Fields

Most collections share the following fields:

| Field | Purpose |
|--------|----------|
| userId | Identifies the owner |
| projectId | Links to a project (optional) |
| tags | Helps organize and search |
| favorite | Marks important items |
| archived | Hides items without deleting them |
| createdAt | Creation timestamp |
| updatedAt | Last modification timestamp |

This keeps the database structure consistent across the application.

---

# 6. Design Decisions

### Why MongoDB?

- Flexible document-based database.
- Works naturally with JavaScript.
- Easy to scale and modify during development.

---

### Why Projects are Optional?

Not every note or resource belongs to a project.

For example, a user may save "React Hooks Notes" without working on a React project.

Making projects optional provides greater flexibility.

---

### Why Tags are Strings?

Using an array of strings keeps the implementation simple.

Examples:

- React
- MongoDB
- Express
- JWT

This is sufficient for the first version of DevVault.

---

### Why Favorite and Archived are Boolean Fields?

These are simple states of an item.

Using boolean fields makes filtering fast and avoids unnecessary collections.

---

### Why No Folder Collection?

Projects and tags already provide enough organization for the MVP.

Adding folders would increase complexity without significant benefit.

Folders can be introduced in a future version if needed.

---

# 7. Summary

The database design focuses on simplicity, consistency, and future scalability.

Every knowledge item belongs to a user, can optionally belong to a project, and supports tags, favorites, and archiving.

This design covers all required functionality for the first version of DevVault while remaining easy to implement and understand.