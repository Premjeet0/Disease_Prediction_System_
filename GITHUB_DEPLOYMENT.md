# GitHub & Cloud Deployment Instructions

## Step 1: Create GitHub Repository

### On GitHub Website

1. Go to https://github.com/new
2. Create repository name: `disease-predictor` (or your preference)
3. Add description: "ML-powered disease prediction app (Diabetes & Heart Disease)"
4. Choose Public or Private
5. **DO NOT** initialize with README (we have our own)
6. Click "Create repository"

### Get Your Repository URL

You'll see a URL like:
```
https://github.com/YOUR_USERNAME/disease-predictor.git
```

## Step 2: Push Local Code to GitHub

From `/workspace/web/`:

```bash
# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/disease-predictor.git

# Rename branch to main (optional but recommended)
git branch -M main

# Push code
git push -u origin main
```

**If you get authentication error:**

### Using GitHub Personal Access Token (Recommended)

1. Go to https://github.com/settings/tokens/new
2. Create token with:
   - Name: "Disease Predictor Deploy"
   - Scopes: `repo`, `workflow`
   - Expiration: 90 days
3. Copy token
4. Push with token:
```bash
git push -u origin main
# When prompted for password, paste token (no username needed)
```

### Using SSH (Alternative)

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Add to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Add public key to GitHub
# https://github.com/settings/keys

# Test connection
ssh -T git@github.com

# Push with SSH
git remote set-url origin git@github.com:YOUR_USERNAME/disease-predictor.git
git push -u origin main
```

## Step 3: Deployment Platforms

### Option A: Vercel (Recommended for Next.js)

**Fastest deployment for Next.js apps**

1. Go to https://vercel.com/new
2. Sign in with GitHub
3. Select your `disease-predictor` repository
4. Click "Import"
5. Configure:
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)
6. Add Environment Variables:
   ```
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```
7. Click "Deploy"

**Important Note:** Vercel may have Python execution limitations. The ML models are served from `/public/models/`, so ensure they're committed to Git.

**After Deployment:**
- Your app is live at: `https://disease-predictor-[random].vercel.app`
- Automatic deployments on each push to `main`
- Preview deployments for pull requests

### Option B: Railway (Best for Python + Node.js)

**Best for this project - supports Python execution**

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Authorize Railway and select `disease-predictor`
6. Railway auto-detects Node.js and creates service
7. Add Python runtime:
   - Settings → Add Service → Python
8. Environment Variables:
   - Go to Variables
   - Add: `NEXT_PUBLIC_APP_URL=${{ RAILWAY_PUBLIC_DOMAIN }}`
9. Deploy automatically starts

**Benefits:**
- Full Python 3.11+ support
- Easy environment variable management
- Custom domains included
- Automatic HTTPS

### Option C: Render.com

**Free tier available**

1. Go to https://render.com
2. Sign up with GitHub
3. Create new Web Service
4. Select your repository
5. Configure:
   - Name: `disease-predictor`
   - Environment: Node
   - Build Command: `npm install && pip install -r requirements.txt && npm run build`
   - Start Command: `npm start`
   - Plan: Free (or Starter for better reliability)
6. Add Environment Variables:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://disease-predictor.onrender.com
   ```
7. Click "Create Web Service"

**Benefits:**
- Python support
- Free tier available
- Auto-deploys on push
- Custom domains

### Option D: Netlify

**Good for frontend, limited Python support**

1. Go to https://netlify.com
2. Click "Connect from Git"
3. Authorize GitHub
4. Select `disease-predictor` repository
5. Configure build settings:
   - Build Command: `npm run build`
   - Publish Directory: `.next`
6. Advanced build settings:
   - Add environment variables
7. Click "Deploy site"

**Note:** Netlify has Python limitations. Better to use Railway or Render for this project.

### Option E: Heroku (Legacy)

**Heroku free tier discontinued, but still option for paid**

```bash
# Install Heroku CLI
npm i -g heroku

# Login
heroku login

# Create app
heroku create disease-predictor

# Set Python buildpack
heroku buildpacks:add heroku/nodejs -a disease-predictor
heroku buildpacks:add heroku/python -a disease-predictor

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Option F: AWS (Elastic Beanstalk)

**Enterprise-grade, more complex**

```bash
# Install AWS CLI
pip install awsebcli

# Initialize
eb init disease-predictor --platform node.js

# Create environment
eb create disease-predictor-prod

# Deploy
eb deploy

# Open app
eb open
```

## Step 4: Custom Domain (Optional)

### For Vercel
1. Project Settings → Domains
2. Add domain
3. Follow DNS configuration

### For Railway
1. Settings → Custom Domain
2. Add domain
3. Follow DNS instructions

### For Render
1. Settings → Custom Domain
2. Add domain
3. Follow DNS setup

## Step 5: Post-Deployment Verification

After deployment, verify:

```bash
# Check homepage loads
curl https://your-app.vercel.app/

# Check API endpoint
curl -X GET https://your-app.vercel.app/api/models/metrics

# Test diabetes prediction
curl -X POST https://your-app.vercel.app/api/predict/diabetes \
  -H "Content-Type: application/json" \
  -d '{
    "features": {
      "Pregnancies": 1,
      "Glucose": 120,
      "BloodPressure": 80,
      "SkinThickness": 25,
      "Insulin": 100,
      "BMI": 28,
      "DiabetesPedigreeFunction": 0.5,
      "Age": 35
    },
    "model_type": "random_forest"
  }'
```

## Step 6: Monitoring & Debugging

### View Deployment Logs

**Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# View logs
vercel logs your-app-name
```

**Railway:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# View logs
railway logs
```

**Render:**
- View in dashboard under "Logs"

### Common Issues

**Python module not found:**
- Ensure `requirements.txt` is in root
- Verify Python version in platform settings

**ML models not loading:**
- Check models in `/public/models/`
- Verify models are committed to Git
- Check file permissions

**Port binding errors:**
- Remove hardcoded port, use `process.env.PORT || 3000`

**Memory issues:**
- Optimize model loading (cache at startup)
- Use smaller models if needed

## Step 7: CI/CD Setup (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          npm install
          pip install -r requirements.txt
      
      - name: Run tests
        run: npm run lint
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Troubleshooting Deployment

### Deployment Fails
1. Check build logs in platform dashboard
2. Verify all dependencies in `package.json` and `requirements.txt`
3. Test build locally: `npm run build`

### App Crashes After Deploy
1. Check platform logs
2. Verify environment variables set
3. Check Node/Python versions

### API Returns 500
1. Verify ML models in `/public/models/`
2. Check Python is installed on platform
3. Review error logs

### Slow Performance
1. Enable caching headers
2. Optimize model loading
3. Use CDN for static assets (Vercel does this automatically)

## Production Checklist

- [ ] Repository created on GitHub
- [ ] Code pushed to main branch
- [ ] Platform connected (Vercel/Railway/Render)
- [ ] Environment variables configured
- [ ] Build succeeds on platform
- [ ] App deployed and accessible
- [ ] All pages load correctly
- [ ] API endpoints respond
- [ ] ML predictions work
- [ ] Error tracking configured (Sentry)
- [ ] Performance monitoring set up
- [ ] HTTPS enabled
- [ ] Custom domain configured (optional)
- [ ] Backups/disaster recovery planned

## Next Steps

1. **Monitor**: Check logs regularly
2. **Update**: Keep dependencies updated
3. **Scale**: Add database when needed
4. **Optimize**: Monitor performance metrics
5. **Share**: Market your application

---

**Happy Deploying!** 🚀

Questions? Check platform documentation:
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
- Render: https://render.com/docs
