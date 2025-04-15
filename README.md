# Agile AI Support Desk

A modern, AI-powered support desk application that combines agile project management with intelligent ticket handling. Built with React, TypeScript, and Ollama integration for AI features.

 ![image](https://github.com/user-attachments/assets/a58b3895-7b3f-4652-a74e-591fab5f2827)
## 🌟 Features

### Dashboard
- Real-time ticket statistics and metrics
- Interactive charts showing ticket distribution by category and priority
- Recent ticket activity feed
- AI agent status monitoring
- Performance metrics including resolution times and trends

### Ticket Management
- Comprehensive ticket lifecycle management
- Advanced filtering and search capabilities
- Priority-based ticket organization
- Category-based classification
- Real-time status updates
- Detailed ticket history tracking

### AI-Powered Features
- *Sentiment Analysis*: Analyzes customer ticket sentiment
- *Smart Routing*: Automatically assigns tickets to appropriate teams
- *Time Estimation*: Predicts resolution time for tickets
- *Recommendations*: Suggests solutions based on historical data
- *Action Planning*: Generates step-by-step resolution plans
- *Ticket Summarization*: Creates concise summaries of lengthy tickets

### Analytics
- Ticket distribution visualization
- Priority-based analytics
- Resolution time tracking
- Team performance metrics
- Customer satisfaction tracking

## 🛠 Tech Stack

### Frontend
- *Core*: React 18 with TypeScript
- *Build Tool*: Vite
- *UI Components*: shadcn-ui (Radix UI)
- *Styling*: Tailwind CSS
- *State Management*: TanStack Query (React Query)
- *Charts*: Recharts
- *Forms*: React Hook Form + Zod
- *Routing*: React Router DOM
- *Notifications*: Sonner

### Backend
- *Framework*: Flask (Python)
- *AI Integration*: Ollama
- *LLM Support*: Default model - llama3
- *API*: RESTful endpoints
- *CORS*: Enabled for cross-origin requests

## 📦 Prerequisites

- Node.js (Latest LTS version)
- Python 3.8+
- Ollama installed locally
- npm or bun package manager

 


## 🚀 Getting Started

1. *Clone the repository*
bash
git clone https://github.com/AP4549/Agile-Support.git
cd Agile-Support


2. *Frontend Setup*
bash
# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev


3. *Backend Setup*
bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py


4. *Ollama Setup*
bash
# Pull the default model
ollama pull llama3
Ensure Ollama is running at http://localhost:11434


## 🔧 Configuration

### Environment Variables

Create a .env file in the root directory:
env
# Frontend
VITE_API_URL=http://localhost:5000

# Backend
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3


### Available Scripts

- npm run dev - Start development server
- npm run build - Build for production
- npm run preview - Preview production build
- npm run lint - Run ESLint

## 📁 Project Structure

### Key Directories and Files

#### Frontend (/src)
- *components/*: Reusable React components
  - ui/: Base UI components (buttons, inputs, cards)
  - dashboard/: Dashboard-specific components (charts, stats)
  - tickets/: Ticket management components
  - layout/: Layout and structure components
- *pages/*: Page components and routing logic
- *hooks/*: Custom React hooks for shared logic
- *lib/*: Utility functions and helper methods
- *types/*: TypeScript type definitions and interfaces

#### Backend (/backend)
- *agents/*: AI agent implementations
  - actions_agent.py: Generates action plans
  - recommendations_agent.py: Provides solution recommendations
  - router_agent.py: Handles ticket routing
  - sentiment_analyzer.py: Analyzes ticket sentiment
  - summarizer_agent.py: Creates ticket summaries
  - time_estimator.py: Estimates resolution time
- *data/*: Data management and storage
- *app.py*: Flask application setup
- *routes.py*: API endpoint definitions
- *agent_service.py*: AI agent coordination
- *ollama_service.py*: Ollama LLM integration
- *ticket_service.py*: Ticket operations
- *data_loader.py*: Data loading utilities
- *utils.py*: Helper functions

#### Configuration Files
- tsconfig.json: TypeScript compiler options
- vite.config.ts: Vite bundler configuration
- tailwind.config.ts: Tailwind CSS customization
- postcss.config.js: PostCSS processing setup
- package.json: Project metadata and dependencies

#### Static Assets (/public)
- Static files served directly by the web server
- Images, icons, and other media assets

This structure follows a modular architecture that separates concerns between frontend and backend, with clear organization of AI capabilities, UI components, and business logic.
## 🤖 AI Agents

The application includes several specialized AI agents:
- *Sentiment Analyzer*: Evaluates ticket tone and urgency
- *Router Agent*: Determines optimal ticket routing
- *Time Estimator*: Predicts resolution timeframes
- *Recommendations Agent*: Suggests solutions
- *Summarizer Agent*: Creates ticket summaries
- *Actions Agent*: Generates action plans

## 🎨 Customization

### Theme
- Customizable through Tailwind configuration
- Dark/Light mode support
- Configurable color schemes
- Custom component styling

### AI Models
- Configurable through environment variables
- Supports any Ollama-compatible model
- Adjustable parameters per agent

## 🔐 Security

- CORS protection
- Environment variable management
- Secure API endpoints
- Type-safe implementations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙋‍♂ Support

For support:
- Open an issue in the [GitHub repository](https://github.com/AP4549/Agile-Support)
- Check existing documentation
- Contact the development team
