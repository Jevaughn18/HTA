const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Content = require('./models/Content');

dotenv.config();

// COMPLETE seed data matching exact HTML content
const seedData = [
    // ==================== HOME PAGE (index.html) ====================
    {
        page: 'home',
        section: 'hero',
        content: {
            title: 'Agents of Change.',
            subtitle: 'Welcome to Harvest Temple Apostolic',
            backgroundImage: 'assets/youth.jpeg'
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
            heading: 'Attend a Sunday Service',
            description: 'At Harvest Temple, everyone is welcome whether you\'re single or married, young or young at heart. This is a place to grow in your faith, connect with others, and be part of a loving, supportive community. Join us every Sunday for Spirit-filled worship and biblically-centered teaching that inspires and equips you for life.',
            secondaryText: 'Come on out to our Sunday school at 9am.'
        }
    },
    {
        page: 'home',
        section: 'vision',
        content: {
            heading: 'To see people passionately devoted to God.',
            description: 'Harvest Temple Apostolic is a One God Apostolic, Bible-based church in Jamaica. Founded in 1985 by Bishop K.O Carter, we exist to see people passionately devoted to God.',
            extendedDescription: 'We value the presence of God. Our worship, preaching and teaching, and Children\'s Ministry are centered around each person encountering the Holy Spirit. We want to help you discover truth, find hope, and become all who God has created you to be.'
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
            description: 'Thank you for your generosity - your support allows Harvest Temple Apostolic to make a meaningful impact in our community, sharing hope and transforming lives every day.'
        }
    },
    {
        page: 'home',
        section: 'locations',
        content: {
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

    // ==================== ABOUT PAGE (about.html) ====================
    {
        page: 'about',
        section: 'hero',
        content: {
            title: 'About Us',
            backgroundImage: ''
        }
    },
    {
        page: 'about',
        section: 'who-we-are',
        content: {
            heading: 'Rooted in Faith, Growing in Community',
            description: 'We are a church family committed to nurturing faith, building meaningful relationships, and creating a welcoming space where everyone can experience the love and hope of Jesus Christ.',
            vision: 'To see people passionately devoted to God.',
            mission: 'To help people experience God\'s love, trust His Word and follow His lead.'
        }
    },
    {
        page: 'about',
        section: 'what-we-believe',
        content: {
            heading: 'What We Believe',
            intro: 'At Harvest Temple Apostolic Church, we are strong believers in faith, family, and the fruit of the Spirit. We believe in one God, baptism in the name of the Lord Jesus Christ, and the infilling of the Holy Ghost as referenced in Acts 2:38. We uphold holiness and believe that the Word of God is truth, encouraging all to live by this standard.',
            statement: 'Harvest Temple Apostolic welcomes all with open arms, offering a home and a place of true worship, as stated in St. John 4:24. We embrace being Agents of Change, boldly declaring: "The Spirit of the Lord is upon us, because he hath anointed us to preach the gospel to the poor; he hath sent us to heal the brokenhearted, to preach deliverance to the captives, and recovering of sight to the blind, to set at liberty them that are bruised, to preach the acceptable year of the Lord." (St. Luke 4:18-19)',
            articles: [
                'Article 1 - The Oneness of God',
                'Article 2 - The Authority of Scripture',
                'Article 3 - Salvation Through Jesus Christ',
                'Article 4 - Water Baptism in Jesus\' Name',
                'Article 5 - The Baptism of the Holy Ghost'
            ]
        }
    },
    {
        page: 'about',
        section: 'our-story',
        content: {
            heading: 'A Short History of Harvest Temple Apostolic',
            paragraph1: 'The Harvest Temple Apostolic Group of Churches was formed in 1980 by the late Bishop Kingsley O. Carter. After the death of our founder in March 2023, the mantle was passed on to his assistant at the time, Bishop Clifton Campbell, in July 2023.',
            paragraph2: 'Our headquarters office is located in Portsmouth, St. Catherine, and over the years, the organization has expanded to include branches in Banks Clarendon, Slipe Pen Road Kingston, and Mullet Hall Portland.',
            scripture: 'Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost. — Acts 2:38',
            founderCaption: 'Late Bishop Kingsley O. Carter, Founder (1980-2023)'
        }
    },
    {
        page: 'about',
        section: 'our-name',
        content: {
            heading: 'Why Harvest Temple Apostolic?',
            harvest: 'represents the gathering of souls for Christ\'s kingdom. Jesus said, "Then saith he unto his disciples, The harvest truly is plenteous, but the labourers are few" (Matthew 9:37 KJV). We are committed to being faithful laborers in God\'s harvest field.',
            temple: 'signifies that we are God\'s dwelling place. "Know ye not that ye are the temple of God, and that the Spirit of God dwelleth in you?" (1 Corinthians 3:16 KJV). As a church, we are the living temple where God\'s presence dwells.',
            apostolic: 'affirms our foundation in the teaching and doctrine of the apostles. "And they continued stedfastly in the apostles\' doctrine and fellowship, and in breaking of bread, and in prayers" (Acts 2:42 KJV). We hold fast to the apostolic faith delivered to the saints.',
            mission: 'Together, our name reflects our mission: to be a Spirit-filled community gathering souls, honoring God\'s presence, and living out the apostolic faith in truth and power.'
        }
    },
    {
        page: 'about',
        section: 'leadership',
        content: {
            heading: 'Meet Our Leadership',
            leaders: [
                {
                    name: 'Bishop Clifton & Evangelist Sophia Campbell',
                    title: 'Presiding Bishop',
                    location: 'HTA Banks, Clarendon',
                    image: 'assets/Bishop & Lady.jpg'
                },
                {
                    name: 'Pastor Calpurnia Williams',
                    title: 'Pastor',
                    location: 'HTA Portsmouth, St. Catherine',
                    image: 'assets/pastor.jpg'
                },
                {
                    name: 'Pastor Sheron Kavanagh',
                    title: 'Pastor',
                    location: 'HTA Slipe Pen Road, Kingston',
                    image: 'assets/Sharon.jpg'
                },
                {
                    name: 'Pastor Yulanda Vassel',
                    title: 'Pastor',
                    location: 'HTA Mullet Hall, Portland',
                    image: 'assets/pastor yulanda.jpg'
                }
            ]
        }
    },

    // ==================== DEPARTMENTS PAGE (departments.html) ====================
    {
        page: 'departments',
        section: 'hero',
        content: {
            title: 'Departments',
            backgroundImage: ''
        }
    },
    {
        page: 'departments',
        section: 'national-youth',
        content: {
            heading: 'National Youth Department',
            description: 'Our Youth Ministry is a vibrant community designed to help young people learn about God\'s love in a fun and engaging way. Through age-appropriate lessons, interactive activities, and exciting events, youth are introduced to biblical truths, encouraged to grow in their faith, and build a foundation for a lifelong relationship with Jesus. The ministry provides a safe and welcoming environment where young people can explore, discover, and experience the joy of following Christ.',
            image: 'assets/youth.jpeg'
        }
    },
    {
        page: 'departments',
        section: 'sunday-school',
        content: {
            heading: 'Sunday School Department',
            description: 'Our Sunday School Ministry is focused on guiding all ages through their spiritual journey with biblical teaching and fellowship. With a mix of weekly classes, worship, and interactive learning, Sunday School creates a space where members can deepen their relationship with God, form strong connections with fellow believers, and discover biblical truths. Our desire is to equip and empower everyone to have a personal relationship with God through His Word.',
            image: 'assets/church.jpeg'
        }
    },
    {
        page: 'departments',
        section: 'mens-department',
        content: {
            heading: 'Men\'s Department',
            description: 'The Men\'s Ministry aims to create a welcoming environment for men to grow spiritually and support one another. This ministry focuses on providing spiritual growth, community, and a sense of brotherhood through small group studies, social events, and service projects. We help men to grow in their faith, become godly leaders in their families and communities, and find their place within the church family as they walk in purpose and integrity.',
            image: 'assets/banksworship.jpg'
        }
    },
    {
        page: 'departments',
        section: 'womens-department',
        content: {
            heading: 'Women\'s Department',
            description: 'The Women\'s Ministry creates a nurturing environment for women to grow in their faith, build meaningful relationships, and serve together. Through Bible studies, prayer meetings, fellowship events, and outreach opportunities, women are encouraged to deepen their walk with God, support one another, and use their gifts to make a difference. This ministry provides a space where women can find strength, encouragement, and purpose as they follow Christ together.',
            image: 'assets/bankspraise.jpg'
        }
    },
    {
        page: 'departments',
        section: 'national-ladies',
        content: {
            heading: 'National Ladies Department',
            description: 'The National Ladies Department is dedicated to empowering women across all our congregations to live out their faith with grace, strength, and purpose. Through conferences, retreats, mentorship programs, and service initiatives, ladies are equipped to be vessels of God\'s love in their homes, churches, and communities. This ministry celebrates womanhood in Christ and encourages ladies to walk in their God-given identity as they serve the Lord with excellence.',
            image: 'assets/convocation.jpg'
        }
    },

    // ==================== MEDIA PAGE (media.html) ====================
    {
        page: 'media',
        section: 'hero',
        content: {
            title: 'Media',
            backgroundImage: ''
        }
    },
    {
        page: 'media',
        section: 'youtube-channels',
        content: {
            heading: 'Watch Our Services Online',
            description: 'Subscribe to our YouTube channels to stay connected with our services and events.',
            channels: [
                {
                    name: 'HTA Portsmouth',
                    description: 'Watch live streams and past services from our headquarters in Portsmouth, St. Catherine',
                    url: 'https://www.youtube.com/@harvesttempleapostolicchurch'
                },
                {
                    name: 'HTA Banks Clarendon',
                    description: 'Watch live streams and past services from our Banks Clarendon branch',
                    url: 'https://www.youtube.com/@HTABanksClarendon'
                }
            ]
        }
    },
    {
        page: 'media',
        section: 'prayer-meeting',
        content: {
            heading: 'Join Our Weekly Online Prayer Meeting',
            description: 'Harvest Temple Apostolic Church invites you to our weekly online prayer meetings.',
            time: '5:00 AM',
            days: 'Sunday, Wednesday & Friday',
            platform: 'Via Zoom',
            meetingId: '865 4665 7301',
            passcode: '820325'
        }
    },
    {
        page: 'media',
        section: 'weekly-schedule',
        content: {
            heading: 'Weekly Schedule',
            description: 'Join us throughout the week for worship, prayer, and fellowship.',
            schedule: [
                { day: 'Sunday', times: ['9:00 AM (Sunday School)', '10:30 AM (Sunday Service)'] },
                { day: 'Monday', times: ['7:00 PM (Prayer Meeting)'] },
                { day: 'Tuesday', times: ['7:00 PM (Bible Study)'] },
                { day: 'Wednesday', times: ['9:00 AM (Fasting & Prayer)'] },
                { day: 'Friday', times: ['6:30 PM (Youth Service)'] }
            ]
        }
    },

    // ==================== CONTACT PAGE (contact.html / Plan A Visit) ====================
    {
        page: 'contact',
        section: 'hero',
        content: {
            title: 'Plan A Visit',
            backgroundImage: ''
        }
    },
    {
        page: 'contact',
        section: 'service-details',
        content: {
            heading: 'Attend a Sunday Service',
            description: 'Whether you\'re single or married, older or younger, this is a place where you can grow in your faith and build a strong community with others. Every Sunday, we offer Spirit-filled worship and live teaching that is biblically-centered.',
            note: 'Children\'s ministry is available from birth - 12 years old.',
            time: '10am',
            timeLabel: 'Every Sunday',
            location: 'HTA Portsmouth',
            address: '822A Southern Parade, Waterford P.O, Jamaica'
        }
    },
    {
        page: 'contact',
        section: 'what-to-expect',
        content: {
            heading: 'What To Expect',
            items: [
                { title: 'Warm Welcome', description: 'You\'ll be greeted with a friendly smile and a warm welcome.' },
                { title: 'Uplifting Worship', description: 'Experience a mix of contemporary and traditional worship.' },
                { title: 'Relevant Message', description: 'Hear a message that\'s engaging and will deepen your walk with Jesus.' },
                { title: 'Kids Ministry', description: 'Fun and safe programs for kids ages birth-12yo to learn about God.' },
                { title: 'Joyful Choir', description: 'Experience inspiring music that lifts your spirit.' },
                { title: 'Praise & Worship', description: 'Join us in powerful moments of praise and worship.' }
            ]
        }
    },
    {
        page: 'contact',
        section: 'faq',
        content: {
            heading: 'Frequently Asked Questions',
            faqs: [
                {
                    question: 'What Should I Wear?',
                    answer: 'Come as you are! We have people who dress casually and others who prefer more formal attire. The most important thing is that you\'re comfortable and ready to worship.'
                },
                {
                    question: 'How Long Is the Service?',
                    answer: 'Our Sunday service typically lasts about 1.5 to 2 hours, including worship, announcements, and the message. We believe in being led by the Spirit, so times may vary.'
                },
                {
                    question: 'Is There Something for My Kids?',
                    answer: 'Yes! We offer children\'s ministry for ages birth through 12 years old. Our dedicated team provides age-appropriate biblical teaching in a fun, safe environment during the service.'
                },
                {
                    question: 'Do I Need to Bring Anything?',
                    answer: 'Just bring yourself and your Bible if you have one. We\'ll provide everything else you need. If you don\'t have a Bible, we\'re happy to help you get one.'
                },
                {
                    question: 'Is Your Campus Accessible?',
                    answer: 'Yes, our facilities are accessible for those with mobility needs. We have accessible parking, ramps, and restrooms. If you have specific accessibility needs, please contact us in advance so we can assist you.'
                }
            ]
        }
    },
    {
        page: 'contact',
        section: 'locations',
        content: {
            heading: 'Our Locations',
            branches: [
                {
                    name: 'HTA Portsmouth',
                    address: '822A Southern Parade, Waterford P.O, Jamaica'
                },
                {
                    name: 'HTA Banks',
                    address: 'Banks, Clarendon, Jamaica'
                },
                {
                    name: 'HTA Slipe Pen Road',
                    address: 'Slipe Pen Road, Kingston, Jamaica'
                },
                {
                    name: 'HTA Mullet Hall',
                    address: 'Mullet Hall, Portland, Jamaica'
                }
            ]
        }
    },
    {
        page: 'contact',
        section: 'contact-form',
        content: {
            heading: 'Have a Question?',
            description: 'We are here to help you! Send our team an email and we will be sure to get back with you within 3-5 days!'
        }
    },

    // ==================== EVENTS PAGE (events.html) ====================
    {
        page: 'events',
        section: 'hero',
        content: {
            title: 'Upcoming Events',
            subtitle: 'What\'s happening at Harvest Temple Apostolic',
            backgroundImage: ''
        }
    },
    {
        page: 'events',
        section: 'intro',
        content: {
            heading: 'Upcoming Events',
            description: 'We\'re excited about the upcoming events at Harvest Temple Apostolic! Explore what\'s coming up below and click to register.'
        }
    },
    {
        page: 'events',
        section: 'upcoming',
        content: {
            events: [
                {
                    title: '22nd Annual Holy Convocation',
                    date: 'March 7-11, 2025',
                    location: 'Harvest Temple Portsmouth, St. Catherine',
                    description: 'Join us for HTA\'s Annual Convocation — a powerful time of refreshing, restoration, and revival. Featuring dynamic day speakers, anointed nightly preachers, and impactful messages rooted in the Apostolic doctrine.',
                    image: 'assets/convocation.jpg'
                },
                {
                    title: 'HTA Youth Camp 2025',
                    date: 'August 10-16, 2025',
                    location: 'Knox Community College, Cobbla, Manchester',
                    description: 'Get ready for HTA Youth Camp — a life-changing experience filled with fun, fellowship, and faith-building sessions. Features inspiring devotionals, interactive workshops on leadership and faith, and outdoor activities.',
                    image: 'assets/camp.jpg'
                }
            ]
        }
    },
    {
        page: 'events',
        section: 'past-events',
        content: {
            heading: 'Past Events',
            description: 'Take a look at some of our recent events and what God has been doing in our community.',
            events: [
                { title: 'Youth Camp', date: 'August 10–16 2025', photoCount: 12 },
                { title: 'Family Day Celebration', date: 'October 2024', photoCount: 18 },
                { title: 'Youth Conference', date: 'September 2024', photoCount: 15 }
            ]
        }
    },
    {
        page: 'events',
        section: 'cta',
        content: {
            heading: 'Don\'t Miss Out!',
            description: 'Stay connected and be the first to know about upcoming events, special services, and community gatherings.'
        }
    },

    // ==================== GIVE PAGE (give.html) ====================
    {
        page: 'give',
        section: 'hero',
        content: {
            title: 'Thank you for Giving',
            subtitle: 'We couldn\'t do it without you.',
            backgroundImage: ''
        }
    },
    {
        page: 'give',
        section: 'thank-you',
        content: {
            heading: 'Transforming Lives Through Generosity',
            description: 'Because of your generous giving, Harvest Temple Apostolic is reaching Jamaica and beyond with the truth of God\'s Word. Together, we\'re reaching people who don\'t know Jesus, helping families grow together, and raising up leaders who take their faith outside the church.'
        }
    },
    {
        page: 'give',
        section: 'ways-to-give',
        content: {
            heading: 'Ways to Give',
            description: 'Here are some easy ways to support our church.',
            methods: [
                {
                    title: 'Give Online',
                    description: 'Donate securely through our trusted online platform.'
                },
                {
                    title: 'Bank Transfer',
                    accountName: 'Harvest Temple Apostolic',
                    bankName: 'National Commercial Bank',
                    accountNumber: '666789666456',
                    branch: 'Waterford, St. Catherine'
                },
                {
                    title: 'In Person',
                    description: 'During all Weekend Services',
                    details: 'Join us every Sunday at 822A Southern Parade, Waterford P.O.',
                    note: 'Drop your contribution in our offering box during service.'
                }
            ]
        }
    },
    {
        page: 'give',
        section: 'impact',
        content: {
            heading: 'Your Impact',
            description: 'Your generosity empowers our community to grow, worship, and thrive.',
            areas: [
                {
                    title: 'Community Programs',
                    description: 'Fund outreach initiatives that support the community and individuals in need.'
                },
                {
                    title: 'Youth Initiatives',
                    description: 'Empower the next generation through education and spiritual development.'
                },
                {
                    title: 'Worship Spaces',
                    description: 'Create welcoming environments for worship and fellowship.'
                }
            ]
        }
    },
    {
        page: 'give',
        section: 'scripture',
        content: {
            quote: 'Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.',
            reference: '2 Corinthians 9:7'
        }
    },
    {
        page: 'give',
        section: 'faq',
        content: {
            heading: 'Frequently Asked Questions',
            faqs: [
                {
                    question: 'Is my donation secure?',
                    answer: 'Yes! We use industry-standard encryption and security measures to protect your information. Your donation is processed through secure, trusted payment platforms.'
                },
                {
                    question: 'Can I set up recurring donations?',
                    answer: 'Absolutely! When you give online, you have the option to set up weekly, bi-weekly, or monthly recurring donations. This is a great way to support the church consistently.'
                },
                {
                    question: 'Will I receive a tax receipt?',
                    answer: 'Yes, all donations are tax-deductible. You will receive a receipt via email for online donations, and annual giving statements are provided for tax purposes.'
                },
                {
                    question: 'How is my donation used?',
                    answer: 'Your donations support our ministry operations, community outreach programs, youth initiatives, facility maintenance, and spreading the Gospel. We are committed to faithful stewardship of all gifts.'
                },
                {
                    question: 'Can I designate my gift to a specific ministry?',
                    answer: 'Yes! When giving online or by bank transfer, you can specify which ministry or project you\'d like to support. For in-person giving, please include a note with your designation.'
                }
            ]
        }
    }
];

// Connect to MongoDB and seed data
async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hta-cms');
        console.log('✅ Connected to MongoDB');

        // Clear existing content
        await Content.deleteMany({});
        console.log('🗑️  Cleared existing content');

        // Insert seed data
        await Content.insertMany(seedData);
        console.log(`✅ Successfully seeded ${seedData.length} content sections`);

        // Display summary
        console.log('\n📊 Content Summary:');
        const pages = ['home', 'about', 'departments', 'media', 'contact', 'events', 'give'];
        for (const page of pages) {
            const count = seedData.filter(item => item.page === page).length;
            console.log(`   ${page.toUpperCase()}: ${count} sections`);
        }

        console.log('\n🎉 Database seeding complete with FULL HTML content!');
        console.log('👉 All content now matches your HTML pages exactly.\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seed function
seedDatabase();
