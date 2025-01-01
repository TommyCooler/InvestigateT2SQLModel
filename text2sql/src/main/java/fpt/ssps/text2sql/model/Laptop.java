package fpt.ssps.text2sql.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "laptops")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Laptop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Laptop_ID")
    private Long id;

    @Column(name = "Laptop_name", unique = true, nullable = false)
    private String name;

    @Column(name = "Type")
    private String type;

    @Column(name = "Price")
    private Double price;

    @Column(name = "CPU")
    private String cpu;

    @Column(name = "GPU")
    private String gpu;

    @Column(name = "RAM")
    private String ram;

    @Column(name = "SSD")
    private String ssd;

    @Lob
    private String description;
}
