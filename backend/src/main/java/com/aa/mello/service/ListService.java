package com.aa.mello.service;

import com.aa.mello.entity.ListEntity;
import com.aa.mello.repository.ListRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ListService {
    private final ListRepository listRepository;

    public ListService(ListRepository listRepository) {
        this.listRepository = listRepository;
    }

    public List<ListEntity> getAllLists() {
        return listRepository.findAll();
    }

    public ListEntity createList(ListEntity list) {
        return listRepository.save(list);
    }

    public Optional<ListEntity> getListById(Long id) {
        return listRepository.findById(id);
    }

    public ListEntity updateList(Long id, ListEntity listDetails) {
        ListEntity list = listRepository.findById(id).orElseThrow();
        list.setTitle(listDetails.getTitle());
        list.setPosition(listDetails.getPosition());
        return listRepository.save(list);
    }

    public void deleteList(Long id) {
        listRepository.deleteById(id);
    }
}