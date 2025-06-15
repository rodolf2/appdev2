const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const Book = require("../models/book.model");
require("dotenv").config();

// Helper function to generate valid usernames
function generateValidUsername() {
  return faker.internet
    .username()
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9]/g, "") // Remove all non-alphanumeric characters
    .padEnd(3, "a"); // Ensure minimum length of 3
}

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing collections
    await User.deleteMany({});
    await Book.deleteMany({});
    console.log("✅ Cleared existing collections");

    // Create users
    const users = [];
    const numUsers = 5;
    const saltRounds = 10;

    for (let i = 0; i < numUsers; i++) {
      let user;
      let attempts = 0;
      const maxAttempts = 5;

      // Retry logic for duplicate usernames/emails
      while (attempts < maxAttempts) {
        try {
          const hashedPassword = await bcrypt.hash("password123", saltRounds);
          user = new User({
            username: generateValidUsername(),
            email: faker.internet.email(),
            password: hashedPassword,
          });
          await user.save();
          break;
        } catch (error) {
          if (error.code === 11000) {
            // Duplicate key error
            attempts++;
            if (attempts === maxAttempts) {
              throw new Error(
                `Failed to create unique user after ${maxAttempts} attempts`
              );
            }
          } else {
            throw error;
          }
        }
      }

      users.push(user);
    }
    console.log(`✅ Created ${users.length} users`);

    // Create books
    const books = [];
    const numBooks = 10;

    for (let i = 0; i < numBooks; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const book = new Book({
        id: i + 1,
        title: faker.lorem.words(3),
        author: faker.person.fullName(),
        year: faker.number.int({ min: 1900, max: 2024 }),
        createdBy: randomUser._id,
      });
      books.push(await book.save());
    }
    console.log(`✅ Created ${books.length} books`);

    console.log("✅ Seeding completed successfully");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("✅ Disconnected from MongoDB");
  }
}

// Run the seeder
seedDatabase();
