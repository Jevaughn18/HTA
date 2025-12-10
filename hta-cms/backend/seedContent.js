const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Content = require('./models/Content');

dotenv.config();

// Comprehensive seed data with ALL actual content from HTML pages
const seedData = [
    // ==================== HOME PAGE ====================
    {
        page: 'home',
        section: 'hero',
        content: {
            title: 'Agents of Change.',
            subtitle: 'Welcome to Harvest Temple Apostolic',
            backgroundImage: 'assets/youth.jpeg',
            primaryButtonText: 'Plan A Visit',
            primaryButtonLink: 'contact.html',
            secondaryButtonText: 'Get Connected',
            secondaryButtonLink: 'contact.html'
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
            secondaryText: 'Come on out to our Sunday school at 9am.',
            aboutButtonText: 'About Us',
            aboutButtonLink: 'about.html',
            directionsButtonText: 'Get Directions',
            directionsButtonLink: 'contact.html'
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
        section: 'vision-gallery',
        content: {
            images: [
                'assets/Choir.jpg',
                'assets/banks choir.jpg',
                'assets/Me.jpg',
                'assets/youth.jpeg'
            ]
        }
    },
    {
        page: 'home',
        section: 'next-steps',
        content: {
            heading: 'What Are My Next Steps',
            description: 'Discover your next steps at Harvest Temple Apostolic as you grow in faith, connect with others, and walk in God\'s calling on your life.',
            steps: [
                {
                    title: 'Plan A Visit',
                    description: 'Plan your visit and experience a warm welcome, Spirit-filled worship, and a message that will deepen your faith.',
                    image: 'assets/church.jpeg',
                    link: 'contact.html',
                    buttonText: 'Learn More'
                },
                {
                    title: 'Departments',
                    description: 'Explore our diverse departments, each dedicated to helping you grow spiritually and find your place in our community.',
                    image: 'assets/youth.jpeg',
                    link: 'departments.html',
                    buttonText: 'Learn More'
                },
                {
                    title: 'Serve',
                    description: 'Discover the joy of giving back, connecting with others, and growing in your faith through serving.',
                    image: 'assets/banksworship.jpg',
                    link: 'contact.html',
                    buttonText: 'Learn More'
                }
            ]
        }
    },
    {
        page: 'home',
        section: 'events',
        content: {
            heading: 'Upcoming Events',
            viewMoreText: 'View More Events',
            viewMoreLink: 'events.html',
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
            primaryButtonText: 'Give Online',
            primaryButtonLink: 'give.html',
            secondaryButtonText: 'Ways To Give',
            secondaryButtonLink: 'give.html'
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

    // ==================== ABOUT PAGE ====================
    {
        page: 'about',
        section: 'hero',
        content: {
            title: 'About Us',
            backgroundVideo: 'assets/handgreet.mp4'
        }
    },
    {
        page: 'about',
        section: 'who-we-are',
        content: {
            heading: 'Rooted in Faith,\nGrowing in Community',
            description: 'We are a church family committed to nurturing faith, building meaningful relationships, and creating a welcoming space where everyone can experience the love and hope of Jesus Christ.',
            vision: {
                title: 'Vision',
                text: 'To see people passionately devoted to God.'
            },
            mission: {
                title: 'Mission',
                text: 'To help people experience God\'s love, trust His Word and follow His lead.'
            }
        }
    },
    {
        page: 'about',
        section: 'what-we-believe',
        content: {
            heading: 'What We Believe',
            intro: 'At Harvest Temple Apostolic Church, we are strong believers in faith, family, and the fruit of the Spirit. We believe in one God, baptism in the name of the Lord Jesus Christ, and the infilling of the Holy Ghost as referenced in Acts 2:38. We uphold holiness and believe that the Word of God is truth, encouraging all to live by this standard.',
            intro2: 'Harvest Temple Apostolic welcomes all with open arms, offering a home and a place of true worship, as stated in St. John 4:24. We embrace being Agents of Change, boldly declaring: "The Spirit of the Lord is upon us, because he hath anointed us to preach the gospel to the poor; he hath sent us to heal the brokenhearted, to preach deliverance to the captives, and recovering of sight to the blind, to set at liberty them that are bruised, to preach the acceptable year of the Lord." (St. Luke 4:18-19)',
            articles: [
                {
                    title: 'Article 1 | The Oneness of God',
                    content: 'We believe in one God who has revealed Himself in many ways throughout scripture. There is one God, eternally existent in His nature, yet manifesting Himself in different roles and relationships to humanity.\n\n"Hear, O Israel: The LORD our God is one LORD." (Deuteronomy 6:4 KJV)\n\n"I am Alpha and Omega, the beginning and the ending, saith the Lord, which is, and which was, and which is to come, the Almighty." (Revelation 1:8 KJV)'
                },
                {
                    title: 'Article 2 | The Authority of Scripture',
                    content: 'We believe the Bible is the inspired, infallible, and authoritative Word of God. It is verbally inspired in all parts and therefore wholly without error in the original writings. The Scripture is the supreme and final authority for all matters of faith, doctrine, and Christian living.\n\n"All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness: That the man of God may be perfect, throughly furnished unto all good works." (2 Timothy 3:16-17 KJV)'
                },
                {
                    title: 'Article 3 | Salvation Through Jesus Christ',
                    content: 'We believe that salvation is found only through Jesus Christ. He came to earth, born of the virgin Mary, lived a sinless life, died on the cross for our sins, was buried, and rose again on the third day for our justification.\n\n"For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." (John 3:16 KJV)'
                },
                {
                    title: 'Article 4 | Water Baptism in Jesus\' Name',
                    content: 'We believe in water baptism by immersion in the name of the Lord Jesus Christ for the remission of sins. This is the baptism demonstrated throughout the book of Acts and commanded by the apostles.\n\n"Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost." (Acts 2:38 KJV)'
                },
                {
                    title: 'Article 5 | The Baptism of the Holy Ghost',
                    content: 'We believe in the baptism of the Holy Ghost with the initial evidence of speaking in other tongues as the Spirit gives utterance. This is a distinct experience that follows salvation and empowers believers for service and victorious living.\n\n"And they were all filled with the Holy Ghost, and began to speak with other tongues, as the Spirit gave them utterance." (Acts 2:4 KJV)'
                }
            ]
        }
    },
    {
        page: 'about',
        section: 'our-story',
        content: {
            heading: 'A Short History of Harvest Temple Apostolic',
            description: 'The Harvest Temple Apostolic Group of Churches was formed in 1980 by the late Bishop Kingsley O. Carter. After the death of our founder in March 2023, the mantle was passed on to his assistant at the time, Bishop Clifton Campbell, in July 2023.',
            description2: 'Our headquarters office is located in Portsmouth, St. Catherine, and over the years, the organization has expanded to include branches in Banks Clarendon, Slipe Pen Road Kingston, and Mullet Hall Portland.',
            quote: '"Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost." — Acts 2:38',
            founderImage: 'assets/bishopcarter.png',
            founderName: 'Late Bishop Kingsley O. Carter',
            founderTitle: 'Founder (1980-2023)'
        }
    },
    {
        page: 'about',
        section: 'our-name',
        content: {
            heading: 'Why Harvest Temple Apostolic?',
            harvest: 'Harvest represents the gathering of souls for Christ\'s kingdom. Jesus said, "Then saith he unto his disciples, The harvest truly is plenteous, but the labourers are few" (Matthew 9:37 KJV). We are committed to being faithful laborers in God\'s harvest field.',
            temple: 'Temple signifies that we are God\'s dwelling place. "Know ye not that ye are the temple of God, and that the Spirit of God dwelleth in you?" (1 Corinthians 3:16 KJV). As a church, we are the living temple where God\'s presence dwells.',
            apostolic: 'Apostolic affirms our foundation in the teaching and doctrine of the apostles. "And they continued stedfastly in the apostles\' doctrine and fellowship, and in breaking of bread, and in prayers" (Acts 2:42 KJV). We hold fast to the apostolic faith delivered to the saints.',
            conclusion: 'Together, our name reflects our mission: to be a Spirit-filled community gathering souls, honoring God\'s presence, and living out the apostolic faith in truth and power.'
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
                    image: 'assets/BISHOP/FIRSTLADY.jpeg'
                },
                {
                    name: 'Pastor Calpurnia Williams',
                    title: 'Pastor',
                    location: 'HTA Portsmouth, St. Catherine',
                    image: 'assets/Pastor Williams.jpg'
                },
                {
                    name: 'Pastor Sheron Kavanagh',
                    title: 'Pastor',
                    location: 'HTA Slipe Pen Road, Kingston',
                    image: 'assets/Pastor Sharon.jpg'
                },
                {
                    name: 'Pastor Yulanda Vassel',
                    title: 'Pastor',
                    location: 'HTA Mullet Hall, Portland',
                    image: 'assets/Pastor Vasell.jpg'
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
            heading: 'Attend a Sunday Service',
            description: 'Whether you\'re single or married, older or younger, this is a place where you can grow in your faith and build a strong community with others. Every Sunday, we offer Spirit-filled worship and live teaching that is biblically-centered.',
            note: 'Children\'s ministry is available from birth - 12 years old.',
            serviceTime: '10am',
            serviceDay: 'Every Sunday',
            location: 'HTA Portsmouth',
            address: '822A Southern Parade\nWaterford P.O, Jamaica',
            aboutButtonText: 'About Us',
            aboutButtonLink: 'about.html',
            directionsButtonText: 'Get Directions',
            directionsButtonLink: 'https://maps.google.com'
        }
    },
    {
        page: 'contact',
        section: 'what-to-expect',
        content: {
            heading: 'What To Expect',
            items: [
                {
                    title: 'Warm Welcome',
                    description: 'You\'ll be greeted with a friendly smile and a warm welcome.',
                    image: 'assets/church.jpeg'
                },
                {
                    title: 'Uplifting Worship',
                    description: 'Experience a mix of contemporary and traditional worship.',
                    image: 'assets/banksworship.jpg'
                },
                {
                    title: 'Relevant Message',
                    description: 'Hear a message that\'s engaging and will deepen your walk with Jesus.',
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
            heading: 'Frequently Asked Questions',
            questions: [
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
            locations: [
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
            heading: 'Have a Question?',
            description: 'We are here to help you! Send our team an email and we will be sure to get back with you within 3-5 days!',
            formAction: 'https://formspree.io/f/Htaportsmouth@gmail.com',
            formMethod: 'POST'
        }
    },

    // ==================== GIVE PAGE ====================
    {
        page: 'give',
        section: 'hero',
        content: {
            title: 'Thank you for Giving',
            subtitle: 'We couldn\'t do it without you.',
            backgroundVideo: 'assets/give.mp4',
            buttonText: 'Give Online',
            buttonLink: '#ways-to-give'
        }
    },
    {
        page: 'give',
        section: 'thank-you',
        content: {
            heading: 'Transforming Lives Through Generosity',
            description: 'Because of your generous giving, Harvest Temple Apostolic is reaching Jamaica and beyond with the truth of God\'s Word. Together, we\'re reaching people who don\'t know Jesus, helping families grow together, and raising up leaders who take their faith outside the church.',
            buttonText: 'Give Here',
            buttonLink: '#ways-to-give'
        }
    },
    {
        page: 'give',
        section: 'ways-to-give',
        content: {
            heading: 'Ways to Give',
            subtitle: 'Here are some easy ways to support our church.',
            methods: [
                {
                    title: 'Give Online',
                    description: 'Donate securely through our trusted online platform.',
                    icon: 'desktop',
                    buttonText: 'Give Online',
                    buttonLink: '#'
                },
                {
                    title: 'Bank Transfer',
                    description: '',
                    icon: 'university',
                    accountName: 'Harvest Temple Apostolic',
                    bankName: 'National Commercial Bank',
                    accountNumber: '666789666456',
                    branch: 'Waterford, St. Catherine'
                },
                {
                    title: 'In Person',
                    description: 'During all Weekend Services',
                    icon: 'church',
                    details: 'Join us every Sunday at 822A Southern Parade, Waterford P.O.\nDrop your contribution in our offering box during service.'
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
            impacts: [
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
        section: 'scripture',
        content: {
            quote: '"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."',
            reference: '— 2 Corinthians 9:7'
        }
    },
    {
        page: 'give',
        section: 'faq',
        content: {
            heading: 'Frequently Asked Questions',
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
                    answer: 'Yes! When giving online or by bank transfer, you can specify which ministry or project you\'d like to support. For in-person giving, please include a note with your designation.'
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
            subtitle: 'What\'s happening at Harvest Temple Apostolic',
            backgroundVideo: 'assets/bible.mp4'
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
                    dateDay: '7-11',
                    dateMonth: 'Mar',
                    location: 'Harvest Temple Portsmouth, St. Catherine',
                    description: 'Join us for HTA\'s Annual Convocation — a powerful time of refreshing, restoration, and revival. Featuring dynamic day speakers, anointed nightly preachers, and impactful messages rooted in the Apostolic doctrine.',
                    image: 'assets/convocation.jpg',
                    link: '#convocation-details'
                },
                {
                    title: 'HTA Youth Camp 2025',
                    date: 'August 10-16, 2025',
                    dateDay: '10-16',
                    dateMonth: 'Aug',
                    location: 'Knox Community College, Cobbla, Manchester',
                    description: 'Get ready for HTA Youth Camp — a life-changing experience filled with fun, fellowship, and faith-building sessions. Features inspiring devotionals, interactive workshops on leadership and faith, and outdoor activities.',
                    image: 'assets/camp.jpg',
                    link: '#youth-camp-details'
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
                    title: 'Youth Camp',
                    date: 'August 10–16 2025',
                    photoCount: 12,
                    link: 'youth-camp.html',
                    images: [
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
                    images: [
                        'assets/church.jpeg',
                        'assets/camp.jpg',
                        'assets/convocation.jpg'
                    ]
                },
                {
                    title: 'Youth Conference',
                    date: 'September 2024',
                    photoCount: 15,
                    link: 'youth-conference.html',
                    images: [
                        'assets/convocation.jpg',
                        'assets/camp.jpg',
                        'assets/church.jpeg'
                    ]
                }
            ]
        }
    },
    {
        page: 'events',
        section: 'cta',
        content: {
            heading: 'Don\'t Miss Out!',
            description: 'Stay connected and be the first to know about upcoming events, special services, and community gatherings.',
            primaryButtonText: 'Get Connected',
            primaryButtonLink: 'contact.html',
            secondaryButtonText: 'Support Our Events',
            secondaryButtonLink: 'give.html'
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
            heading: 'National Youth Department',
            description: 'Our Youth Ministry is a vibrant community designed to help young people learn about God\'s love in a fun and engaging way. Through age-appropriate lessons, interactive activities, and exciting events, youth are introduced to biblical truths, encouraged to grow in their faith, and build a foundation for a lifelong relationship with Jesus. The ministry provides a safe and welcoming environment where young people can explore, discover, and experience the joy of following Christ.',
            image: 'assets/National Youth Department.jpg',
            link: 'contact.html',
            buttonText: 'Learn More'
        }
    },
    {
        page: 'departments',
        section: 'sunday-school',
        content: {
            heading: 'Sunday School Department',
            description: 'Our Sunday School Ministry is focused on guiding all ages through their spiritual journey with biblical teaching and fellowship. With a mix of weekly classes, worship, and interactive learning, Sunday School creates a space where members can deepen their relationship with God, form strong connections with fellow believers, and discover biblical truths. Our desire is to equip and empower everyone to have a personal relationship with God through His Word.',
            image: 'assets/church.jpeg',
            link: 'contact.html',
            buttonText: 'Learn More'
        }
    },
    {
        page: 'departments',
        section: 'mens-department',
        content: {
            heading: 'Men\'s Department',
            description: 'The Men\'s Ministry aims to create a welcoming environment for men to grow spiritually and support one another. This ministry focuses on providing spiritual growth, community, and a sense of brotherhood through small group studies, social events, and service projects. We help men to grow in their faith, become godly leaders in their families and communities, and find their place within the church family as they walk in purpose and integrity.',
            image: 'assets/men\'schoir.jpg',
            link: 'contact.html',
            buttonText: 'Learn More'
        }
    },
    {
        page: 'departments',
        section: 'womens-department',
        content: {
            heading: 'Women\'s Department',
            description: 'The Women\'s Ministry creates a nurturing environment for women to grow in their faith, build meaningful relationships, and serve together. Through Bible studies, prayer meetings, fellowship events, and outreach opportunities, women are encouraged to deepen their walk with God, support one another, and use their gifts to make a difference. This ministry provides a space where women can find strength, encouragement, and purpose as they follow Christ together.',
            image: 'assets/bankspraise.jpg',
            link: 'contact.html',
            buttonText: 'Learn More'
        }
    },
    {
        page: 'departments',
        section: 'national-ladies',
        content: {
            heading: 'National Ladies Department',
            description: 'The National Ladies Department is dedicated to empowering women across all our congregations to live out their faith with grace, strength, and purpose. Through conferences, retreats, mentorship programs, and service initiatives, ladies are equipped to be vessels of God\'s love in their homes, churches, and communities. This ministry celebrates womanhood in Christ and encourages ladies to walk in their God-given identity as they serve the Lord with excellence.',
            image: 'assets/Choir.jpg',
            link: 'contact.html',
            buttonText: 'Learn More'
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
            heading: 'Watch Our Services Online',
            description: 'Subscribe to our YouTube channels to stay connected with our services and events.',
            channels: [
                {
                    name: 'HTA Portsmouth',
                    description: 'Watch live streams and past services from our headquarters in Portsmouth, St. Catherine',
                    link: 'https://www.youtube.com/@harvesttempleapostolicchurch',
                    buttonText: 'Visit Channel'
                },
                {
                    name: 'HTA Banks Clarendon',
                    description: 'Watch live streams and past services from our Banks Clarendon branch',
                    link: 'https://www.youtube.com/@HarvestTempleApostolicBanks',
                    buttonText: 'Visit Channel'
                }
            ]
        }
    },
    {
        page: 'media',
        section: 'recent-services',
        content: {
            heading: 'Recent Services',
            services: [
                {
                    branch: 'Portsmouth Services',
                    videos: [
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
                {
                    branch: 'Banks Clarendon Services',
                    videos: [
                        {
                            title: 'First Sunday Service',
                            date: 'October 5, 2025',
                            location: 'HTA Banks Clarendon',
                            embedUrl: 'https://www.youtube.com/embed/nzBCNO-0rtQ'
                        },
                        {
                            title: 'Women\'s Evangelistic Service',
                            date: 'September 30, 2025',
                            location: 'HTA Banks Clarendon',
                            embedUrl: 'https://www.youtube.com/embed/x52Upy8XLcA'
                        }
                    ]
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
            platformDescription: 'Join from anywhere',
            allWelcome: 'All Welcome',
            allWelcomeDescription: 'Join us in prayer',
            meetingId: '865 4665 7301',
            passcode: '820325',
            zoomLink: 'https://us02web.zoom.us/j/86546657301?pwd=QWNqL1ZLbzB5eUxlVEJHY3pPVWhCdz09',
            buttonText: 'Join Prayer Meeting'
        }
    },
    {
        page: 'media',
        section: 'weekly-schedule',
        content: {
            heading: 'Weekly Schedule',
            description: 'Join us throughout the week for worship, prayer, and fellowship.',
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

    // ==================== FOOTER (SHARED) ====================
    {
        page: 'shared',
        section: 'footer',
        content: {
            email: 'htaportsmouth@gmail.com',
            address: '822A Southern Parade\nWaterford P.O, Jamaica',
            mapLink: 'https://maps.google.com',
            giveLink: 'give.html',
            socialLinks: [
                {
                    platform: 'Facebook',
                    url: 'https://www.facebook.com/profile.php?id=100069664802993',
                    icon: 'facebook-f'
                },
                {
                    platform: 'Instagram',
                    url: 'https://www.instagram.com',
                    icon: 'instagram'
                },
                {
                    platform: 'YouTube',
                    url: 'https://www.youtube.com/@harvesttempleapostolicchurch',
                    icon: 'youtube'
                }
            ],
            copyright: '© 2025 Harvest Temple Apostolic. All rights reserved.'
        }
    },

    // ==================== NAVIGATION (SHARED) ====================
    {
        page: 'shared',
        section: 'navigation',
        content: {
            logo: 'assets/logo.png',
            logoAlt: 'HTA Logo',
            menuItems: [
                { text: 'Home', link: 'index.html' },
                { text: 'About', link: 'about.html' },
                { text: 'Departments', link: 'departments.html' },
                { text: 'Media', link: 'media.html' },
                { text: 'Contact Us', link: 'contact.html' },
                { text: 'Events', link: 'events.html' },
                { text: 'Give', link: 'give.html' },
                { text: 'New Here?', link: 'contact.html', isButton: true }
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
        const pages = ['home', 'about', 'departments', 'media', 'contact', 'events', 'give', 'shared'];
        for (const page of pages) {
            const count = seedData.filter(item => item.page === page).length;
            console.log(`   ${page.toUpperCase()}: ${count} sections`);
        }

        console.log('\n🎉 Database seeding complete!');
        console.log('👉 You can now log in to the admin dashboard and start editing content.\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seed function
seedDatabase();
