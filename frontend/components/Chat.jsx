import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatMessages, sendChatMessage, updateDraftMessage } from '../store/modules/chat';

export default function Chat() {
  const dispatch = useDispatch();
  const messagesContainerRef = useRef(null);
  const shownMessages = useSelector(state => state.chat.shownMessages);
  const loading = useSelector(state => state.chat.loading);
  const draftMessage = useSelector(state => state.chat.draftMessage);
  
  useEffect(() => {
    dispatch(fetchChatMessages());
  }, [dispatch]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [shownMessages]);

  return (
    <div className="bg-white rounded-lg shadow p-4 h-[800px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="w-5"></div>
        <h3 className="font-semibold text-gray-700 text-xl">Global Chat</h3>
        <button 
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
          onClick={() => dispatch(fetchChatMessages())}
        >
          <svg 
            className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} 
            fill="none" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto"
      >
        {shownMessages.map(message => (
          <div key={message.id} className="mb-2">
            <span className="font-bold text-blue-600">{message.username}: </span>
            <span className="text-black">{message.text}</span>
          </div>
        ))}
      </div>
      
      <form onSubmit={(e) => {
          e.preventDefault();
          dispatch(sendChatMessage());
        }} className="border-t pt-4">
        <input
          type="text"
          value={draftMessage}
          onChange={(e) => dispatch(updateDraftMessage(e.target.value))}
          placeholder="Type a message..."
          className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>
    </div>
  );
} 