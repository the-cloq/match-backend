CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  name VARCHAR(255),
  path ENUM('blind_chat', 'wingperson', 'slow_match') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT,
  receiver_id INT,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user1_id INT,
  user2_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);