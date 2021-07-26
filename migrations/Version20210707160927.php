<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210707160927 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE appointments (id INT AUTO_INCREMENT NOT NULL, users_id INT DEFAULT NULL, start DATETIME NOT NULL, end DATETIME NOT NULL, lastname VARCHAR(255) NOT NULL, firstname VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, tel VARCHAR(255) NOT NULL, prestation VARCHAR(255) NOT NULL, INDEX IDX_6A41727A67B3B43D (users_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE categories (id INT AUTO_INCREMENT NOT NULL, users_id INT DEFAULT NULL, prestations_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, image VARCHAR(255) NOT NULL, INDEX IDX_3AF3466867B3B43D (users_id), INDEX IDX_3AF346688BE96D0D (prestations_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE prestations (id INT AUTO_INCREMENT NOT NULL, users_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, image VARCHAR(255) NOT NULL, presta_time INT NOT NULL, INDEX IDX_B338D8D167B3B43D (users_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, company_name VARCHAR(255) NOT NULL, tel VARCHAR(255) NOT NULL, time_lapse VARCHAR(255) NOT NULL, start_time TIME DEFAULT NULL, end_time TIME DEFAULT NULL, show_preta VARBINARY(255) NOT NULL, subscriber_user VARBINARY(255) NOT NULL, UNIQUE INDEX UNIQ_1483A5E9E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE appointments ADD CONSTRAINT FK_6A41727A67B3B43D FOREIGN KEY (users_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE categories ADD CONSTRAINT FK_3AF3466867B3B43D FOREIGN KEY (users_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE categories ADD CONSTRAINT FK_3AF346688BE96D0D FOREIGN KEY (prestations_id) REFERENCES prestations (id)');
        $this->addSql('ALTER TABLE prestations ADD CONSTRAINT FK_B338D8D167B3B43D FOREIGN KEY (users_id) REFERENCES users (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE categories DROP FOREIGN KEY FK_3AF346688BE96D0D');
        $this->addSql('ALTER TABLE appointments DROP FOREIGN KEY FK_6A41727A67B3B43D');
        $this->addSql('ALTER TABLE categories DROP FOREIGN KEY FK_3AF3466867B3B43D');
        $this->addSql('ALTER TABLE prestations DROP FOREIGN KEY FK_B338D8D167B3B43D');
        $this->addSql('DROP TABLE appointments');
        $this->addSql('DROP TABLE categories');
        $this->addSql('DROP TABLE prestations');
        $this->addSql('DROP TABLE users');
    }
}
