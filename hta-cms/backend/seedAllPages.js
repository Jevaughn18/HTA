const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Content = require('./models/Content');

dotenv.config();

const allSections = [
    // ============================================
    // HOME PAGE SECTIONS
    // ============================================
    {
        page: 'home',
        section: 'hero',
        content: {
            title: 'Agents of Change.',
            subtitle: 'Welcome to Harvest Temple Apostolic',
            backgroundImage: 'assets/youth.jpeg',
            videoUrl: '',
            primaryButton: {
                text: 'Plan A Visit',
                link: 'contact.html'
            },
            secondaryButton: {
                text: 'Get Connected',
                link: 'contact.html'
            }
        }
    },
    {
        page: 'home',
        section: 'service-times',
        content: {
            time: 'Sundays at 10:00 AM',
            note: 'Join us every Sunday for worship and fellowship',
            location: 'Multiple Locations'
        }
    },
    {
        page: 'home',
        section: 'service-details',
        content: {
            heading: 'Join Us This Sunday',
            description: 'Experience a welcoming community where faith, hope, and love come together. No matter where you are in your spiritual journey, you belong here.',
            primaryButton: {
                text: 'Plan Your Visit',
                link: 'contact.html'
            },
            secondaryButton: {
                text: 'Watch Live',
                link: 'media.html'
            }
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
            heading: 'Take Your Next Step',
            description: 'Whether you\'re new to faith or looking to grow deeper, we have a place for you.',
            steps: [
                {
                    title: 'New Here?',
                    description: 'Learn more about who we are and what we believe. Plan your first visit with us.',
                    image: 'assets/convocation.jpg',
                    buttonText: 'Plan A Visit',
                    buttonLink: 'contact.html'
                },
                {
                    title: 'Get Connected',
                    description: 'Find a small group, serve on a team, or connect with our ministries.',
                    image: 'assets/camp.jpg',
                    buttonText: 'Explore Ministries',
                    buttonLink: 'departments.html'
                },
                {
                    title: 'Give Online',
                    description: 'Support the mission and ministry of Harvest Temple Apostolic Church.',
                    image: 'assets/church.jpeg',
                    buttonText: 'Give Now',
                    buttonLink: 'give.html'
                }
            ]
        }
    },
    {
        page: 'home',
        section: 'events',
        content: {
            heading: 'Upcoming Events',
            upcomingEvents: [
                {
                    title: 'Sunday Morning Worship',
                    date: 'Every Sunday',
                    time: '10:00 AM',
                    location: 'All Locations',
                    description: 'Join us for powerful worship and life-changing messages.',
                    image: 'assets/Choir.jpg'
                },
                {
                    title: 'Youth Conference 2025',
                    date: 'July 15-20, 2025',
                    time: 'All Day',
                    location: 'Waltham Abbey',
                    description: 'A week of worship, learning, and fun for our youth.',
                    image: 'assets/youth.jpeg',
                    registerLink: 'events.html'
                }
            ],
            viewAllButton: {
                text: 'View All Events',
                link: 'events.html'
            }
        }
    },
    {
        page: 'home',
        section: 'generosity',
        content: {
            heading: 'Generosity Changes Lives',
            text: 'Your generosity helps us reach more people, serve our community, and spread the Gospel around the world. Thank you for your faithful giving.',
            backgroundImage: 'assets/church.jpeg',
            primaryButton: {
                text: 'Give Online',
                link: 'give.html'
            },
            secondaryButton: {
                text: 'Learn More',
                link: 'give.html'
            }
        }
    },
    {
        page: 'home',
        section: 'locations',
        content: {
            branches: [
                {
                    name: 'Headquarters',
                    pastor: 'Bishop J. Stewart',
                    address: 'Forest Road, Walthamstow, London, E17 3EE',
                    isHeadquarters: true
                },
                {
                    name: 'Harold Wood',
                    pastor: 'Min. Joel Banks',
                    address: 'Station Road, Harold Wood, Essex, RM3 0BS'
                },
                {
                    name: 'Ilford',
                    pastor: 'Elder Jamar Williams',
                    address: 'Ilford Lane, Ilford, Essex, IG1 2JZ'
                }
            ]
        }
    },

    // ============================================
    // ABOUT PAGE SECTIONS
    // ============================================
    {
        page: 'about',
        section: 'hero',
        content: {
            title: 'About Us',
            subtitle: 'Learn about our history, beliefs, and mission'
        }
    },
    {
        page: 'about',
        section: 'who-we-are',
        content: {
            heading: 'Who We Are',
            description: 'Harvest Temple Apostolic is a vibrant community of believers committed to following Jesus Christ and making disciples. We are part of a global movement of Apostolic Pentecostal churches dedicated to preaching the full Gospel message.',
            vision: {
                title: 'Vision',
                text: 'To be agents of change in our communities, spreading the love of Christ and making disciples of all nations.'
            },
            mission: {
                title: 'Mission',
                text: 'To preach the Gospel, make disciples, and equip believers to live out their faith in everyday life.'
            }
        }
    },
    {
        page: 'about',
        section: 'what-we-believe',
        content: {
            heading: 'What We Believe',
            introduction: 'Our faith is rooted in the Word of God and the teachings of Jesus Christ. Here are the core beliefs that guide our church:',
            beliefs: [
                {
                    title: 'The Bible',
                    content: 'We believe the Bible is the inspired Word of God, our infallible guide for faith and conduct.'
                },
                {
                    title: 'The Godhead',
                    content: 'We believe in one God who has revealed Himself as Father, Son, and Holy Spirit. Jesus Christ is God manifest in the flesh.'
                },
                {
                    title: 'Salvation',
                    content: 'We believe salvation comes through repentance, baptism in Jesus\' name, and receiving the gift of the Holy Spirit.'
                },
                {
                    title: 'The Church',
                    content: 'We believe the Church is the body of Christ, called to worship, fellowship, and spread the Gospel to all nations.'
                },
                {
                    title: 'Holiness',
                    content: 'We believe in living a life of holiness and separation from the world, reflecting the character of Christ in all we do.'
                }
            ]
        }
    },
    {
        page: 'about',
        section: 'our-story',
        content: {
            heading: 'Our Story',
            paragraphs: [
                'Harvest Temple Apostolic Church was founded with a vision to bring the transformative power of the Gospel to communities across the UK. Under the leadership of Bishop J. Stewart, our church has grown from a small gathering to a thriving multi-location ministry.',
                'Today, we continue to impact lives through powerful worship services, dynamic youth programs, and community outreach initiatives. Our commitment remains the same: to preach the Gospel, make disciples, and be agents of change in our world.'
            ],
            leaderImage: 'assets/Me.jpg',
            leaderName: 'Bishop J. Stewart',
            leaderTitle: 'Senior Pastor & Founder'
        }
    },
    {
        page: 'about',
        section: 'our-name',
        content: {
            heading: 'Why "Harvest Temple"?',
            paragraphs: [
                '<strong>Harvest</strong> represents the biblical call to bring in the harvest of souls. Jesus said, "The harvest is plentiful, but the workers are few" (Matthew 9:37). We are committed to reaping the harvest God has prepared.',
                '<strong>Temple</strong> signifies that we are the dwelling place of God. As believers, we are called to be living temples of the Holy Spirit, reflecting God\'s glory to the world.',
                'Together, <strong>Harvest Temple</strong> embodies our mission: to gather souls into God\'s kingdom and be a place where His presence dwells.'
            ]
        }
    },
    {
        page: 'about',
        section: 'leadership',
        content: {
            heading: 'Our Leadership Team',
            team: [
                {
                    name: 'Bishop J. Stewart',
                    title: 'Senior Pastor & Founder',
                    location: 'Walthamstow HQ',
                    photo: 'assets/Me.jpg',
                    email: 'bishop@harvesttemple.org'
                },
                {
                    name: 'Minister Joel Banks',
                    title: 'Branch Pastor',
                    location: 'Harold Wood',
                    photo: 'assets/banks choir.jpg',
                    email: 'joelbanks@harvesttemple.org'
                },
                {
                    name: 'Elder Jamar Williams',
                    title: 'Branch Pastor',
                    location: 'Ilford',
                    photo: 'assets/black.png',
                    email: 'jamar@harvesttemple.org'
                }
            ]
        }
    },

    // ============================================
    // EVENTS PAGE SECTIONS
    // ============================================
    {
        page: 'events',
        section: 'hero',
        content: {
            title: 'Events',
            subtitle: 'Join us for upcoming events and special services'
        }
    },
    {
        page: 'events',
        section: 'intro',
        content: {
            heading: 'What\'s Happening at HTA',
            text: 'From weekly worship services to special conferences and community outreach, there\'s always something happening at Harvest Temple Apostolic. Check out our upcoming events below!'
        }
    },
    {
        page: 'events',
        section: 'upcoming',
        content: {
            heading: 'Upcoming Events',
            events: [
                {
                    title: 'Sunday Morning Worship',
                    date: 'Every Sunday',
                    time: '10:00 AM',
                    location: 'All Locations',
                    description: 'Join us for powerful worship and life-changing messages every Sunday morning.',
                    image: 'assets/Choir.jpg'
                },
                {
                    title: 'Youth Conference 2025',
                    date: 'July 15-20, 2025',
                    time: 'All Day',
                    location: 'Waltham Abbey',
                    description: 'A week of worship, learning, and fun for our youth ages 13-25.',
                    image: 'assets/youth.jpeg',
                    registerLink: 'contact.html'
                },
                {
                    title: 'Family Day Celebration',
                    date: 'August 10, 2025',
                    time: '12:00 PM - 5:00 PM',
                    location: 'Walthamstow HQ',
                    description: 'A day of food, games, and fellowship for the whole family.',
                    image: 'assets/church.jpeg',
                    registerLink: 'contact.html'
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
                {
                    title: 'Youth Camp 2024',
                    date: 'August 10–16, 2024',
                    photoCount: 12,
                    link: 'youth-camp.html',
                    stackedImages: [
                        'assets/sheeka-kam.jpeg',
                        'assets/ron-mic.jpeg',
                        'assets/black.png'
                    ]
                },
                {
                    title: 'Family Day Celebration 2024',
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
                    title: 'Annual Convocation 2024',
                    date: 'December 2024',
                    photoCount: 25,
                    link: '#',
                    stackedImages: [
                        'assets/Choir.jpg',
                        'assets/Me.jpg',
                        'assets/youth.jpeg'
                    ]
                }
            ]
        }
    },
    {
        page: 'events',
        section: 'cta',
        content: {
            heading: 'Don\'t Miss Out',
            text: 'Stay connected and never miss an event. Sign up for our newsletter to get updates on upcoming events and special services.',
            buttonText: 'Subscribe to Newsletter',
            buttonLink: 'contact.html'
        }
    },

    // ============================================
    // DEPARTMENTS PAGE SECTIONS
    // ============================================
    {
        page: 'departments',
        section: 'hero',
        content: {
            title: 'Ministries',
            subtitle: 'Find your place to serve and grow'
        }
    },
    {
        page: 'departments',
        section: 'national-youth',
        content: {
            title: 'National Youth Department',
            description: 'Empowering the next generation to live bold, unashamed lives for Christ. Our youth ministry provides a safe space for young people to grow in faith, build lasting friendships, and discover their purpose.',
            image: 'assets/youth.jpeg',
            learnMoreLink: 'national-youth-department.html'
        }
    },
    {
        page: 'departments',
        section: 'sunday-school',
        content: {
            title: 'Sunday School',
            description: 'Building strong foundations in God\'s Word for all ages. From toddlers to adults, our Sunday School classes provide age-appropriate biblical teaching and practical life application.',
            image: 'assets/camp.jpg',
            learnMoreLink: 'sunday-school-department.html'
        }
    },
    {
        page: 'departments',
        section: 'mens-department',
        content: {
            title: 'Men\'s Department',
            description: 'Raising up godly men of integrity, strength, and leadership. Our men\'s ministry focuses on discipleship, accountability, and equipping men to lead their families and communities.',
            image: 'assets/black.png',
            learnMoreLink: 'mens-department.html'
        }
    },
    {
        page: 'departments',
        section: 'womens-department',
        content: {
            title: 'Women\'s Department',
            description: 'Empowering women to walk in their God-given purpose and calling. Our women\'s ministry provides opportunities for spiritual growth, fellowship, and service.',
            image: 'assets/sheeka-kam.jpeg',
            learnMoreLink: 'woman-department.html'
        }
    },
    {
        page: 'departments',
        section: 'national-ladies',
        content: {
            title: 'National Ladies Department',
            description: 'A nationwide network of women united in faith, prayer, and service. Our ladies ministry hosts conferences, retreats, and outreach events throughout the year.',
            image: 'assets/convocation.jpg',
            learnMoreLink: 'national-ladies-department.html'
        }
    },

    // ============================================
    // MEDIA PAGE SECTIONS
    // ============================================
    {
        page: 'media',
        section: 'hero',
        content: {
            title: 'Media',
            subtitle: 'Watch sermons, worship sessions, and more'
        }
    },
    {
        page: 'media',
        section: 'youtube-channels',
        content: {
            heading: 'Our YouTube Channels',
            description: 'Subscribe to stay connected with our latest sermons, worship sessions, and ministry updates.',
            channels: [
                {
                    name: 'Harvest Temple Apostolic - Walthamstow',
                    description: 'Main church services and special events from our headquarters.',
                    link: 'https://youtube.com/@harvesttemple'
                },
                {
                    name: 'HTA Youth',
                    description: 'Youth services, conferences, and inspiring messages for young people.',
                    link: 'https://youtube.com/@htayouth'
                }
            ]
        }
    },
    {
        page: 'media',
        section: 'prayer-meeting',
        content: {
            heading: 'Weekly Prayer Meeting',
            description: 'Join us every Wednesday evening for prayer and worship via Zoom.',
            schedule: 'Wednesdays at 7:00 PM',
            meetingId: '123 456 7890',
            passcode: 'PRAY2025',
            zoomLink: 'https://zoom.us/j/1234567890'
        }
    },
    {
        page: 'media',
        section: 'weekly-schedule',
        content: {
            heading: 'Weekly Schedule',
            description: 'Join us throughout the week for worship, prayer, and Bible study.',
            schedule: [
                {
                    day: 'Sunday',
                    events: [
                        { time: '10:00 AM', name: 'Morning Worship Service' },
                        { time: '6:00 PM', name: 'Evening Service' }
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
                        { time: '7:00 PM', name: 'Prayer Meeting (Zoom)' }
                    ]
                },
                {
                    day: 'Friday',
                    events: [
                        { time: '7:00 PM', name: 'Youth Service' }
                    ]
                },
                {
                    day: 'Saturday',
                    events: [
                        { time: '10:00 AM', name: 'Men\'s Prayer Breakfast (1st Saturday)' },
                        { time: '2:00 PM', name: 'Women\'s Fellowship (2nd Saturday)' }
                    ]
                }
            ]
        }
    },

    // ============================================
    // CONTACT PAGE SECTIONS
    // ============================================
    {
        page: 'contact',
        section: 'hero',
        content: {
            title: 'Contact Us',
            subtitle: 'We\'d love to hear from you'
        }
    },
    {
        page: 'contact',
        section: 'service-details',
        content: {
            heading: 'Plan Your Visit',
            description: 'Join us this Sunday! We have services at multiple locations across London and Essex.'
        }
    },
    {
        page: 'contact',
        section: 'what-to-expect',
        content: {
            heading: 'What to Expect',
            items: [
                {
                    title: 'Welcoming Atmosphere',
                    description: 'You\'ll be greeted with a warm smile and friendly faces ready to help you feel at home.'
                },
                {
                    title: 'Powerful Worship',
                    description: 'Experience vibrant worship with contemporary music and Spirit-filled praise.'
                },
                {
                    title: 'Relevant Teaching',
                    description: 'Hear practical, biblical messages that apply to your everyday life.'
                },
                {
                    title: 'Kids Ministry',
                    description: 'Age-appropriate classes for children during the service (infant through youth).'
                }
            ]
        }
    },
    {
        page: 'contact',
        section: 'faq',
        content: {
            heading: 'Frequently Asked Questions',
            questions: [
                {
                    question: 'What should I wear?',
                    answer: 'Come as you are! While many people dress in business casual attire, we welcome you to wear whatever makes you comfortable.'
                },
                {
                    question: 'How long is the service?',
                    answer: 'Our services typically last about 1.5 to 2 hours, including worship, message, and altar call.'
                },
                {
                    question: 'Is there parking available?',
                    answer: 'Yes, free parking is available at all our locations. Arrive early on Sundays for the best spots.'
                },
                {
                    question: 'What about my children?',
                    answer: 'We have excellent children\'s programs for all ages, from nursery through youth. Your kids will love it!'
                }
            ]
        }
    },
    {
        page: 'contact',
        section: 'locations',
        content: {
            branches: [
                {
                    name: 'Walthamstow HQ',
                    pastor: 'Bishop J. Stewart',
                    address: 'Forest Road, Walthamstow, London, E17 3EE',
                    phone: '+44 20 1234 5678',
                    email: 'walthamstow@harvesttemple.org'
                },
                {
                    name: 'Harold Wood',
                    pastor: 'Min. Joel Banks',
                    address: 'Station Road, Harold Wood, Essex, RM3 0BS',
                    phone: '+44 20 1234 5679',
                    email: 'haroldwood@harvesttemple.org'
                },
                {
                    name: 'Ilford',
                    pastor: 'Elder Jamar Williams',
                    address: 'Ilford Lane, Ilford, Essex, IG1 2JZ',
                    phone: '+44 20 1234 5680',
                    email: 'ilford@harvesttemple.org'
                }
            ]
        }
    },

    // ============================================
    // GIVE PAGE SECTIONS
    // ============================================
    {
        page: 'give',
        section: 'hero',
        content: {
            title: 'Give',
            subtitle: 'Your generosity changes lives'
        }
    },
    {
        page: 'give',
        section: 'thank-you',
        content: {
            heading: 'Thank You for Your Generosity',
            text: 'Your faithful giving enables us to preach the Gospel, serve our community, and make disciples around the world. We are grateful for your partnership in ministry.'
        }
    },
    {
        page: 'give',
        section: 'ways-to-give',
        content: {
            heading: 'Ways to Give',
            methods: [
                {
                    title: 'Online Giving',
                    description: 'The quickest and most convenient way to give. Set up one-time or recurring gifts.',
                    buttonText: 'Give Online',
                    link: '#'
                },
                {
                    title: 'Bank Transfer',
                    description: 'Transfer directly to our church account. Contact the office for details.',
                    buttonText: 'Get Bank Details',
                    link: 'contact.html'
                },
                {
                    title: 'In-Person',
                    description: 'Give during any of our services using the offering boxes or envelopes.',
                    buttonText: 'Plan a Visit',
                    link: 'contact.html'
                }
            ]
        }
    },
    {
        page: 'give',
        section: 'impact',
        content: {
            heading: 'Your Impact',
            text: 'See how your generosity is making a difference in lives around the world.',
            stats: [
                { number: '500+', label: 'Lives Impacted' },
                { number: '3', label: 'Locations' },
                { number: '15', label: 'Ministries Supported' },
                { number: '100%', label: 'Gospel Preached' }
            ]
        }
    },
    {
        page: 'give',
        section: 'scripture',
        content: {
            text: '"Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap. For with the measure you use, it will be measured to you."',
            reference: 'Luke 6:38 (NIV)'
        }
    },
    {
        page: 'give',
        section: 'faq',
        content: {
            heading: 'Giving FAQs',
            questions: [
                {
                    question: 'Is my giving tax-deductible?',
                    answer: 'Yes, Harvest Temple Apostolic is a registered charity. We can provide receipts for all donations for tax purposes.'
                },
                {
                    question: 'How is my donation used?',
                    answer: 'Your gifts support our ministry operations, community outreach, missions work, and facility maintenance. We are committed to financial transparency and stewardship.'
                },
                {
                    question: 'Can I give to a specific ministry?',
                    answer: 'Yes! You can designate your gift to specific ministries or projects. Contact our office for more information.'
                },
                {
                    question: 'Is online giving secure?',
                    answer: 'Absolutely. We use industry-standard encryption and security measures to protect your information.'
                }
            ]
        }
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hta-cms');
        console.log('Connected to MongoDB');

        // Clear existing content
        await Content.deleteMany({});
        console.log('Cleared existing content');

        // Insert all sections
        await Content.insertMany(allSections);

        const sectionsByPage = allSections.reduce((acc, section) => {
            acc[section.page] = (acc[section.page] || 0) + 1;
            return acc;
        }, {});

        console.log('\n✅ Successfully seeded all content!');
        console.log(`📊 Total sections: ${allSections.length}`);
        console.log('\nSections by page:');
        Object.entries(sectionsByPage).forEach(([page, count]) => {
            console.log(`   ${page}: ${count} sections`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
