import React, { useState, useEffect, useCallback } from 'react';
import { contentAPI, mediaAPI, BASE_URL } from '../services/api';
import DOMPurify from 'dompurify';
import './ContentEditor.css';

// Helper function to get full image URL
const getImageUrl = (path) => {
    if (!path) return null; // Return null instead of empty string for React
    // Handle objects with src property (like gallery images)
    if (typeof path === 'object' && path.src) {
        path = path.src;
    }
    // Handle string paths
    if (typeof path !== 'string' || path.trim() === '') return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `${BASE_URL}${path}`;
    return `${BASE_URL}/${path}`;
};

// Helper function to convert YouTube URLs to embed format
const convertToYouTubeEmbed = (url) => {
    if (!url || typeof url !== 'string') return url;

    // Already an embed URL
    if (url.includes('youtube.com/embed/')) return url;

    // Convert watch URL to embed URL
    // Handles: https://www.youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) {
        return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }

    // Handles: https://youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch) {
        return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }

    // Not a YouTube URL or already correct format
    return url;
};

function ContentEditor({ page }) {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    // Sort sections according to website layout order
    const sortSectionsByPageOrder = useCallback((sections, page) => {
        const orderMap = {
            home: ['hero', 'service-times', 'service-details', 'upcoming-events', 'vision', 'vision-gallery', 'next-steps', 'generosity', 'locations'],
            about: ['hero', 'who-we-are', 'what-we-believe', 'our-story', 'our-name', 'leadership'],
            departments: ['hero', 'national-youth', 'sunday-school', 'mens-department', 'womens-department', 'national-ladies'],
            media: ['hero', 'youtube-channels', 'recent-services', 'prayer-meeting', 'weekly-schedule'],
            contact: ['hero', 'service-details', 'what-to-expect', 'faq', 'locations', 'contact-form'],
            events: ['hero', 'intro', 'upcoming', 'past-events', 'cta'],
            give: ['hero', 'thank-you', 'ways-to-give', 'impact', 'scripture', 'faq'],
            shared: ['navigation', 'footer']
        };

        const order = orderMap[page] || [];
        return sections.sort((a, b) => {
            const indexA = order.indexOf(a.section);
            const indexB = order.indexOf(b.section);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
    }, []);

    const initializeDefaultSections = useCallback(() => {
        const defaultSections = {
            home: [
                { section: 'hero', content: { title: '', subtitle: '', backgroundImage: '' } },
                { section: 'service-times', content: { time: '', location: '' } },
                { section: 'vision', content: { text: '' } }
            ],
            about: [
                { section: 'hero', content: { title: 'About Us' } },
                { section: 'story', content: { text: '' } },
                { section: 'leadership', content: [] }
            ],
        };

        setSections(defaultSections[page] || []);
    }, [page]);

    const loadContent = useCallback(async () => {
        try {
            setLoading(true);
            const response = await contentAPI.getPageContent(page);
            // Sort sections in proper website order
            const sortedSections = sortSectionsByPageOrder(response.data, page);
            setSections(sortedSections);
        } catch (error) {
            console.error('Error loading content:', error);
            initializeDefaultSections();
        } finally {
            setLoading(false);
        }
    }, [page, sortSectionsByPageOrder, initializeDefaultSections]);

    useEffect(() => {
        loadContent();
    }, [loadContent]);

    const handleContentChange = async (sectionName, newContent) => {
        try {
            setSaving(true);
            await contentAPI.updateContent(page, sectionName, newContent);

            setSections(sections.map(s =>
                s.section === sectionName ? { ...s, content: newContent } : s
            ));

            showMessage('Saved successfully');
        } catch (error) {
            showMessage('Failed to save', true);
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (file, sectionName, fieldKey) => {
        try {
            console.log('Uploading file:', file);
            const formData = new FormData();
            formData.append('file', file);

            console.log('FormData created, calling API...');
            const response = await mediaAPI.uploadFile(formData);
            console.log('Upload response:', response.data);
            const imagePath = response.data.file.path;

            showMessage('Image uploaded successfully');
            return imagePath;
        } catch (error) {
            console.error('Upload failed:', error);
            console.error('Error details:', error.response?.data);
            showMessage('Image upload failed: ' + (error.response?.data?.error || error.message), true);
            return null;
        }
    };

    const showMessage = (msg, isError = false) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
    };

    if (loading) {
        return <div className="loading">Loading content...</div>;
    }

    return (
        <div className="content-editor">
            {message && (
                <div className={`save-message ${message.includes('Failed') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            <div className="sections-grid">
                {sections.map((section, index) => (
                    <SectionCard
                        key={index}
                        section={section}
                        onUpdate={(content) => handleContentChange(section.section, content)}
                        onImageUpload={(file, fieldKey) => handleImageUpload(file, section.section, fieldKey)}
                        saving={saving}
                    />
                ))}

                {sections.length === 0 && (
                    <div className="empty-state">
                        <h3>No content yet</h3>
                        <p>Start by adding some content sections for this page</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function SectionCard({ section, onUpdate, onImageUpload, saving }) {
    const [localContent, setLocalContent] = useState(section.content);
    const [isEditing, setIsEditing] = useState(false);

    // Update local content when section content changes (after save)
    useEffect(() => {
        if (!isEditing) {
            setLocalContent(section.content);
        }
    }, [section.content, isEditing]);

    const handleSave = () => {
        onUpdate(localContent);
        setIsEditing(false);
    };

    const renderPreview = () => {
        if (typeof localContent === 'string') {
            // Sanitize HTML content before rendering to prevent XSS
            const sanitizedContent = DOMPurify.sanitize(localContent || '<em style="color: #999">No content yet</em>', {
                ADD_TAGS: ['iframe'],
                ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
            });
            return (
                <div
                    className="preview-text"
                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />
            );
        }

        if (typeof localContent === 'object' && localContent !== null) {
            return (
                <div className="preview-fields">
                    {Object.keys(localContent).map(key => {
                        const value = localContent[key];

                        if (!value || (Array.isArray(value) && value.length === 0)) {
                            return null;
                        }

                        if (Array.isArray(value)) {
                            // Events should always use standard array preview, not gallery preview
                            const isImageArray = key !== 'events' && value.length > 0 && (
                                (typeof value[0] === 'string' && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value[0])) ||
                                (typeof value[0] === 'object' && value[0] !== null &&
                                 ('src' in value[0] || 'image' in value[0] || 'img' in value[0]))
                            );


                            if (isImageArray) {
                                // Show image array preview with grid
                                return (
                                    <div key={key} className="preview-field array-field">
                                        <strong>{formatFieldName(key)} ({value.length} items)</strong>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            {value.slice(0, 12).map((item, idx) => {
                                                const imageSrc = typeof item === 'object'
                                                    ? (item.src || item.image || item.img)
                                                    : item;
                                                const imageUrl = getImageUrl(imageSrc);
                                                return imageUrl ? (
                                                    <img
                                                        key={idx}
                                                        src={imageUrl}
                                                        alt={`${idx + 1}`}
                                                        style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div key={idx} style={{ display: 'none' }}></div>
                                                );
                                            })}
                                            {value.length > 12 && (
                                                <div style={{
                                                    width: '100%',
                                                    height: '80px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: '#f3f4f6',
                                                    borderRadius: '4px',
                                                    color: '#6b7280',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '600'
                                                }}>
                                                    +{value.length - 12} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={key} className="preview-field array-field">
                                    <strong>{formatFieldName(key)}</strong>
                                    <div className="array-items">
                                        {value.filter(item => item !== null && item !== undefined).map((item, idx) => (
                                            <div key={idx} className="array-item-card">
                                                {typeof item === 'object' && item !== null ? (
                                                    <>
                                                        {Object.keys(item).filter(subKey => subKey !== undefined).map(subKey => {
                                                            const subValue = item[subKey];
                                                            const isImage = typeof subValue === 'string' && (
                                                                subKey.toLowerCase().includes('image') ||
                                                                subKey.toLowerCase().includes('photo') ||
                                                                subKey.toLowerCase().includes('img') ||
                                                                subKey.toLowerCase().includes('src') ||
                                                                /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(subValue)
                                                            );

                                                            return (
                                                                <div key={subKey} className="item-row">
                                                                    <span className="item-label">{formatFieldName(subKey)}:</span>
                                                                    <span className="item-value">
                                                                        {Array.isArray(subValue) ? (
                                                                            <div style={{ marginTop: '8px' }}>
                                                                                <div style={{ fontWeight: '600', marginBottom: '8px', color: '#6c757d', fontSize: '0.9em' }}>
                                                                                    ({subValue.length} items)
                                                                                </div>
                                                                                {subValue.map((nestedItem, nestedIdx) => (
                                                                                    <div key={nestedIdx} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px', fontSize: '0.9em' }}>
                                                                                        {typeof nestedItem === 'object' && nestedItem !== null ? (
                                                                                            <div>
                                                                                                {Object.keys(nestedItem).map(nestedKey => (
                                                                                                    <div key={nestedKey} style={{ marginBottom: '4px' }}>
                                                                                                        <strong style={{ fontSize: '0.85em' }}>{formatFieldName(nestedKey)}:</strong>{' '}
                                                                                                        {String(nestedItem[nestedKey] || 'Not set')}
                                                                                                    </div>
                                                                                                ))}
                                                                                            </div>
                                                                                        ) : (
                                                                                            String(nestedItem)
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        ) : isImage && subValue ? (
                                                                            <>
                                                                                {getImageUrl(subValue) && (
                                                                                    <img
                                                                                        src={getImageUrl(subValue)}
                                                                                        alt={subKey}
                                                                                        className="image-preview"
                                                                                        style={{ maxWidth: '200px', maxHeight: '150px', display: 'block', marginTop: '0.5rem', borderRadius: '4px', objectFit: 'cover' }}
                                                                                        onError={(e) => {
                                                                                            e.target.style.display = 'none';
                                                                                            if (e.target.nextSibling) {
                                                                                                e.target.nextSibling.style.display = 'block';
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                                <span style={{ display: 'none', color: '#999', fontSize: '0.85em' }}>
                                                                                    {String(subValue)}
                                                                                </span>
                                                                            </>
                                                                        ) : typeof subValue === 'object' && subValue !== null ? (
                                                                            <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px', fontSize: '0.9em' }}>
                                                                                {Object.keys(subValue).map(nestedKey => (
                                                                                    <div key={nestedKey} style={{ marginBottom: '4px' }}>
                                                                                        <strong style={{ fontSize: '0.85em' }}>{formatFieldName(nestedKey)}:</strong>{' '}
                                                                                        {typeof subValue[nestedKey] === 'object' ? JSON.stringify(subValue[nestedKey]) : String(subValue[nestedKey] || 'Not set')}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        ) : containsHTML(subValue) ? (
                                                                            <span style={{ whiteSpace: 'pre-wrap' }}>{stripHtmlTags(subValue)}</span>
                                                                        ) : (
                                                                            String(subValue) || <em>Not set</em>
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </>
                                                ) : (
                                                    <span>{String(item)}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        if (typeof value === 'object' && value !== null) {
                            return (
                                <div key={key} className="preview-field">
                                    <strong>{formatFieldName(key)}:</strong>
                                    <div style={{ marginLeft: '20px' }}>
                                        {Object.keys(value).map(subKey => {
                                            const subValue = value[subKey];
                                            const isNestedImageField = typeof subValue === 'string' && (
                                                subKey.toLowerCase().includes('image') ||
                                                subKey.toLowerCase().includes('photo') ||
                                                subKey.toLowerCase().includes('img') ||
                                                subKey.toLowerCase().includes('src') ||
                                                /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(subValue)
                                            );

                                            if (Array.isArray(subValue)) {
                                                return (
                                                    <div key={subKey} style={{ marginBottom: '16px' }}>
                                                        <strong>{formatFieldName(subKey)}:</strong> ({subValue.length} items)
                                                        <div style={{ marginLeft: '20px', marginTop: '8px' }}>
                                                            {subValue.map((item, idx) => (
                                                                <div key={idx} style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                                                    <div style={{ fontWeight: '600', marginBottom: '8px', color: '#6c757d' }}>
                                                                        Item {idx + 1}
                                                                    </div>
                                                                    {typeof item === 'object' && item !== null ? (
                                                                        <div style={{ marginLeft: '12px' }}>
                                                                            {Object.keys(item).map(itemKey => {
                                                                                const itemValue = item[itemKey];
                                                                                return (
                                                                                    <div key={itemKey} style={{ marginBottom: '4px' }}>
                                                                                        <strong style={{ fontSize: '0.9em' }}>{formatFieldName(itemKey)}:</strong>{' '}
                                                                                        <span style={{ color: '#495057' }}>
                                                                                            {typeof itemValue === 'object' ? JSON.stringify(itemValue) : String(itemValue || 'Not set')}
                                                                                        </span>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    ) : (
                                                                        <div style={{ marginLeft: '12px', color: '#495057' }}>
                                                                            {String(item)}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            if (typeof subValue === 'object' && subValue !== null) {
                                                return (
                                                    <div key={subKey}>
                                                        <strong>{formatFieldName(subKey)}:</strong>
                                                        <pre className="json-preview">
                                                            {JSON.stringify(subValue, null, 2)}
                                                        </pre>
                                                    </div>
                                                );
                                            }

                                            if (isNestedImageField && subValue) {
                                                return (
                                                    <div key={subKey}>
                                                        <strong>{formatFieldName(subKey)}:</strong>
                                                        <div style={{ marginTop: '8px' }}>
                                                            {getImageUrl(subValue) && (
                                                                <img
                                                                    src={getImageUrl(subValue)}
                                                                    alt={subKey}
                                                                    className="image-preview"
                                                                    style={{ maxWidth: '200px', maxHeight: '150px', display: 'block', borderRadius: '4px', objectFit: 'cover' }}
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        if (e.target.nextSibling) {
                                                                            e.target.nextSibling.style.display = 'block';
                                                                        }
                                                                    }}
                                                                />
                                                            )}
                                                            <span style={{ display: 'none', color: '#999', fontSize: '0.85em' }}>
                                                                {String(subValue)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div key={subKey}>
                                                    <strong>{formatFieldName(subKey)}:</strong>{' '}
                                                    {subValue ? (typeof subValue === 'object' ? JSON.stringify(subValue) : String(subValue)) : <em style={{ color: '#999' }}>Not set</em>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        }

                        // Check if field is an image field (contains 'image', 'photo', 'img', or ends with image extensions)
                        const isImageField = typeof value === 'string' && (
                            key.toLowerCase().includes('image') || 
                            key.toLowerCase().includes('photo') || 
                            key.toLowerCase().includes('img') ||
                            /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value)
                        );
                        
                        if (isImageField && value && typeof value === 'string') {
                            return (
                                <div key={key} className="preview-field">
                                    <strong>{formatFieldName(key)}</strong>
                                    <img
                                        src={getImageUrl(value)}
                                        alt={key}
                                        className="image-preview"
                                        style={{ maxWidth: '300px', maxHeight: '200px', marginTop: '8px', borderRadius: '4px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                    <span style={{ display: 'none', color: '#999', fontSize: '0.9em' }}>
                                        Image not found: {value}
                                    </span>
                                </div>
                            );
                        }

                        if (containsHTML(value)) {
                            return (
                                <div key={key} className="preview-field">
                                    <strong>{formatFieldName(key)}:</strong>
                                    <div style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                        {stripHtmlTags(value)}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={key} className="preview-field">
                                <strong>{formatFieldName(key)}:</strong> {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </div>
                        );
                    })}
                </div>
            );
        }

        return <p>No content available</p>;
    };

    const formatFieldName = (name) => {
        return name
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    // Helper to strip HTML tags for display - using DOMParser instead of innerHTML
    const stripHtmlTags = (html) => {
        if (typeof html !== 'string') return html;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    };

    // Helper to check if content contains HTML
    const containsHTML = (str) => {
        if (typeof str !== 'string') return false;
        return /<[a-z][\s\S]*>/i.test(str);
    };

    // Special gallery image grid editor
    const renderGalleryEditor = (arrayValue, key) => {
        return (
            <div className="gallery-editor" style={{ marginTop: '12px' }}>
                <div className="gallery-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '20px',
                    padding: '12px'
                }}>
                    {arrayValue.map((item, idx) => {
                        const imageSrc = typeof item === 'object' ? (item.src || item.image || item.img) : item;
                        const imageClass = typeof item === 'object' ? item.class : '';

                        const imageUrl = getImageUrl(imageSrc);

                        return (
                            <div key={idx} className="gallery-item-editor" style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '12px',
                                backgroundColor: '#fafafa'
                            }}>
                                <div className="gallery-item-preview" style={{
                                    width: '100%',
                                    height: '180px',
                                    marginBottom: '12px',
                                    borderRadius: '6px',
                                    overflow: 'hidden',
                                    backgroundColor: '#e9ecef',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {imageUrl ? (
                                        <img
                                            src={`${imageUrl}?t=${Date.now()}`}
                                            alt={`Gallery ${idx + 1}`}
                                            className="gallery-thumbnail"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextElementSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className="gallery-placeholder" style={{
                                        display: imageUrl ? 'none' : 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#999'
                                    }}>
                                        <i className="fas fa-image" style={{ fontSize: '2em' }}></i>
                                        <span>No Image</span>
                                    </div>
                                </div>
                                <div className="gallery-item-controls">
                                    <label style={{ fontSize: '0.85em', fontWeight: '600', marginBottom: '4px', display: 'block' }}>
                                        Image {idx + 1}
                                    </label>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                        <input
                                            type="text"
                                            value={imageSrc || ''}
                                            onChange={(e) => {
                                                const newArray = [...arrayValue];
                                                if (typeof item === 'object') {
                                                    // Determine which property to update based on what exists in the object
                                                    const imageKey = 'src' in item ? 'src' : ('image' in item ? 'image' : ('img' in item ? 'img' : 'src'));
                                                    newArray[idx] = { ...item, [imageKey]: e.target.value };
                                                } else {
                                                    newArray[idx] = e.target.value;
                                                }
                                                setLocalContent({ ...localContent, [key]: newArray });
                                            }}
                                            className="gallery-path-input"
                                            placeholder="Image path"
                                            style={{ flex: 1, padding: '8px', fontSize: '0.9em', border: '1px solid #ddd', borderRadius: '4px' }}
                                        />
                                        <label className="gallery-upload-btn" style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '0.9em',
                                            fontWeight: '500',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            <i className="fas fa-upload"></i>
                                            Upload
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const uploadedPath = await onImageUpload(file, key);
                                                        if (uploadedPath) {
                                                            const newArray = [...arrayValue];
                                                            if (typeof item === 'object') {
                                                                // Determine which property to update based on what exists in the object
                                                                const imageKey = 'src' in item ? 'src' : ('image' in item ? 'image' : ('img' in item ? 'img' : 'src'));
                                                                newArray[idx] = { ...item, [imageKey]: uploadedPath };
                                                            } else {
                                                                newArray[idx] = uploadedPath;
                                                            }
                                                            setLocalContent({ ...localContent, [key]: newArray });
                                                            // Reset the file input to allow uploading the same file again
                                                            e.target.value = '';
                                                        }
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                    {imageClass && (
                                        <span className="gallery-class-badge" style={{
                                            padding: '4px 8px',
                                            backgroundColor: '#f0f0f0',
                                            borderRadius: '4px',
                                            fontSize: '0.8em',
                                            fontWeight: '500'
                                        }}>
                                            {imageClass}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderArrayEditor = (arrayValue, key) => {
        // Events should always use the standard array editor, not the gallery editor
        // Check if this is any kind of image array (gallery, history images, vision gallery, etc.)
        const isImageArray = key !== 'events' && arrayValue.length > 0 && (
            (typeof arrayValue[0] === 'string' && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(arrayValue[0])) ||
            (typeof arrayValue[0] === 'object' && arrayValue[0] !== null &&
             ('src' in arrayValue[0] || 'image' in arrayValue[0] || 'img' in arrayValue[0]))
        );


        if (isImageArray) {
            return renderGalleryEditor(arrayValue, key);
        }

        return (
            <div className="array-editor">
                {arrayValue.map((item, idx) => (
                    <div key={idx} className="array-item-editor">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h4 style={{ margin: 0 }}>{key === 'events' ? `Event ${idx + 1}` : `Item ${idx + 1}`}</h4>
                            {key === 'events' && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newArray = arrayValue.filter((_, i) => i !== idx);
                                        setLocalContent({ ...localContent, [key]: newArray });
                                    }}
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '0.85em'
                                    }}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        {typeof item === 'object' ? (
                            <div className="item-fields">
                                {Object.keys(item).map(subKey => {
                                    const subValue = item[subKey];
                                    const isImage = typeof subValue === 'string' && (
                                        subKey.toLowerCase().includes('image') ||
                                        subKey.toLowerCase().includes('photo') ||
                                        subKey.toLowerCase().includes('img') ||
                                        subKey.toLowerCase().includes('src') ||
                                        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(subValue)
                                    );
                                    const isLongText = typeof subValue === 'string' && subValue.length > 100;
                                    const isDescription = subKey.toLowerCase() === 'description';
                                    const isAddress = subKey.toLowerCase() === 'address';

                                    return (
                                        <div key={subKey} className="field-group">
                                            <label>{formatFieldName(subKey)}</label>
                                            {isImage ? (
                                                <div className="image-field">
                                                    <div className="image-input-group">
                                                        <input
                                                            type="text"
                                                            value={subValue || ''}
                                                            onChange={(e) => {
                                                                const newArray = [...arrayValue];
                                                                newArray[idx] = { ...item, [subKey]: e.target.value };
                                                                setLocalContent({ ...localContent, [key]: newArray });
                                                            }}
                                                            className="text-input"
                                                            placeholder="assets/image.jpg"
                                                        />
                                                        <label className="upload-button">
                                                            Choose File
                                                            <input
                                                                type="file"
                                                                accept="image/*,video/*"
                                                                style={{ display: 'none' }}
                                                                onChange={async (e) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        const uploadedPath = await onImageUpload(file, section.section, subKey);
                                                                        if (uploadedPath) {
                                                                            const newArray = [...arrayValue];
                                                                            newArray[idx] = { ...item, [subKey]: uploadedPath };
                                                                            setLocalContent({ ...localContent, [key]: newArray });
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                    {subValue && (
                                                        <img
                                                            src={getImageUrl(subValue)}
                                                            alt="Preview"
                                                            className="image-preview"
                                                            style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '8px', borderRadius: '4px', objectFit: 'cover' }}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                if (e.target.nextSibling) {
                                                                    e.target.nextSibling.style.display = 'block';
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                    {subValue && typeof subValue === 'string' && (
                                                        <span style={{ display: 'none', color: '#999', fontSize: '0.85em' }}>
                                                            {subValue}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : Array.isArray(subValue) ? (
                                                <div className="nested-array" style={{ marginTop: '8px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                                                    <div style={{ marginBottom: '8px', fontWeight: '600', color: '#495057' }}>
                                                        {formatFieldName(subKey)} ({subValue.length} items)
                                                    </div>
                                                    {subValue.map((nestedItem, nestedIdx) => (
                                                        <div key={nestedIdx} style={{ marginBottom: '12px', padding: '12px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                                                            <div style={{ marginBottom: '8px', fontWeight: '600', fontSize: '0.9em', color: '#6c757d' }}>
                                                                Item {nestedIdx + 1}
                                                            </div>
                                                            {typeof nestedItem === 'object' && nestedItem !== null ? (
                                                                <div>
                                                                    {Object.keys(nestedItem).map(nestedKey => {
                                                                        const nestedValue = nestedItem[nestedKey];
                                                                        const isUrl = nestedKey.toLowerCase().includes('url') || nestedKey.toLowerCase().includes('link');
                                                                        const isLongNestedText = typeof nestedValue === 'string' && nestedValue.length > 50;

                                                                        return (
                                                                            <div key={nestedKey} style={{ marginBottom: '8px' }}>
                                                                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85em', fontWeight: '500' }}>
                                                                                    {formatFieldName(nestedKey)}:
                                                                                </label>
                                                                                {isLongNestedText || isUrl ? (
                                                                                    <textarea
                                                                                        value={nestedValue || ''}
                                                                                        onChange={(e) => {
                                                                                            let value = e.target.value;
                                                                                            // Auto-convert YouTube URLs to embed format
                                                                                            if (nestedKey.toLowerCase().includes('embed')) {
                                                                                                value = convertToYouTubeEmbed(value);
                                                                                            }
                                                                                            const newSubValue = [...subValue];
                                                                                            newSubValue[nestedIdx] = { ...nestedItem, [nestedKey]: value };
                                                                                            const newArray = [...arrayValue];
                                                                                            newArray[idx] = { ...item, [subKey]: newSubValue };
                                                                                            setLocalContent({ ...localContent, [key]: newArray });
                                                                                        }}
                                                                                        rows="2"
                                                                                        style={{ width: '100%', padding: '8px', fontSize: '0.9em', border: '1px solid #ced4da', borderRadius: '4px' }}
                                                                                        placeholder={`Enter ${formatFieldName(nestedKey).toLowerCase()}...`}
                                                                                    />
                                                                                ) : (
                                                                                    <input
                                                                                        type="text"
                                                                                        value={typeof nestedValue === 'object' ? JSON.stringify(nestedValue) : (nestedValue || '')}
                                                                                        onChange={(e) => {
                                                                                            let value = e.target.value;
                                                                                            // Auto-convert YouTube URLs to embed format
                                                                                            if (nestedKey.toLowerCase().includes('embed')) {
                                                                                                value = convertToYouTubeEmbed(value);
                                                                                            }
                                                                                            const newSubValue = [...subValue];
                                                                                            newSubValue[nestedIdx] = { ...nestedItem, [nestedKey]: value };
                                                                                            const newArray = [...arrayValue];
                                                                                            newArray[idx] = { ...item, [subKey]: newSubValue };
                                                                                            setLocalContent({ ...localContent, [key]: newArray });
                                                                                        }}
                                                                                        style={{ width: '100%', padding: '8px', fontSize: '0.9em', border: '1px solid #ced4da', borderRadius: '4px' }}
                                                                                        placeholder={`Enter ${formatFieldName(nestedKey).toLowerCase()}...`}
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ) : (
                                                                <input
                                                                    type="text"
                                                                    value={nestedItem || ''}
                                                                    onChange={(e) => {
                                                                        const newSubValue = [...subValue];
                                                                        newSubValue[nestedIdx] = e.target.value;
                                                                        const newArray = [...arrayValue];
                                                                        newArray[idx] = { ...item, [subKey]: newSubValue };
                                                                        setLocalContent({ ...localContent, [key]: newArray });
                                                                    }}
                                                                    style={{ width: '100%', padding: '8px', fontSize: '0.9em', border: '1px solid #ced4da', borderRadius: '4px' }}
                                                                />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : isLongText || isDescription || isAddress ? (
                                                <textarea
                                                    value={subValue || ''}
                                                    onChange={(e) => {
                                                        const newArray = [...arrayValue];
                                                        newArray[idx] = { ...item, [subKey]: e.target.value };
                                                        setLocalContent({ ...localContent, [key]: newArray });
                                                    }}
                                                    className="text-input"
                                                    rows="4"
                                                    placeholder={`Enter ${formatFieldName(subKey).toLowerCase()}...`}
                                                />
                                            ) : typeof subValue === 'boolean' ? (
                                                <select
                                                    value={subValue ? 'true' : 'false'}
                                                    onChange={(e) => {
                                                        const newArray = [...arrayValue];
                                                        newArray[idx] = { ...item, [subKey]: e.target.value === 'true' };
                                                        setLocalContent({ ...localContent, [key]: newArray });
                                                    }}
                                                    className="text-input"
                                                >
                                                    <option value="true">Yes</option>
                                                    <option value="false">No</option>
                                                </select>
                                            ) : typeof subValue === 'object' && subValue !== null ? (
                                                <textarea
                                                    value={JSON.stringify(subValue, null, 2)}
                                                    onChange={(e) => {
                                                        let updatedValue = subValue;
                                                        try {
                                                            updatedValue = JSON.parse(e.target.value);
                                                        } catch (err) {
                                                            updatedValue = e.target.value;
                                                        }
                                                        const newArray = [...arrayValue];
                                                        newArray[idx] = { ...item, [subKey]: updatedValue };
                                                        setLocalContent({ ...localContent, [key]: newArray });
                                                    }}
                                                    className="text-input"
                                                    rows="4"
                                                    placeholder="Enter JSON..."
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={subValue || ''}
                                                    onChange={(e) => {
                                                        const newArray = [...arrayValue];
                                                        newArray[idx] = { ...item, [subKey]: e.target.value };
                                                        setLocalContent({ ...localContent, [key]: newArray });
                                                    }}
                                                    className="text-input"
                                                    placeholder={`Enter ${formatFieldName(subKey).toLowerCase()}...`}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <input
                                type="text"
                                value={typeof item === 'object' ? JSON.stringify(item) : item || ''}
                                onChange={(e) => {
                                    const newArray = [...arrayValue];
                                    newArray[idx] = e.target.value;
                                    setLocalContent({ ...localContent, [key]: newArray });
                                }}
                                className="text-input"
                            />
                        )}
                    </div>
                ))}
                {/* Add Event button - only for events array */}
                {key === 'events' && arrayValue.length < 4 && (
                    <button
                        type="button"
                        onClick={() => {
                            // Create a template based on the first item's structure
                            let newItem;
                            if (arrayValue.length > 0 && typeof arrayValue[0] === 'object') {
                                // Clone the structure of the first item with empty values
                                newItem = Object.keys(arrayValue[0]).reduce((acc, key) => {
                                    acc[key] = '';
                                    return acc;
                                }, {});
                            } else {
                                // For events, provide a default structure
                                newItem = { title: '', date: '', image: '' };
                            }
                            const newArray = [...arrayValue, newItem];
                            setLocalContent({ ...localContent, [key]: newArray });
                        }}
                        style={{
                            marginTop: '16px',
                            padding: '10px 20px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9em',
                            fontWeight: '500',
                            width: '100%'
                        }}
                    >
                        + Add Event ({arrayValue.length}/4)
                    </button>
                )}
                {key === 'events' && arrayValue.length >= 4 && (
                    <div style={{
                        marginTop: '12px',
                        padding: '12px',
                        backgroundColor: '#fff3cd',
                        border: '1px solid #ffc107',
                        borderRadius: '4px',
                        color: '#856404',
                        fontSize: '0.9em'
                    }}>
                        Maximum of 4 events reached
                    </div>
                )}
            </div>
        );
    };

    const renderEditor = () => {
        if (typeof localContent === 'string') {
            return (
                <textarea
                    value={localContent}
                    onChange={(e) => setLocalContent(e.target.value)}
                    className="text-editor"
                    rows="10"
                    placeholder="Enter content here..."
                />
            );
        }

        if (typeof localContent === 'object') {
            return (
                <div className="object-editor">
                    {Object.keys(localContent).map(key => {
                        const value = localContent[key];
                        const isImage = !Array.isArray(value) && (
                                       key.toLowerCase().includes('image') ||
                                       key.toLowerCase().includes('photo') ||
                                       key.toLowerCase().includes('img') ||
                                       (typeof value === 'string' && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value))
                        );
                        const isLongText = typeof value === 'string' && value.length > 100;

                        return (
                            <div key={key} className="field-group">
                                <label>{formatFieldName(key)}</label>
                                {Array.isArray(value) ? (
                                    renderArrayEditor(value, key)
                                ) : isImage ? (
                                    <div className="image-field">
                                        <div className="image-input-group">
                                            <input
                                                type="text"
                                                value={value || ''}
                                                onChange={(e) => setLocalContent({
                                                    ...localContent,
                                                    [key]: e.target.value
                                                })}
                                                className="text-input"
                                                placeholder="assets/image.jpg"
                                            />
                                            <label className="upload-button">
                                                Choose File
                                                <input
                                                    type="file"
                                                    accept="image/*,video/*"
                                                    style={{ display: 'none' }}
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const uploadedPath = await onImageUpload(file, section.section, key);
                                                            if (uploadedPath) {
                                                                setLocalContent({
                                                                    ...localContent,
                                                                    [key]: uploadedPath
                                                                });
                                                            }
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        {value && (
                                            <img
                                                src={getImageUrl(value)}
                                                alt="Preview"
                                                className="image-preview"
                                                style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '8px', borderRadius: '4px', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    if (e.target.nextSibling) {
                                                        e.target.nextSibling.style.display = 'block';
                                                    }
                                                }}
                                            />
                                        )}
                                        {value && typeof value === 'string' && (
                                            <span style={{ display: 'none', color: '#999', fontSize: '0.9em' }}>
                                                Image path: {value}
                                            </span>
                                        )}
                                    </div>
                                ) : isLongText || key.toLowerCase() === 'text' || key.toLowerCase() === 'description' ? (
                                    <textarea
                                        value={value || ''}
                                        onChange={(e) => setLocalContent({
                                            ...localContent,
                                            [key]: e.target.value
                                        })}
                                        className="text-input"
                                        rows="6"
                                        placeholder={`Enter ${formatFieldName(key).toLowerCase()}...`}
                                    />
                                ) : typeof value === 'object' && value !== null ? (
                                    <div className="nested-object">
                                        {Object.keys(value).map(subKey => {
                                            const subValue = value[subKey];
                                            const isNestedImage = typeof subValue === 'string' && (
                                                subKey.toLowerCase().includes('image') ||
                                                subKey.toLowerCase().includes('photo') ||
                                                subKey.toLowerCase().includes('img') ||
                                                subKey.toLowerCase().includes('src') ||
                                                /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(subValue)
                                            );

                                            return (
                                                <div key={subKey} className="field-group">
                                                    <label>{formatFieldName(subKey)}</label>
                                                    {isNestedImage ? (
                                                        <div className="image-field">
                                                            <div className="image-input-group">
                                                                <input
                                                                    type="text"
                                                                    value={subValue || ''}
                                                                    onChange={(e) => setLocalContent({
                                                                        ...localContent,
                                                                        [key]: { ...value, [subKey]: e.target.value }
                                                                    })}
                                                                    className="text-input"
                                                                    placeholder="assets/image.jpg"
                                                                />
                                                                <label className="upload-button">
                                                                    Choose File
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*,video/*"
                                                                        style={{ display: 'none' }}
                                                                        onChange={async (e) => {
                                                                            const file = e.target.files[0];
                                                                            if (file) {
                                                                                const uploadedPath = await onImageUpload(file, section.section, subKey);
                                                                                if (uploadedPath) {
                                                                                    setLocalContent({
                                                                                        ...localContent,
                                                                                        [key]: { ...value, [subKey]: uploadedPath }
                                                                                    });
                                                                                }
                                                                            }
                                                                        }}
                                                                    />
                                                                </label>
                                                            </div>
                                                            {subValue && (
                                                                <img
                                                                    src={getImageUrl(subValue)}
                                                                    alt="Preview"
                                                                    className="image-preview"
                                                                    style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '8px', borderRadius: '4px', objectFit: 'cover' }}
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        if (e.target.nextSibling) {
                                                                            e.target.nextSibling.style.display = 'block';
                                                                        }
                                                                    }}
                                                                />
                                                            )}
                                                            {subValue && typeof subValue === 'string' && (
                                                                <span style={{ display: 'none', color: '#999', fontSize: '0.85em' }}>
                                                                    {subValue}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : Array.isArray(subValue) ? (
                                                        <div className="nested-array" style={{ marginTop: '8px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                                                            <div style={{ marginBottom: '8px', fontWeight: '600', color: '#495057' }}>
                                                                {formatFieldName(subKey)} ({subValue.length} items)
                                                            </div>
                                                            {subValue.map((nestedItem, nestedIdx) => (
                                                                <div key={nestedIdx} style={{ marginBottom: '12px', padding: '12px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                                                                    <div style={{ marginBottom: '8px', fontWeight: '600', fontSize: '0.9em', color: '#6c757d' }}>
                                                                        Item {nestedIdx + 1}
                                                                    </div>
                                                                    {typeof nestedItem === 'object' && nestedItem !== null ? (
                                                                        <div>
                                                                            {Object.keys(nestedItem).map(nestedKey => {
                                                                                const nestedValue = nestedItem[nestedKey];
                                                                                const isUrl = nestedKey.toLowerCase().includes('url') || nestedKey.toLowerCase().includes('link');
                                                                                const isLongNestedText = typeof nestedValue === 'string' && nestedValue.length > 50;

                                                                                return (
                                                                                    <div key={nestedKey} style={{ marginBottom: '8px' }}>
                                                                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85em', fontWeight: '500' }}>
                                                                                            {formatFieldName(nestedKey)}:
                                                                                        </label>
                                                                                        {isLongNestedText || isUrl ? (
                                                                                            <textarea
                                                                                                value={nestedValue || ''}
                                                                                                onChange={(e) => {
                                                                                                    let value = e.target.value;
                                                                                                    // Auto-convert YouTube URLs to embed format
                                                                                                    if (nestedKey.toLowerCase().includes('embed')) {
                                                                                                        value = convertToYouTubeEmbed(value);
                                                                                                    }
                                                                                                    const newSubValue = [...subValue];
                                                                                                    newSubValue[nestedIdx] = { ...nestedItem, [nestedKey]: value };
                                                                                                    setLocalContent({
                                                                                                        ...localContent,
                                                                                                        [key]: { ...localContent[key], [subKey]: newSubValue }
                                                                                                    });
                                                                                                }}
                                                                                                rows="2"
                                                                                                style={{ width: '100%', padding: '8px', fontSize: '0.9em', border: '1px solid #ced4da', borderRadius: '4px' }}
                                                                                                placeholder={`Enter ${formatFieldName(nestedKey).toLowerCase()}...`}
                                                                                            />
                                                                                        ) : (
                                                                                            <input
                                                                                                type="text"
                                                                                                value={typeof nestedValue === 'object' ? JSON.stringify(nestedValue) : (nestedValue || '')}
                                                                                                onChange={(e) => {
                                                                                                    let value = e.target.value;
                                                                                                    // Auto-convert YouTube URLs to embed format
                                                                                                    if (nestedKey.toLowerCase().includes('embed')) {
                                                                                                        value = convertToYouTubeEmbed(value);
                                                                                                    }
                                                                                                    const newSubValue = [...subValue];
                                                                                                    newSubValue[nestedIdx] = { ...nestedItem, [nestedKey]: value };
                                                                                                    setLocalContent({
                                                                                                        ...localContent,
                                                                                                        [key]: { ...localContent[key], [subKey]: newSubValue }
                                                                                                    });
                                                                                                }}
                                                                                                style={{ width: '100%', padding: '8px', fontSize: '0.9em', border: '1px solid #ced4da', borderRadius: '4px' }}
                                                                                                placeholder={`Enter ${formatFieldName(nestedKey).toLowerCase()}...`}
                                                                                            />
                                                                                        )}
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    ) : (
                                                                        <input
                                                                            type="text"
                                                                            value={nestedItem || ''}
                                                                            onChange={(e) => {
                                                                                const newSubValue = [...subValue];
                                                                                newSubValue[nestedIdx] = e.target.value;
                                                                                setLocalContent({
                                                                                    ...localContent,
                                                                                    [key]: { ...value, [subKey]: newSubValue }
                                                                                });
                                                                            }}
                                                                            style={{ width: '100%', padding: '8px', fontSize: '0.9em', border: '1px solid #ced4da', borderRadius: '4px' }}
                                                                        />
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : typeof subValue === 'object' && subValue !== null ? (
                                                        <textarea
                                                            value={JSON.stringify(subValue, null, 2)}
                                                            onChange={(e) => {
                                                                let updatedValue = subValue;
                                                                try {
                                                                    updatedValue = JSON.parse(e.target.value);
                                                                } catch (err) {
                                                                    updatedValue = e.target.value;
                                                                }
                                                                setLocalContent({
                                                                    ...localContent,
                                                                    [key]: { ...value, [subKey]: updatedValue }
                                                                });
                                                            }}
                                                            className="text-input"
                                                            rows="4"
                                                            placeholder="Enter JSON..."
                                                        />
                                                    ) : typeof subValue === 'boolean' ? (
                                                        <select
                                                            value={subValue ? 'true' : 'false'}
                                                            onChange={(e) => setLocalContent({
                                                                ...localContent,
                                                                [key]: { ...value, [subKey]: e.target.value === 'true' }
                                                            })}
                                                            className="text-input"
                                                        >
                                                            <option value="true">Yes</option>
                                                            <option value="false">No</option>
                                                        </select>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={subValue || ''}
                                                            onChange={(e) => setLocalContent({
                                                                ...localContent,
                                                                [key]: { ...value, [subKey]: e.target.value }
                                                            })}
                                                            className="text-input"
                                                            placeholder={`Enter ${formatFieldName(subKey).toLowerCase()}...`}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        value={value || ''}
                                        onChange={(e) => setLocalContent({
                                            ...localContent,
                                            [key]: e.target.value
                                        })}
                                        className="text-input"
                                        placeholder={`Enter ${formatFieldName(key).toLowerCase()}...`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }

        return <p>Unsupported content type</p>;
    };

    return (
        <div className="section-card">
            <div className="section-header">
                <h3>{section.section.replace(/-/g, ' ').toUpperCase()}</h3>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="edit-button">
                        Edit
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="section-content">
                    {renderEditor()}
                    <div className="section-actions">
                        <button onClick={handleSave} disabled={saving} className="save-button">
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button onClick={() => setIsEditing(false)} className="cancel-button">
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="section-preview">
                    {renderPreview()}
                </div>
            )}
        </div>
    );
}

export default ContentEditor;
