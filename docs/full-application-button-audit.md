# Full Application Button Audit

| Page | Button/Control | Visible Label | Purpose | Handler | API/Navigation | Required Role | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| AdminDashboard | Button | Retry | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| AdminDashboard | Button | handleToggleStatus(user.id, user.is_active)}
                                                className={`${user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                            >
                                                {user.is_active ? 'Deactivate' : 'Activate'} | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| AuditTrail | Button | setFilters({ skip: 0, limit: 50 })}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm font-medium">
                    Clear Filters | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| AuditTrail | Button | setFilters({...filters, skip: Math.max(0, (filters.skip || 0) - (filters.limit || 50))})}
                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                            Previous | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| AuditTrail | Button | setFilters({...filters, skip: (filters.skip || 0) + (filters.limit || 50)})}
                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                            Next | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| BedsList | Button | Add Bed | Action | Submit/Link | API/State | User | TBD | TBD | UNVERIFIED |
| CommandCenter | Button | {loading ? 'Refreshing...' : 'Refresh Now'} | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| CommandCenter | Button | window.location.href='/reports'} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 w-full">Go to Reports | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| CommandCenter | Button | window.location.href='/executive'} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 w-full shadow-sm">View Executive Performance | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| ErrorBoundary | Button | window.location.reload()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                
                Retry Loading | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| ErrorBoundary | Button | window.location.assign('/')}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                
                Return to Dashboard | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| EventsList | Button | Add Manual Event | Action | Submit/Link | API/State | User | TBD | TBD | UNVERIFIED |
| ExecutiveDashboard | Button | setDays(period)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                days === period
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {period} Days | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| FacilityBenchmarking | Button | fetchAllData(days)}
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                    >
                        
                        Refresh | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| Login | Button | setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ?  : } | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| Login | Button | {loading ? (
                <>
                  
                  Authenticating...
                
              ) : (
                'Sign In'
              )} | Action | Submit/Link | API/State | User | TBD | TBD | UNVERIFIED |
| NotificationCenter | Button | {loading ? 'Refreshing...' : 'Refresh'} | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| NotificationCenter | Button | Generate Mock | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| NotificationCenter | Button | Mark All Read | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| NotificationCenter | Button | setFilter(f)}
                        style={{ fontWeight: filter === f ? 'bold' : 'normal', backgroundColor: filter === f ? '#e0e0e0' : 'white' }}
                    >
                        {f} | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| NotificationCenter | Button | handleMarkRead(n.id)} style={{ padding: '5px 10px' }}>
                                    Mark Read | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| ProvisioningModals | Button | { setActiveModal(m.id); setFormData({}); setError(null); }}
                    className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                >
                    {m.label} | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| ProvisioningModals | Button | setActiveModal(null)} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300">Cancel | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| ProvisioningModals | Button | {loading ? 'Saving...' : 'Save'} | Action | Submit/Link | API/State | User | TBD | TBD | UNVERIFIED |
| Reports | Button | Apply | Action | Submit/Link | API/State | User | TBD | TBD | UNVERIFIED |
| Reports | Button | {exportingCSV ? 'Exporting...' : 'CSV'} | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| Reports | Button | {exportingPDF ? 'Exporting...' : 'PDF'} | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| SimulationCenter | Button | applyPreset('surge')} className="text-xs bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-50 font-medium transition-colors">Mass Casualty Surge | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| SimulationCenter | Button | applyPreset('efficiency')} className="text-xs bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-50 font-medium transition-colors">EVS Efficiency | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| SimulationCenter | Button | applyPreset('capacity_expansion')} className="text-xs bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-50 font-medium transition-colors">Wing Expansion | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| SimulationCenter | Button | Reset | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| SimulationCenter | Button | {loading ?  : } 
                                Simulate | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| WorkflowOrchestration | Button | loadData(true)} 
                    disabled={refreshing}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
                >
                    
                    Refresh | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| WorkflowOrchestration | Button | Assign | Action | Submit/Link | API/State | User | TBD | TBD | UNVERIFIED |
| WorkloadPrioritization | Button | loadData(days)} className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors">
                         Refresh Data | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| WorkloadPrioritization | Button | Action | Action | Submit/Link | API/State | User | TBD | TBD | UNVERIFIED |
| WorkloadPrioritization | Button | Review Critical Items | Action | Submit/Link | API/State | User | TBD | TBD | UNVERIFIED |
| TopHeader | Button | Icon/Unknown | Action | Submit/Link | API/State | User | TBD | TBD | UNVERIFIED |
| TopHeader | Button | Icon/Unknown | Action | Submit/Link | API/State | User | TBD | TBD | UNVERIFIED |
| TopHeader | Button | Icon/Unknown | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| Button | Button | {isLoading && (
          
            
            
          
        )}
        {!isLoading && leftIcon && {leftIcon}}
        {children}
        {!isLoading && rightIcon && {rightIcon}} | Action | Submit/Link | API/State | User | TBD | TBD | UNVERIFIED |
| ErrorState | Button | Retry | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| PermissionDenied | Button | Go Back | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| StaleDataBanner | Button | Refresh Data | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
| States | Button | Try Again | Action | Yes | API/State | User | TBD | TBD | UNVERIFIED |
