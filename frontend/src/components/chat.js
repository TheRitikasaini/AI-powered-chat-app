import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const newChat = [...chat, { user: 'You', text: message }];
        setChat(newChat);
        setMessage('');
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:5000/api/chat', { message });
            let aiReply = response.data.reply;

            // Ensure the AI response is clean and does not repeat the user's message
            aiReply = aiReply.replace(message, '').trim();

            setChat([...newChat, { user: 'AI', text: aiReply }]);
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to get a response from AI. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <div style={{ minHeight: '300px', overflowY: 'auto', padding: '10px', borderBottom: '1px solid #ccc' }}>
                {chat.map((msg, index) => (
                    <p key={index}><strong>{msg.user}:</strong> {msg.text}</p>
                ))}
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flex: 1, padding: '8px' }}
                />
                <button onClick={sendMessage} disabled={loading} style={{ padding: '8px 15px', cursor: 'pointer' }}>
                    {loading ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    );
};

export default Chat;
