// Prompts Hub JavaScript Application
// Easy to customize and extend

class PromptsHub {
    constructor() {
        this.prompts = [];
        this.filteredPrompts = [];
        this.currentView = 'grid';
        this.filters = {
            search: '',
            category: '',
            subcategory: '',
            complexity: '',
            aiModel: ''
        };
        
        this.init();
    }

    async init() {
        await this.loadPrompts();
        this.setupEventListeners();
        this.populateFilterOptions();
        this.renderPrompts();
        this.updateStats();
    }

    async loadPrompts() {
        try {
            // Try to load from the data directory
            const response = await fetch('/data/prompts.json');
            console.log('Fetch response:', response); // Log the raw response
            if (!response.ok) {
                const errorText = await response.text(); // Try to read response body for more info
                throw new Error(`Could not load prompts data: ${response.status} ${response.statusText} - ${errorText}`);
            }
            const jsonData = await response.json(); // Parse JSON
            console.log('Parsed JSON data:', jsonData); // Log the parsed JSON object
            this.prompts = jsonData.prompts;
            this.filteredPrompts = [...this.prompts];
        } catch (error) {
            console.error('Error loading prompts:', error);
            this.showError('Could not load prompts database. Please ensure the data files are available.');
        }
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        // Filter selects
        ['categoryFilter', 'subcategoryFilter', 'complexityFilter', 'aiModelFilter'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.applyFilters());
            }
        });

        // View toggle buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.toggleView(view);
            });
        });

        // Category filter changes should update subcategory options
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.updateSubcategoryOptions();
                this.applyFilters();
            });
        }
    }

    populateFilterOptions() {
        this.populateSubcategoryOptions();
    }

    populateSubcategoryOptions() {
        const subcategoryFilter = document.getElementById('subcategoryFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        
        if (!subcategoryFilter || !categoryFilter) return;

        const selectedCategory = categoryFilter.value;
        const subcategories = new Set();

        this.prompts.forEach(prompt => {
            if (!selectedCategory || prompt.category === selectedCategory) {
                subcategories.add(prompt.subcategory);
            }
        });

        // Clear existing options (except "All")
        subcategoryFilter.innerHTML = '<option value="">All Subcategories</option>';
        
        // Add new options
        Array.from(subcategories).sort().forEach(subcategory => {
            const option = document.createElement('option');
            option.value = subcategory;
            option.textContent = this.formatSubcategoryName(subcategory);
            subcategoryFilter.appendChild(option);
        });
    }

    updateSubcategoryOptions() {
        this.populateSubcategoryOptions();
        // Reset subcategory filter when category changes
        const subcategoryFilter = document.getElementById('subcategoryFilter');
        if (subcategoryFilter) {
            subcategoryFilter.value = '';
            this.filters.subcategory = '';
        }
    }

    formatSubcategoryName(subcategory) {
        return subcategory
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    applyFilters() {
        // Get current filter values
        this.filters.category = document.getElementById('categoryFilter')?.value || '';
        this.filters.subcategory = document.getElementById('subcategoryFilter')?.value || '';
        this.filters.complexity = document.getElementById('complexityFilter')?.value || '';
        this.filters.aiModel = document.getElementById('aiModelFilter')?.value || '';

        // Apply filters
        this.filteredPrompts = this.prompts.filter(prompt => {
            // Search filter
            if (this.filters.search) {
                const searchFields = [
                    prompt.title,
                    prompt.description,
                    prompt.prompt_text,
                    ...prompt.tags
                ].join(' ').toLowerCase();
                
                if (!searchFields.includes(this.filters.search)) {
                    return false;
                }
            }

            // Category filter
            if (this.filters.category && prompt.category !== this.filters.category) {
                return false;
            }

            // Subcategory filter
            if (this.filters.subcategory && prompt.subcategory !== this.filters.subcategory) {
                return false;
            }

            // Complexity filter
            if (this.filters.complexity && prompt.complexity !== this.filters.complexity) {
                return false;
            }

            // AI Model filter
            if (this.filters.aiModel) {
                if (this.filters.aiModel === 'any') {
                    if (!prompt.target_ai.includes('any')) {
                        return false;
                    }
                } else if (!prompt.target_ai.includes(this.filters.aiModel)) {
                    return false;
                }
            }

            return true;
        });

        this.renderPrompts();
        this.updateStats();
    }

    renderPrompts() {
        const container = document.getElementById('promptsContainer');
        const loading = document.getElementById('loadingSpinner');
        const noResults = document.getElementById('noResults');

        if (!container) return;

        // Hide loading
        if (loading) loading.style.display = 'none';

        // Show/hide no results
        if (noResults) {
            noResults.style.display = this.filteredPrompts.length === 0 ? 'block' : 'none';
        }

        // Show container
        container.style.display = this.filteredPrompts.length > 0 ? 'block' : 'none';

        // Update container class based on view
        container.className = this.currentView === 'grid' ? 'prompts-grid' : 'prompts-list';

        // Render prompts
        container.innerHTML = this.filteredPrompts.map(prompt => this.renderPromptCard(prompt)).join('');
    }

    renderPromptCard(prompt) {
        const categoryIcon = this.getCategoryIcon(prompt.category);
        const complexityColor = this.getComplexityColor(prompt.complexity);
        
        return `
            <div class="prompt-card ${this.currentView === 'list' ? 'list-view' : ''}" onclick="openPromptModal('${prompt.id}')">
                <div class="prompt-header">
                    <div class="prompt-category" style="background-color: ${complexityColor}">
                        ${categoryIcon} ${this.formatSubcategoryName(prompt.subcategory)}
                    </div>
                </div>
                
                <h3 class="prompt-title">${this.escapeHtml(prompt.title)}</h3>
                <p class="prompt-description">${this.escapeHtml(prompt.description)}</p>
                
                <div class="prompt-meta">
                    <span class="meta-tag">📂 ${prompt.category}</span>
                    <span class="meta-tag">🎯 ${prompt.complexity}</span>
                    <span class="meta-tag">🤖 ${prompt.target_ai.join(', ')}</span>
                </div>
                
                <div class="prompt-tags">
                    ${prompt.tags.slice(0, 4).map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                    ${prompt.tags.length > 4 ? `<span class="tag">+${prompt.tags.length - 4} more</span>` : ''}
                </div>
            </div>
        `;
    }

    getCategoryIcon(category) {
        const icons = {
            'conversational': '💬',
            'system': '⚙️',
            'template': '📝'
        };
        return icons[category] || '📋';
    }

    getComplexityColor(complexity) {
        const colors = {
            'basic': '#10b981',
            'intermediate': '#f59e0b',
            'advanced': '#ef4444',
            'expert': '#8b5cf6'
        };
        return colors[complexity] || '#64748b';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateStats() {
        const filteredElement = document.getElementById('filteredPrompts');
        if (filteredElement) {
            filteredElement.textContent = this.filteredPrompts.length;
        }
    }

    toggleView(view) {
        this.currentView = view;
        
        // Update button states
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        this.renderPrompts();
    }

    clearFilters() {
        // Reset all filters
        this.filters = {
            search: '',
            category: '',
            subcategory: '',
            complexity: '',
            aiModel: ''
        };

        // Reset form elements
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';

        ['categoryFilter', 'subcategoryFilter', 'complexityFilter', 'aiModelFilter'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
        });

        // Update subcategory options and apply filters
        this.updateSubcategoryOptions();
        this.applyFilters();
    }

    showError(message) {
        const container = document.getElementById('promptsContainer');
        const loading = document.getElementById('loadingSpinner');
        
        if (loading) loading.style.display = 'none';
        if (container) {
            container.innerHTML = `
                <div class="error-message" style="text-align: center; padding: 2rem; color: var(--error-color);">
                    <h3>⚠️ Error Loading Prompts</h3>
                    <p>${message}</p>
                    <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-secondary);">
                        Make sure you're running this from a web server and the data files are accessible.
                    </p>
                </div>
            `;
            container.style.display = 'block';
        }
    }

    getPromptById(id) {
        return this.prompts.find(prompt => prompt.id === id);
    }
}

// Global functions for HTML event handlers
let promptsHub;

window.addEventListener('DOMContentLoaded', () => {
    promptsHub = new PromptsHub();
});

function searchPrompts() {
    promptsHub.applyFilters();
}

function applyFilters() {
    promptsHub.applyFilters();
}

function clearFilters() {
    promptsHub.clearFilters();
}

function toggleView(view) {
    promptsHub.toggleView(view);
}

function showCategory(category) {
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.value = category;
        promptsHub.applyFilters();
    }
}

function openPromptModal(promptId) {
    const prompt = promptsHub.getPromptById(promptId);
    if (!prompt) return;

    const modal = document.getElementById('promptModal');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
        <div style="margin-top: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <h2 style="margin: 0; color: var(--primary-color);">${promptsHub.escapeHtml(prompt.title)}</h2>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <span class="meta-tag">📂 ${prompt.category}</span>
                    <span class="meta-tag">🎯 ${prompt.complexity}</span>
                </div>
            </div>
            
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.6;">
                ${promptsHub.escapeHtml(prompt.description)}
            </p>
            
            <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: var(--radius-lg); margin-bottom: 1.5rem;">
                <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Prompt:</h3>
                <div style="background: var(--bg-primary); padding: 1rem; border-radius: var(--radius-md); border: 1px solid #e2e8f0; white-space: pre-wrap; font-family: 'Monaco', 'Menlo', monospace; line-height: 1.5;">
${promptsHub.escapeHtml(prompt.prompt_text)}</div>
                <button onclick="copyPrompt('${prompt.id}', event)" style="margin-top: 1rem; background: var(--primary-color); color: white; border: none; padding: 0.5rem 1rem; border-radius: var(--radius-md); cursor: pointer;">
                    📋 Copy Prompt
                </button>
            </div>
            
            ${prompt.usage_example ? `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Usage Example:</h3>
                <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: var(--radius-md); font-style: italic;">
                    ${promptsHub.escapeHtml(prompt.usage_example)}
                </div>
            </div>
            ` : ''}
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                <div>
                    <h4 style="margin-bottom: 0.5rem; color: var(--text-primary);">AI Models:</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                        ${prompt.target_ai.map(ai => `<span class="tag">${ai}</span>`).join('')}
                    </div>
                </div>
                <div>
                    <h4 style="margin-bottom: 0.5rem; color: var(--text-primary);">Use Cases:</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                        ${prompt.use_cases.map(useCase => `<span class="tag">${useCase}</span>`).join('')}
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 0.5rem; color: var(--text-primary);">Tags:</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                    ${prompt.tags.map(tag => `<span class="tag">${promptsHub.escapeHtml(tag)}</span>`).join('')}
                </div>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 1rem; font-size: 0.875rem; color: var(--text-secondary);">
                <strong>Source:</strong> ${prompt.source.repository} (${prompt.source.license})<br>
                <strong>Last Updated:</strong> ${prompt.last_updated}
            </div>
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(event) {
    const modal = document.getElementById('promptModal');
    if (!modal) return;
    
    // Close if clicking outside modal content or on close button
    if (!event || event.target === modal || event.target.classList.contains('close')) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function copyPrompt(promptId) {
    const prompt = promptsHub.getPromptById(promptId);
    if (!prompt) return;

    navigator.clipboard.writeText(prompt.prompt_text).then(() => {
        // Show success feedback
        const button = event.target;
        const originalText = button.innerHTML;
        button.innerHTML = '✅ Copied!';
        button.style.background = 'var(--success-color)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = 'var(--primary-color)';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy to clipboard');
    });
}

function showLicenseInfo() {
    alert('All prompts are licensed under permissive licenses (MIT, CC0, Apache 2.0) allowing commercial use. See LICENSE.md for details.');
}

function showSourceInfo() {
    alert('Prompts sourced from multiple GitHub repositories with proper attribution. See SOURCES.md for complete information.');
}

// Handle escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});