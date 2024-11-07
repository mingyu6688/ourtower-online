CREATE TABLE IF NOT EXISTS user
(
    id         INT           NOT NULL PRIMARY KEY AUTO_INCREMENT,
    accountId  VARCHAR(255)  NOT NULL UNIQUE,
    password   VARCHAR(255)  NOT NULL,
    email      VARCHAR(255)  NOT NULL,
    createdAt  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lastLogin  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gameLog
(
    id           INT         NOT NULL PRIMARY KEY AUTO_INCREMENT,
    winUserId    INT         NOT NULL,
    loseUserId   INT         NOT NULL,
    winScore     INT         NOT NULL,
    loseScore    INT         NOT NULL,
    playedAt     TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (winUserId)  REFERENCES user (id),
    FOREIGN KEY (loseUserId) REFERENCES user (id)
);