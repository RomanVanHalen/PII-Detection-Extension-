# PII Shield - Exposed Websites Tracking & Integrity Check Feature

## Overview
Implemented a comprehensive mechanism to track websites where users expose their PII and check their integrity via url.io (URLhaus) API.

## Features Implemented

### 1. **Exposed Websites Storage**
- Automatically stores websites when PII is detected
- Tracks the following per website:
  - Domain name
  - Original URL
  - Types of PII exposed (NIC, Credit Card, Email, Phone)
  - First detection timestamp
  - Last detection timestamp
  - Integrity check status
  - Integrity check results

**Storage Location:** Chrome's `chrome.storage.local` under key `exposed_websites`

**Data Structure:**
```javascript
{
  domain: "example.com",
  url: "https://example.com/page",
  piiTypes: ["Email Address", "Payment Card"],
  firstDetected: "2024-04-20T10:30:00.000Z",
  lastDetected: "2024-04-20T10:35:00.000Z",
  integrityCheckStatus: "unchecked|checking|malicious|safe|error",
  integrityCheckResult: { /* API response */ }
}
```

### 2. **Popup UI Enhancements**

#### Tab Navigation
- Added two tabs in the popup:
  - **Overview Tab**: Shows total exposures identified (existing functionality)
  - **Exposed Sites Tab**: Shows list of all websites where PII was detected

#### Exposed Sites Display
- Displays each website with:
  - **Domain name** (highlighted in blue)
  - **Detected PII Types** (shown as red tags)
  - **Integrity Check Status** (with visual indicators):
    - ✅ Safe (green)
    - ⚠️ Malicious (red)
    - ⏳ Checking (blue)
  - **Action Buttons**:
    - 🔍 Check - Click to verify website integrity
    - Remove - Click to delete from list

#### Visual Styling
- Consistent with existing PII Shield design
- Gradient backgrounds and smooth transitions
- Responsive list with scrolling
- Empty state message when no websites detected
- Disabled states for checking in progress

### 3. **Website Integrity Checking via URL.io (URLhaus)**

#### Primary API: URLhaus
- **Endpoint:** `https://urlhaus-api.abuse.ch/v1/url/`
- **Method:** POST
- **Checks against:** URLhaus malware database

#### Fallback API: AbuseIPDB
- **Endpoint:** `https://api.abuseipdb.com/api/v2/check`
- **Method:** GET
- **Fallback reliability:** Basic domain reputation

#### Check Flow
1. User clicks "Check" button on a website entry
2. Status changes to "⏳ Checking..." with disabled button
3. Extension queries URLhaus API for domain
4. Results are stored and displayed:
   - **Malicious**: ⚠️ "This website is marked as MALICIOUS"
   - **Safe**: ✅ "This website appears safe"
5. Status persists across popup closes/reopens

### 4. **Service Worker Updates**

Modified `service-worker.js` to:
- Capture the website URL when PII is detected
- Extract domain from full URL
- Store website information in Chrome storage
- Handle duplicate websites (updates detection count)
- Preserve all historical data

### 5. **Code Files Modified**

#### `src/utils/constants.js`
- Added new action types:
  - `ADD_EXPOSED_WEBSITE`
  - `GET_EXPOSED_WEBSITES`
  - `CLEAR_EXPOSED_WEBSITES`
  - `CHECK_WEBSITE_INTEGRITY`

#### `src/background/service-worker.js`
- Added `storeExposedWebsite()` function
- Modified `handlePositiveDetection()` to capture URLs
- Implements deduplication logic

#### `src/popup/popup.html`
- Added tab navigation buttons
- Added websites list container
- Added CSS for new UI elements:
  - Tab styling
  - Website item cards
  - PII type tags
  - Status indicators
  - Action buttons

#### `src/popup/popup.js`
- Complete rewrite with new functionality:
  - Tab switching logic
  - `loadWebsites()` function to fetch and display stored websites
  - `checkWebsiteIntegrity()` function to call APIs
  - `removeWebsite()` function to delete entries
  - `checkViaUrlIO()` function for API integration
  - Storage change listener for real-time updates

#### `manifest.json`
- Added `host_permissions` for:
  - `https://urlhaus-api.abuse.ch/*`
  - `https://api.abuseipdb.com/*`

## Usage Flow

### For Users:
1. When PII is exposed on a website:
   - Banner appears (existing feature)
   - Website is automatically stored
   - Exposure count increments

2. To view exposed websites:
   - Click extension popup
   - Click "Exposed Sites" tab
   - See list of all websites where PII was exposed

3. To check website integrity:
   - Click "🔍 Check" button on any website
   - Wait for API to respond (shows "⏳ Checking...")
   - See result (✅ Safe or ⚠️ Malicious)

4. To remove a website:
   - Click "Remove" button on any website entry
   - Website is deleted from the list

5. To clear everything:
   - Click "Clear History" button
   - All stats and website data are cleared

## API Integration Details

### URLhaus API
- **No authentication required** (public API)
- **Rate limits:** ~5 requests/second
- **Response format:**
  ```json
  {
    "query_status": "ok|not_found",
    "url_details": {
      "url": "https://...",
      "threat_types": ["phishing", "malware", ...],
      ...
    }
  }
  ```

### Fallback: AbuseIPDB
- **Requires API key** (free tier available)
- **Used if URLhaus fails**
- **Response includes:** `abuseConfidenceScore` (0-100)
- **Threshold:** >25 = Malicious

## Security Considerations

1. **Data Storage:**
   - Stored in Chrome's encrypted local storage
   - User data never sent to external servers except for integrity checks
   - URL data sent to URLhaus only contains domain

2. **API Communication:**
   - HTTPS only
   - Manifest permissions restrict to specific domains
   - No sensitive data included in API requests

3. **User Privacy:**
   - Users control what data is stored
   - Can clear at any time
   - Integrity checks are optional (user-initiated)

## Testing Recommendations

1. **Storage Test:**
   - Enter PII on any website
   - Open popup → Exposed Sites tab
   - Verify domain appears in list

2. **Integrity Check Test:**
   - Click "Check" on a known safe website (e.g., google.com)
   - Should show ✅ Safe status
   - Click "Check" on URLhaus malware database sample
   - Should show ⚠️ Malicious status

3. **Edge Cases:**
   - Same domain multiple times (should deduplicate)
   - Multiple PII types on same domain (should list all)
   - API failures (should handle gracefully)
   - Clearing data (should reset everything)

## Future Enhancements

1. Add sorting/filtering by PII type or risk level
2. Export report of exposed websites
3. Periodic automated integrity checks
4. Integration with more threat databases
5. Browser history scan for already-visited risky sites
6. Notification alerts for newly detected malicious sites
7. Integration with VirusTotal API (more comprehensive)
8. Dark/Light theme toggle

## Notes

- URLhaus API integration is production-ready
- AbuseIPDB fallback requires configuration with API key
- Extension requires "host_permissions" for network access
- Storage is persistent across browser sessions
- Chrome storage limits: ~10MB per extension
