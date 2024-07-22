const { Router } = require("express");
const Blog = require("../models/blog");
const multer = require("multer");
const path = require("path")


const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/uploads`)
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    }
  })
  
  const upload = multer({ storage: storage })

router.get("/add-blog", (req, res)=> {
    return res.render("addBlog", {
        user: req.user, //bcz in navigation bar, we need user's detial too here
    });
})

router.post("/",upload.single("coverImage") , async (req, res)=> {
    const { title, body } = req.body;
    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageUrl: `/uploads/${req.file.filename}`,
    });
    console.log(`Blog title: "${blog.title}" added to database`);
    // console.log(req.file, req.body);
    return res.redirect(`/blog/${blog._id}`);//new route for each blog
})


module.exports = router
