-- CreateTable
CREATE TABLE `AdminUser` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPERADMIN', 'EDITOR') NOT NULL DEFAULT 'EDITOR',
    `active` BOOLEAN NOT NULL DEFAULT true,
    `lastLogin` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AdminUser_email_key`(`email`),
    INDEX `AdminUser_email_idx`(`email`),
    INDEX `AdminUser_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasswordResetToken` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `otp` VARCHAR(191) NULL,
    `expires` DATETIME(3) NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PasswordResetToken_token_key`(`token`),
    INDEX `PasswordResetToken_email_idx`(`email`),
    INDEX `PasswordResetToken_token_idx`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HeroSlide` (
    `id` VARCHAR(191) NOT NULL,
    `badge` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `ctaPrimaryLabel` VARCHAR(191) NOT NULL DEFAULT 'Explorar Programas',
    `ctaPrimaryHref` VARCHAR(191) NOT NULL DEFAULT '#areas',
    `ctaSecondaryLabel` VARCHAR(191) NOT NULL DEFAULT 'Saber Mais',
    `ctaSecondaryHref` VARCHAR(191) NOT NULL DEFAULT '#sobre',
    `imageUrl` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `HeroSlide_active_order_idx`(`active`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Area` (
    `id` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Area_active_order_idx`(`active`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Program` (
    `id` VARCHAR(191) NOT NULL,
    `areaId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `mode` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `startDate` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Program_areaId_active_idx`(`areaId`, `active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Solution` (
    `id` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `wide` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Solution_active_order_idx`(`active`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SiteSettings` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'singleton',
    `siteName` VARCHAR(191) NOT NULL DEFAULT 'Instituto Mirabilis',
    `tagline` VARCHAR(191) NOT NULL DEFAULT 'Administração & Negócios',
    `address` VARCHAR(191) NOT NULL DEFAULT 'Urbanização Nova Rua 165A, Luanda, Angola',
    `phone` VARCHAR(191) NOT NULL DEFAULT '+244 999 999 999',
    `whatsapp` VARCHAR(191) NOT NULL DEFAULT '+244999999999',
    `email` VARCHAR(191) NOT NULL DEFAULT 'geral@mai.ao',
    `linkedin` VARCHAR(191) NULL,
    `facebook` VARCHAR(191) NULL,
    `instagram` VARCHAR(191) NULL,
    `youtube` VARCHAR(191) NULL,
    `googleMapsEmbed` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactSubmission` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `organization` VARCHAR(191) NULL,
    `area` VARCHAR(191) NULL,
    `message` VARCHAR(191) NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `readAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ContactSubmission_read_createdAt_idx`(`read`, `createdAt`),
    INDEX `ContactSubmission_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EnrollmentSubmission` (
    `id` VARCHAR(191) NOT NULL,
    `programId` VARCHAR(191) NULL,
    `programName` VARCHAR(191) NOT NULL,
    `areaName` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `organization` VARCHAR(191) NULL,
    `role` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `statusNote` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `EnrollmentSubmission_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `EnrollmentSubmission_programId_idx`(`programId`),
    INDEX `EnrollmentSubmission_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Job` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `location` ENUM('PRESENCIAL', 'REMOTO', 'HIBRIDO') NOT NULL DEFAULT 'PRESENCIAL',
    `type` ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP') NOT NULL DEFAULT 'FULL_TIME',
    `area` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `requirements` JSON NOT NULL,
    `benefits` JSON NOT NULL,
    `salary` VARCHAR(191) NULL,
    `deadline` VARCHAR(191) NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('OPEN', 'CLOSED', 'PAUSED') NOT NULL DEFAULT 'OPEN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Job_status_featured_idx`(`status`, `featured`),
    INDEX `Job_status_createdAt_idx`(`status`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobApplication` (
    `id` VARCHAR(191) NOT NULL,
    `jobId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `linkedin` VARCHAR(191) NULL,
    `portfolio` VARCHAR(191) NULL,
    `coverLetter` MEDIUMTEXT NOT NULL,
    `cvUrl` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'REVIEWING', 'INTERVIEW', 'REJECTED', 'HIRED') NOT NULL DEFAULT 'PENDING',
    `statusNote` VARCHAR(191) NULL,
    `reviewedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `JobApplication_jobId_status_idx`(`jobId`, `status`),
    INDEX `JobApplication_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `JobApplication_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Program` ADD CONSTRAINT `Program_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `Area`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EnrollmentSubmission` ADD CONSTRAINT `EnrollmentSubmission_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `Program`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobApplication` ADD CONSTRAINT `JobApplication_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
