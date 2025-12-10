const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Content = require('./models/Content');

dotenv.config();

// Complete accurate seed with ALL data from actual HTML pages
const allContent = [
    // HOME PAGE
    {
        page: 'home',
        section: 'hero',
        content: {
            title: 'Agents of Change.',
            subtitle: 'Welcome to Harvest Temple Apostolic',
            backgroundImage: 'assets/youth.jpeg',
            videoUrl: '',
            primaryButton: { text: 'Plan A Visit', link: 'contact.html' },
            secondaryButton: { text: 'Get Connected', link: 'contact.html' }
        }
    },
    {
        page: 'home',
        section: 'service-details',
        content: {
            heading: 'Join Us This Sunday',
            description: 'Experience a welcoming community where faith, hope, and love come together. No matter where you are in your spiritual journey, you belong here.',
            primaryButton: { text: 'Plan Your Visit', link: 'contact.html' },
            secondaryButton: { text: 'Watch Live', link: 'media.html' }
        }
    },
    {
        page: 'home',
        section: 'vision',
        content: {
            heading: 'Our Vision',
            text: 'To be agents of change in our communities, spreading the love of Christ and making disciples of all nations. We believe in the power of the Gospel to transform lives and bring hope to the world.'
        }
    },
    {
        page: 'home',
        section: 'vision-gallery',
        content: {
            images: [
                { src: 'assets/Choir.jpg', alt: 'Worship at HTA' },
                { src: 'assets/banks choir.jpg', alt: 'Church Service' },
                { src: 'assets/Me.jpg', alt: 'Leadership' },
                { src: 'assets/youth.jpeg', alt: 'Youth Ministry' }
            ]
        }
    },
    {
        page: 'home',
        section: 'generosity',
        content: {
            heading: 'Generosity Changes Lives',
            text: 'Your generosity helps us reach more people, serve our community, and spread the Gospel around the world. Thank you for your faithful giving.',
            backgroundImage: 'assets/church.jpeg',
            primaryButton: { text: 'Give Online', link: 'give.html' },
            secondaryButton: { text: 'Learn More', link: 'give.html' }
        }
    },

    // ABOUT PAGE
    {
        page: 'about',
        section: 'hero',
        content: {
            title: 'About Us',
            videoUrl: 'assets/handgreet.mp4'
        }
    },
    {
        page: 'about',
        section: 'who-we-are',
        content: {
            heading: 'Rooted in Faith, Growing in Community',
            description: 'We are a church family committed to nurturing faith, building meaningful relationships, and creating a welcoming space where everyone can experience the love and hope of Jesus Christ.',
            vision: { title: 'Vision', text: 'To see people passionately devoted to God.' },
            mission: { title: 'Mission', text: 'To help people experience God\'s love, trust His Word and follow His lead.' }
        }
    },
    {
        page: 'about',
        section: 'what-we-believe',
        content: {
            heading: 'What We Believe',
            introduction: 'At Harvest Temple Apostolic Church, we are strong believers in faith, family, and the fruit of the Spirit. We believe in one God, baptism in the name of the Lord Jesus Christ, and the infilling of the Holy Ghost as referenced in Acts 2:38.'
        }
    },
    {
        page: 'about',
        section: 'our-name',
        content: {
            heading: 'Why Harvest Temple Apostolic?',
            text: 'Harvest represents the gathering of souls for Christ\'s kingdom. Temple signifies that we are God\'s dwelling place. Apostolic affirms our foundation in the teaching and doctrine of the apostles.'
        }
    },
    {
        page: 'about',
        section: 'leadership',
        content: {
            heading: 'Meet Our Leadership',
            team: [
                { name: 'Bishop Clifton & Evangelist Sophia Campbell', title: 'Presiding Bishop', location: 'HTA Banks, Clarendon', photo: 'assets/BISHOP/FIRSTLADY.jpeg' },
                { name: 'Pastor Calpurnia Williams', title: 'Pastor', location: 'HTA Portsmouth, St. Catherine', photo: 'assets/Pastor Williams.jpg' },
                { name: 'Pastor Sheron Kavanagh', title: 'Pastor', location: 'HTA Slipe Pen Road, Kingston', photo: 'assets/Pastor Sharon.jpg' },
                { name: 'Pastor Yulanda Vassel', title: 'Pastor', location: 'HTA Mullet Hall, Portland', photo: 'assets/Pastor Vasell.jpg' }
            ]
        }
    },

    // EVENTS PAGE
    {
        page: 'events',
        section: 'hero',
        content: {
            title: 'Events',
            subtitle: 'Join us for upcoming events and special services'
        }
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hta-cms');
        console.log('✅ Connected to MongoDB');

        // Clear and re-seed
        await Content.deleteMany({});
        console.log('✅ Cleared existing content');

        await Content.insertMany(allContent);

        console.log(`\n✅ Successfully seeded ${allContent.length} sections!`);
        console.log('\n📋 Seeded sections:');
        const byPage = allContent.reduce((acc, s) => {
            acc[s.page] = (acc[s.page] || 0) + 1;
            return acc;
        }, {});
        Object.entries(byPage).forEach(([page, count]) => {
            console.log(`   ${page}: ${count} sections`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
