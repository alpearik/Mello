package com.aa.mello.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity

public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ListEntity> lists = new ArrayList<>();
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public List<ListEntity> getLists() { return lists; }
    public void setLists(List<ListEntity> lists) { this.lists = lists; }
}