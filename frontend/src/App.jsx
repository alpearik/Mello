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
  <div>
    <h1>Mello</h1>

    {!selectedBoard ? (
      <div>
        <h2>Boards</h2>
        <div>
          <input
            type="text"
            placeholder="New board title"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
          />
          <button onClick={createBoard}>Create Board</button>
        </div>

        <div>
          {boards.map(board => (
            <div key={board.id}>
              <span onClick={() => selectBoard(board)} style={{ cursor: 'pointer' }}>
                {board.title}
              </span>
              <button onClick={() => deleteBoard(board.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div>
        <button onClick={() => setSelectedBoard(null)}>← Back to Boards</button>
        <h2>{selectedBoard.title}</h2>

        <div>
          <input
            type="text"
            placeholder="New list title"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
          />
          <button onClick={createList}>Create List</button>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          {lists.map(list => (
            <div key={list.id}>
              <h3>
                {list.title}
                <button onClick={() => deleteList(list.id)}>×</button>
              </h3>

              <div>
                {(cards[list.id] || []).map(card => (
                  <div key={card.id}>
                    {card.description && <small>{card.description}</small>}
                    <button onClick={() => deleteCard(card.id, list.id)}>Delete</button>
                  </div>
                ))}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="New card title"
                  value={newCardTitles[list.id] || ''}
                  onChange={(e) => {
                    const updatedTitles = Object.assign({}, newCardTitles);
                    updatedTitles[list.id] = e.target.value;
                    setNewCardTitles(updatedTitles);
                  }}
                />
                <button onClick={() => createCard(list.id)}>Add Card</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
}

export default App;