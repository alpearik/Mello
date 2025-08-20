package com.aa.mello.service;

import com.aa.mello.entity.Card;
import com.aa.mello.repository.CardRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CardService {
    private final CardRepository cardRepository;

    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    public List<Card> getAllCards() {
        return cardRepository.findAll();
    }

    public Card createCard(Card card) {
        return cardRepository.save(card);
    }

    public Optional<Card> getCardById(Long id) {
        return cardRepository.findById(id);
    }

    public Card updateCard(Long id, Card cardDetails) {
        Card card = cardRepository.findById(id).orElseThrow();
        card.setTitle(cardDetails.getTitle());
        card.setDescription(cardDetails.getDescription());
        card.setPosition(cardDetails.getPosition());
        return cardRepository.save(card);
    }

    public void deleteCard(Long id) {
        cardRepository.deleteById(id);
    }
}