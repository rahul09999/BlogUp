const { Router } = require("express")
const User = require('../models/user')

const router = Router();

router.get("/signin", (req, res) => {
    return res.render("signin");
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.post("/signin", async (req, res)=> {
    const {email, password} = req.body;
    try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    // console.log("token from route/user",token)
    return res.cookie("token", token).redirect('/')

    } catch (error) {
        console.error("Error during sign-in:", error);
        return res.render("signin", {
            error: "Incorrect Password or Email"
        })
    }
})

router.post("/signup", async (req, res) => {
    const {fullName, email, password } = req.body;

    try {
        await User.create({
            fullName,
            email,
            password,
        })
    
        res.redirect("/");
        return;
        
    } catch (error) {
        console.error("Error during sign-up:", error);
        // Handle the error appropriately, maybe render the signup page with an error message
        return res.status(500).render("signup", {
            error: "An error occurred during sign-up. Please try again."
        });
        
    }

});

router.get("/logout", (req, res)=> {
    return res.clearCookie("token").redirect("/")
})
module.exports = router;