const express = require("express");
const router = express.Router();

const {
  createDeployment,
  getDeployments
} = require("../models/deploymentModel");

/* ---------- CREATE DEPLOYMENT ---------- */

router.post("/:projectId", async (req, res) => {

  try {

    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Login required" });
    }

    const { version } = req.body;

    const deployment = await createDeployment(
      req.params.projectId,
      version,
      "success"
    );

    res.json(deployment);

  } catch (err) {

    console.error("Deployment failed:", err);
    res.status(500).json({ error: "Deployment failed" });

  }

});

/* ---------- GET DEPLOYMENTS ---------- */

router.get("/:projectId", async (req, res) => {

  try {

    const deployments = await getDeployments(req.params.projectId);

    res.json(deployments);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Failed to fetch deployments" });

  }

});

module.exports = router;