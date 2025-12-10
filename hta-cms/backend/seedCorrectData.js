const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Content = require('./models/Content');

dotenv.config();

// This seed file contains the ACTUAL content from the HTML pages
// NO HTML tags - just clean, readable text for the tech team

const correctSections = [
    // ============================================
    // ABOUT PAGE - CORRECT DATA FROM HTML
    // ============================================
    {
        page: 'about',
        section: 'who-we-are',
        content: {
            heading: 'Rooted in Faith, Growing in Community',
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
            introduction: 'At Harvest Temple Apostolic Church, we are strong believers in faith, family, and the fruit of the Spirit. We believe in one God, baptism in the name of the Lord Jesus Christ, and the infilling of the Holy Ghost as referenced in Acts 2:38. We uphold holiness and believe that the Word of God is truth, encouraging all to live by this standard.\n\nHarvest Temple Apostolic welcomes all with open arms, offering a home and a place of true worship, as stated in St. John 4:24. We embrace being Agents of Change, boldly declaring: "The Spirit of the Lord is upon us, because he hath anointed us to preach the gospel to the poor; he hath sent us to heal the brokenhearted, to preach deliverance to the captives, and recovering of sight to the blind, to set at liberty them that are bruised, to preach the acceptable year of the Lord." (St. Luke 4:18-19)'
        }
    },
    {
        page: 'about',
        section: 'our-name',
        content: {
            heading: 'Why Harvest Temple Apostolic?',
            text: 'Harvest represents the gathering of souls for Christ\'s kingdom. Jesus said, "Then saith he unto his disciples, The harvest truly is plenteous, but the labourers are few" (Matthew 9:37 KJV). We are committed to being faithful laborers in God\'s harvest field.\n\nTemple signifies that we are God\'s dwelling place. "Know ye not that ye are the temple of God, and that the Spirit of God dwelleth in you?" (1 Corinthians 3:16 KJV). As a church, we are the living temple where God\'s presence dwells.\n\nApostolic affirms our foundation in the teaching and doctrine of the apostles. "And they continued stedfastly in the apostles\' doctrine and fellowship, and in breaking of bread, and in prayers" (Acts 2:42 KJV). We hold fast to the apostolic faith delivered to the saints.\n\nTogether, our name reflects our mission: to be a Spirit-filled community gathering souls, honoring God\'s presence, and living out the apostolic faith in truth and power.'
        }
    },
    {
        page: 'about',
        section: 'leadership',
        content: {
            heading: 'Meet Our Leadership',
            team: [
                {
                    name: 'Bishop Clifton & Evangelist Sophia Campbell',
                    title: 'Presiding Bishop',
                    location: 'HTA Banks, Clarendon',
                    photo: 'assets/BISHOP/FIRSTLADY.jpeg'
                },
                {
                    name: 'Pastor Calpurnia Williams',
                    title: 'Pastor',
                    location: 'HTA Portsmouth, St. Catherine',
                    photo: 'assets/Pastor Williams.jpg'
                },
                {
                    name: 'Pastor Sheron Kavanagh',
                    title: 'Pastor',
                    location: 'HTA Slipe Pen Road, Kingston',
                    photo: 'assets/Pastor Sharon.jpg'
                },
                {
                    name: 'Pastor Yulanda Vassel',
                    title: 'Pastor',
                    location: 'HTA Mullet Hall, Portland',
                    photo: 'assets/Pastor Vasell.jpg'
                }
            ]
        }
    },

    // ============================================
    // HOME PAGE - Keep existing good data
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
            note: 'Join us every Sunday for worship and fellowship'
        }
    },
    {
        page: 'home',
        section: 'service-details',
        content: {
            heading: 'Join Us This Sunday',
            description: 'Experience a welcoming community where faith, hope, and love come together.',
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
            text: 'To be agents of change in our communities, spreading the love of Christ and making disciples of all nations.'
        }
    },
    {
        page: 'home',
        section: 'vision-gallery',
        content: {
            images: [
                { src: 'assets/Choir.jpg', alt: 'Worship at HTA' },
                { src: 'assets/banks choir.jpg', alt: 'Church Service' },
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
                    description: 'Learn more about who we are and what we believe.',
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
                }
            ]
        }
    },
    {
        page: 'home',
        section: 'generosity',
        content: {
            heading: 'Generosity Changes Lives',
            text: 'Your generosity helps us reach more people, serve our community, and spread the Gospel.',
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
            heading: 'Our Locations',
            branches: [
                {
                    name: 'Banks',
                    location: 'Clarendon, Jamaica',
                    pastor: 'Bishop Clifton Campbell',
                    isHeadquarters: true
                },
                {
                    name: 'Portsmouth',
                    location: 'St. Catherine, Jamaica',
                    pastor: 'Pastor Calpurnia Williams'
                },
                {
                    name: 'Slipe Pen Road',
                    location: 'Kingston, Jamaica',
                    pastor: 'Pastor Sheron Kavanagh'
                },
                {
                    name: 'Mullet Hall',
                    location: 'Portland, Jamaica',
                    pastor: 'Pastor Yulanda Vassel'
                }
            ]
        }
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hta-cms');
        console.log('Connected to MongoDB');

        // Only update the specific sections we're fixing
        for (const section of correctSections) {
            await Content.findOneAndUpdate(
                { page: section.page, section: section.section },
                section,
                { upsert: true, new: true }
            );
            console.log(`✅ Updated: ${section.page}/${section.section}`);
        }

        console.log('\n✅ Successfully updated all sections with correct data!');
        console.log('📊 Updated sections: ' + correctSections.length);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
