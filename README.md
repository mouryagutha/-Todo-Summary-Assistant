<<<<<<< HEAD
# Todo Summary Assistant

A full-stack application that helps users manage their todos and get AI-powered summaries sent to Slack.



## Features

- Create, edit, and delete todo items
- View list of current todos
- Generate AI-powered summaries of pending todos
- Send summaries directly to Slack
- Real-time updates using Supabase

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI API
- **Communication**: Slack Webhooks

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- OpenAI API key
- Slack workspace with webhook URL

## Slack Channel Integration Details

- This project sends todo summaries directly to your company’s **dedicated Slack channel** via an Incoming Webhook URL.
- You can join this Slack channel to verify that the AI-generated todo summaries are being posted in real-time.
- **Join the Slack channel here:** [Join Our Slack Channel](https://app.slack.com/huddle/T08TNJDK3K4/C08TNJE9482)  
  *(Replace this URL with your actual Slack invite link or Slack channel URL)*
- After joining, create or update todos and trigger the summary to see the messages appear instantly in Slack.


## Setup Instructions

### 1. Clone the Repository

```bash
git clone [repository-url]
cd todo-summary-assistant
```

### 2. Environment Setup

#### Frontend (.env)
Create a `.env` file in the `frontend` directory:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3000
```

#### Backend (.env)
Create a `.env` file in the `backend` directory:
```
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
OPENAI_API_KEY=your_openai_api_key
SLACK_WEBHOOK_URL=your_slack_webhook_url
```

### 3. Database Setup

1. Create a new project in Supabase
2. Create a `todos` table with the following schema:
```sql
create table todos (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 4. Slack Setup

1. Go to your Slack workspace
2. Create a new app or use an existing one
3. Enable Incoming Webhooks
4. Create a new webhook URL for your channel
5. Copy the webhook URL to your backend `.env` file

### 5. OpenAI Setup

1. Create an account on OpenAI
2. Generate an API key
3. Add the API key to your backend `.env` file

### 6. Installation

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 7. Running the Application

```bash
# Start the backend server
cd backend
npm run dev

# Start the frontend development server
cd frontend
npm run dev
```

## API Endpoints

- `GET /api/todos` - Fetch all todos
- `POST /api/todos` - Create a new todo
- `DELETE /api/todos/:id` - Delete a todo
- `POST /api/summarize` - Generate and send todo summary to Slack

## Project Structure

```
todo-summary-assistant/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API services
│   │   └── types/        # TypeScript types
│   └── package.json
├── backend/               # Node.js backend application
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── types/        # TypeScript types
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 
=======
# -Todo-Summary-Assistant
>>>>>>> 80f0a7bafacf3454adb2c4994f47cb0291f2c251
