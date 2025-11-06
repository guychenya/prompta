document.addEventListener('DOMContentLoaded', () => {
    const addPromptForm = document.getElementById('addPromptForm');
    const promptsListDiv = document.getElementById('promptsList');
    const messageArea = document.getElementById('messageArea');

    async function showMessage(message, type = 'success') {
        messageArea.innerHTML = `<div class="message ${type}">${message}</div>`;
        setTimeout(() => {
            messageArea.innerHTML = '';
        }, 5000);
    }

    async function fetchAndDisplayPrompts() {
        promptsListDiv.innerHTML = '<p>Loading prompts...</p>';
        try {
            const response = await fetch('/api/prompts');
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch prompts: ${response.status} ${response.statusText} - ${errorText}`);
            }
            const data = await response.json();
            
            // Assuming the API returns an object with a 'prompts' array, similar to prompts.json
            const prompts = data.prompts || data; 

            if (prompts.length === 0) {
                promptsListDiv.innerHTML = '<p>No prompts found. Add one using the form above.</p>';
                return;
            }

            promptsListDiv.innerHTML = '';
            prompts.forEach(prompt => {
                const promptItem = document.createElement('div');
                promptItem.className = 'prompt-item';
                promptItem.innerHTML = `
                    <div class="prompt-item-details">
                        <h3>${prompt.title} (${prompt.id})</h3>
                        <p>${prompt.description}</p>
                    </div>
                    <div class="prompt-item-actions">
                        <button class="btn btn-secondary edit-btn" data-id="${prompt.id}">Edit</button>
                        <button class="btn btn-danger delete-btn" data-id="${prompt.id}">Delete</button>
                    </div>
                `;
                promptsListDiv.appendChild(promptItem);
            });

            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', (e) => editPrompt(e.target.dataset.id));
            });
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (e) => deletePrompt(e.target.dataset.id));
            });

        } catch (error) {
            console.error('Error fetching prompts:', error);
            showMessage(`Error loading prompts: ${error.message}`, 'error');
            promptsListDiv.innerHTML = '<p>Error loading prompts. Please check the console for details.</p>';
        }
    }

    addPromptForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPrompt = {
            id: document.getElementById('promptId').value,
            title: document.getElementById('promptTitle').value,
            description: document.getElementById('promptDescription').value,
            prompt_text: document.getElementById('promptText').value,
            category: document.getElementById('promptCategory').value,
            subcategory: document.getElementById('promptSubcategory').value,
            complexity: document.getElementById('promptComplexity').value,
            target_ai: document.getElementById('promptTargetAi').value.split(',').map(s => s.trim()).filter(s => s),
            use_cases: document.getElementById('promptUseCases').value.split(',').map(s => s.trim()).filter(s => s),
            tags: document.getElementById('promptTags').value.split(',').map(s => s.trim()).filter(s => s),
            usage_example: document.getElementById('promptUsageExample').value,
            source: {
                repository: document.getElementById('promptSourceRepo').value,
                license: document.getElementById('promptSourceLicense').value,
                attribution: ""
            },
            created_date: new Date().toISOString().split('T')[0],
            last_updated: new Date().toISOString().split('T')[0]
        };

        console.log('Simulating POST request to /api/prompts with data:', newPrompt);
        // In a real scenario, you would send this data to your backend API
        try {
            const response = await fetch('/api/prompts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPrompt),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to add prompt: ${response.status} ${response.statusText} - ${errorText}`);
            }

            showMessage('Prompt added successfully!');
            addPromptForm.reset();
            fetchAndDisplayPrompts(); // Refresh the list
        } catch (error) {
            console.error('Error adding prompt:', error);
            showMessage(`Error adding prompt: ${error.message}`, 'error');
        }
    });

    async function editPrompt(id) {
        console.log(`Simulating GET request to /api/prompts/${id} for editing`);
        // In a real scenario, you would fetch the prompt data to pre-fill the form
        // For now, we'll just log and show a message
        showMessage(`Simulating edit for prompt ID: ${id}. You would typically load this into the form.`, 'info');
    }

    async function deletePrompt(id) {
        if (!confirm(`Are you sure you want to delete prompt ID: ${id}?`)) {
            return;
        }

        console.log(`Simulating DELETE request to /api/prompts/${id}`);
        // In a real scenario, you would send a DELETE request to your backend API
        try {
            const response = await fetch(`/api/prompts/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete prompt: ${response.status} ${response.statusText} - ${errorText}`);
            }

            showMessage('Prompt deleted successfully!');
            fetchAndDisplayPrompts(); // Refresh the list
        } catch (error) {
            console.error('Error deleting prompt:', error);
            showMessage(`Error deleting prompt: ${error.message}`, 'error');
        }
    }

    // Initial fetch and display
    fetchAndDisplayPrompts();
});