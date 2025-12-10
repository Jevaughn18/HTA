const mongoose = require('mongoose');
const Content = require('./models/Content');
require('dotenv').config();

// Complete content extracted from HTML files
const completeContent = {
    home: [
        {
            section: 'hero',
            content: {
                title: 'Agents of Change',
                subtitle: 'Welcome to Harvest Temple Apostolic',
                type: 'gallery',
                galleryImages: [
                    { src: 'assets/bishop n wife.jpeg', class: 'tall' },
                    { src: 'assets/banksgroup.jpeg', class: '' },
                    { src: 'assets/baptisam.jpeg', class: 'wide' },
                    { src: 'assets/march.jpeg', class: '' },
                    { src: 'assets/roneil .jpeg', class: 'tall' },
                    { src: 'assets/pebs.jpeg', class: '' },
                    { src: 'assets/banks choir.jpg', class: 'wide' },
                    { src: 'assets/lat-deb.jpeg', class: '' },
                    { src: 'assets/mother-lewis.jpeg', class: 'tall' },
                    { src: 'assets/kids.jpeg', class: '' },
                    { src: 'assets/elder vassel.jpeg', class: '' },
                    { src: 'assets/band.jpeg', class: 'wide' },
                    { src: 'assets/evanglist tracy.jpeg', class: 'tall' },
                    { src: 'assets/Me.jpg', class: '' },
                    { src: 'assets/blue banks.jpeg', class: '' },
                    { src: 'assets/youth.jpeg', class: 'wide' },
                    { src: 'assets/congregration.jpeg', class: '' },
                    { src: 'assets/pastor sharon.jpeg', class: 'tall' }
                ]
            }
        },
        {
            section: 'service-details',
            content: {
                label: 'SERVICE DETAILS',
                title: 'Attend a Sunday Service',
                description: 'At Harvest Temple, everyone is welcome whether you\'re single or married, young or young at heart. This is a place to grow in your faith, connect with others, and be part of a loving, supportive community. Join us every Sunday for Spirit-filled worship and biblically-centered teaching that inspires and equips you for life.',
                note: 'Come on out to our Sunday school at 9am.',
                serviceTime: {
                    mainService: '10am',
                    mainServiceDescription: 'Service Every Sunday',
                    sundaySchool: '9am',
                    sundaySchoolDescription: 'Sunday School'
                },
                locations: [
                    {
                        name: 'HTA Portsmouth, St. Catherine',
                        pastor: 'Pastor Calpurnia Williams',
                        address: '822A Southern Parade',
                        city: 'Waterford P.O, Jamaica',
                        badge: 'Headquarters'
                    },
                    {
                        name: 'HTA Banks Clarendon',
                        pastor: 'Bishop Clifton & Evangelist Sophia Campbell',
                        address: 'Banks District',
                        city: 'Race Course P.O., Clarendon, Jamaica'
                    },
                    {
                        name: 'HTA Slipe Pen Road, Kingston',
                        pastor: 'Pastor Sheron Kavanagh',
                        address: '37 Slipe Road',
                        city: 'Kingston 5, Jamaica'
                    },
                    {
                        name: 'HTA Mullet Hall, Portland',
                        pastor: 'Pastor Yulanda Vassel',
                        address: '101 Mullet Hall',
                        city: 'Portland, Jamaica'
                    }
                ],
                buttons: [
                    { text: 'About Us', link: 'about.html', type: 'primary' },
                    { text: 'Get Directions', link: 'contact.html', type: 'outline' }
                ]
            }
        },
        {
            section: 'upcoming-events',
            content: {
                title: 'Upcoming Events',
                events: [
                    {
                        image: 'assets/bankspraise.jpg',
                        title: 'Sunday Worship Service',
                        date: 'Every Sunday, 10:00 AM'
                    },
                    {
                        image: 'assets/youth.jpeg',
                        title: 'Youth Week 2025',
                        date: 'March 10-15, 2025'
                    }
                ],
                button: { text: 'View More Events', link: 'events.html' }
            }
        },
        {
            section: 'our-vision',
            content: {
                label: 'OUR VISION',
                title: 'To see people passionately devoted to God.',
                paragraphs: [
                    'Harvest Temple Apostolic is a One God Apostolic, Bible-based church in Jamaica. Founded in 1985 by Bishop K.O Carter, we exist to see people passionately devoted to God.',
                    'We value the presence of God. Our worship, preaching and teaching, and Children\'s Ministry are centered around each person encountering the Holy Spirit. We want to help you discover truth, find hope, and become all who God has created you to be.'
                ],
                galleryImages: [
                    { src: 'assets/gold n white choir.jpeg', alt: 'Worship at HTA' },
                    { src: 'assets/trio.jpeg', alt: 'Bishop and Family' },
                    { src: 'assets/ushers.jpeg', alt: 'Church Leadership' },
                    { src: 'assets/kimmy.jpeg', alt: 'Youth Ministry' },
                    { src: 'assets/congregration.jpeg', alt: 'Church Leadership' },
                    { src: 'assets/march.jpeg', alt: 'Youth Ministry' },
                    { src: 'assets/Choir.jpg', alt: 'Worship at HTA' },
                    { src: 'assets/banks choir.jpg', alt: 'Bishop and Family' },
                    { src: 'assets/Me.jpg', alt: 'Church Leadership' },
                    { src: 'assets/youth.jpeg', alt: 'Youth Ministry' }
                ]
            }
        },
        {
            section: 'next-steps',
            content: {
                title: 'What Are My Next Steps',
                description: 'Discover your next steps at Harvest Temple Apostolic as you grow in faith, connect with others, and walk in God\'s calling on your life.',
                steps: [
                    {
                        image: 'assets/church.jpeg',
                        title: 'Plan A Visit',
                        description: 'Plan your visit and experience a warm welcome, Spirit-filled worship, and a message that will deepen your faith.',
                        link: 'contact.html'
                    },
                    {
                        image: 'assets/youth.jpeg',
                        title: 'Departments',
                        description: 'Explore our diverse departments, each dedicated to helping you grow spiritually and find your place in our community.',
                        link: 'departments.html'
                    },
                    {
                        image: 'assets/banksworship.jpg',
                        title: 'Serve',
                        description: 'Discover the joy of giving back, connecting with others, and growing in your faith through serving.',
                        link: 'contact.html'
                    }
                ]
            }
        },
        {
            section: 'generosity',
            content: {
                title: 'Thank You For Your Generosity',
                description: 'Thank you for your generosity - your support allows Harvest Temple Apostolic to make a meaningful impact in our community, sharing hope and transforming lives every day.',
                buttons: [
                    { text: 'Give Online', link: 'give.html', type: 'primary' },
                    { text: 'Ways To Give', link: 'give.html', type: 'outline' }
                ]
            }
        }
    ],
    about: [
        {
            section: 'hero',
            content: {
                title: 'About Us',
                type: 'video',
                videoSrc: 'assets/handgreet.mp4'
            }
        },
        {
            section: 'who-we-are',
            content: {
                label: 'WHO WE ARE',
                title: 'Rooted in Faith,\nGrowing in Community',
                leadText: 'We are a church family committed to nurturing faith, building meaningful relationships, and creating a welcoming space where everyone can experience the love and hope of Jesus Christ.',
                visionMission: [
                    {
                        icon: 'fa-eye',
                        title: 'Vision',
                        description: 'To see people passionately devoted to God.'
                    },
                    {
                        icon: 'fa-bullseye',
                        title: 'Mission',
                        description: 'To help people experience God\'s love, trust His Word and follow His lead.'
                    }
                ]
            }
        },
        {
            section: 'what-we-believe',
            content: {
                title: 'What We Believe',
                intro: [
                    'At Harvest Temple Apostolic Church, we are strong believers in faith, family, and the fruit of the Spirit. We believe in one God, baptism in the name of the Lord Jesus Christ, and the infilling of the Holy Ghost as referenced in Acts 2:38. We uphold holiness and believe that the Word of God is truth, encouraging all to live by this standard.',
                    'Harvest Temple Apostolic welcomes all with open arms, offering a home and a place of true worship, as stated in St. John 4:24. We embrace being Agents of Change, boldly declaring: "The Spirit of the Lord is upon us, because he hath anointed us to preach the gospel to the poor; he hath sent us to heal the brokenhearted, to preach deliverance to the captives, and recovering of sight to the blind, to set at liberty them that are bruised, to preach the acceptable year of the Lord." (St. Luke 4:18-19)'
                ],
                articles: [
                    {
                        title: 'Article 1 | The Oneness of God',
                        content: 'We believe in one God who has revealed Himself in many ways throughout scripture. There is one God, eternally existent in His nature, yet manifesting Himself in different roles and relationships to humanity.\n\n"Hear, O Israel: The LORD our God is one LORD." (Deuteronomy 6:4 KJV)\n\n"I am Alpha and Omega, the beginning and the ending, saith the Lord, which is, and which was, and which is to come, the Almighty." (Revelation 1:8 KJV)\n\nGod as Father: God is the creator and sustainer of all things. He created the heavens and the earth and formed man in His own image. "In the beginning God created the heaven and the earth." (Genesis 1:1 KJV)\n\nGod Manifested in the Son: Jesus Christ is God manifested in flesh. He is the visible image of the invisible God, fully divine and fully human. "And without controversy great is the mystery of godliness: God was manifest in the flesh, justified in the Spirit, seen of angels, preached unto the Gentiles, believed on in the world, received up into glory." (1 Timothy 3:16 KJV)\n\nGod as the Holy Spirit: The Holy Spirit is not a separate person but God Himself actively working in the world today. "Now the Lord is that Spirit: and where the Spirit of the Lord is, there is liberty." (2 Corinthians 3:17 KJV)\n\nThe Name of Jesus Christ is the name of the Father, Son, and Holy Spirit. "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost." (Matthew 28:19 KJV) This singular "name" is revealed as Jesus. "Neither is there salvation in any other: for there is none other name under heaven given among men, whereby we must be saved." (Acts 4:12 KJV)'
                    },
                    {
                        title: 'Article 2 | The Authority of Scripture',
                        content: 'We believe the Bible is the inspired, infallible, and authoritative Word of God. It is verbally inspired in all parts and therefore wholly without error in the original writings. The Scripture is the supreme and final authority for all matters of faith, doctrine, and Christian living.\n\n"All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness: That the man of God may be perfect, throughly furnished unto all good works." (2 Timothy 3:16-17 KJV)\n\n"Sanctify them through thy truth: thy word is truth." (John 17:17 KJV)\n\n"Heaven and earth shall pass away, but my words shall not pass away." (Matthew 24:35 KJV)\n\nThe Word of God is the foundation of our faith and the standard by which we live. We encourage all believers to study the Scriptures diligently and apply them to every aspect of life. "Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth." (2 Timothy 2:15 KJV)'
                    },
                    {
                        title: 'Article 3 | Salvation Through Jesus Christ',
                        content: 'We believe that salvation is found only through Jesus Christ. He came to earth, born of the virgin Mary, lived a sinless life, died on the cross for our sins, was buried, and rose again on the third day for our justification.\n\n"For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." (John 3:16 KJV)\n\n"But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed." (Isaiah 53:5 KJV)\n\nThe Blood of Jesus: Through His shed blood on Calvary, we have redemption and forgiveness of sins. "In whom we have redemption through his blood, the forgiveness of sins, according to the riches of his grace." (Ephesians 1:7 KJV)\n\nThe Resurrection: Christ\'s resurrection is the guarantee of our salvation and eternal life. "But now is Christ risen from the dead, and become the firstfruits of them that slept." (1 Corinthians 15:20 KJV)\n\nSalvation is by grace through faith, not of works, but it produces good works in the life of the believer. "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast." (Ephesians 2:8-9 KJV)'
                    },
                    {
                        title: 'Article 4 | Water Baptism in Jesus\' Name',
                        content: 'We believe in water baptism by immersion in the name of the Lord Jesus Christ for the remission of sins. This is the baptism demonstrated throughout the book of Acts and commanded by the apostles.\n\n"Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost." (Acts 2:38 KJV)\n\nThe Apostolic Pattern: Throughout the book of Acts, every recorded baptism was performed in the name of Jesus Christ:\n\n"For as yet he was fallen upon none of them: only they were baptized in the name of the Lord Jesus." (Acts 8:16 KJV)\n\n"And he commanded them to be baptized in the name of the Lord." (Acts 10:48 KJV)\n\n"When they heard this, they were baptized in the name of the Lord Jesus." (Acts 19:5 KJV)\n\nThe Power of the Name: There is power and authority in the name of Jesus Christ. "And whatsoever ye do in word or deed, do all in the name of the Lord Jesus, giving thanks to God and the Father by him." (Colossians 3:17 KJV)\n\nWater baptism is an essential step of obedience in the salvation process, symbolizing the death, burial, and resurrection of Jesus Christ, and our identification with Him.'
                    },
                    {
                        title: 'Article 5 | The Baptism of the Holy Ghost',
                        content: 'We believe in the baptism of the Holy Ghost with the initial evidence of speaking in other tongues as the Spirit gives utterance. This is a distinct experience that follows salvation and empowers believers for service and victorious living.\n\n"And they were all filled with the Holy Ghost, and began to speak with other tongues, as the Spirit gave them utterance." (Acts 2:4 KJV)\n\nThe Promise of the Father: The Holy Ghost was promised by Jesus before His ascension. "And, behold, I send the promise of my Father upon you: but tarry ye in the city of Jerusalem, until ye be endued with power from on high." (Luke 24:49 KJV)\n\nThe Evidence: Speaking in tongues is the initial physical evidence of receiving the Holy Ghost, as demonstrated on the Day of Pentecost and throughout the book of Acts.\n\n"And when Paul had laid his hands upon them, the Holy Ghost came on them; and they spake with tongues, and prophesied." (Acts 19:6 KJV)\n\n"For they heard them speak with tongues, and magnify God." (Acts 10:46 KJV)\n\nThe Purpose: The baptism of the Holy Ghost empowers believers for witness and service. "But ye shall receive power, after that the Holy Ghost is come upon you: and ye shall be witnesses unto me both in Jerusalem, and in all Judaea, and in Samaria, and unto the uttermost part of the earth." (Acts 1:8 KJV)\n\nThe Fruit and Gifts: The Spirit-filled life produces the fruit of the Spirit and operates in the gifts of the Spirit for the edification of the church. "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, Meekness, temperance: against such there is no law." (Galatians 5:22-23 KJV)'
                    }
                ]
            }
        },
        {
            section: 'our-history',
            content: {
                label: 'OUR HISTORY',
                title: 'A Short History of Harvest Temple Apostolic',
                paragraphs: [
                    'The Harvest Temple Apostolic was established in 1984 by the late Bishop Kingsley O. Carter and nine missionaries from the church of our lord jesus christ (Cool JC). Harvest Temple Apostolic Banks was established in the year 1999. After the death of our founder in March 2023, the mantle was passed on to his assistant, Bishop Clifton Campbell as general overseer of the Harvest Temple Group Of Churches, in July 2023.',
                    'Our headquarters office is located in Portsmouth, St. Catherine pastored by Pastor Calpurnia Williams, and over the years, the organization has expanded to include branches in Banks Clarendon- Bishop Cliftion Campbell, Slipe Pen Road Kingston-Pastor Sharon Cavanaugha, and Mullet Hall Portland.'
                ],
                founderImage: {
                    src: 'assets/bishopcarter.png',
                    caption: 'Late Bishop Kingsley O. Carter',
                    subtitle: 'Founder (1980-2023)'
                },
                historyImages: [
                    {
                        src: 'assets/og members.png',
                        caption: 'Original Members',
                        subtitle: 'The Founding Nine (1984)'
                    },
                    {
                        src: 'assets/Og Choir.png',
                        caption: 'Original Choir',
                        subtitle: 'Early Days of Worship'
                    }
                ],
                quote: 'Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost. — Acts 2:38'
            }
        },
        {
            section: 'our-team',
            content: {
                title: 'Meet Our Leadership',
                staff: [
                    {
                        image: 'assets/bishop n wife.jpeg',
                        name: 'Bishop Clifton & Evangelist Sophia Campbell',
                        title: 'Presiding Bishop',
                        location: 'HTA Banks, Clarendon'
                    },
                    {
                        image: 'assets/williams.jpeg',
                        name: 'Pastor Calpurnia Williams',
                        title: 'Pastor',
                        location: 'HTA Portsmouth, St. Catherine'
                    },
                    {
                        image: 'assets/pastor sharon.jpeg',
                        name: 'Pastor Sheron Kavanagh',
                        title: 'Pastor',
                        location: 'HTA Slipe Pen Road, Kingston'
                    },
                    {
                        image: 'assets/Pastor Vasell.jpg',
                        name: 'Pastor Yulanda Vassel',
                        title: 'Pastor',
                        location: 'HTA Mullet Hall, Portland'
                    }
                ]
            }
        },
        {
            section: 'our-name',
            content: {
                label: 'OUR NAME',
                title: 'Why Harvest Temple Apostolic?',
                paragraphs: [
                    'Harvest represents the gathering of souls for Christ\'s kingdom. Jesus said, "Then saith he unto his disciples, The harvest truly is plenteous, but the labourers are few" (Matthew 9:37 KJV). We are committed to being faithful laborers in God\'s harvest field.',
                    'Temple signifies that we are God\'s dwelling place. "Know ye not that ye are the temple of God, and that the Spirit of God dwelleth in you?" (1 Corinthians 3:16 KJV). As a church, we are the living temple where God\'s presence dwells.',
                    'Apostolic affirms our foundation in the teaching and doctrine of the apostles. "And they continued stedfastly in the apostles\' doctrine and fellowship, and in breaking of bread, and in prayers" (Acts 2:42 KJV). We hold fast to the apostolic faith delivered to the saints.'
                ],
                conclusion: 'Together, our name reflects our mission: to be a Spirit-filled community gathering souls, honoring God\'s presence, and living out the apostolic faith in truth and power.'
            }
        }
    ],
    departments: [
        {
            section: 'hero',
            content: {
                title: 'Departments',
                type: 'video',
                videoSrc: 'assets/group.MOV'
            }
        },
        {
            section: 'youth-department',
            content: {
                title: 'National Youth Department',
                image: 'assets/National Youth Department.jpg',
                description: 'Our Youth Ministry is a vibrant community designed to help young people learn about God\'s love in a fun and engaging way. Through age-appropriate lessons, interactive activities, and exciting events, youth are introduced to biblical truths, encouraged to grow in their faith, and build a foundation for a lifelong relationship with Jesus. The ministry provides a safe and welcoming environment where young people can explore, discover, and experience the joy of following Christ.',
                link: 'contact.html'
            }
        },
        {
            section: 'sunday-school',
            content: {
                title: 'Sunday School Department',
                image: 'assets/church.jpeg',
                description: 'Our Sunday School Ministry is focused on guiding all ages through their spiritual journey with biblical teaching and fellowship. With a mix of weekly classes, worship, and interactive learning, Sunday School creates a space where members can deepen their relationship with God, form strong connections with fellow believers, and discover biblical truths. Our desire is to equip and empower everyone to have a personal relationship with God through His Word.',
                link: 'contact.html',
                imagePosition: 'right'
            }
        },
        {
            section: 'mens-department',
            content: {
                title: 'Men\'s Department',
                image: 'assets/men\'schoir.jpg',
                description: 'The Men\'s Ministry aims to create a welcoming environment for men to grow spiritually and support one another. This ministry focuses on providing spiritual growth, community, and a sense of brotherhood through small group studies, social events, and service projects. We help men to grow in their faith, become godly leaders in their families and communities, and find their place within the church family as they walk in purpose and integrity.',
                link: 'contact.html'
            }
        },
        {
            section: 'womens-department',
            content: {
                title: 'Women\'s Department',
                image: 'assets/bankspraise.jpg',
                description: 'The Women\'s Ministry creates a nurturing environment for women to grow in their faith, build meaningful relationships, and serve together. Through Bible studies, prayer meetings, fellowship events, and outreach opportunities, women are encouraged to deepen their walk with God, support one another, and use their gifts to make a difference. This ministry provides a space where women can find strength, encouragement, and purpose as they follow Christ together.',
                link: 'contact.html',
                imagePosition: 'right'
            }
        },
        {
            section: 'ladies-department',
            content: {
                title: 'National Ladies Department',
                image: 'assets/Choir.jpg',
                description: 'The National Ladies Department is dedicated to empowering women across all our congregations to live out their faith with grace, strength, and purpose. Through conferences, retreats, mentorship programs, and service initiatives, ladies are equipped to be vessels of God\'s love in their homes, churches, and communities. This ministry celebrates womanhood in Christ and encourages ladies to walk in their God-given identity as they serve the Lord with excellence.',
                link: 'contact.html'
            }
        }
    ],
    media: [
        {
            section: 'hero',
            content: {
                title: 'Media',
                type: 'video',
                videoSrc: 'assets/cam1.mp4'
            }
        },
        {
            section: 'youtube-channels',
            content: {
                title: 'Watch Our Services Online',
                intro: 'Subscribe to our YouTube channels to stay connected with our services and events.',
                channels: [
                    {
                        name: 'HTA Portsmouth',
                        description: 'Watch live streams and past services from our headquarters in Portsmouth, St. Catherine',
                        url: 'https://www.youtube.com/@harvesttempleapostolicchurch'
                    },
                    {
                        name: 'HTA Banks Clarendon',
                        description: 'Watch live streams and past services from our Banks Clarendon branch',
                        url: 'https://www.youtube.com/@HarvestTempleApostolicBanks'
                    }
                ]
            }
        },
        {
            section: 'recent-services',
            content: {
                title: 'Recent Services',
                services: {
                    portsmouth: [
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
                    ],
                    banks: [
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
            }
        },
        {
            section: 'prayer-meeting',
            content: {
                title: 'Join Our Weekly Online Prayer Meeting',
                description: 'Harvest Temple Apostolic Church invites you to our weekly online prayer meetings.',
                details: {
                    time: '5:00 AM',
                    days: 'Sunday, Wednesday & Friday',
                    platform: 'Via Zoom',
                    meetingId: '865 4665 7301',
                    passcode: '820325',
                    zoomLink: 'https://us02web.zoom.us/j/86546657301?pwd=QWNqL1ZLbzB5eUxlVEJHY3pPVWhCdz09'
                }
            }
        },
        {
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
        }
    ],
    contact: [
        {
            section: 'hero',
            content: {
                title: 'Plan A Visit',
                type: 'video',
                videoSrc: 'assets/handgreet.mp4'
            }
        },
        {
            section: 'service-details',
            content: {
                label: 'SERVICE DETAILS',
                title: 'Attend a Sunday Service',
                intro: 'Whether you\'re single or married, older or younger, this is a place where you can grow in your faith and build a strong community with others. Every Sunday, we offer Spirit-filled worship and live teaching that is biblically-centered.',
                note: 'Children\'s ministry is available from birth - 12 years old.',
                time: '10am',
                timeDescription: 'Every Sunday',
                location: 'HTA Portsmouth',
                address: '822A Southern Parade\nWaterford P.O, Jamaica'
            }
        },
        {
            section: 'what-to-expect',
            content: {
                title: 'What To Expect',
                cards: [
                    {
                        image: 'assets/church.jpeg',
                        title: 'Warm Welcome',
                        description: 'You\'ll be greeted with a friendly smile and a warm welcome.'
                    },
                    {
                        image: 'assets/banksworship.jpg',
                        title: 'Uplifting Worship',
                        description: 'Experience a mix of contemporary and traditional worship.'
                    },
                    {
                        image: 'assets/hand.jpg',
                        title: 'Relevant Message',
                        description: 'Hear a message that\'s engaging and will deepen your walk with Jesus.'
                    },
                    {
                        image: 'assets/youth.jpeg',
                        title: 'Kids Ministry',
                        description: 'Fun and safe programs for kids ages birth-12yo to learn about God.'
                    },
                    {
                        image: 'assets/Choir.jpg',
                        title: 'Joyful Choir',
                        description: 'Experience inspiring music that lifts your spirit.'
                    },
                    {
                        image: 'assets/praise.jpg',
                        title: 'Praise & Worship',
                        description: 'Join us in powerful moments of praise and worship.'
                    }
                ]
            }
        },
        {
            section: 'faq',
            content: {
                title: 'Frequently Asked Questions',
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
            section: 'branch-locations',
            content: {
                title: 'Our Locations',
                locations: [
                    {
                        name: 'HTA Portsmouth',
                        address: '822A Southern Parade\nWaterford P.O, Jamaica',
                        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=822A+Southern+Parade+Waterford+P.O+Jamaica'
                    },
                    {
                        name: 'HTA Banks',
                        address: 'Banks\nClarendon, Jamaica',
                        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Banks+Clarendon+Jamaica'
                    },
                    {
                        name: 'HTA Slipe Pen Road',
                        address: 'Slipe Pen Road\nKingston, Jamaica',
                        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Slipe+Pen+Road+Kingston+Jamaica'
                    },
                    {
                        name: 'HTA Mullet Hall',
                        address: 'Mullet Hall\nPortland, Jamaica',
                        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mullet+Hall+Portland+Jamaica'
                    }
                ]
            }
        },
        {
            section: 'contact-form',
            content: {
                title: 'Have a Question?',
                intro: 'We are here to help you! Send our team an email and we will be sure to get back with you within 3-5 days!',
                formAction: 'https://formspree.io/f/Htaportsmouth@gmail.com',
                fields: ['firstName', 'lastName', 'email', 'phone', 'message']
            }
        }
    ],
    events: [
        {
            section: 'hero',
            content: {
                title: 'Upcoming Events',
                subtitle: 'What\'s happening at Harvest Temple Apostolic',
                type: 'video',
                videoSrc: 'assets/bible.mp4'
            }
        },
        {
            section: 'events-intro',
            content: {
                title: 'Upcoming Events',
                description: 'We\'re excited about the upcoming events at Harvest Temple Apostolic! Explore what\'s coming up below and click to register.'
            }
        },
        {
            section: 'upcoming-events',
            content: {
                events: [
                    {
                        image: 'assets/convocation.jpg',
                        dateBadge: { day: '7-11', month: 'Mar' },
                        title: '22nd Annual Holy Convocation',
                        date: 'March 7-11, 2025',
                        location: 'Harvest Temple Portsmouth, St. Catherine',
                        description: 'Join us for HTA\'s Annual Convocation — a powerful time of refreshing, restoration, and revival. Featuring dynamic day speakers, anointed nightly preachers, and impactful messages rooted in the Apostolic doctrine.',
                        link: '#convocation-details'
                    },
                    {
                        image: 'assets/camp.jpg',
                        dateBadge: { day: '10-16', month: 'Aug' },
                        title: 'HTA Youth Camp 2025',
                        date: 'August 10-16, 2025',
                        location: 'Knox Community College, Cobbla, Manchester',
                        description: 'Get ready for HTA Youth Camp — a life-changing experience filled with fun, fellowship, and faith-building sessions. Features inspiring devotionals, interactive workshops on leadership and faith, and outdoor activities.',
                        link: '#youth-camp-details'
                    }
                ]
            }
        },
        {
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
                        images: [
                            'assets/black.png',
                            'assets/ron-mic.jpeg',
                            'assets/sheeka-kam.jpeg'
                        ]
                    },
                    {
                        title: 'Family Day Celebration',
                        date: 'October 2024',
                        photoCount: '18 Photos',
                        link: 'family-day.html',
                        images: [
                            'assets/convocation.jpg',
                            'assets/camp.jpg',
                            'assets/church.jpeg'
                        ]
                    },
                    {
                        title: 'Youth Conference',
                        date: 'September 2024',
                        photoCount: '15 Photos',
                        link: 'youth-conference.html',
                        images: [
                            'assets/church.jpeg',
                            'assets/camp.jpg',
                            'assets/convocation.jpg'
                        ]
                    }
                ]
            }
        },
        {
            section: 'events-cta',
            content: {
                title: 'Don\'t Miss Out!',
                description: 'Stay connected and be the first to know about upcoming events, special services, and community gatherings.',
                buttons: [
                    { text: 'Get Connected', link: 'contact.html', type: 'primary' },
                    { text: 'Support Our Events', link: 'give.html', type: 'outline' }
                ]
            }
        }
    ],
    give: [
        {
            section: 'hero',
            content: {
                title: 'Thank you for Giving',
                subtitle: 'We couldn\'t do it without you.',
                type: 'video',
                videoSrc: 'assets/give.mp4',
                button: { text: 'Give Online', link: '#ways-to-give' }
            }
        },
        {
            section: 'thank-you',
            content: {
                label: 'THANK YOU!',
                title: 'Transforming Lives Through Generosity',
                text: 'Because of your generous giving, Harvest Temple Apostolic is reaching Jamaica and beyond with the truth of God\'s Word. Together, we\'re reaching people who don\'t know Jesus, helping families grow together, and raising up leaders who take their faith outside the church.',
                button: { text: 'Give Here', link: '#ways-to-give' }
            }
        },
        {
            section: 'ways-to-give',
            content: {
                title: 'Ways to Give',
                subtitle: 'Here are some easy ways to support our church.',
                methods: [
                    {
                        icon: 'fa-university',
                        title: 'Bank Transfer',
                        details: {
                            accountName: 'Harvest Temple Apostolic',
                            bankName: 'National Commercial Bank',
                            currentAccount: '361006518',
                            savingsAccount: '364556977',
                            branch: 'Waterford, St. Catherine'
                        }
                    },
                    {
                        icon: 'fa-church',
                        title: 'In Person',
                        description: 'During all Weekend Services',
                        details: 'Join us every Sunday at 822A Southern Parade, Waterford P.O.\nDrop your contribution in our offering box during service.'
                    }
                ]
            }
        },
        {
            section: 'impact',
            content: {
                title: 'Your Impact',
                intro: 'Your generosity empowers our community to grow, worship, and thrive.',
                impacts: [
                    {
                        image: 'assets/Choir.jpg',
                        title: 'Community Programs',
                        description: 'Fund outreach initiatives that support the community and individuals in need.'
                    },
                    {
                        image: 'assets/youth.jpeg',
                        title: 'Youth Initiatives',
                        description: 'Empower the next generation through education and spiritual development.'
                    },
                    {
                        image: 'assets/bankspraise.jpg',
                        title: 'Worship Spaces',
                        description: 'Create welcoming environments for worship and fellowship.'
                    }
                ]
            }
        },
        {
            section: 'generosity-quote',
            content: {
                quote: 'Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.',
                citation: '2 Corinthians 9:7'
            }
        },
        {
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
                        answer: 'Yes! When giving online or by bank transfer, you can specify which ministry or project you\'d like to support. For in-person giving, please include a note with your designation.'
                    }
                ]
            }
        }
    ],
    shared: [
        {
            section: 'footer',
            content: {
                columns: [
                    {
                        icon: 'fa-envelope',
                        title: 'Email',
                        link: 'mailto:htaportsmouth@gmail.com',
                        text: 'htaportsmouth@gmail.com'
                    },
                    {
                        icon: 'fa-map-marker-alt',
                        title: 'Find Us',
                        link: 'https://maps.google.com',
                        text: '822A Southern Parade\nWaterford P.O, Jamaica'
                    },
                    {
                        icon: 'fa-credit-card',
                        title: 'Give',
                        link: 'give.html',
                        text: 'Give Online'
                    }
                ],
                social: [
                    { platform: 'facebook', url: 'https://www.facebook.com/profile.php?id=100069664802993' },
                    { platform: 'instagram', url: 'https://www.instagram.com' },
                    { platform: 'youtube', url: 'https://www.youtube.com/@harvesttempleapostolicchurch' }
                ],
                navigation: ['Home', 'About', 'Departments', 'Contact Us', 'Events', 'Give', 'New Here?'],
                copyright: '© 2025 Harvest Temple Apostolic. All rights reserved.'
            }
        }
    ]
};

async function seedDatabase() {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        console.log('🗑️  Clearing existing content...');
        await Content.deleteMany({});
        console.log('✅ Cleared existing content');

        console.log('📝 Seeding complete content from HTML files...');

        let totalInserted = 0;

        for (const [page, sections] of Object.entries(completeContent)) {
            console.log(`\n📄 Seeding ${page} page...`);

            for (const section of sections) {
                try {
                    await Content.create({
                        page,
                        section: section.section,
                        content: section.content
                    });
                    totalInserted++;
                    console.log(`   ✓ ${section.section}`);
                } catch (error) {
                    console.error(`   ✗ Failed to seed ${page}/${section.section}:`, error.message);
                }
            }
        }

        console.log(`\n✅ Successfully seeded ${totalInserted} content sections`);
        console.log('📊 Content breakdown:');
        console.log(`   - Home: ${completeContent.home.length} sections`);
        console.log(`   - About: ${completeContent.about.length} sections`);
        console.log(`   - Departments: ${completeContent.departments.length} sections`);
        console.log(`   - Media: ${completeContent.media.length} sections`);
        console.log(`   - Contact: ${completeContent.contact.length} sections`);
        console.log(`   - Events: ${completeContent.events.length} sections`);
        console.log(`   - Give: ${completeContent.give.length} sections`);
        console.log(`   - Shared: ${completeContent.shared.length} sections`);

        console.log('\n🎉 Database seeding complete!');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Database connection closed');
    }
}

seedDatabase();
