# Deployment Guide - Disease Prediction AI

This guide covers deploying the Disease Prediction AI application to various platforms.

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Git account (GitHub, GitLab, etc.)

## Local Development

### Setup

```bash
# Install Node dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt

# Run the development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

Vercel is the official deployment platform for Next.js.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Configuration:**
- Build Command: `npm run build`
- Start Command: `npm start`
- Python Runtime: Need to use Vercel's Python support or serverless functions

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy
```

**Important:** Netlify has limitations with Python. For this project, use Vercel or another provider.

### Option 3: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway up
```

**Benefits:**
- Supports both Node.js and Python
- Easy environment variable management
- Automatic deployments from Git

### Option 4: Render.com

**Steps:**
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your GitHub repository
4. Build Command: `npm install && pip install -r requirements.txt && npm run build`
5. Start Command: `npm start`
6. Add environment variables in Render dashboard

### Option 5: Self-Hosted (Docker)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install Python
RUN apk add --no-cache python3 py3-pip

# Copy files
COPY package*.json ./
COPY requirements.txt ./

# Install dependencies
RUN npm ci
RUN pip install -r requirements.txt

# Copy application
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t disease-predictor .
docker run -p 3000:3000 disease-predictor
```

## Important Considerations

### Python/ML Model Execution

The application uses Python subprocess calls to execute ML predictions. Some platforms have limitations:

- **Vercel**: Use serverless functions approach or API routes with Python support
- **Netlify**: Limited Python support, not recommended
- **Railway/Render**: Full Python support, recommended
- **Docker**: Full support

### Environment Variables Required

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

### File System Persistence

- ML models are loaded from `/workspace/ml_models/models/` directory
- For production, ensure this directory is copied to the deployment environment

## Production Best Practices

1. **Security**
   - Never commit `.env` files
   - Use platform-specific secret management
   - Enable HTTPS (automatic on most platforms)

2. **Performance**
   - Enable caching headers for static files
   - Use CDN for image assets
   - Monitor API response times

3. **Monitoring**
   - Set up error tracking (Sentry, etc.)
   - Monitor server logs
   - Track API usage

4. **Scaling**
   - Implement rate limiting for prediction API
   - Use environment variables for configuration
   - Monitor database connections (if using Supabase)

## Troubleshooting

### "Module not found" errors
- Ensure all dependencies are installed: `npm install`
- Check Python dependencies: `pip install -r requirements.txt`

### Python subprocess errors
- Verify Python 3.11+ is installed
- Check ML model files exist in correct directory
- Test locally before deploying

### Port already in use
- Change port: `PORT=3001 npm run dev`
- Or kill existing process: `lsof -ti:3000 | xargs kill -9`

### Build failures
- Check Node version: `node --version` (should be 18+)
- Clear cache: `rm -rf .next node_modules && npm install`
- Check TypeScript errors: `npm run lint`

## Deployment Checklist

- [ ] Environment variables configured
- [ ] `.env` file not committed to Git
- [ ] Build passes locally: `npm run build`
- [ ] Tests pass: `npm run lint`
- [ ] ML models included in deployment
- [ ] Python dependencies installed
- [ ] HTTPS configured
- [ ] Monitoring set up
- [ ] Error tracking configured
- [ ] Performance tested

## Support

For issues specific to:
- **Next.js**: https://nextjs.org/docs
- **Vercel**: https://vercel.com/docs
- **Railway**: https://docs.railway.app
- **Render**: https://render.com/docs

