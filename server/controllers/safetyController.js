const safetyData = require("./safetyData");

const analyzeSafety = (req, res) => {
  try {
    const {
      crimeRisk,
      lighting,
      traffic,
      communityReports,
    } = safetyData;

    // Lower crime risk means higher safety
    const crimeScore = 100 - crimeRisk;

    // Calculate overall safety score
    const safetyScore = Math.round(
      crimeScore * 0.35 +
      lighting * 0.25 +
      (100 - traffic) * 0.15 +
      communityReports * 0.25
    );

    let safetyLevel;

    if (safetyScore >= 80) {
      safetyLevel = "Safe";
    } else if (safetyScore >= 60) {
      safetyLevel = "Moderate";
    } else {
      safetyLevel = "High Risk";
    }

    res.json({
      success: true,
      safetyScore,
      safetyLevel,
      factors: {
        crimeRisk,
        lighting,
        traffic,
        communityReports,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to analyze route safety",
    });
  }
};

module.exports = {
  analyzeSafety,
};