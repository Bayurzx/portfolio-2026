/**
 * API client for backend communication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface ChatRequest {
    message: string;
}

export interface ChatResponse {
    response: string;
    success: boolean;
}

/**
 * Send a chat message to the backend
 */
export async function sendChatMessage(message: string): Promise<string> {
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data: ChatResponse = await response.json();

        if (!data.success) {
            throw new Error("API returned unsuccessful response");
        }

        return data.response;
    } catch (error) {
        console.error("Chat API error:", error);
        throw error;
    }
}

/**
 * Check if the backend is healthy
 */
export async function checkHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Repository interface for frontend display
 */
export interface Repo {
    id: string;
    story: string;
    display_name: string;
    tech_stack: string;
    stars: number;
    language: string;
    html_url: string;
    visibility: "visible" | "hidden";
    // NEW V2 fields
    thumbnail_url?: string;      // Hero image for card
    updated_at?: string;         // ISO date for "Updated X days ago"
    evolution_summary?: string;  // One-liner project journey
    highlights?: string;         // Comma-separated key features
    recent_commits?: Array<{ sha: string; message: string }>;  // Recent activity
}

/**
 * Result type for GitHub repos fetch - includes error info for proper UI handling
 */
export interface GitHubReposResult {
    repos: Repo[];
    error?: string;
    status?: number;
}

/**
 * Fetch visible GitHub repositories from backend
 */
export async function getGitHubRepos(): Promise<GitHubReposResult> {
    try {
        const response = await fetch(`${API_BASE_URL}/github`);

        if (!response.ok) {
            const errorMessage = response.status === 404
                ? "GitHub API endpoint not found. The backend may need to be redeployed."
                : response.status === 503
                    ? "Backend services are still starting up. Please wait a moment."
                    : `Failed to fetch repos (status: ${response.status})`;

            console.error(`GitHub API error: ${response.status} - ${response.statusText}`);
            return { repos: [], error: errorMessage, status: response.status };
        }

        const data = await response.json();
        return { repos: data.repos || [] };
    } catch (error) {
        const errorMessage = error instanceof TypeError && error.message.includes('fetch')
            ? "Cannot connect to backend. Is the server running?"
            : "An unexpected error occurred while fetching repositories.";

        console.error("Fetch repos error:", error);
        return { repos: [], error: errorMessage };
    }
}

/**
 * Trigger repository sync
 */
export async function refreshRepos(force: boolean = false): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/github/refresh?force=${force}`, { method: "POST" });
    if (!response.ok) throw new Error("Sync failed");
    return response.json();
}
