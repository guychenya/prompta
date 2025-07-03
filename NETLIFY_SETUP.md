# Netlify Environment Variables Configuration

## Required Environment Variables

You need to configure the following environment variable in your Netlify dashboard:

### DATABASE_URL
Your Neon database connection string. This should look like:
```
postgresql://username:password@hostname:port/database?sslmode=require
```

## How to Configure in Netlify

1. **Via Netlify Dashboard:**
   - Go to your site's dashboard on Netlify
   - Navigate to "Site configuration" → "Environment variables"
   - Click "Add a variable"
   - Set the key as `DATABASE_URL`
   - Set the value as your Neon database connection string
   - Click "Save"

2. **Via Netlify CLI:**
   ```bash
   netlify env:set DATABASE_URL "your-neon-connection-string"
   ```

3. **Via netlify.toml (not recommended for sensitive data):**
   ```toml
   [build.environment]
   DATABASE_URL = "your-neon-connection-string"
   ```

## Database Schema

Make sure your Neon database has the following table structure:

```sql
CREATE TABLE prompts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    category VARCHAR(100),
    type VARCHAR(50),
    tags TEXT,
    author VARCHAR(100),
    use_case TEXT,
    example_input TEXT,
    example_output TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

Once deployed, your API will be available at:

- `GET /.netlify/functions/prompts` - Get all prompts (with optional query params)
- `GET /.netlify/functions/prompts/:id` - Get a specific prompt
- `POST /.netlify/functions/prompts` - Create a new prompt
- `PUT /.netlify/functions/prompts/:id` - Update a prompt
- `DELETE /.netlify/functions/prompts/:id` - Delete a prompt

## Query Parameters for GET /prompts

- `category` - Filter by category
- `type` - Filter by type
- `search` - Search in title, description, and tags
- `limit` - Number of results to return (default: 100)
- `offset` - Number of results to skip (default: 0)

## Example Usage

```javascript
// Get all prompts
fetch('/.netlify/functions/prompts')
  .then(response => response.json())
  .then(data => console.log(data));

// Get prompts with filtering
fetch('/.netlify/functions/prompts?category=technical&search=javascript&limit=10')
  .then(response => response.json())
  .then(data => console.log(data));

// Create a new prompt
fetch('/.netlify/functions/prompts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'My New Prompt',
    description: 'A helpful prompt for...',
    content: 'You are a helpful assistant...',
    category: 'technical',
    type: 'conversational',
    tags: 'javascript, programming',
    author: 'Your Name'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Security Notes

- Never commit your database connection string to version control
- Use environment variables for all sensitive configuration
- The API includes CORS headers for cross-origin requests
- Consider implementing authentication for write operations in production