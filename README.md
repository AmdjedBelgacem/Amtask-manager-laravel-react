
# Task Manager Application Documentation

## Backend (Laravel)

### Setup

**Cloning the Repository:**
First, you’ll want to clone the repository to your  machine to work on it locally. Here’s how you do it:

```sh
git clone https://github.com/yourusername/task-manager-backend.git
cd task-manager-backend
```

**Installing Dependencies:**
Next, you’ll need to install all the necessary packages that Laravel needs. This includes things like the framework itself, database drivers, and any other libraries we might be using. Running the following command will pull in all these dependencies:

```sh
composer install
```

**Environment Configuration:**
Now, you’ll need to set up your environment variables. This is where Laravel mark database, app URL, and other settings. Copy the `.env.example` file to `.env` and tweak the settings to match your local environment.  set your database credentials here.

**Database Migration:**
Once your environment is set up, you’ll need to create the database tables with migrations. Running the following command will create all the necessary tables based on the migration files:

```sh
php artisan migrate
```

**Running the Application:**
Finally, you can fire up the development server. This will make your backend accessible at `http://localhost:8000`. Just run:

```sh
php artisan serve
```

And there you have it! Your backend is up and running.

### API Endpoints

**User Authentication:**
We have three main endpoints for authentication:

- **Signup:** `POST /api/signup` – This is where new users will sign up. They’ll send their name, email, and password, and the backend will create a new user record.

- **Login:** `POST /api/login` – Existing users will use this endpoint to log in. They’ll provide their email and password, and the backend will return an authentication token.

- **Logout:** `POST /api/logout` – When users are done, they can log out to invalidate their current token.

**Task Management:**
Tasks are the core of our application. Here’s how users can manage them:

- **Create Task:** `POST /api/tasks` – Users can create new tasks by sending a title, description, status, and due date.

- **Get Tasks:** `GET /api/tasks` – Fetch all tasks for the authenticated user.

- **Update Task:** `PUT /api/tasks/{task}` – Update an existing task. Users can change the title, description, status, or due date.

- **Delete Task:** `DELETE /api/tasks/{task}` – Remove a task from the system.

- **Priority Tasks:** `GET /api/tasks/priority` – Fetch tasks that are marked as priority.

**Folder Management:**
Folders help users organize their tasks:

- **Create Folder:** `POST /api/folders` – Create a new folder with a name.

- **Get Folders:** `GET /api/folders` – Fetch all folders for the authenticated user.

- **Add Task to Folder:** `POST /api/folders/{folder}/add-task` – Add a task to a specific folder.

- **Remove Task from Folder:** `DELETE /api/folders/{folder}/remove-task/{task}` – Remove a task from a folder.

- **Reorder Tasks in Folder:** `PUT /api/folders/{folder}/reorder-tasks` – Change the order of tasks within a folder.

### Database Schema

**Users Table:**
This table stores user information. It includes fields like `id`, `name`, `email`, `password`, `is_premium`, `created_at`, and `updated_at`.

**Tasks Table:**
Tasks are stored here. Fields include `id`, `user_id`, `title`, `description`, `status`, `due_date`, `order`, `priority`, `created_at`, and `updated_at`.

**Folders Table:**
Folders help organize tasks. Fields are `id`, `user_id`, `name`, `created_at`, and `updated_at`.

**Task_Folder Pivot Table:**
This table links tasks to folders. It has `task_id`, `folder_id`, and `order`.

### Security

**Token-Based Authentication:**
Laravel Sanctum is used for authentication. When users log in, they receive a token that they must include in their API requests. This ensures that only authenticated users can access protected endpoints.

**Input Validation:**
All user inputs are validated to prevent malicious data from being submitted. For example, when creating a task, we check that the title is present and the status is one of the allowed values.

**Password Hashing:**
Passwords are securely hashed using Laravel’s built-in hashing mechanism (bycrypt in this case). This ensures that even if the database is compromised, user passwords remain protected.

### Asynchronous Operations

**Email Notifications:**
When a new task is created, the server sends an email notification to the user. This is handled asynchronously using Laravel Queues, which means the main application doesn’t have to wait for the email to be sent before responding to the user.

### Documentation & Testing

**Unit/Feature Tests:**
I would like to write tests but i was charged up with work, tests will be added in the future.

### CI/CD

**GitHub Actions:**
CI/CD pipeline is set up using GitHub Actions. This runs tests and checks code quality whenever there’s a push or pull request. This helps catch issues early and ensures that the codebase remains healthy.

## Frontend (React)

**Running Endpoint:**
You can access the frontend using the following url: https://task-manager-yxfl08yhn-amdjedbelgacems-projects.vercel.app/

### Setup

**Cloning the Repository:**
First, clone the frontend repository:

```sh
git clone https://github.com/yourusername/task-manager-frontend.git
cd task-manager-frontend
```

**Installing Dependencies:**
Next, install the necessary packages:

```sh
npm install
```

**Running the Application:**
Finally, start the development server:

```sh
npm start
```

### Usage

**Register/Login:**
Users can register or log in using the forms provided. This interacts with the backend’s authentication endpoints.

**Task Management:**
Users can create, update, and delete tasks. The frontend sends requests to the backend’s task management endpoints.

Users are able to drag and drop tasks and change their location. The frontend sends requests to the backend’s task management endpoints. 

**Folder Management:**
Users can create folders and add/remove tasks from them. This is handled through the backend’s folder management endpoints.

### Features

**Styling with Tailwind CSS:**
Tailwind CSS is used for styling, which provides a set of utility classes to build responsive designs quickly.

**Animations with Framer Motion:**
Framer Motion is used for smooth animations, making the user interface more engaging.

**API Integration with Axios:**
Axios is used to make HTTP requests to the backend. This allows the frontend to interact with the backend’s APIs.

### Bonus Features

**Payment Gateway Simulation:**
mock payment gateway had been added to simulate premium features. This allows users to “upgrade” to a premium account, which unlocks additional features like priority tasks.

## Deployment

The application is deployed on Vercel. You can access it [here](will be updated).
