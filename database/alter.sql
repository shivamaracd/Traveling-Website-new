
Create Table

CREATE TABLE `manifests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `iduser` int(11) DEFAULT NULL,
  `tracking_number` varchar(100) DEFAULT NULL,
  `origin` varchar(100) NOT NULL,
  `manifest_number` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `forwarding_number` varchar(100) DEFAULT NULL,
  `forwarding_by` varchar(100) DEFAULT NULL,
  `destination` enum('Vendor','Branch') DEFAULT 'Vendor',
  `branch` varchar(100) DEFAULT NULL,
  `vendor` varchar(100) DEFAULT NULL,
  `status` enum('Pending','In Transit','Completed') NOT NULL,
  `remarks` text DEFAULT NULL,
  `driver_contact` varchar(10) NOT NULL,
  `total_packages` int(11) NOT NULL CHECK (`total_packages` >= 1),
  `total_weight` decimal(10,2) NOT NULL CHECK (`total_weight` > 0),
  `vehicle_number` varchar(100) NOT NULL,
  `driver_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4
