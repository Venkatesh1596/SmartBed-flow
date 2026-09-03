import os
import re

path = "c:/Users/venkatesh/OneDrive/Desktop/Smartbed-flow/frontend/src/components/AdminDashboard.tsx"
with open(path, "r") as f:
    content = f.read()

# Add error state
content = re.sub(
    r"const \[loading, setLoading\] = useState\(true\);",
    "const [loading, setLoading] = useState(true);\n    const [error, setError] = useState<string | null>(null);",
    content
)

# Update try/catch in loadData
content = re.sub(
    r"\} catch \(error\) \{\s*console\.error\(\"Failed to load admin data\", error\);\s*\}",
    "} catch (error: any) {\n            console.error(\"Failed to load admin data\", error);\n            setError(error.message || \"Failed to load admin dashboard data.\");\n        }",
    content
)

# Add error display
content = re.sub(
    r"if \(loading\) \{\s*return <div className=\"p-6\">Loading admin dashboard...</div>;\s*\}",
    "if (loading) {\n        return <div className=\"p-6 flex items-center justify-center\"><div className=\"animate-pulse text-slate-500\">Loading admin dashboard...</div></div>;\n    }\n\n    if (error) {\n        return (\n            <div className=\"p-6\">\n                <div className=\"bg-red-50 text-red-600 p-4 rounded-lg border border-red-200\">\n                    <h3 className=\"font-bold\">Error Loading Admin Dashboard</h3>\n                    <p>{error}</p>\n                    <button onClick={loadData} className=\"mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700\">Retry</button>\n                </div>\n            </div>\n        );\n    }",
    content
)

with open(path, "w") as f:
    f.write(content)
print("Updated AdminDashboard.tsx to include ErrorState")
