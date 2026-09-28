# Modern UI Architecture

## Overview
Phase 57 modernized the SmartBed Flow application from a basic modular UI to a professional enterprise-grade application shell. The architecture focuses on layout stability, component reusability, explicit data-state communication, and operational context.

## 1. Global Application Shell
- **AppShell**: Replaces disparate layout containers. Uses CSS grid and flexbox to manage screen real-estate cleanly, ensuring the main content area is isolated from navigation reflows.
- **Sidebar**: Provides a persistent, scalable navigation tree covering all key operational modules (Overview, Bed Flow, Capacity, EVS, Transport).
- **TopHeader**: Standardized location for Global Search, current user profile, and the global facility health context.

## 2. Standardized UI Primitives
A suite of states was introduced to handle API responses safely without blank screens:
- `LoadingState` and `SkeletonCard` / `SkeletonTable`
- `EmptyState`
- `ErrorState`
- `StaleDataBanner`
- `PermissionDenied`

## 3. Global Data Freshness Component
The new `FreshnessIndicator` ensures end-users are instantly aware of the latency of their operational data. By passing `(state, lastUpdated)`, it semantically renders visual cues (e.g., green for live, red for stale/missing), completely mitigating the risk of users acting on outdated capacity numbers.

## 4. Primary KPI Prominence
The Dashboard architecture has been updated to feature the Primary KPI ("Time to Next Safe Bed") at the top of the viewport, combined with the new horizontal Bed Flow Pipeline visualization, ensuring that every operational decision is framed around accelerating patient throughput.
