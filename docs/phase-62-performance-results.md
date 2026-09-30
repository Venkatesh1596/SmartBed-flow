# Phase 62 Performance Results (Measured via Pytest + PyInstrument/Timings)
| Metric | Min (ms) | Avg (ms) | Max (ms) | Samples |
|---|---|---|---|---|
| `GET /api/beds` (Dashboard Load) | 12ms | 18ms | 45ms | 50 |
| `POST /api/allocations` (Row-locked) | 22ms | 31ms | 89ms | 50 |
| `GET /api/analytics` (Calculations) | 45ms | 72ms | 180ms | 25 |
| Digital Twin Simulation | 120ms | 155ms | 305ms | 10 |
