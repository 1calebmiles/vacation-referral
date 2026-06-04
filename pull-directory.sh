#!/bin/bash
# Route 504 — Pull directory updates from GitHub to OneDrive
# Run this after triggering the remote routine from your phone.

REPO="$HOME/Desktop/vacation-referral"
ONEDRIVE="$HOME/Library/CloudStorage/OneDrive-CommunityCoffeeCompany/Route 504"

echo "Pulling latest changes from GitHub..."
cd "$REPO" && git pull origin main

echo "Copying updated files to OneDrive..."
cp "$REPO/CUSTOMER DIRECTORY.csv" "$ONEDRIVE/CUSTOMER DIRECTORY.csv"
cp "$REPO/route-customers.html"   "$ONEDRIVE/Route Tools/route-customers.html"

echo "✅ Done — OneDrive is up to date."
