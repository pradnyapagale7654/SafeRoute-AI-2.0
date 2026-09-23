export const normalizeFactorList = (factors) => {
  if (Array.isArray(factors)) {
    return factors.filter(Boolean);
  }

  if (!factors || typeof factors !== "object") {
    return [];
  }

  return Object.entries(factors).map(([key, value]) => {
    const label = key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .replace(/^./, (char) => char.toUpperCase());

    if (typeof value === "number") {
      return `${label}: ${Math.round(value)}`;
    }

    return `${label}: ${String(value)}`;
  });
};

export const buildAssistantSummary = (data = {}, routeContext = {}) => {
  const destination = routeContext.destination || data?.destination || "your destination";
  const time = routeContext.time || "the selected travel time";
  const riskLabel = data?.safetyScore !== undefined ? `For your trip to ${destination} at ${time}, safety score: ${data.safetyScore}/100.` : `For your trip to ${destination} at ${time}, safety score is not available yet.`;
  const weatherLine = data?.weather?.summary ? `Weather note: ${data.weather.summary}.` : "Weather detail is unavailable.";
  const warningLine = data?.warnings?.length ? `Important note: ${data.warnings[0]}.` : "No urgent warnings reported.";

  return `${riskLabel} ${weatherLine} ${warningLine}`;
};

export const getRouteAwarePrompts = (plan = {}) => {
  const destination = plan.destination || "Pune Station";
  const time = plan.time || "evening";
  const routeLabel = plan.routeLabel || "the current route";

  return [
    `I am going to ${destination} at ${time}.`,
    `Is ${routeLabel} safer than my usual route tonight?`,
    `What safety risks should I watch for on my trip to ${destination}?`,
    `How should I adjust my travel plan for ${time} conditions?`,
  ];
};
