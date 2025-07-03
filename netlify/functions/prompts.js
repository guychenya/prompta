const { query } = require('./db');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { httpMethod, path, body } = event;
    
    // Extract ID from path if present (e.g., /api/prompts/123)
    const pathParts = path.split('/');
    const id = pathParts[pathParts.length - 1];
    const hasId = id && id !== 'prompts' && !isNaN(id);

    switch (httpMethod) {
      case 'GET':
        if (hasId) {
          // Get single prompt by ID
          const result = await query(
            'SELECT * FROM prompts WHERE id = $1',
            [id]
          );
          
          if (result.rows.length === 0) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Prompt not found' })
            };
          }
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result.rows[0])
          };
        } else {
          // Get all prompts with optional filtering
          const queryParams = event.queryStringParameters || {};
          const { category, type, search, limit = 100, offset = 0 } = queryParams;
          
          let sql = 'SELECT * FROM prompts WHERE 1=1';
          const params = [];
          let paramCount = 0;
          
          if (category) {
            paramCount++;
            sql += ` AND category = $${paramCount}`;
            params.push(category);
          }
          
          if (type) {
            paramCount++;
            sql += ` AND type = $${paramCount}`;
            params.push(type);
          }
          
          if (search) {
            paramCount++;
            sql += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount} OR tags ILIKE $${paramCount})`;
            params.push(`%${search}%`);
          }
          
          sql += ' ORDER BY created_at DESC';
          
          paramCount++;
          sql += ` LIMIT $${paramCount}`;
          params.push(parseInt(limit));
          
          paramCount++;
          sql += ` OFFSET $${paramCount}`;
          params.push(parseInt(offset));
          
          const result = await query(sql, params);
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              prompts: result.rows,
              total: result.rowCount
            })
          };
        }

      case 'POST':
        // Create new prompt
        const newPrompt = JSON.parse(body);
        const {
          title,
          description,
          content,
          category,
          type,
          tags,
          author,
          use_case,
          example_input,
          example_output
        } = newPrompt;
        
        const insertResult = await query(
          `INSERT INTO prompts (title, description, content, category, type, tags, author, use_case, example_input, example_output, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
           RETURNING *`,
          [title, description, content, category, type, tags, author, use_case, example_input, example_output]
        );
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(insertResult.rows[0])
        };

      case 'PUT':
        // Update existing prompt
        if (!hasId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Prompt ID is required for updates' })
          };
        }
        
        const updatePrompt = JSON.parse(body);
        const {
          title: updateTitle,
          description: updateDescription,
          content: updateContent,
          category: updateCategory,
          type: updateType,
          tags: updateTags,
          author: updateAuthor,
          use_case: updateUseCase,
          example_input: updateExampleInput,
          example_output: updateExampleOutput
        } = updatePrompt;
        
        const updateResult = await query(
          `UPDATE prompts 
           SET title = $1, description = $2, content = $3, category = $4, type = $5, 
               tags = $6, author = $7, use_case = $8, example_input = $9, 
               example_output = $10, updated_at = NOW()
           WHERE id = $11
           RETURNING *`,
          [updateTitle, updateDescription, updateContent, updateCategory, updateType, 
           updateTags, updateAuthor, updateUseCase, updateExampleInput, updateExampleOutput, id]
        );
        
        if (updateResult.rows.length === 0) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Prompt not found' })
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(updateResult.rows[0])
        };

      case 'DELETE':
        // Delete prompt
        if (!hasId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Prompt ID is required for deletion' })
          };
        }
        
        const deleteResult = await query(
          'DELETE FROM prompts WHERE id = $1 RETURNING *',
          [id]
        );
        
        if (deleteResult.rows.length === 0) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Prompt not found' })
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Prompt deleted successfully' })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};