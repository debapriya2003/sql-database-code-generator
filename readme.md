

# 📊 SQL Database Code Generator

A web-based interactive tool that allows you to **configure database tables visually** and **generate SQL schema code** for multiple database systems such as **MySQL, PostgreSQL, SQL Server, Oracle, and SQLite**.

This project simplifies schema design by providing a clean UI for adding **columns, indexes, and foreign keys** and instantly generating **database-specific SQL code**.

---

## 🚀 Features

* ✅ **Supports multiple databases**: MySQL, PostgreSQL, SQL Server, Oracle, SQLite
* ✅ **Interactive Table Designer**: Add, edit, delete, and reorder columns
* ✅ **Indexes Support**: Create unique or non-unique indexes with multiple columns
* ✅ **Foreign Key Support**: Configure references and ON DELETE rules
* ✅ **Auto SQL Generation**: Generate SQL schema instantly with one click
* ✅ **Theme Toggle**: Light/Dark mode
* ✅ **Export Options**:

  * Export schema as `.sql` file
  * Copy SQL code to clipboard
  * Share link via Web Share API (if supported)
* ✅ **Persistent State**: Auto-saves your schema in `localStorage`
* ✅ **Responsive UI**: Works smoothly on desktop and mobile

---

## 🛠️ Tech Stack

* **Frontend**: HTML, CSS, JavaScript
* **Icons**: [Font Awesome](https://fontawesome.com/)
* **Storage**: Browser `localStorage`
* **No Backend Required** – Entirely client-side

---

## 📂 Project Structure

```
sql-database-code-generator/
│── index.html       # Main UI
│── style.css        # Stylesheet (light/dark mode, panels, buttons)
│── script.js        # Core logic for rendering, saving, and SQL generation
│── README.md        # Documentation
```

---

## ⚡ How It Works

1. Enter the **Table Name** and select **Database Type**.
2. Add **columns** with name, type, length, nullability, and default values.
3. Add **indexes** (unique/non-unique) and **foreign keys**.
4. Click **Generate SQL** – code will be displayed instantly.
5. Use options to **copy**, **export as .sql file**, or **share**.

---

## 📜 SQL Generation Details

* **Columns**: Supports primary keys, `NOT NULL`, `DEFAULT` values, and auto-increment depending on DB type.
* **Indexes**: Generates `INDEX` or `UNIQUE CONSTRAINT` depending on user choice.
* **Foreign Keys**: Includes reference table, reference column, and `ON DELETE` action.
* **DB Specifics**:

  * MySQL → `AUTO_INCREMENT`, backticks for identifiers
  * PostgreSQL → `COMMENT ON` for tables & columns
  * SQL Server → `IDENTITY(1,1)`, square brackets for identifiers
  * Oracle → Standard `PRIMARY KEY` and `NUMBER` support
  * SQLite → `AUTOINCREMENT` for primary keys

---

## 📸 UI Overview

* **Left Panel** – Table configuration (tabs for Columns, Indexes, Foreign Keys)
* **Right Panel** – Generated SQL Code with export/share options
* **Header** – Logo and theme toggle button

---

## 💻 Setup & Usage

1. Clone or download this repository:

   ```bash
   git clone https://github.com/debapriya2003/sql-database-code-generator.git
   cd sql-database-code-generator
   ```

2. Open `index.html` in a browser.

3. Start creating your database schema!

---

## 📦 Export Options

* **Export as .sql File** – Downloads schema as `table_schema.sql`.
* **Copy to Clipboard** – Copies SQL directly for quick use.
* **Share** – Uses browser’s `navigator.share()` API (if supported).

---

## 🔮 Future Improvements

* Add support for **composite primary keys**
* Advanced data types (JSON, UUID, XML, etc.)
* Support for **CHECK constraints**
* Import existing schema to edit visually

---

## 👨‍💻 Author

**Debapriya Mukherjee**

* 🌐 Full Stack Developer | Analyst | App & Web Developer
* ✨ Freelance & Creative Projects Enthusiast

---
