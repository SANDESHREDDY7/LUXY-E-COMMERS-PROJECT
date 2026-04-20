package com.luxe.backend.controller;

import com.luxe.backend.model.Collection;
import com.luxe.backend.repository.CollectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collections")
public class CollectionController {

    @Autowired
    private CollectionRepository collectionRepository;

    @GetMapping
    public List<Collection> getAllCollections() {
        return collectionRepository.findAllByOrderByNameAsc();
    }

    @PostMapping
    public Collection addCollection(@RequestBody Collection collection) {
        return collectionRepository.save(collection);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Collection> updateCollection(@PathVariable Long id, @RequestBody Collection collectionDetails) {
        return collectionRepository.findById(id).map(collection -> {
            collection.setName(collectionDetails.getName());
            return ResponseEntity.ok(collectionRepository.save(collection));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCollection(@PathVariable Long id) {
        return collectionRepository.findById(id).map(collection -> {
            collectionRepository.delete(collection);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
