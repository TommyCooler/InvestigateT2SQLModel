package fpt.ssps.text2sql.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Stores")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Store_ID")
    private Long id;

    @Column(name = "Store_name", nullable = false, unique = true)
    private String name;

    private String address;

    private String city;

    private String district;
}
