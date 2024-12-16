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
@Table(name = "laptops")  // Tên bảng trong cơ sở dữ liệu
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID tự động tăng (giả định)
    private Long Product_ID;

    @Column(name="Product_Code", length=200 )
    private String Product_Code ;

    @Column(name="Product_name", length=200)
    private String Product_name;

    @Column(name="Type", length=200)
    private String Type;

    @Column(name="Price", length=20)
    private String Price;

    @Column(name="CPU", length=20)
    private String CPU;

    @Column(name="GPU", length=20)
    private String GPU;

    @Column(name="RAM", length=20)
    private String RAM;

    @Column(name="SSD", length=20)
    private String SSD;

    @Column(name="Description", columnDefinition = "TEXT")
    private String Description;
}