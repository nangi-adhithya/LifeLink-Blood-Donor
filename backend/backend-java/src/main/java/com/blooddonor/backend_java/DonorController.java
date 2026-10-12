package com.blooddonor.backend_java;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donors")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174"
})
public class DonorController {

    private final DonorRepository donorRepository;

    public DonorController(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    @GetMapping
    public List<Donor> getAllDonors(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false) String name) {

        List<Donor> donors = donorRepository.findAll();

        return donors.stream()
                .filter(d -> city == null || city.isBlank()
                        || (d.getCity() != null
                        && d.getCity().toLowerCase()
                        .contains(city.toLowerCase())))
                .filter(d -> bloodGroup == null || bloodGroup.isBlank()
                        || (d.getBloodGroup() != null
                        && d.getBloodGroup().equalsIgnoreCase(bloodGroup)))
                .filter(d -> name == null || name.isBlank()
                        || (d.getName() != null
                        && d.getName().toLowerCase()
                        .contains(name.toLowerCase())))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Donor> getDonorById(@PathVariable Long id) {
        return donorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createDonor(@RequestBody Donor donor) {
        if (donor.getName() == null || donor.getName().isBlank()
                || donor.getBloodGroup() == null
                || donor.getBloodGroup().isBlank()
                || donor.getPhone() == null || donor.getPhone().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Name, blood group and phone are required.");
        }

        donor.setId(null);
        Donor savedDonor = donorRepository.save(donor);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDonor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDonor(
            @PathVariable Long id,
            @RequestBody Donor updatedDonor) {

        return donorRepository.findById(id)
                .map(existing -> {
                    existing.setName(updatedDonor.getName());
                    existing.setAge(updatedDonor.getAge());
                    existing.setGender(updatedDonor.getGender());
                    existing.setBloodGroup(updatedDonor.getBloodGroup());
                    existing.setPhone(updatedDonor.getPhone());
                    existing.setCity(updatedDonor.getCity());
                    existing.setAvailable(updatedDonor.isAvailable());

                    return ResponseEntity.ok(donorRepository.save(existing));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonor(@PathVariable Long id) {
        if (!donorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        donorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
