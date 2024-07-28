const { Router } = require("express");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const multer = require("multer");
const path = require("path");


const router = Router();

function capitalizeWords(str){
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

function removeLeadingDot(str){
  return str.startsWith('.') ? str.slice(1) : str;
}

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

router.get("/:id", async (req, res)=> {
  const blog = await Blog.findById(req.params.id).populate('createdBy');
  const comments = await Comment.find({blogId: req.params.id}).populate('createdBy')
  // console.log(comments)
  blog.createdBy.fullName = capitalizeWords(blog.createdBy.fullName)
  // blog.createdBy.profileImage = removeLeadingDot(blog.createdBy.profileImage);
  // console.log(blog);
  res.render("blog", {
    user: req.user,
    blog,
    comments,
  })
})

router.post("/",upload.single("coverImage") , async (req, res)=> {
    const { title, body } = req.body;
    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageUrl: req.file ? `/uploads/${req.file.filename}`: undefined,
    });
    console.log(`Blog title: "${blog.title}" added to database`);
    // console.log(req.file, req.body);
    return res.redirect(`/blog/${blog._id}`);//new route for each blog
})

router.post("/comment/:blogId", async (req,res)=> {
  // console.log(req.body);
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  })
  res.redirect(`/blog/${req.params.blogId}`);

})


module.exports = router
