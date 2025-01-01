package fpt.ssps.text2sql.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Store_Laptop")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoreLaptop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @JoinColumn(name = "Store_ID", referencedColumnName = "Store_ID", nullable = false)
    private Store storeId;

    @ManyToOne(optional = false, cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @JoinColumn(name = "Laptop_ID", referencedColumnName = "Laptop_ID", nullable = false)
    private Laptop laptopId;

    private int quantity;

    @Column(name = "Discount_Percentage")
    private Double discountPercentage;

    @Column(name = "Last_Updated", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime lastUpdate;


}
