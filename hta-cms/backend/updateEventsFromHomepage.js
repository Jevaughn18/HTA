/**
 * Updates the CMS database with the current homepage events
 * Run this script to sync the database with the hardcoded homepage events
 *
 * Usage: MONGO_URI="your-mongo-uri" node updateEventsFromHomepage.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const contentSchema = new mongoose.Schema({
    page: { type: String, required: true },
    section: { type: String, required: true },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Content = mongoose.model('Content', contentSchema);

const currentHomepageEvents = {
    title: "Upcoming Events",
    events: [
        {
            title: "Singles Seminar",
            date: "Coming Soon",
            image: "assets/singles-semniar.jpg"
        },
        {
            title: "Prayer & Fasting",
            date: "Coming Soon",
            image: "assets/prayer-fasting.jpeg"
        },
        {
            title: "Hurricane Relief",
            date: "Coming Soon",
            image: "assets/hurrican.jpeg"
        },
        {
            title: "Anniversary Celebration",
            date: "Coming Soon",
            image: "assets/aniversary.jpeg"
        }
    ],
    button: {
        text: "View More Events",
        link: "events.html"
    }
};

async function updateEvents() {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

        if (!mongoUri) {
            console.error('❌ MONGO_URI environment variable not set');
            console.log('Usage: MONGO_URI="your-mongo-uri" node updateEventsFromHomepage.js');
            process.exit(1);
        }

        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        console.log('\n📝 Current homepage events to sync:');
        currentHomepageEvents.events.forEach((event, idx) => {
            console.log(`  ${idx + 1}. ${event.title} - ${event.image}`);
        });

        // Update or create the upcoming-events section
        const result = await Content.findOneAndUpdate(
            { page: 'home', section: 'upcoming-events' },
            {
                page: 'home',
                section: 'upcoming-events',
                content: currentHomepageEvents
            },
            { upsert: true, new: true }
        );

        console.log('\n✅ Successfully updated CMS database!');
        console.log('Updated document ID:', result._id);
        console.log('\n📊 Events now in database:');
        result.content.events.forEach((event, idx) => {
            console.log(`  ${idx + 1}. ${event.title} - ${event.image}`);
        });

        await mongoose.connection.close();
        console.log('\n👋 Database connection closed');

    } catch (error) {
        console.error('❌ Error updating events:', error);
        process.exit(1);
    }
}

updateEvents();
