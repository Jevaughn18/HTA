const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Content = require('./models/Content');

dotenv.config();

// COMPLETE SEED FILE WITH ALL 7 PAGES - ACCURATE DATA FROM HTML
const allContent = [
    // ==================== HOME PAGE ====================
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

    // ==================== ABOUT PAGE ====================
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

    // ==================== DEPARTMENTS PAGE ====================
    {
        page: 'departments',
        section: 'hero',
        content: {
            title: 'Departments',
            backgroundVideo: 'assets/group.MOV'
        }
    },
    {
        page: 'departments',
        section: 'national-youth',
        content: {
            title: 'National Youth Department',
            description: "Our Youth Ministry is a vibrant community designed to help young people learn about God's love in a fun and engaging way. Through age-appropriate lessons, interactive activities, and exciting events, youth are introduced to biblical truths, encouraged to grow in their faith, and build a foundation for a lifelong relationship with Jesus. The ministry provides a safe and welcoming environment where young people can explore, discover, and experience the joy of following Christ.",
            image: 'assets/National Youth Department.jpg',
            button: { text: 'Learn More', link: 'contact.html' },
            layout: 'image-left'
        }
    },
    {
        page: 'departments',
        section: 'sunday-school',
        content: {
            title: 'Sunday School Department',
            description: "Our Sunday School Ministry is focused on guiding all ages through their spiritual journey with biblical teaching and fellowship. With a mix of weekly classes, worship, and interactive learning, Sunday School creates a space where members can deepen their relationship with God, form strong connections with fellow believers, and discover biblical truths. Our desire is to equip and empower everyone to have a personal relationship with God through His Word.",
            image: 'assets/church.jpeg',
            button: { text: 'Learn More', link: 'contact.html' },
            layout: 'image-right'
        }
    },
    {
        page: 'departments',
        section: 'mens-department',
        content: {
            title: "Men's Department",
            description: "The Men's Ministry aims to create a welcoming environment for men to grow spiritually and support one another. This ministry focuses on providing spiritual growth, community, and a sense of brotherhood through small group studies, social events, and service projects. We help men to grow in their faith, become godly leaders in their families and communities, and find their place within the church family as they walk in purpose and integrity.",
            image: "assets/men'schoir.jpg",
            button: { text: 'Learn More', link: 'contact.html' },
            layout: 'image-left'
        }
    },
    {
        page: 'departments',
        section: 'womens-department',
        content: {
            title: "Women's Department",
            description: "The Women's Ministry creates a nurturing environment for women to grow in their faith, build meaningful relationships, and serve together. Through Bible studies, prayer meetings, fellowship events, and outreach opportunities, women are encouraged to deepen their walk with God, support one another, and use their gifts to make a difference. This ministry provides a space where women can find strength, encouragement, and purpose as they follow Christ together.",
            image: 'assets/bankspraise.jpg',
            button: { text: 'Learn More', link: 'contact.html' },
            layout: 'image-right'
        }
    },
    {
        page: 'departments',
        section: 'national-ladies',
        content: {
            title: 'National Ladies Department',
            description: "The National Ladies Department is dedicated to empowering women across all our congregations to live out their faith with grace, strength, and purpose. Through conferences, retreats, mentorship programs, and service initiatives, ladies are equipped to be vessels of God's love in their homes, churches, and communities. This ministry celebrates womanhood in Christ and encourages ladies to walk in their God-given identity as they serve the Lord with excellence.",
            image: 'assets/Choir.jpg',
            button: { text: 'Learn More', link: 'contact.html' },
            layout: 'image-left'
        }
    },

    // ==================== MEDIA PAGE ====================
    {
        page: 'media',
        section: 'hero',
        content: {
            title: 'Media',
            backgroundVideo: 'assets/cam1.mp4'
        }
    },
    {
        page: 'media',
        section: 'youtube-channels',
        content: {
            title: 'Watch Our Services Online',
            subtitle: 'Subscribe to our YouTube channels to stay connected with our services and events.',
            channels: [
                {
                    name: 'HTA Portsmouth',
                    description: 'Watch live streams and past services from our headquarters in Portsmouth, St. Catherine',
                    link: 'https://www.youtube.com/@harvesttempleapostolicchurch'
                },
                {
                    name: 'HTA Banks Clarendon',
                    description: 'Watch live streams and past services from our Banks Clarendon branch',
                    link: 'https://www.youtube.com/@HarvestTempleApostolicBanks'
                }
            ]
        }
    },
    {
        page: 'media',
        section: 'recent-services',
        content: {
            title: 'Recent Services',
            portsmouth: {
                heading: 'Portsmouth Services',
                services: [
                    {
                        title: 'Sunday Service',
                        date: 'November 9, 2025',
                        location: 'HTA Portsmouth',
                        embedUrl: 'https://www.youtube.com/embed/xYPvinGG_-k'
                    },
                    {
                        title: 'Youth Sunday',
                        date: 'Recent Service',
                        location: 'HTA Portsmouth',
                        embedUrl: 'https://www.youtube.com/embed/sKOs27yX8_c'
                    }
                ]
            },
            banksClarendon: {
                heading: 'Banks Clarendon Services',
                services: [
                    {
                        title: 'First Sunday Service',
                        date: 'October 5, 2025',
                        location: 'HTA Banks Clarendon',
                        embedUrl: 'https://www.youtube.com/embed/nzBCNO-0rtQ'
                    },
                    {
                        title: "Women's Evangelistic Service",
                        date: 'September 30, 2025',
                        location: 'HTA Banks Clarendon',
                        embedUrl: 'https://www.youtube.com/embed/x52Upy8XLcA'
                    }
                ]
            }
        }
    },
    {
        page: 'media',
        section: 'prayer-meeting',
        content: {
            title: 'Join Our Weekly Online Prayer Meeting',
            description: 'Harvest Temple Apostolic Church invites you to our weekly online prayer meetings.',
            schedule: {
                time: '5:00 AM',
                days: 'Sunday, Wednesday & Friday',
                platform: 'Via Zoom',
                openToAll: 'All Welcome'
            },
            credentials: {
                meetingId: '865 4665 7301',
                passcode: '820325',
                link: 'https://us02web.zoom.us/j/86546657301?pwd=QWNqL1ZLbzB5eUxlVEJHY3pPVWhCdz09'
            }
        }
    },
    {
        page: 'media',
        section: 'weekly-schedule',
        content: {
            title: 'Weekly Schedule',
            intro: 'Join us throughout the week for worship, prayer, and fellowship.',
            schedule: [
                {
                    day: 'Sunday',
                    events: [
                        { time: '9:00 AM', name: 'Sunday School' },
                        { time: '10:30 AM', name: 'Sunday Service' }
                    ]
                },
                {
                    day: 'Monday',
                    events: [
                        { time: '7:00 PM', name: 'Prayer Meeting' }
                    ]
                },
                {
                    day: 'Tuesday',
                    events: [
                        { time: '7:00 PM', name: 'Bible Study' }
                    ]
                },
                {
                    day: 'Wednesday',
                    events: [
                        { time: '9:00 AM', name: 'Fasting & Prayer' }
                    ]
                },
                {
                    day: 'Friday',
                    events: [
                        { time: '6:30 PM', name: 'Youth Service' }
                    ]
                }
            ]
        }
    },

    // ==================== CONTACT PAGE ====================
    {
        page: 'contact',
        section: 'hero',
        content: {
            title: 'Plan A Visit',
            backgroundVideo: 'assets/handgreet.mp4'
        }
    },
    {
        page: 'contact',
        section: 'service-details',
        content: {
            sectionLabel: 'SERVICE DETAILS',
            title: 'Attend a Sunday Service',
            intro: "Whether you're single or married, older or younger, this is a place where you can grow in your faith and build a strong community with others. Every Sunday, we offer Spirit-filled worship and live teaching that is biblically-centered.",
            note: "Children's ministry is available from birth - 12 years old.",
            serviceTime: {
                time: '10am',
                frequency: 'Every Sunday'
            },
            location: {
                name: 'HTA Portsmouth',
                address: '822A Southern Parade\nWaterford P.O, Jamaica'
            },
            buttons: [
                { text: 'About Us', link: 'about.html', type: 'primary' },
                { text: 'Get Directions', link: 'https://maps.google.com', type: 'outline' }
            ]
        }
    },
    {
        page: 'contact',
        section: 'what-to-expect',
        content: {
            title: 'What To Expect',
            cards: [
                {
                    title: 'Warm Welcome',
                    description: "You'll be greeted with a friendly smile and a warm welcome.",
                    image: 'assets/church.jpeg'
                },
                {
                    title: 'Uplifting Worship',
                    description: 'Experience a mix of contemporary and traditional worship.',
                    image: 'assets/banksworship.jpg'
                },
                {
                    title: 'Relevant Message',
                    description: "Hear a message that's engaging and will deepen your walk with Jesus.",
                    image: 'assets/hand.jpg'
                },
                {
                    title: 'Kids Ministry',
                    description: 'Fun and safe programs for kids ages birth-12yo to learn about God.',
                    image: 'assets/youth.jpeg'
                },
                {
                    title: 'Joyful Choir',
                    description: 'Experience inspiring music that lifts your spirit.',
                    image: 'assets/Choir.jpg'
                },
                {
                    title: 'Praise & Worship',
                    description: 'Join us in powerful moments of praise and worship.',
                    image: 'assets/praise.jpg'
                }
            ]
        }
    },
    {
        page: 'contact',
        section: 'faq',
        content: {
            title: 'Frequently Asked Questions',
            questions: [
                {
                    question: 'What Should I Wear?',
                    answer: "Come as you are! We have people who dress casually and others who prefer more formal attire. The most important thing is that you're comfortable and ready to worship."
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
                    answer: "Just bring yourself and your Bible if you have one. We'll provide everything else you need. If you don't have a Bible, we're happy to help you get one."
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
        section: 'branch-locations',
        content: {
            title: 'Our Locations',
            branches: [
                {
                    name: 'HTA Portsmouth',
                    address: '822A Southern Parade\nWaterford P.O, Jamaica',
                    mapLink: 'https://www.google.com/maps/search/?api=1&query=822A+Southern+Parade+Waterford+P.O+Jamaica'
                },
                {
                    name: 'HTA Banks',
                    address: 'Banks\nClarendon, Jamaica',
                    mapLink: 'https://www.google.com/maps/search/?api=1&query=Banks+Clarendon+Jamaica'
                },
                {
                    name: 'HTA Slipe Pen Road',
                    address: 'Slipe Pen Road\nKingston, Jamaica',
                    mapLink: 'https://www.google.com/maps/search/?api=1&query=Slipe+Pen+Road+Kingston+Jamaica'
                },
                {
                    name: 'HTA Mullet Hall',
                    address: 'Mullet Hall\nPortland, Jamaica',
                    mapLink: 'https://www.google.com/maps/search/?api=1&query=Mullet+Hall+Portland+Jamaica'
                }
            ]
        }
    },
    {
        page: 'contact',
        section: 'contact-form',
        content: {
            title: 'Have a Question?',
            intro: 'We are here to help you! Send our team an email and we will be sure to get back with you within 3-5 days!',
            formAction: 'https://formspree.io/f/Htaportsmouth@gmail.com',
            submitButton: 'Email Us'
        }
    },

    // ==================== GIVE PAGE ====================
    {
        page: 'give',
        section: 'hero',
        content: {
            title: 'Thank you for Giving',
            subtitle: "We couldn't do it without you.",
            backgroundVideo: 'assets/give.mp4',
            button: { text: 'Give Online', link: '#ways-to-give' }
        }
    },
    {
        page: 'give',
        section: 'thank-you',
        content: {
            sectionLabel: 'THANK YOU!',
            title: 'Transforming Lives Through Generosity',
            description: "Because of your generous giving, Harvest Temple Apostolic is reaching Jamaica and beyond with the truth of God's Word. Together, we're reaching people who don't know Jesus, helping families grow together, and raising up leaders who take their faith outside the church.",
            button: { text: 'Give Here', link: '#ways-to-give' }
        }
    },
    {
        page: 'give',
        section: 'ways-to-give',
        content: {
            title: 'Ways to Give',
            subtitle: 'Here are some easy ways to support our church.',
            methods: [
                {
                    type: 'online',
                    icon: 'fa-desktop',
                    title: 'Give Online',
                    description: 'Donate securely through our trusted online platform.',
                    button: { text: 'Give Online', link: '#' }
                },
                {
                    type: 'bank-transfer',
                    icon: 'fa-university',
                    title: 'Bank Transfer',
                    bankDetails: {
                        accountName: 'Harvest Temple Apostolic',
                        bankName: 'National Commercial Bank',
                        accountNumber: '666789666456',
                        branch: 'Waterford, St. Catherine'
                    }
                },
                {
                    type: 'in-person',
                    icon: 'fa-church',
                    title: 'In Person',
                    description: 'During all Weekend Services',
                    details: [
                        'Join us every Sunday at 822A Southern Parade, Waterford P.O.',
                        'Drop your contribution in our offering box during service.'
                    ]
                }
            ]
        }
    },
    {
        page: 'give',
        section: 'impact',
        content: {
            title: 'Your Impact',
            intro: 'Your generosity empowers our community to grow, worship, and thrive.',
            cards: [
                {
                    title: 'Community Programs',
                    description: 'Fund outreach initiatives that support the community and individuals in need.',
                    image: 'assets/Choir.jpg'
                },
                {
                    title: 'Youth Initiatives',
                    description: 'Empower the next generation through education and spiritual development.',
                    image: 'assets/youth.jpeg'
                },
                {
                    title: 'Worship Spaces',
                    description: 'Create welcoming environments for worship and fellowship.',
                    image: 'assets/bankspraise.jpg'
                }
            ]
        }
    },
    {
        page: 'give',
        section: 'generosity-quote',
        content: {
            quote: "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.",
            citation: '2 Corinthians 9:7'
        }
    },
    {
        page: 'give',
        section: 'faq',
        content: {
            title: 'Frequently Asked Questions',
            questions: [
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
                    answer: "Yes! When giving online or by bank transfer, you can specify which ministry or project you'd like to support. For in-person giving, please include a note with your designation."
                }
            ]
        }
    },

    // ==================== EVENTS PAGE ====================
    {
        page: 'events',
        section: 'hero',
        content: {
            title: 'Upcoming Events',
            subtitle: "What's happening at Harvest Temple Apostolic",
            backgroundVideo: 'assets/bible.mp4'
        }
    },
    {
        page: 'events',
        section: 'events-intro',
        content: {
            title: 'Upcoming Events',
            description: "We're excited about the upcoming events at Harvest Temple Apostolic! Explore what's coming up below and click to register."
        }
    },
    {
        page: 'events',
        section: 'upcoming-events',
        content: {
            events: [
                {
                    title: '22nd Annual Holy Convocation',
                    dateRange: 'March 7-11, 2025',
                    dateBadge: { day: '7-11', month: 'Mar' },
                    location: 'Harvest Temple Portsmouth, St. Catherine',
                    description: "Join us for HTA's Annual Convocation — a powerful time of refreshing, restoration, and revival. Featuring dynamic day speakers, anointed nightly preachers, and impactful messages rooted in the Apostolic doctrine.",
                    image: 'assets/convocation.jpg',
                    detailsLink: '#convocation-details'
                },
                {
                    title: 'HTA Youth Camp 2025',
                    dateRange: 'August 10-16, 2025',
                    dateBadge: { day: '10-16', month: 'Aug' },
                    location: 'Knox Community College, Cobbla, Manchester',
                    description: 'Get ready for HTA Youth Camp — a life-changing experience filled with fun, fellowship, and faith-building sessions. Features inspiring devotionals, interactive workshops on leadership and faith, and outdoor activities.',
                    image: 'assets/camp.jpg',
                    detailsLink: '#youth-camp-details'
                }
            ]
        }
    },
    {
        page: 'events',
        section: 'past-events',
        content: {
            title: 'Past Events',
            description: 'Take a look at some of our recent events and what God has been doing in our community.',
            events: [
                {
                    title: 'Youth Camp',
                    date: 'August 10–16 2025',
                    photoCount: '12 Photos',
                    link: 'youth-camp.html',
                    images: ['assets/sheeka-kam.jpeg', 'assets/ron-mic.jpeg', 'assets/black.png']
                },
                {
                    title: 'Family Day Celebration',
                    date: 'October 2024',
                    photoCount: '18 Photos',
                    link: 'family-day.html',
                    images: ['assets/church.jpeg', 'assets/camp.jpg', 'assets/convocation.jpg']
                },
                {
                    title: 'Youth Conference',
                    date: 'September 2024',
                    photoCount: '15 Photos',
                    link: 'youth-conference.html',
                    images: ['assets/convocation.jpg', 'assets/camp.jpg', 'assets/church.jpeg']
                }
            ]
        }
    },
    {
        page: 'events',
        section: 'cta',
        content: {
            title: "Don't Miss Out!",
            description: 'Stay connected and be the first to know about upcoming events, special services, and community gatherings.',
            buttons: [
                { text: 'Get Connected', link: 'contact.html', type: 'primary' },
                { text: 'Support Our Events', link: 'give.html', type: 'outline' }
            ]
        }
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hta-cms');
        console.log('✅ Connected to MongoDB');

        // Clear existing content
        await Content.deleteMany({});
        console.log('✅ Cleared existing content');

        // Insert all content
        await Content.insertMany(allContent);

        console.log(`\n✅ Successfully seeded ${allContent.length} sections!`);
        console.log('\n📋 Seeded sections by page:');
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
