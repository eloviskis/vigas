#!/bin/bash
# Performance Benchmark Script
# Mede velocidade de build, bundle size e web vitals

set -e

echo "🚀 VITAS Performance Benchmark"
echo "=============================="
echo ""

# Backend Build
echo "📦 Backend Build..."
cd backend
npm run build --silent
echo "✅ Backend built successfully"
echo ""

# Frontend Build & Bundle Analysis
echo "📦 Frontend Build..."
cd ../frontend

# Build
npm run build --silent

# Bundle size
echo "📊 Bundle Analysis:"
du -sh dist/
echo ""

# Web Vitals check (Lighthouse)
echo "🔍 Lighthouse Performance Check..."
if command -v lighthouse &> /dev/null; then
  lighthouse http://localhost:5173 --chrome-flags="--headless" --output-path=./lighthouse-report.json --output=json
  
  # Extract scores
  LCP=$(jq '.audits | keys[] | select(startswith("largest-contentful")) | .[1]' ./lighthouse-report.json 2>/dev/null || echo "N/A")
  FID=$(jq '.audits."first-input-delay"' ./lighthouse-report.json 2>/dev/null || echo "N/A")
  CLS=$(jq '.audits."cumulative-layout-shift"' ./lighthouse-report.json 2>/dev/null || echo "N/A")
  
  echo "  LCP: $LCP"
  echo "  FID: $FID"
  echo "  CLS: $CLS"
else
  echo "⚠️  Lighthouse not installed. Install with: npm install -g lighthouse"
fi

echo ""
echo "✅ Benchmark Complete!"
