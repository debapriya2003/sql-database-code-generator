document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const generateBtn = document.getElementById('generateBtn');
    const tableNameInput = document.getElementById('tableName');
    const dbTypeSelect = document.getElementById('dbType');
    const generatedCode = document.getElementById('generatedCode');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const copyCodeBtnSmall = document.getElementById('copyCodeBtnSmall');
    const exportSqlFileBtn = document.getElementById('exportSqlFileBtn');
    const exportClipboardBtn = document.getElementById('exportClipboardBtn');
    const shareBtn = document.getElementById('shareBtn');
    const toast = document.getElementById('toast');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const addColumnBtn = document.getElementById('addColumnBtn');
    const addIndexBtn = document.getElementById('addIndexBtn');
    const addForeignKeyBtn = document.getElementById('addForeignKeyBtn');
    const columnsBody = document.getElementById('columnsBody');
    const indexesBody = document.getElementById('indexesBody');
    const foreignKeysBody = document.getElementById('foreignKeysBody');

    // Sample data types based on database type
    const dataTypes = {
        mysql: ['INT', 'VARCHAR', 'TEXT', 'DATE', 'DATETIME', 'DECIMAL', 'BOOLEAN', 'BLOB'],
        postgresql: ['INTEGER', 'VARCHAR', 'TEXT', 'DATE', 'TIMESTAMP', 'NUMERIC', 'BOOLEAN', 'BYTEA'],
        sqlserver: ['INT', 'VARCHAR', 'NVARCHAR', 'TEXT', 'DATE', 'DATETIME', 'DECIMAL', 'BIT', 'VARBINARY'],
        oracle: ['NUMBER', 'VARCHAR2', 'CLOB', 'DATE', 'TIMESTAMP', 'BLOB', 'CHAR'],
        sqlite: ['INTEGER', 'TEXT', 'REAL', 'NUMERIC', 'BLOB']
    };

    // Default column
    let columns = [
        { name: 'id', type: 'INT', length: '', nullable: false, default: '', isPrimary: true }
    ];

    let indexes = [];
    let foreignKeys = [];

    // Initialize the app
    function init() {
        renderColumns();
        renderIndexes();
        renderForeignKeys();
        updateDataTypes();
        loadFromLocalStorage();
    }

    // Load from localStorage
    function loadFromLocalStorage() {
        const savedData = localStorage.getItem('sqlGenData');
        if (savedData) {
            const data = JSON.parse(savedData);
            tableNameInput.value = data.tableName || '';
            dbTypeSelect.value = data.dbType || 'mysql';
            columns = data.columns || columns;
            indexes = data.indexes || indexes;
            foreignKeys = data.foreignKeys || foreignKeys;
            
            renderColumns();
            renderIndexes();
            renderForeignKeys();
            updateDataTypes();
        }
    }

    // Save to localStorage
    function saveToLocalStorage() {
        const data = {
            tableName: tableNameInput.value,
            dbType: dbTypeSelect.value,
            columns,
            indexes,
            foreignKeys
        };
        localStorage.setItem('sqlGenData', JSON.stringify(data));
    }

    // Theme toggle
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update active content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Database type change
    dbTypeSelect.addEventListener('change', function() {
        updateDataTypes();
        saveToLocalStorage();
    });

    // Update data types based on selected DB
    function updateDataTypes() {
        const dbType = dbTypeSelect.value;
        const typeSelects = document.querySelectorAll('.column-type');
        
        typeSelects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = '';
            
            dataTypes[dbType].forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                select.appendChild(option);
            });
            
            // Try to preserve the current value if it exists in the new types
            if (dataTypes[dbType].includes(currentValue)) {
                select.value = currentValue;
            }
        });
    }

    // Render columns table
    function renderColumns() {
        columnsBody.innerHTML = '';
        
        columns.forEach((col, index) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td><input type="text" class="column-name" value="${col.name}" data-index="${index}"></td>
                <td>
                    <select class="column-type" data-index="${index}">
                        ${dataTypes[dbTypeSelect.value].map(type => 
                            `<option value="${type}" ${type === col.type ? 'selected' : ''}>${type}</option>`
                        ).join('')}
                    </select>
                </td>
                <td><input type="text" class="column-length" value="${col.length}" data-index="${index}" placeholder="Optional"></td>
                <td>
                    <div class="checkbox-group">
                        <input type="checkbox" class="column-nullable" ${col.nullable ? 'checked' : ''} data-index="${index}">
                    </div>
                </td>
                <td><input type="text" class="column-default" value="${col.default}" data-index="${index}" placeholder="Optional"></td>
                <td>
                    <button class="action-btn delete-column" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                    ${index !== 0 ? `
                    <button class="action-btn move-up" data-index="${index}">
                        <i class="fas fa-arrow-up"></i>
                    </button>
                    ` : ''}
                    ${index !== columns.length - 1 ? `
                    <button class="action-btn move-down" data-index="${index}">
                        <i class="fas fa-arrow-down"></i>
                    </button>
                    ` : ''}
                </td>
            `;
            
            columnsBody.appendChild(row);
        });
        
        // Add event listeners
        document.querySelectorAll('.column-name').forEach(input => {
            input.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                columns[index].name = this.value;
                saveToLocalStorage();
            });
        });
        
        document.querySelectorAll('.column-type').forEach(select => {
            select.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                columns[index].type = this.value;
                saveToLocalStorage();
            });
        });
        
        document.querySelectorAll('.column-length').forEach(input => {
            input.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                columns[index].length = this.value;
                saveToLocalStorage();
            });
        });
        
        document.querySelectorAll('.column-nullable').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                columns[index].nullable = this.checked;
                saveToLocalStorage();
            });
        });
        
        document.querySelectorAll('.column-default').forEach(input => {
            input.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                columns[index].default = this.value;
                saveToLocalStorage();
            });
        });
        
        document.querySelectorAll('.delete-column').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                columns.splice(index, 1);
                renderColumns();
                saveToLocalStorage();
            });
        });
        
        document.querySelectorAll('.move-up').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (index > 0) {
                    [columns[index], columns[index - 1]] = [columns[index - 1], columns[index]];
                    renderColumns();
                    saveToLocalStorage();
                }
            });
        });
        
        document.querySelectorAll('.move-down').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (index < columns.length - 1) {
                    [columns[index], columns[index + 1]] = [columns[index + 1], columns[index]];
                    renderColumns();
                    saveToLocalStorage();
                }
            });
        });
    }

    // Add new column
    addColumnBtn.addEventListener('click', function() {
        columns.push({
            name: `column_${columns.length + 1}`,
            type: 'VARCHAR',
            length: '255',
            nullable: false,
            default: ''
        });
        renderColumns();
        saveToLocalStorage();
    });

    // Render indexes table
    function renderIndexes() {
        indexesBody.innerHTML = '';
        
        if (indexes.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="4" style="text-align: center; color: #6c757d;">No indexes added yet</td>`;
            indexesBody.appendChild(row);
            return;
        }
        
        indexes.forEach((idx, index) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td><input type="text" class="index-name" value="${idx.name}" data-index="${index}"></td>
                <td>
                    <select class="index-columns" multiple data-index="${index}" style="width: 100%; min-height: 38px;">
                        ${columns.map(col => 
                            `<option value="${col.name}" ${idx.columns.includes(col.name) ? 'selected' : ''}>${col.name}</option>`
                        ).join('')}
                    </select>
                </td>
                <td>
                    <div class="checkbox-group">
                        <input type="checkbox" class="index-unique" ${idx.unique ? 'checked' : ''} data-index="${index}">
                    </div>
                </td>
                <td>
                    <button class="action-btn delete-index" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            indexesBody.appendChild(row);
        });
        
        // Add event listeners
        document.querySelectorAll('.index-name').forEach(input => {
            input.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                indexes[index].name = this.value;
                saveToLocalStorage();
            });
        });
        
        document.querySelectorAll('.index-columns').forEach(select => {
            select.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const selectedOptions = Array.from(this.selectedOptions).map(opt => opt.value);
                indexes[index].columns = selectedOptions;
                saveToLocalStorage();
            });
        });
        
        document.querySelectorAll('.index-unique').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                indexes[index].unique = this.checked;
                saveToLocalStorage();
            });
        });
        
        document.querySelectorAll('.delete-index').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                indexes.splice(index, 1);
                renderIndexes();
                saveToLocalStorage();
            });
        });
    }

    // Add new index
    addIndexBtn.addEventListener('click', function() {
        if (columns.length === 0) {
            showToast('Please add columns first');
            return;
        }
        
        indexes.push({
            name: `idx_${tableNameInput.value || 'table'}_${indexes.length + 1}`,
            columns: [columns[0].name],
            unique: false
        });
        renderIndexes();
        saveToLocalStorage();
    });

    // Render foreign keys table
    function renderForeignKeys() {
        foreignKeysBody.innerHTML = '';
        
        if (foreignKeys.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="6" style="text-align: center; color: #6c757d;">No foreign keys added yet</td>`;
            foreignKeysBody.appendChild(row);
            return;
        }
        
        foreignKeys.forEach((fk, index) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td><input type="text" class="fk-name" value="${fk.name}" data-index="${index}"></td>
                <td>
                    <select class="fk-column" data-index="${index}">
                        ${columns.map(col => 
                            `<option value="${col.name}" ${col.name === fk.column ? 'selected' : ''}>${col.name}</option>`
                        ).join('')}
                    </select>
                </td>
                <td><input type="text" class="fk-ref-table" value="${fk.refTable}" data-index="${index}"></td>
                <td><input type="text" class="fk-ref-column" value="${fk.refColumn}" data-index="${index}"></td>
                <td>
                    <select class="fk-on-delete" data-index="${index}">
                        <option value="NO ACTION" ${fk.onDelete === 'NO ACTION' ? 'selected' : ''}>NO ACTION</option>
                        <option value="CASCADE" ${fk.onDelete === 'CASCADE' ? 'selected' : ''}>CASCADE</option>
                        <option value="SET NULL" ${fk.onDelete === 'SET NULL' ? 'selected' : ''}>SET NULL</option>
                        <option value="SET DEFAULT" ${fk.onDelete === 'SET DEFAULT' ? 'selected' : ''}>SET DEFAULT</option>
                        <option value="RESTRICT" ${fk.onDelete === 'RESTRICT' ? 'selected' : ''}>RESTRICT</option>
                    </select>
                </td>
                <td>
                    <button class="action-btn delete-fk" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            foreignKeysBody.appendChild(row);
        });
        
        // Add event listeners
        document.querySelectorAll('.fk-name').forEach(input => {
            input.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                foreignKeys[index].name = this.value;
                saveToLocalStorage();
            });
        });
        
        document.querySelectorAll('.fk-column').forEach(select => {
            select.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                foreignKeys[index].column = this.value;
                saveToLocalStorage();
            });
        });
        
        document.querySelectorAll('.fk-ref-table').forEach(input => {
            input.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                foreignKeys[index].refTable = this.value;
                saveToLocalStorage();
            });
        });
        
        document.querySelectorAll('.fk-ref-column').forEach(input => {
            input.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                foreignKeys[index].refColumn = this.value;
                saveToLocalStorage();
            });
        });
        
        document.querySelectorAll('.fk-on-delete').forEach(select => {
            select.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                foreignKeys[index].onDelete = this.value;
                saveToLocalStorage();
            });
        });
        
        document.querySelectorAll('.delete-fk').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                foreignKeys.splice(index, 1);
                renderForeignKeys();
                saveToLocalStorage();
            });
        });
    }

    // Add new foreign key
    addForeignKeyBtn.addEventListener('click', function() {
        if (columns.length === 0) {
            showToast('Please add columns first');
            return;
        }
        
        foreignKeys.push({
            name: `fk_${tableNameInput.value || 'table'}_${foreignKeys.length + 1}`,
            column: columns[0].name,
            refTable: 'related_table',
            refColumn: 'id',
            onDelete: 'NO ACTION'
        });
        renderForeignKeys();
        saveToLocalStorage();
    });

    // Generate SQL code
    generateBtn.addEventListener('click', function() {
        const tableName = tableNameInput.value.trim();
        const dbType = dbTypeSelect.value;
        
        if (!tableName) {
            showToast('Please enter a table name');
            return;
        }
        
        if (columns.length === 0) {
            showToast('Please add at least one column');
            return;
        }
        
        let sql = '';
        
        // CREATE TABLE statement
        sql += `CREATE TABLE ${escapeIdentifier(tableName, dbType)} (\n`;
        
        // Columns
        columns.forEach((col, index) => {
            sql += `  ${escapeIdentifier(col.name, dbType)} ${col.type}`;
            
            // Add length if specified and the type supports it
            if (col.length && typeSupportsLength(col.type, dbType)) {
                sql += `(${col.length})`;
            }
            
            // Primary key
            if (col.isPrimary) {
                if (dbType === 'mysql') {
                    sql += ' PRIMARY KEY AUTO_INCREMENT';
                } else if (dbType === 'postgresql') {
                    sql += ' PRIMARY KEY';
                } else if (dbType === 'sqlserver') {
                    sql += ' PRIMARY KEY IDENTITY(1,1)';
                } else if (dbType === 'oracle') {
                    sql += ' PRIMARY KEY';
                } else if (dbType === 'sqlite') {
                    sql += ' PRIMARY KEY AUTOINCREMENT';
                }
            } else {
                // Nullable
                if (!col.nullable) {
                    sql += ' NOT NULL';
                }
                
                // Default value
                if (col.default) {
                    sql += ` DEFAULT ${formatDefaultValue(col.default, col.type, dbType)}`;
                }
            }
            
            sql += index < columns.length - 1 || indexes.length > 0 || foreignKeys.length > 0 ? ',\n' : '\n';
        });
        
        // Indexes
        indexes.forEach((idx, index) => {
            const columnsList = idx.columns.map(col => escapeIdentifier(col, dbType)).join(', ');
            if (idx.unique) {
                sql += `  CONSTRAINT ${escapeIdentifier(idx.name, dbType)} UNIQUE (${columnsList})`;
            } else {
                sql += `  INDEX ${escapeIdentifier(idx.name, dbType)} (${columnsList})`;
            }
            
            sql += index < indexes.length - 1 || foreignKeys.length > 0 ? ',\n' : '\n';
        });
        
        // Foreign keys
        foreignKeys.forEach((fk, index) => {
            sql += `  CONSTRAINT ${escapeIdentifier(fk.name, dbType)} FOREIGN KEY (${escapeIdentifier(fk.column, dbType)}) `;
            sql += `REFERENCES ${escapeIdentifier(fk.refTable, dbType)} (${escapeIdentifier(fk.refColumn, dbType)}) `;
            sql += `ON DELETE ${fk.onDelete}`;
            
            sql += index < foreignKeys.length - 1 ? ',\n' : '\n';
        });
        
        sql += ');\n\n';
        
        // Add comments for MySQL and PostgreSQL
        if (dbType === 'mysql' || dbType === 'postgresql') {
            sql += `-- Table comment\n`;
            sql += `COMMENT ON TABLE ${escapeIdentifier(tableName, dbType)} IS '${tableName} table';\n\n`;
            
            columns.forEach(col => {
                sql += `-- Column comment\n`;
                sql += `COMMENT ON COLUMN ${escapeIdentifier(tableName, dbType)}.${escapeIdentifier(col.name, dbType)} IS '${col.name} column';\n\n`;
            });
        }
        
        generatedCode.value = sql;
        saveToLocalStorage();
    });

    // Helper function to escape identifiers based on database type
    function escapeIdentifier(identifier, dbType) {
        if (!identifier) return '';
        
        switch (dbType) {
            case 'mysql':
                return `\`${identifier}\``;
            case 'sqlserver':
                return `[${identifier}]`;
            case 'postgresql':
            case 'oracle':
                return `"${identifier}"`;
            default:
                return identifier;
        }
    }

    // Helper function to check if type supports length
    function typeSupportsLength(type, dbType) {
        const typesWithLength = ['VARCHAR', 'CHAR', 'NVARCHAR', 'VARCHAR2', 'DECIMAL', 'NUMERIC'];
        return typesWithLength.includes(type.toUpperCase());
    }

    // Helper function to format default values
    function formatDefaultValue(value, type, dbType) {
        const upperType = type.toUpperCase();
        
        if (upperType.includes('INT') || upperType.includes('NUMBER') || upperType.includes('DECIMAL') || upperType.includes('NUMERIC')) {
            return value;
        } else if (upperType.includes('BOOL')) {
            return value.toUpperCase() === 'TRUE' ? 'TRUE' : 'FALSE';
        } else {
            return `'${value.replace(/'/g, "''")}'`;
        }
    }

    // Copy code to clipboard
    function copyToClipboard() {
        if (!generatedCode.value) {
            showToast('No code to copy');
            return;
        }
        
        generatedCode.select();
        document.execCommand('copy');
        showToast('Copied to clipboard!');
    }

    copyCodeBtn.addEventListener('click', copyToClipboard);
    copyCodeBtnSmall.addEventListener('click', copyToClipboard);

    // Export as SQL file
    exportSqlFileBtn.addEventListener('click', function() {
        if (!generatedCode.value) {
            showToast('No code to export');
            return;
        }
        
        const tableName = tableNameInput.value.trim() || 'table';
        const blob = new Blob([generatedCode.value], { type: 'text/sql' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${tableName}_schema.sql`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Share functionality
    shareBtn.addEventListener('click', function() {
        if (!generatedCode.value) {
            showToast('No code to share');
            return;
        }
        
        if (navigator.share) {
            navigator.share({
                title: 'SQL Code Generated by SQLGen',
                text: 'Check out this SQL code I generated:',
                url: window.location.href
            }).catch(err => {
                console.log('Error sharing:', err);
                showToast('Sharing failed');
            });
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast('Link copied to clipboard');
            }).catch(err => {
                console.log('Error copying link:', err);
                showToast('Failed to copy link');
            });
        } else {
            showToast('Sharing not supported in your browser');
        }
    });

    // Show toast message
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Initialize the app
    init();
});