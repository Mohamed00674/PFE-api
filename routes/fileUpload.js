const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const path = require("path");

router.post("/upload-photos", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      let data = [];

      _.forEach(_.keysIn(req.files.photos), (key) => {
        let photo = req.files.photos[key];

        photo.mv("./uploads/" + photo.name);

        data.push({
          name: photo.name,
          mimetype: photo.mimetype,
          size: photo.size,
        });
      });
      res.json({
        status: true,
        message: "Files are uploaded",
        data: data,
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
