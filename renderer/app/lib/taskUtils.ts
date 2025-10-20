export function togglePriority(priority: "low" | "medium" | "high") : "low" | "medium" | "high" {
    switch (priority) {
        case "low":
            return "medium";
        case "medium":
            return "high";
        case "high":
            return "low";
        default:
            return "low";
    }
}