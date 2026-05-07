#!/bin/bash
set -e

echo "[$(date)] Starting post-download setup..."

cd /root/work/nemesis

# Step 1: Check if SQL file is complete (should be ~4.19GB)
FILE_SIZE=$(stat -c%s data/dashboard.sql 2>/dev/null || echo 0)
echo "[$(date)] SQL file size: $FILE_SIZE bytes ($(echo "scale=2; $FILE_SIZE/1073741824" | bc) GB)"

if [ "$FILE_SIZE" -lt 1000000000 ]; then
    echo "[$(date)] ERROR: SQL file too small, download may have failed"
    exit 1
fi

# Step 2: Remove any existing corrupt sqlite
rm -f data/dashboard.sqlite

# Step 3: Compile SQL dump to SQLite binary
echo "[$(date)] Compiling SQL dump to SQLite binary (this takes a while)..."
sqlite3 data/dashboard.sqlite < data/dashboard.sql
echo "[$(date)] SQLite compilation done!"

# Step 4: Apply v1-to-v2 patch
echo "[$(date)] Applying v1-to-v2 patch..."
sqlite3 data/dashboard.sqlite < data/patch-v1-to-v2.sql
echo "[$(date)] Patch applied!"

# Step 5: Verify database
echo "[$(date)] Verifying database..."
TABLE_COUNT=$(sqlite3 data/dashboard.sqlite "SELECT count(*) FROM sqlite_master WHERE type= ' table ' ;")
echo "[$(date)] Tables found: $TABLE_COUNT"

PACKAGE_COUNT=$(sqlite3 data/dashboard.sqlite "SELECT count(*) FROM packages;" 2>/dev/null || echo "0")
echo "[$(date)] Packages in database: $PACKAGE_COUNT"

REGION_COUNT=$(sqlite3 data/dashboard.sqlite "SELECT count(*) FROM regions;" 2>/dev/null || echo "0")
echo "[$(date)] Regions in database: $REGION_COUNT"

# Step 6: Start the service
echo "[$(date)] Starting nemesis service..."
systemctl restart nemesis
sleep 3

# Step 7: Verify service is running
if systemctl is-active --quiet nemesis; then
    echo "[$(date)] ✅ Nemesis service is RUNNING!"
    
    # Step 8: Test health endpoint
    sleep 2
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8002/api/health)
    echo "[$(date)] Health check: HTTP $HTTP_CODE"
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "[$(date)] ✅ API is responding 200 OK!"
        echo "[$(date)] ✅ https://nemesis.tams.codes should be live now!"
    else
        echo "[$(date)] ⚠️ API returned HTTP $HTTP_CODE"
        journalctl -u nemesis --no-pager -n 20
    fi
else
    echo "[$(date)] ❌ Service failed to start!"
    journalctl -u nemesis --no-pager -n 30
fi

echo "[$(date)] Setup complete!"
