const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
            index: true
        },
        title: {
            type: String,
            required: [true, "Please enter book title"],
            trim: true,
        },
        author: {
            type: String,
            required: [true, "Please enter book author"],
            trim: true,
        },
    },
    { 
        timestamps: true,
        toJSON: { 
            transform: function(doc, ret) {
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    }
);

// Create a static method to get the next id
bookSchema.statics.getNextId = async function() {
    try {
        const result = await this.aggregate([
            { $group: { _id: null, maxId: { $max: "$id" } } }
        ]);
        return result.length > 0 ? result[0].maxId + 1 : 1;
    } catch (error) {
        console.error('Error generating next ID:', error);
        throw new Error('Failed to generate book ID');
    }
};

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;