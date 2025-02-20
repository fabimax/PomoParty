import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  sendChatMessage, 
  updateDraftMessage,
  enableAutoChatRefreshing,
  disableAutoChatRefreshing 
} from '../store/modules/chat';

export default function Chat() {
  const dispatch = useDispatch();
  const messagesContainerRef = useRef(null);
  const shownMessages = useSelector(state => state.chat.shownMessages);
  const loading = useSelector(state => state.chat.loading);
  const draftMessage = useSelector(state => state.chat.draftMessage);
  const validationErrors = useSelector(state => state.chat.validationErrors);
  
  useEffect(() => {
    dispatch(enableAutoChatRefreshing());
    
    return () => {
      dispatch(disableAutoChatRefreshing());
    };
  }, [dispatch]);

  // this doesn't work very well
  useEffect(() => {
    // Scroll to bottom when message content changes
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [JSON.stringify(shownMessages.map(msg => ({ id: msg.uuid, text: msg.text })))]);

  shownMessages.sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="bg-white rounded-lg shadow p-4 h-[800px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-center font-semibold text-gray-700 text-xl">Global Chat</h3>
      </div>
      
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto"
      >
        {shownMessages.map(message => (
          <div key={message.uuid} className="mb-2">
            <span className="font-bold text-blue-600">{message.username}: </span>
            <span className="text-black">{message.text}</span>
          </div>
        ))}
      </div>
      
      <form onSubmit={(e) => {
          e.preventDefault();
          dispatch(sendChatMessage());
        }} className="border-t pt-4">
        <div className="relative">
          <input
            type="text"
            value={draftMessage}
            onChange={(e) => dispatch(updateDraftMessage(e.target.value))}
            disabled={loading}
            placeholder="Type a message..."
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
              validationErrors?.text?.length > 0 ? 'border-red-500' : 'border-gray-300'
            } ${
              loading ? 'bg-gray-100' : 'bg-white'
            }`}
          />
          {validationErrors?.text?.length > 0 && (
            <div className="mt-2">
              {validationErrors.text.map((error, index) => (
                <p key={index} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
} 