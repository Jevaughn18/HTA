const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Content = require('./models/Content');

dotenv.config();

// ALL SECTIONS - Complete seed data including galleries and past events
const allSections = [
    // ==================== HOME PAGE ====================
    {
        page: 'home',
        section: 'hero',
        content: {
            title: 'Agents of Change.',
            subtitle: 'Welcome to Harvest Temple Apostolic',
            backgroundImage: 'assets/youth.jpeg',
            button1Text: 'Plan A Visit',
            button1Link: 'contact.html',
            button2Text: 'Get Connected',
            button2Link: 'contact.html'
        }
    },
    {
        page: 'home',
        section: 'service-times',
        content: {
            serviceTime: '10am',
            serviceLabel: 'Service Every Sunday',
            sundaySchoolTime: '9am',
            sundaySchoolLabel: 'Sunday School'
        }
    },
    {
        page: 'home',
        section: 'service-details',
        content: {
            label: 'SERVICE DETAILS',
            heading: 'Attend a Sunday Service',
            description: 'At Harvest Temple, everyone is welcome whether you\'re single or married, young or young at heart. This is a place to grow in your faith, connect with others, and be part of a loving, supportive community. Join us every Sunday for Spirit-filled worship and biblically-centered teaching that inspires and equips you for life.',
            secondaryText: 'Come on out to our Sunday school at 9am.',
            button1Text: 'About Us',
            button1Link: 'about.html',
            button2Text: 'Get Directions',
            button2Link: 'contact.html'
        }
    },
    {
        page: 'home',
        section: 'vision',
        content: {
            label: 'OUR VISION',
            heading: 'To see people passionately devoted to God.',
            description: 'Harvest Temple Apostolic is a One God Apostolic, Bible-based church in Jamaica. Founded in 1985 by Bishop K.O Carter, we exist to see people passionately devoted to God.',
            extendedDescription: 'We value the presence of God. Our worship, preaching and teaching, and Children\'s Ministry are centered around each person encountering the Holy Spirit. We want to help you discover truth, find hope, and become all who God has created you to be.'
        }
    },
    {
        page: 'home',
        section: 'vision-gallery',
        content: {
            images: [
                { src: 'assets/Choir.jpg', alt: 'Worship at HTA' },
                { src: 'assets/banks choir.jpg', alt: 'Bishop and Family' },
                { src: 'assets/Me.jpg', alt: 'Church Leadership' },
                { src: 'assets/youth.jpeg', alt: 'Youth Ministry' }
            ]
        }
    },
    {
        page: 'home',
        section: 'next-steps',
        content: {
            heading: 'What Are My Next Steps',
            description: 'Discover your next steps at Harvest Temple Apostolic as you grow in faith, connect with others, and walk in God\'s calling on your life.',
            cards: [
                {
                    title: 'Plan A Visit',
                    description: 'Plan your visit and experience a warm welcome, Spirit-filled worship, and a message that will deepen your faith.',
                    image: 'assets/church.jpeg',
                    link: 'contact.html'
                },
                {
                    title: 'Departments',
                    description: 'Explore our diverse departments, each dedicated to helping you grow spiritually and find your place in our community.',
                    image: 'assets/youth.jpeg',
                    link: 'departments.html'
                },
                {
                    title: 'Serve',
                    description: 'Discover the joy of giving back, connecting with others, and growing in your faith through serving.',
                    image: 'assets/banksworship.jpg',
                    link: 'contact.html'
                }
            ]
        }
    },
    {
        page: 'home',
        section: 'events',
        content: {
            heading: 'Upcoming Events',
            button: { text: 'View More Events', link: 'events.html' },
            events: [
                {
                    title: 'Sunday Worship Service',
                    date: 'Every Sunday, 10:00 AM',
                    image: 'assets/bankspraise.jpg'
                },
                {
                    title: 'Youth Week 2025',
                    date: 'March 10-15, 2025',
                    image: 'assets/youth.jpeg'
                }
            ]
        }
    },
    {
        page: 'home',
        section: 'generosity',
        content: {
            heading: 'Thank You For Your Generosity',
            description: 'Thank you for your generosity - your support allows Harvest Temple Apostolic to make a meaningful impact in our community, sharing hope and transforming lives every day.',
            button: { text: 'Give Online', link: 'give.html' }
        }
    },
    {
        page: 'home',
        section: 'locations',
        content: {
            heading: 'Our Locations',
            locations: [
                {
                    name: 'HTA Portsmouth, St. Catherine',
                    pastor: 'Pastor Calpurnia Williams',
                    address: '822A Southern Parade\nWaterford P.O, Jamaica',
                    isHeadquarters: true
                },
                {
                    name: 'HTA Banks Clarendon',
                    pastor: 'Bishop Clifton & Evangelist Sophia Campbell',
                    address: 'Banks District\nRace Course P.O., Clarendon, Jamaica',
                    isHeadquarters: false
                },
                {
                    name: 'HTA Slipe Pen Road, Kingston',
                    pastor: 'Pastor Sheron Kavanagh',
                    address: '37 Slipe Road\nKingston 5, Jamaica',
                    isHeadquarters: false
                },
                {
                    name: 'HTA Mullet Hall, Portland',
                    pastor: 'Pastor Yulanda Vassel',
                    address: '101 Mullet Hall\nPortland, Jamaica',
                    isHeadquarters: false
                }
            ]
        }
    },

    // ==================== EVENTS PAGE ====================
    {
        page: 'events',
        section: 'hero',
        content: {
            title: 'Events & Gatherings',
            subtitle: 'Join us for upcoming events and celebrations',
            backgroundImage: 'assets/youth.jpeg'
        }
    },
    {
        page: 'events',
        section: 'past-events',
        content: {
            heading: 'Past Events',
            description: 'Take a look at some of our recent events and what God has been doing in our community.',
            events: [
                {
                    title: 'Youth Camp',
                    date: 'August 10–16 2025',
                    photoCount: 12,
                    link: 'youth-camp.html',
                    stackedImages: [
                        'assets/sheeka-kam.jpeg',
                        'assets/ron-mic.jpeg',
                        'assets/black.png'
                    ]
                },
                {
                    title: 'Family Day Celebration',
                    date: 'October 2024',
                    photoCount: 18,
                    link: 'family-day.html',
                    stackedImages: [
                        'assets/church.jpeg',
                        'assets/camp.jpg',
                        'assets/convocation.jpg'
                    ]
                },
                {
                    title: 'Youth Conference',
                    date: 'September 2024',
                    photoCount: 24,
                    link: 'youth-conference.html',
                    stackedImages: [
                        'assets/youth.jpeg',
                        'assets/banksworship.jpg',
                        'assets/bankspraise.jpg'
                    ]
                }
            ]
        }
    }
];

async function seedAllSections() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hta-cms');
        console.log('✅ Connected to MongoDB');

        console.log('🗑️  Clearing existing content...');
        await Content.deleteMany({});

        console.log('📝 Seeding all sections...');
        for (const section of allSections) {
            await Content.create(section);
            console.log(`   ✓ Added ${section.page}/${section.section}`);
        }

        console.log(`\n✅ Successfully seeded ${allSections.length} sections!`);
        console.log('\n📊 Sections by page:');
        const pageGroups = allSections.reduce((acc, s) => {
            acc[s.page] = (acc[s.page] || 0) + 1;
            return acc;
        }, {});
        Object.entries(pageGroups).forEach(([page, count]) => {
            console.log(`   ${page}: ${count} sections`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedAllSections();
