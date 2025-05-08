#!/bin/bash

# Super simplified Render build script that creates static files directly
echo "Starting simplified Render build process..."

# Show current directory
echo "Current directory: $(pwd)"
ls -la

# Install only bare minimum dependencies
echo "Installing minimal dependencies..."
npm install express fs-extra

# Create dist directory structure
echo "Creating dist directory..."
mkdir -p dist/public/assets

# Create a static index.html file directly
echo "Creating static index.html..."
cat > dist/public/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aniexo - Anime Discovery Platform</title>
  <meta name="description" content="Discover your next favorite anime with Aniexo, a modern anime discovery platform with personalized recommendations.">
  <link rel="stylesheet" href="/assets/styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="container">
    <header>
      <h1>Aniexo</h1>
      <p class="tagline">Anime Discovery Platform</p>
    </header>
    
    <main>
      <div class="card">
        <div class="card-content">
          <h2>Welcome to Aniexo</h2>
          <p>Your modern anime discovery platform with personalized recommendations.</p>
          <div class="loading-spinner"></div>
          <p class="deployment-notice">The application is currently in deployment mode.</p>
          <p>Please check back soon for the full experience!</p>
        </div>
      </div>
      
      <div class="features">
        <div class="feature">
          <h3>Discover</h3>
          <p>Find trending and upcoming anime releases tailored to your preferences.</p>
        </div>
        <div class="feature">
          <h3>Personalize</h3>
          <p>Get recommendations based on your watch history and preferences.</p>
        </div>
        <div class="feature">
          <h3>Explore</h3>
          <p>Dive deep into detailed information about your favorite anime series.</p>
        </div>
      </div>
    </main>
    
    <footer>
      <p>&copy; 2025 Aniexo. All rights reserved.</p>
    </footer>
  </div>
  
  <script src="/assets/script.js"></script>
</body>
</html>
EOL

# Create CSS file
echo "Creating CSS file..."
cat > dist/public/assets/styles.css << 'EOL'
:root {
  --primary: #6200ea;
  --primary-light: #9d46ff;
  --primary-dark: #0a00b6;
  --text: #333333;
  --text-light: #666666;
  --background: #f5f5f5;
  --card-bg: #ffffff;
  --border: #e0e0e0;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--background);
  color: var(--text);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

header {
  text-align: center;
  margin-bottom: 3rem;
}

h1 {
  color: var(--primary);
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.tagline {
  color: var(--text-light);
  font-size: 1.2rem;
}

.card {
  background: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
}

.card-content {
  padding: 2rem;
  text-align: center;
}

h2 {
  color: var(--primary);
  margin-bottom: 1rem;
  font-size: 2rem;
}

.loading-spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 4px solid rgba(98, 0, 234, 0.3);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s linear infinite;
  margin: 2rem auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.deployment-notice {
  font-weight: 500;
  margin-bottom: 1rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
}

h3 {
  color: var(--primary);
  margin-bottom: 1rem;
}

footer {
  text-align: center;
  padding: 2rem 0;
  color: var(--text-light);
  border-top: 1px solid var(--border);
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
}
EOL

# Create JavaScript file
echo "Creating JavaScript file..."
cat > dist/public/assets/script.js << 'EOL'
// Simple script for the deployment placeholder
document.addEventListener('DOMContentLoaded', function() {
  console.log('Aniexo deployment page loaded');
  
  // Add current year to footer
  const footerYear = document.querySelector('footer p');
  if (footerYear) {
    const year = new Date().getFullYear();
    footerYear.textContent = footerYear.textContent.replace('2025', year);
  }
  
  // Add a simple animation effect
  setTimeout(() => {
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
      setTimeout(() => {
        feature.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        feature.style.transform = 'translateY(0)';
        feature.style.opacity = '1';
      }, index * 200);
    });
  }, 500);
});

// Add initial styles for animation
document.addEventListener('DOMContentLoaded', function() {
  const features = document.querySelectorAll('.feature');
  features.forEach(feature => {
    feature.style.transform = 'translateY(20px)';
    feature.style.opacity = '0';
  });
});
EOL

echo "Creating robots.txt..."
cat > dist/public/robots.txt << 'EOL'
User-agent: *
Allow: /
EOL

echo "Creating favicon placeholder..."
echo "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIKADAAQAAAABAAAAIAAAAACshmLzAAADJUlEQVRYCe1WTWsTQRh+drObbWqStkl/KFqpIFiwehE/0IMXhYKXevDiwYsU/AsePPkHvHgQRMGfeBAEhR4Ueu7JgxREEIMftdvdbPZ7Z5MUbKhpsmtiL04y+8478/0+M5BWzjOSXbtXx+7wWqSdO/cxd7EHRXGuLNt8TmfB8WE9n6ij5IxGTmZkBjQCh8nDYBj9AZ0BJ78fnwp9Iw7Ytsm8X9PUn5JjLWbptpL8YL4zU/gT/i7ZU80Gg0G23e6kzUZu0rZlXwTLV0r5q8EHLuNnAZhqAMuy0Gw2jYODgz7TRJpM8kJNmZ2enh57+PAJCRaHIlf8U55jvgEkSUY2m82urCwvnT2bP2cYJsIwaOZyE5WVldufXr9+C9e1kM2m3T8FYCgAf+AZamurq1cXCgVYlgXbtjEcDtFqtby7d+6/W1t7yI0ZoyNYmjSIIK0JI/7a7wAqlUqmUFi65DjOUffyxgwGA4RhCM/zElEcNarVanPSQrOuTB8BsaOfB2BZZmZhfv68oiiDrXW3CQLmQRjgYL+DV6/eJEjYUoQhRIk8d02C3hVAx6lqlj5/ZvbMvK7rgWma3DPTG0QRyaPPHEyKyMNh1Hv+/EXr9Zt3DQhCIvNvBBjnlAWK416v09na2t6r1+tBGIoOOzKGcD0XruvhdG4eYRRAVVUQ/PHFizcbSbfk/QFAHJfuP1XQMXrN/f29rzcXN3Z3968zpLIsMkKBZVn4XNvF5pct7u9oY8hv3mw+e7azs7tNn1TE6NLRNxGAXPMFKM/zQQoRo9Ppot/vIZ3W4QcehsOANjEWoGk6vJSPaqXabrfaCQCGQ5e9lnDtJBBAqBEpTUxBSenMARpjTFhWg2LAfPKcHXZAVVX5z9p6TJ+Q5hSA0WXeA4IowrBL3WnFQcAFSoqNFB2OLFp/6MBRYtJ3FGDWc7oE99gBMWY2R/dSktIIAHsM5kGcePB9H9EoHjPDh9uSnUgNQoCaYkERZUhxE48+U00Qc2d8Ou80lH8BpFRd9xkucCKvQZbn+N7EjFtKHSdZO01WPDVYDqHSN7SBQFc4Qb8C+gbaFPSy9+YAAAAASUVORK5CYII=" > dist/public/favicon.ico

# Verify the build output
if [ -f ./dist/public/index.html ]; then
  echo "Build completed successfully!"
  echo "Static files are in the correct location."
  ls -la ./dist/public/
  exit 0
else
  echo "Something went wrong with the build process."
  exit 1
fi