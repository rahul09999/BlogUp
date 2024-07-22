const { type } = require('express/lib/response')
const { Schema, model } = require('mongoose')

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    coverImageUrl: {
        type: String,
        required: false,
        default: "./images/default-blog.png",
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    }
}, {
    timestamps: true,
})

const Blog = model('blog', blogSchema);

module.exports = Blog;