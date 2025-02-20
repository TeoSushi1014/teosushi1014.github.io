# Setting Up GitHub Pages with Decap CMS

This guide will help you create a blog/portfolio with an admin panel using GitHub Pages and Decap CMS.

## Prerequisites
- A GitHub account
- A repository for your website
- Basic knowledge of HTML/CSS/JavaScript

## Step-by-Step Setup

### 1. Create GitHub Repository
1. Go to GitHub and create a new repository
2. Name it `yourusername.github.io` (replace yourusername with your GitHub username)
3. Make it public
4. Initialize with a README

### 2. Basic Structure Setup
Create these files in your repository:
```
index.html
admin/index.html
admin/config.yml
posts/
assets/
```

### 3. Configure GitHub Pages
1. Go to repository Settings
2. Navigate to Pages section
3. Select main branch as source
4. Save settings

### 4. Setup Authentication
1. Go to GitHub Developer Settings
2. Create new OAuth App
3. Set Homepage URL: `https://yourusername.github.io`
4. Set Authorization callback URL: `https://yourusername.github.io/admin/`
5. Save Client ID and Client Secret

### 5. File Contents

#### index.html (Main Page)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Blog</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div id="content" class="container mx-auto p-4">
        <!-- Content will be dynamically loaded -->
    </div>
    <script src="/assets/js/main.js"></script>
</body>
</html>
```

#### admin/index.html (Admin Panel)
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Content Manager</title>
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
</head>
<body>
    <script src="https://unpkg.com/@staticcms/app@^2.0.0/dist/static-cms-app.js"></script>
    <script>
        window.CMS.init();
    </script>
</body>
</html>
```

#### admin/config.yml
```yaml
backend:
  name: github
  repo: yourusername/yourusername.github.io
  branch: main
  base_url: https://yourusername.github.io
  auth_endpoint: api/auth

media_folder: "assets/images"
public_folder: "/assets/images"

collections:
  - name: "blog"
    label: "Blog"
    folder: "_posts"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Publish Date", name: "date", widget: "datetime"}
      - {label: "Featured Image", name: "thumbnail", widget: "image", required: false}
      - {label: "Body", name: "body", widget: "markdown"}
```

### 6. Deploy and Test
1. Commit and push all files to GitHub
2. Wait a few minutes for GitHub Pages to build
3. Visit `https://yourusername.github.io/admin/`
4. Login with your GitHub account
5. Start creating content!

## Usage
- Access your blog at: `https://yourusername.github.io`
- Access admin panel at: `https://yourusername.github.io/admin`
- Create new posts directly from the admin panel
- All changes will be automatically committed to your repository

## Notes
- Posts are stored as Markdown files in your repository
- Images are stored in the assets/images folder
- The system uses GitHub's authentication
- No additional hosting or CMS service needed
