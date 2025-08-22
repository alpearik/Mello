import { useState, useEffect } from 'react';
import Logo from "./assets/logo.png";

function App() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState({});
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newListTitle, setNewListTitle] = useState('');
  const [newCardTitles, setNewCardTitles] = useState({});

  const API_URL = 'http://localhost:8081/api';

  useEffect(() => {
    fetchBoards();
  }, []);

  /**
   * Fetch boards
   * 
   * Fetches all boards
   */

  async function fetchBoards() {
    try {
      const response = await fetch(`${API_URL}/boards`);
      const data = await response.json();
      setBoards(data);
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  }

  /**
   * Select board
   * 
   * Selects a board and fetches its details including lists and cards.
   * 
   * @param {*} board 
   */

  async function selectBoard(board) {
    try {
      const response = await fetch(`${API_URL}/boards/${board.id}`);
      const data = await response.json();
      setSelectedBoard(data);
      setLists(data.lists || []);

      const cardsData = {};
      for (const list of data.lists || []) {
        cardsData[list.id] = list.cards || [];
      }
      setCards(cardsData);
    } catch (error) {
      console.error('Error fetching board details:', error);
    }
  }

  /**
   * Create board
   * 
   * Creates a new board
   */

  async function createBoard() {
    if (!newBoardTitle.trim()) return;

    try {
      const response = await fetch(`${API_URL}/boards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newBoardTitle })
      });
      const newBoard = await response.json();
      const updatedBoards = boards.concat(newBoard);
      setBoards(updatedBoards);
      setNewBoardTitle('');
    } catch (error) {
      console.error('Error creating board:', error);
    }
  }

  /**
   * Delete board
   * 
   * Deletes a board
   */

  async function deleteBoard(boardId) {
    try {
      await fetch(`${API_URL}/boards/${boardId}`, {
        method: 'DELETE'
      });
      setBoards(boards.filter(b => b.id !== boardId));
      if (selectedBoard && selectedBoard.id === boardId) {
        setSelectedBoard(null);
        setLists([]);
        setCards({});
      }
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  }

  /**
   * Create list
   * 
   * Creates a new list under the selected board.
   */

  async function createList() {
    if (!newListTitle.trim() || !selectedBoard) return;

    try {
      const response = await fetch(`${API_URL}/lists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newListTitle,
          position: lists.length,
          board: { id: selectedBoard.id }
        })
      });
      const newList = await response.json();
      const updatedLists = lists.concat(newList);
      setLists(updatedLists);
      
      const updatedCards = Object.assign({}, cards);
      updatedCards[newList.id] = [];
      setCards(updatedCards);
      setNewListTitle('');
    } catch (error) {
      console.error('Error creating list:', error);
    }
  }
  
  /**
   * deleteList
   * 
   * Deletes a list and its associated cards.
   * 
   * @param {*} listId 
   */

  async function deleteList(listId) {
    try {
      await fetch(`${API_URL}/lists/${listId}`, {
        method: 'DELETE'
      });
      setLists(lists.filter(l => l.id !== listId));
      const newCards = Object.assign({}, cards);
      delete newCards[listId];
      setCards(newCards);
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  }

  /**
   * createCard
   * 
   * Creates a new card in the specified list.
   * 
   * @param {*} listId 
   */

  async function createCard(listId) {
    const cardTitle = newCardTitles[listId];
    if (!cardTitle || !cardTitle.trim()) return;

    try {
      const response = await fetch(`${API_URL}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: cardTitle,
          description: '',
          position: (cards[listId] || []).length,
          list: { id: listId }
        })
      });
      const newCard = await response.json();
      
      const updatedCards = Object.assign({}, cards);
      const existingCards = updatedCards[listId] || [];
      updatedCards[listId] = existingCards.concat(newCard);
      setCards(updatedCards);
      
      const updatedCardTitles = Object.assign({}, newCardTitles);
      updatedCardTitles[listId] = '';
      setNewCardTitles(updatedCardTitles);
    } catch (error) {
      console.error('Error creating card:', error);
    }
  }

  /**
   * deleteCard
   * 
   * Deletes a card from a list.
   * 
   * @param {*} cardId 
   * @param {*} listId 
   */

  async function deleteCard(cardId, listId) {
    try {
      await fetch(`${API_URL}/cards/${cardId}`, {
        method: 'DELETE'
      });
      const updatedCards = Object.assign({}, cards);
      updatedCards[listId] = cards[listId].filter(c => c.id !== cardId);
      setCards(updatedCards);
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  }
  
return (
    <div className="flex h-screen bg-white text-black">
      <div className="w-20 bg-white border-r border-gray-300 flex flex-col items-center pt-2">
        <img src={Logo} alt="Logo" className="w-12 h-12 mb-4" />
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center px-5 py-6 border-b border-gray-300">
          <div className="flex gap-4">
            <span className="text-gray-600">Boards</span>
          </div>
        </div>
        
        <div className="flex-1 p-5">
          {!selectedBoard ? (
            <div>
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="New board title"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded mr-2"
                />
                <button 
                  onClick={createBoard}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Create Board
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {boards.map(board => (
                  <div key={board.id} className="border border-gray-300 p-4 rounded bg-gray-50 flex justify-between items-center">
                    <span 
                      onClick={() => selectBoard(board)} 
                      className="cursor-pointer hover:text-blue-600 font-medium"
                    >
                      {board.title}
                    </span>
                    <button 
                      onClick={() => deleteBoard(board.id)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <button 
                  onClick={() => setSelectedBoard(null)}
                  className="text-blue-600 hover:text-blue-800 mb-2"
                >
                  ←
                </button>
                <h2 className="text-2xl font-bold">{selectedBoard.title}</h2>
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  placeholder="New list title"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded mr-2"
                />
                <button 
                  onClick={createList}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Create List
                </button>
              </div>

              <div className="flex gap-5 overflow-x-auto">
                {lists.map(list => (
                  <div key={list.id} className="bg-gray-100 p-4 rounded min-w-64 max-w-64">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold">{list.title}</h3>
                      <button 
                        onClick={() => deleteList(list.id)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ×
                      </button>
                    </div>

                    <div className="space-y-2 mb-3">
                      {(cards[list.id] || []).map(card => (
                        <div key={card.id} className="bg-white p-2 rounded border flex justify-between items-center">
                          <span className="text-sm">{card.title}</span>
                          <button 
                            onClick={() => deleteCard(card.id, list.id)}
                            className="text-red-500 hover:text-red-700 font-bold ml-2"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="New card title"
                        value={newCardTitles[list.id] || ''}
                        onChange={(e) => {
                          const updatedTitles = { ...newCardTitles };
                          updatedTitles[list.id] = e.target.value;
                          setNewCardTitles(updatedTitles);
                        }}
                        className="w-full border border-gray-300 px-2 py-1 rounded text-sm"
                      />
                      <button 
                        onClick={() => createCard(list.id)}
                        className="w-full bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Add Card
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;