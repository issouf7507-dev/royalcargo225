-- CreateTable
CREATE TABLE `Adresse` (
    `id` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `tel` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `pays` ENUM('COTE_D_IVOIRE', 'MALI') NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `poids` DOUBLE NULL,
    `volume` DOUBLE NULL,
    `prix` DOUBLE NULL,
    `status` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NULL,
    `description` VARCHAR(191) NOT NULL,
    `etat` VARCHAR(191) NULL,
    `codeTracking` VARCHAR(191) NULL,
    `service` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Adresse_email_key`(`email`),
    UNIQUE INDEX `Adresse_codeTracking_key`(`codeTracking`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `adresseId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_adresseId_fkey` FOREIGN KEY (`adresseId`) REFERENCES `Adresse`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
