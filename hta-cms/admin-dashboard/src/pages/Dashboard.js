import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import ContentEditor from '../components/ContentEditor';
import { authAPI } from '../services/api';
import './Dashboard.css';

function Dashboard() {
    const { user, logout, isAdmin, canDeleteUser, canGrantAdminDelete } = useAuth();
    const [selectedPage, setSelectedPage] = useState('home');
    const [users, setUsers] = useState([]);
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState('editor');
    const [createUserError, setCreateUserError] = useState('');
    const [createUserSuccess, setCreateUserSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const pages = [
        { id: 'home', name: 'Home Page' },
        { id: 'about', name: 'About Page' },
        { id: 'departments', name: 'Departments' },
        { id: 'media', name: 'Media' },
        { id: 'contact', name: 'Contact' },
        { id: 'events', name: 'Events' },
        { id: 'give', name: 'Give' }
    ];

    // Fetch users if admin
    useEffect(() => {
        if (isAdmin && selectedPage === 'users') {
            fetchUsers();
        }
    }, [isAdmin, selectedPage, fetchUsers]);

    const fetchUsers = useCallback(async () => {
        try {
            console.log('Fetching users...');
            const response = await authAPI.getUsers();
            console.log('Users response details:', response.data.map(u => ({ email: u.email, role: u.role, permissions: u.permissions })));
            console.log('Current user permissions:', user?.permissions);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            // Error handled by user feedback
        }
    }, [user]);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setCreateUserError('');
        setCreateUserSuccess('');
        setLoading(true);

        try {
            const response = await authAPI.createUser(newUserName, newUserEmail, newUserRole);

            setCreateUserSuccess(`User created successfully!

Name: ${newUserName}
Email: ${newUserEmail}
Temporary Password: ${response.data.temporaryPassword}

Share these credentials with ${newUserName}. They will be required to change their password on first login.`);

            // Reset form
            setNewUserName('');
            setNewUserEmail('');
            setNewUserRole('editor');

            // Refresh users list
            fetchUsers();

        } catch (error) {
            setCreateUserError(error.response?.data?.error || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
            return;
        }

        try {
            await authAPI.deleteUser(userId);
            fetchUsers();
        } catch (error) {
            alert('Failed to delete user: ' + (error.response?.data?.error || 'Unknown error'));
        }
    };

    const handleGrantPermission = async (userId, userName, currentPermission) => {
        const action = currentPermission ? 'revoke' : 'grant';
        const message = currentPermission
            ? `Remove admin deletion permission from "${userName}"?`
            : `Grant admin deletion permission to "${userName}"?`;

        if (!window.confirm(message)) {
            return;
        }

        try {
            await authAPI.grantAdminDeletePermission(userId, !currentPermission);
            fetchUsers();
            alert(`Successfully ${action}ed permission ${action === 'grant' ? 'to' : 'from'} ${userName}`);
        } catch (error) {
            alert('Failed to update permissions: ' + (error.response?.data?.error || 'Unknown error'));
        }
    };

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Harvest Temple</h2>
                    <h3>Content Management</h3>
                    <p>{user?.name}</p>
                    <span className="user-role">{user?.role}</span>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section">
                        <h3>Pages</h3>
                        {pages.map(page => (
                            <button
                                key={page.id}
                                className={`nav-item ${selectedPage === page.id ? 'active' : ''}`}
                                onClick={() => setSelectedPage(page.id)}
                            >
                                <span className="nav-text">{page.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="nav-section">
                        <h3>Administration</h3>
                        <button
                            className={`nav-item ${selectedPage === 'users' ? 'active' : ''} ${!isAdmin ? 'locked' : ''}`}
                            onClick={() => isAdmin && setSelectedPage('users')}
                        >
                            <span className="nav-text">User Management</span>
                            {!isAdmin && (
                                <>
                                    <i className="fas fa-lock lock-icon"></i>
                                    <span className="locked-tooltip">Admin access required</span>
                                </>
                            )}
                        </button>
                    </div>
                </nav>

                <button onClick={logout} className="logout-button">
                    Sign Out
                </button>
            </aside>

            <main className="main-content">
                {selectedPage === 'users' && isAdmin ? (
                    <div className="user-management">
                        <div className="content-header">
                            <h1>User Management</h1>
                            <p>Manage CMS user accounts</p>
                        </div>

                        <div className="user-management-actions">
                            <button
                                className="create-user-btn"
                                onClick={() => {
                                    setShowCreateUserModal(true);
                                    setCreateUserError('');
                                    setCreateUserSuccess('');
                                }}
                            >
                                + Create New User
                            </button>
                        </div>

                        {/* Create User Modal */}
                        {showCreateUserModal && (
                            <div className="modal-overlay" onClick={() => setShowCreateUserModal(false)}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    <div className="modal-header">
                                        <h2>Create New User</h2>
                                        <button className="modal-close" onClick={() => setShowCreateUserModal(false)}>
                                            &times;
                                        </button>
                                    </div>

                                    <form className="create-user-form" onSubmit={handleCreateUser}>
                                        {createUserError && (
                                            <div className="error-alert">
                                                <i className="fas fa-exclamation-circle"></i>
                                                <span>{createUserError}</span>
                                            </div>
                                        )}

                                        {createUserSuccess && (
                                            <div className="success-alert">
                                                <i className="fas fa-check-circle"></i>
                                                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{createUserSuccess}</pre>
                                            </div>
                                        )}

                                        {!createUserSuccess && (
                                            <>
                                                <div className="form-group">
                                                    <label htmlFor="userName">Full Name</label>
                                                    <input
                                                        type="text"
                                                        id="userName"
                                                        value={newUserName}
                                                        onChange={(e) => setNewUserName(e.target.value)}
                                                        placeholder="John Smith"
                                                        required
                                                        autoFocus
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="userEmail">Email Address</label>
                                                    <input
                                                        type="email"
                                                        id="userEmail"
                                                        value={newUserEmail}
                                                        onChange={(e) => setNewUserEmail(e.target.value)}
                                                        placeholder="john@htachurch.com"
                                                        required
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="userRole">Role</label>
                                                    <select
                                                        id="userRole"
                                                        value={newUserRole}
                                                        onChange={(e) => setNewUserRole(e.target.value)}
                                                    >
                                                        <option value="editor">Editor</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                    <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                                                        A secure temporary password will be generated and displayed after creation. User must change it on first login.
                                                    </p>
                                                </div>

                                                <div className="modal-actions">
                                                    <button
                                                        type="button"
                                                        className="btn-secondary"
                                                        onClick={() => setShowCreateUserModal(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button type="submit" className="btn-primary" disabled={loading}>
                                                        {loading ? 'Creating...' : 'Create User'}
                                                    </button>
                                                </div>
                                            </>
                                        )}

                                        {createUserSuccess && (
                                            <div className="modal-actions">
                                                <button
                                                    type="button"
                                                    className="btn-primary"
                                                    onClick={() => {
                                                        setShowCreateUserModal(false);
                                                        setCreateUserSuccess('');
                                                    }}
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Users Table */}
                        <div className="users-table-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Permissions</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                                                No users found
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((u) => (
                                            <tr key={u._id}>
                                                <td>
                                                    {u.name}
                                                    {u.email === 'admin@htachurch.com' && (
                                                        <span style={{ marginLeft: '0.5rem', color: '#ffd700', fontSize: '0.9rem' }}>👑</span>
                                                    )}
                                                </td>
                                                <td>{u.email}</td>
                                                <td>
                                                    <span className={`role-badge role-${u.role}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    {u.role === 'admin' && u.permissions?.canDeleteAdmins && (
                                                        <span className="status-badge" style={{ backgroundColor: '#4a5568', color: '#fbbf24' }}>
                                                            🔑 Can Delete Admins
                                                        </span>
                                                    )}
                                                    {u.email === 'admin@htachurch.com' && (
                                                        <span className="status-badge" style={{ backgroundColor: '#1e3a8a', color: '#fbbf24' }}>
                                                            ⭐ Super Admin
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    {u.requirePasswordChange ? (
                                                        <span className="status-badge status-pending">
                                                            Pending Password Change
                                                        </span>
                                                    ) : (
                                                        <span className="status-badge status-active">
                                                            Active
                                                        </span>
                                                    )}
                                                </td>
                                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                        {/* Grant/Revoke Permission Button - Super Admin Only */}
                                                        {canGrantAdminDelete && u.role === 'admin' && u.email !== 'admin@htachurch.com' && (
                                                            <button
                                                                className="btn-secondary"
                                                                onClick={() => handleGrantPermission(u._id, u.name, u.permissions?.canDeleteAdmins)}
                                                                style={{
                                                                    fontSize: '0.85rem',
                                                                    padding: '0.4rem 0.8rem',
                                                                    backgroundColor: u.permissions?.canDeleteAdmins ? '#059669' : '#6366f1',
                                                                    color: 'white',
                                                                    border: 'none'
                                                                }}
                                                            >
                                                                {u.permissions?.canDeleteAdmins ? '✓ Has Permission' : '🔑 Grant Permission'}
                                                            </button>
                                                        )}

                                                        {/* Delete Button - Conditional based on permissions */}
                                                        {canDeleteUser(u) && (
                                                            <button
                                                                className="btn-delete"
                                                                onClick={() => handleDeleteUser(u._id, u.name)}
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="content-header">
                            <h1>{pages.find(p => p.id === selectedPage)?.name}</h1>
                            <p>Edit content below and changes will be saved automatically</p>
                        </div>

                        <ContentEditor page={selectedPage} />
                    </>
                )}
            </main>
        </div>
    );
}

export default Dashboard;
