package com.example.demo.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name="store")

public class Store {
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID tự động tăng (giả định)
    private Long Store_ID;

    @Column(name="Store_Code", length=200 )
    private String Store_Code ;

    @Column(name="Store_name", length=200 )
    private String Store_name ;

    @Column(name="Address", length=200 )
    private String Address ;

    @Column(name="City", length=200 )
    private String City ;

    @Column(name="District", length=200 )
    private String District ;    
}
