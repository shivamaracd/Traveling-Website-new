
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

-- Create DRS Manifest Table
CREATE TABLE IF NOT EXISTS drs_manifest (
    id INT AUTO_INCREMENT PRIMARY KEY,
    manifest_number VARCHAR(20) UNIQUE NOT NULL,
    origin VARCHAR(100) NOT NULL,
    drs_sheet_date DATE NOT NULL,
    drs_sheet_no VARCHAR(20) NOT NULL,
    delivery_boys_name VARCHAR(100) NOT NULL,
    delivery_boys_contact VARCHAR(15) NOT NULL,
    shipment_status ENUM('Pending', 'In Transit', 'Delivered', 'Cancelled', 'Returned', 'Lost', 'Damaged') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create DRS Tracking Numbers Table (for multiple tracking numbers)
CREATE TABLE IF NOT EXISTS drs_tracking_numbers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    manifest_id INT NOT NULL,
    tracking_number VARCHAR(50) NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manifest_id) REFERENCES drs_manifest(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tracking_manifest (tracking_number, manifest_id)
);

-- Add indexes for better performance
ALTER TABLE drs_manifest ADD INDEX idx_manifest_number (manifest_number);
ALTER TABLE drs_manifest ADD INDEX idx_drs_sheet_no (drs_sheet_no);
ALTER TABLE drs_tracking_numbers ADD INDEX idx_tracking_number (tracking_number);

-- Sample insert statement for your data
INSERT INTO drs_manifest (
    manifest_number,
    origin,
    drs_sheet_date,
    drs_sheet_no,
    delivery_boys_name,
    delivery_boys_contact,
    shipment_status
) VALUES (
    'MF2506287434',
    'shivam',
    CURRENT_DATE(),
    '11110000',
    'shiaa',
    'shivam',
    'Delivered'
);

-- Insert tracking numbers (assuming the manifest_id from previous insert)
INSERT INTO drs_tracking_numbers (manifest_id, tracking_number) VALUES 
    (LAST_INSERT_ID(), 'TR00091'),
    (LAST_INSERT_ID(), 'TUU0090');

-- Useful queries for retrieving data:

-- Get manifest with all its tracking numbers
SELECT 
    m.*,
    GROUP_CONCAT(t.tracking_number) as tracking_numbers
FROM drs_manifest m
LEFT JOIN drs_tracking_numbers t ON m.id = t.manifest_id
GROUP BY m.id;

-- Get specific manifest by manifest number
SELECT 
    m.*,
    GROUP_CONCAT(t.tracking_number) as tracking_numbers
FROM drs_manifest m
LEFT JOIN drs_tracking_numbers t ON m.id = t.manifest_id
WHERE m.manifest_number = 'MF2506287434'
GROUP BY m.id;
