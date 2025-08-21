package com.aa.mello.controller;

import com.aa.mello.entity.ListEntity;
import com.aa.mello.service.ListService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lists")
@CrossOrigin(origins = "http://localhost:5174")

public class ListController {
    private final ListService listService;

    public ListController(ListService listService) {
        this.listService = listService;
    }

    @GetMapping
    public List<ListEntity> getAllLists() {
        return listService.getAllLists();
    }

    @PostMapping
    public ListEntity createList(@RequestBody ListEntity list) {
        return listService.createList(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListEntity> getListById(@PathVariable Long id) {
        return listService.getListById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ListEntity updateList(@PathVariable Long id, @RequestBody ListEntity listDetails) {
        return listService.updateList(id, listDetails);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteList(@PathVariable Long id) {
        listService.deleteList(id);
        return ResponseEntity.ok().build();
    }
}