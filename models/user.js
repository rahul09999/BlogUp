const { Schema, Model, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../service/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      path: "./images/avatar.avif",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

//Do this before saving any User saved in DB
//pre-> action to occur before an event(do this before), post-> do this after saving, 'save' -> mongoose/mongo method, -> middleware function -> what should we do on pre 'save' any  User
userSchema.pre("save", function (next) {
  // Arrow functions do not have their own 'this' context. Instead, 'this' refers to the enclosing lexical context.
  // In mongoose middleware, using a regular function is necessary to access the document being saved through 'this'.
  //grab user using 'this' keyword which is about to save in DB
    const user = this; 
  //if no password modified then we dont need to crypto hash it
  if (!user.isModified("password")) return;

  //salt -> random buffer byte
  //createHmax-> crearte crypto hash using salt and "sha256" algorithm
  //update()-> add element on which hash should apply
  //digest()-> format of output(hexadicimal, binary etc);
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt).update(user.password).digest('hex');

  //save salt and update password with hashedPassword
  this.salt = salt;
  this.password = hashedPassword;

  next();

});

//virtual function: can make multiple function on each schema

userSchema.static("matchPasswordAndGenerateToken", async function (email, password){
    const user = await this.findOne({ email });
    // console.log(user);
    //In case user not in DB
    if(!user) throw new Error("User not found");

    //Match given password with hashedPassword in DB
    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidePasswordToHash = createHmac("sha256", salt).update(password).digest('hex');

    if(hashedPassword !== userProvidePasswordToHash) throw new Error("Incorrect password");

    // return user;
    //generate token and return that instead of user
    const token = createTokenForUser(user);
    return token;
})


const User = model("user", userSchema);

module.exports = User;
