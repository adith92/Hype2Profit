# Hype2Profit Risk Matrix

## Legal / ToS violation
- likelihood: medium
- impact: high
- mitigation: visible DOM scanner only, no private API, no captcha bypass, no checkout automation, explicit legal notice in app and extension
- product decision: extension-first V1, no backend crawler farm

## Scraping broken because marketplace DOM changes
- likelihood: high
- impact: medium
- mitigation: selector fallback, Shopee-first focus, Tokopedia secondary, no overexpansion to many sources in V1
- product decision: narrow platform scope and keep mock fallback active

## Data not accurate
- likelihood: high
- impact: high
- mitigation: label all views/sales/revenue as estimates, expose scoring as signal support not truth source
- product decision: position product as research cockpit, not authoritative BI feed

## Competition is tight
- likelihood: high
- impact: high
- mitigation: differentiate on premium UI, momentum charting, trader-style workflow, and safer visible DOM approach
- product decision: positioning = TradingView for Marketplace Product Research Indonesia

## Low user acquisition
- likelihood: medium
- impact: medium
- mitigation: sharper landing copy, focused V1 scope, fast onboarding with extension + mock data demo
- product decision: hero messaging centered on urgency and product momentum

## High maintenance load
- likelihood: medium
- impact: high
- mitigation: no aggressive backend scraping, no unsupported social radar, no deep TikTok analytics in V1
- product decision: de-scope crawler-heavy features and keep architecture lean
