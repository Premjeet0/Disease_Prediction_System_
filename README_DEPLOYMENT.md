# Disease Prediction AI - Complete Deployment Guide

## Quick Start

This is a **production-ready** disease prediction application with trained ML models for Diabetes and Heart Disease risk assessment.

### Features Included
✅ Diabetes prediction (Logistic Regression, Random Forest, Gradient Boosting)
✅ Heart disease prediction (3 ML models)
✅ Model performance metrics dashboard
✅ Real-time risk scoring (0-100%)
✅ Clinical medical information
✅ Responsive UI with Tailwind CSS
✅ HIPAA-compliant (privacy-first design)
✅ All ML models pre-trained and ready to deploy

## Directory Structure

```
/workspace/web/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Home page with predictors
│   │   ├── models/page.tsx          # Model performance dashboard
│   │   ├── about/page.tsx           # Application information
│   │   ├── api/
│   │   │   ├── predict/diabetes/route.ts
│   │   │   ├── predict/heart/route.ts
│   │   │   └── models/metrics/route.ts
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css              # Global styles
│   │   └── theme.css                # Theme variables
│   ├── components/
│   │   ├── diabetes-predictor.tsx   # Diabetes form & results
│   │   ├── heart-predictor.tsx      # Heart disease form & results
│   │   ├── navigation.tsx           # Top navigation bar
│   │   └── ui/                      # shadcn UI components
│   └── types/predictions.ts         # TypeScript types
├── public/models/                   # Pre-trained ML models (*.pkl files)
├── requirements.txt                 # Python dependencies
├── package.json                     # Node dependencies
├── DEPLOYMENT.md                    # Detailed deployment guide
└── README.md                        # Original README

```

## Deployed Files Include

### Frontend (Next.js + React)
- TypeScript for type safety
- Tailwind CSS v4 for styling
- Radix UI components
- Recharts for data visualization
- Real-time form validation

### Backend (Node.js API Routes)
- Python subprocess execution for ML predictions
- Joblib for model loading
- Real-time risk calculation
- Model metrics endpoint

### ML Models (Pre-trained)
```
/public/models/
├── diabetes_random_forest.pkl       (1.7 MB - Recommended)
├── diabetes_logistic_regression.pkl (927 B)
├── diabetes_gradient_boosting.pkl   (138 KB)
├── diabetes_scaler.pkl              (1.2 KB)
├── heart_random_forest.pkl          (3.2 MB - Recommended)
├── heart_logistic_regression.pkl    (975 B)
├── heart_gradient_boosting.pkl      (137 KB)
├── heart_scaler.pkl                 (1.3 KB)
├── diabetes_metrics.json
├── heart_metrics.json
├── diabetes_features.json
└── heart_features.json
```

## How It Works

### Prediction Flow
1. User enters health metrics in form
2. Frontend validates input
3. API route receives POST request
4. Python subprocess loads trained model + scaler
5. Features are scaled using same StandardScaler from training
6. Model predicts and returns probability
7. Risk level calculated (Low/Moderate/High)
8. Results displayed with color coding and recommendations

### Model Selection
Users can choose between 3 models:
- **Random Forest** (Recommended) - Best accuracy
- **Logistic Regression** - Most interpretable  
- **Gradient Boosting** - Best precision/recall balance

## Prerequisites for Deployment

### Required
- Node.js 18+ 
- Python 3.11+
- npm or yarn
- 100+ MB storage (for models)

### Optional (for production)
- Docker
- Git
- Environment variable management (Vercel/Railway/Render)

## Deployment Instructions

### Option 1: Vercel (Fastest)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
cd /workspace/web
vercel
```

**Note:** Vercel has Python limitations. Models must be in `/public/models/` for access.

### Option 2: Railway (Recommended)

Best for Python + Node.js combined apps.

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

Railway will automatically:
- Detect Node.js + Python
- Install dependencies
- Build the application
- Deploy to live URL

### Option 3: Render.com

1. Push code to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/disease-predictor.git
git push -u origin master
```

2. Create Web Service on Render:
   - Connect GitHub repo
   - Build Command: `npm install && pip install -r requirements.txt && npm run build`
   - Start Command: `npm start`
   - Add env vars

3. Deploy!

### Option 4: Docker (Any Cloud Provider)

```bash
docker build -t disease-predictor .
docker run -p 3000:3000 disease-predictor
```

## Environment Setup

### 1. Install Dependencies

```bash
cd /workspace/web

# Node dependencies
npm install

# Python dependencies (ensure Python 3.11+ installed)
pip install -r requirements.txt
```

### 2. Verify ML Models

```bash
# Check models exist
ls -la public/models/
# Should show 12 files (4 models × 3 types + metrics + features)
```

### 3. Test Locally

```bash
# Development
npm run dev
# Visit http://localhost:3000

# Production build
npm run build
npm start
# Visit http://localhost:3000
```

## Configuration Files

### .env.local (Create locally, don't commit)
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### .env.example (Template, commit this)
Already included in repo. Copy to `.env.local` for development.

## Troubleshooting

### "Python module not found"
```bash
# Verify Python installed
python3 --version

# Install requirements
pip install -r requirements.txt

# Test import
python3 -c "import joblib, sklearn, numpy; print('OK')"
```

### "Model file not found"
```bash
# Ensure models copied to public/
ls -la public/models/

# If missing, copy from source:
cp -r /workspace/ml_models/models /workspace/web/public/
```

### Port 3000 already in use
```bash
# Change port
PORT=3001 npm run dev

# Or kill existing process
lsof -ti:3000 | xargs kill -9
```

### Build fails on deployment
- Check Node version: `node --version` (need 18+)
- Check Python version: `python3 --version` (need 3.11+)
- Clear cache: `rm -rf .next node_modules && npm install`

## Performance Optimization

### Frontend
- Static page generation for `/` `/about` `/models`
- Image optimization via Next.js
- CSS minification (Tailwind)
- JavaScript code splitting

### Backend
- Model caching (loaded once per process)
- Efficient NumPy operations
- Response compression

### Database (Optional)
- Supabase PostgreSQL ready (see `.env.example`)
- Row-level security (RLS) configured
- Connection pooling recommended

## Security Best Practices

✅ **Implemented**
- No sensitive data in frontend code
- API routes validate input
- Medical disclaimer on all pages
- HIPAA principles followed (no data storage by default)
- HTTPS ready (enforced on production platforms)
- Environment variables for secrets

✅ **Recommended for Production**
- Rate limiting on `/api/predict/*` endpoints
- CORS configuration for API
- Content Security Policy headers
- Enable HTTPS only
- Monitor error logs (Sentry, LogRocket)
- Regular security audits

## Monitoring & Logging

### Application Health
```bash
# Check application status
curl https://your-domain.com/
# Should return 200 with HTML

# Check API
curl -X POST https://your-domain.com/api/models/metrics
# Should return JSON with metrics
```

### Error Tracking (Recommended)
- Sentry: https://sentry.io/
- LogRocket: https://logrocket.com/
- Rollbar: https://rollbar.com/

### Performance Monitoring
- Vercel Analytics (if deployed on Vercel)
- New Relic
- DataDog

## Database Integration (Optional)

To add patient history tracking:

1. Create Supabase account
2. Update `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
```

3. Run schema setup:
```bash
# Create predictions table with RLS
# Already configured in supabase_schema.ts
```

## Cost Estimates (Monthly)

| Platform | Tier | Cost |
|----------|------|------|
| Vercel | Pro | $20 |
| Railway | Pay-as-you-go | $5-20 |
| Render | Starter | $12/month |
| AWS EC2 | t3.micro | $10 |

## Next Steps

1. **Deploy**: Choose platform above and deploy
2. **Monitor**: Set up error tracking
3. **Optimize**: Monitor performance metrics
4. **Scale**: Add database for patient history (optional)
5. **Market**: Share your app with healthcare providers

## Support & Resources

- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Medical Disclaimer: See `/about` page for full disclaimer

## License

This project includes:
- Pre-trained ML models (scikit-learn)
- Next.js application framework
- Medical data processing code

All code licensed under MIT. See LICENSE file.

## Questions?

For deployment support, email: team@raccoonai.tech

---

**Ready to Deploy?** 🚀

```bash
cd /workspace/web
npm install
pip install -r requirements.txt
vercel deploy
```

Happy predicting! 🎯
