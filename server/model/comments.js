import mongoose from "mongoose";
import Collection from "../database/collection";
const commentSchema = new mongoose.Schema({
    postId: String,
    content: String,
    authorId: String
})
const CommentsModel = mongoose.model(Collection.COMMENTS, commentSchema);
export default CommentsModel;