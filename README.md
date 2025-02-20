# Creating a Blog/Portfolio with GitHub Pages and CMS Integration

This guide will show you how to create a blog/portfolio using GitHub Pages with a content management system, allowing you to add and edit content directly through a web interface without manual code editing.

## System Overview
- GitHub Pages for hosting
- Decap CMS (formerly Netlify CMS) for content management
- HTML, CSS, JavaScript, and TailwindCSS for styling
- No additional development environment required

## Step-by-Step Setup Guide

### 1. Create GitHub Repository
1. Go to GitHub and create a new repository
2. Name it `yourusername.github.io` (replace 'yourusername' with your actual GitHub username)
3. Make it public
4. Initialize it with a README

### 2. Set Up Basic Structure
Create these files in your repository:
```
yourusername.github.io/
├── index.html
├── admin/
│   ├── index.html
│   └── config.yml
├── css/
│   └── style.css
├── js/
│   └── main.js
└── _posts/
```

### 3. Configure GitHub Pages
1. Go to repository Settings
2. Navigate to "Pages" section
3. Select "main" branch as source
4. Save the settings

### 4. Set Up Decap CMS
Add these files in your admin folder:

In `admin/index.html`:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Content Manager</title>
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
  </head>
  <body>
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
  </body>
</html>
```

In `admin/config.yml`:
```yaml
backend:
  name: github
  repo: yourusername/yourusername.github.io
  branch: main

media_folder: "images/uploads"
public_folder: "/images/uploads"

collections:
  - name: "blog"
    label: "Blog"
    folder: "_posts"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - {label: "Layout", name: "layout", widget: "hidden", default: "post"}
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Publish Date", name: "date", widget: "datetime"}
      - {label: "Featured Image", name: "thumbnail", widget: "image", required: false}
      - {label: "Body", name: "body", widget: "markdown"}
```

### 5. Authentication Setup
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create New OAuth App
   - Application name: Your Site CMS
   - Homepage URL: https://yourusername.github.io
   - Authorization callback URL: https://yourusername.github.io/admin/
3. Get Client ID and Client Secret
4. Update config.yml with these credentials

### 6. Basic Template Setup
Create basic templates in your root folder:

In `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Blog/Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="css/style.css" rel="stylesheet">
</head>
<body>
    <div id="content"></div>
    <script src="js/main.js"></script>
</body>
</html>
```

### 7. Accessing the Admin Panel
1. Go to https://yourusername.github.io/admin/
2. Log in with your GitHub credentials
3. Start creating and managing content

### 8. Creating Content
1. Log into the admin panel
2. Click "New Blog" or relevant collection
3. Fill in the required fields
4. Preview your content
5. Publish when ready

### Tips
- All changes are committed directly to your GitHub repository
- Content is stored as Markdown files in your repository
- Images are automatically optimized and stored in your repository
- You can still edit files manually through GitHub if needed

### Customization
- Modify `config.yml` to add more content types
- Customize the templates in `index.html`
- Add more fields to your content model
- Style your site using TailwindCSS classes

## Troubleshooting
- If admin panel doesn't load, check OAuth settings
- Ensure repository permissions are correct
- Verify branch names match in settings
- Check for proper file paths in config.yml

## Resources
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Decap CMS Documentation](https://decapcms.org/docs/intro/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)