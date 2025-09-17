-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: db:3306
-- Tiempo de generación: 13-09-2025 a las 15:37:39
-- Versión del servidor: 8.0.43
-- Versión de PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `josepe_DB`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Analytics`
--

CREATE TABLE `Analytics` (
  `id` int NOT NULL,
  `metric` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` float DEFAULT '1',
  `properties` json DEFAULT NULL,
  `page` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userAgent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `ipAddress` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `browser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referrer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sessionId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Analytics`
--

INSERT INTO `Analytics` (`id`, `metric`, `value`, `properties`, `page`, `userAgent`, `ipAddress`, `country`, `city`, `device`, `browser`, `referrer`, `sessionId`, `date`) VALUES
(1, 'page_view', 1, '{\"ref\": \"google\", \"campaign\": \"summer\"}', '/', 'Mozilla/5.0', '84.12.34.56', 'ES', 'Madrid', 'desktop', 'Chrome', 'https://google.com', 'sess-1', '2025-09-12 09:00:00'),
(2, 'set_play', 1, '{\"setId\": 1}', '/sets/sunset-mix-2024', 'Mozilla/5.0', '85.23.45.67', 'ES', 'Barcelona', 'mobile', 'Safari', NULL, 'sess-2', '2025-07-01 19:30:00'),
(3, 'download', 1, '{\"asset\": \"sunset-mix\"}', '/download', 'curl/7.68.0', '77.66.55.44', 'ES', 'Sevilla', 'desktop', 'curl', NULL, 'sess-3', '2024-07-02 12:00:00'),
(4, 'contact_form', 1, '{\"source\": \"website\"}', '/contact', 'Mozilla/5.0', '81.23.45.67', 'ES', 'Madrid', 'desktop', 'Chrome', 'https://referrer.example', 'sess-4', '2025-08-01 10:00:00'),
(5, 'page_view', 1, NULL, '/blog/gira-verano-2024', 'Mozilla/5.0', '78.45.12.90', 'ES', 'Madrid', 'desktop', 'Firefox', NULL, 'sess-5', '2024-07-11 09:16:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `BlogComment`
--

CREATE TABLE `BlogComment` (
  `id` int NOT NULL,
  `postId` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `parentId` int DEFAULT NULL,
  `approved` tinyint(1) DEFAULT '0',
  `spam` tinyint(1) DEFAULT '0',
  `ipAddress` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userAgent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `BlogComment`
--

INSERT INTO `BlogComment` (`id`, `postId`, `name`, `email`, `website`, `content`, `parentId`, `approved`, `spam`, `ipAddress`, `userAgent`, `createdAt`) VALUES
(1, 1, 'María López', 'maria@example.com', 'https://maria.example', '¡Gran show! Me encantó la selección.', NULL, 1, 0, '84.12.34.56', 'Mozilla/5.0 (Windows)', '2024-07-11 09:15:00'),
(2, 1, 'Carlos Ruiz', NULL, NULL, '¿Habrá concierto en Madrid el próximo año?', NULL, 0, 0, '78.45.12.90', 'Mozilla/5.0 (Android)', '2024-07-12 10:00:00'),
(3, 1, 'Jose', 'jose@sample.com', NULL, '@Carlos habrá novedades pronto!', 2, 1, 0, '79.34.21.11', 'Mozilla/5.0 (iPhone)', '2024-07-12 11:05:00'),
(4, 2, 'Lucía Fernández', 'lucia@example.com', NULL, 'El single suena increíble, felicidades.', NULL, 1, 0, '85.23.45.67', 'Mozilla/5.0 (Macintosh)', '2025-01-16 08:20:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `BlogPost`
--

CREATE TABLE `BlogPost` (
  `id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `seo_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seo_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `tags` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `featured` tinyint(1) DEFAULT '0',
  `viewCount` int DEFAULT '0',
  `likeCount` int DEFAULT '0',
  `published` tinyint(1) DEFAULT '0',
  `publishedAt` datetime DEFAULT NULL,
  `scheduledFor` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `coverPhotoId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `BlogPost`
--

INSERT INTO `BlogPost` (`id`, `title`, `slug`, `excerpt`, `content`, `seo_title`, `seo_description`, `tags`, `status`, `featured`, `viewCount`, `likeCount`, `published`, `publishedAt`, `scheduledFor`, `createdAt`, `updatedAt`, `coverPhotoId`) VALUES
(1, 'La gira de verano 2024', 'gira-verano-2024', 'Resumen de la gira de verano', 'Contenido completo del post sobre la gira de verano...', 'Gira verano 2024 - Josepe', 'Resumen y fechas de la gira de verano.', 'gira,summer,2024', 'published', 1, 1245, 98, 1, '2024-07-10 10:00:00', NULL, '2024-07-01 08:00:00', '2024-07-10 11:00:00', 3),
(2, 'Nuevo single: Atardecer', 'nuevo-single-atardecer', 'Lanzamiento del nuevo single', 'Texto completo sobre el single y enlaces de compra/streaming...', 'Atardecer - Josepe', 'Escucha el nuevo single \"Atardecer\"', 'single,release', 'published', 0, 845, 34, 1, '2025-01-15 09:00:00', NULL, '2025-01-10 09:00:00', '2025-01-15 09:30:00', 4),
(3, 'Consejos para DJs principiantes', 'consejos-djs-principiantes', 'Pequeña guía para empezar como DJ', 'Contenido pedagógico con pasos y herramientas recomendadas...', 'Guía para DJs', 'Consejos prácticos para empezar a pinchar', 'djs,guide', 'draft', 0, 102, 10, 0, NULL, NULL, '2025-08-01 12:00:00', '2025-09-12 10:00:00', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ContactMessage`
--

CREATE TABLE `ContactMessage` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'general',
  `priority` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'normal',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'new',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `repliedAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `read` tinyint(1) DEFAULT '0',
  `ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userAgent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `source` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ContactMessage`
--

INSERT INTO `ContactMessage` (`id`, `name`, `email`, `phone`, `company`, `subject`, `message`, `type`, `priority`, `status`, `notes`, `repliedAt`, `createdAt`, `updatedAt`, `read`, `ip`, `userAgent`, `source`) VALUES
(1, 'Agencia MKT', 'bookings@agencymkt.example', '+34 600 111 222', 'Agency MKT', 'Booking request', 'Nos gustaría contratar a Josepe para un evento corporativo el 2025-10-05.', 'booking', 'high', 'new', NULL, NULL, '2025-08-01 10:00:00', '2025-08-01 10:00:00', 0, '81.23.45.67', 'Mozilla/5.0 (Windows)', 'website'),
(2, 'Clara Pérez', 'clara.p@example.com', NULL, NULL, 'Pregunta sobre colaboraciones', '¿Aceptas remixes o colaboraciones?', 'collaboration', 'normal', 'new', NULL, NULL, '2025-02-20 14:30:00', '2025-02-20 14:30:00', 0, '88.11.22.33', 'Mozilla/5.0 (Macintosh)', 'instagram'),
(3, 'Usuario Demo', 'demo@example.com', NULL, NULL, 'Consulta general', 'Solo probando el formulario.', 'general', 'low', 'read', 'Contestada por email', '2025-03-01 09:00:00', '2025-03-01 08:55:00', '2025-03-01 09:05:00', 1, '77.66.55.44', 'curl/7.68.0', 'website');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `DJAuth`
--

CREATE TABLE `DJAuth` (
  `id` int NOT NULL,
  `passwordHash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `DJAuth`
--

INSERT INTO `DJAuth` (`id`, `passwordHash`) VALUES
(1, '$2b$12$...'),
(2, '$2b$12$qKj8zWjI8z9yX6LmH5LmH5LmH5LmH5LmH5LmH5LmH5LmH5LmH5LmH');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Event`
--

CREATE TABLE `Event` (
  `id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `shortDescription` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `venue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'España',
  `coordinates` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime NOT NULL,
  `endDate` datetime DEFAULT NULL,
  `time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timezone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Europe/Madrid',
  `price` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `currency` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'EUR',
  `ticketUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facebookUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instagramUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'scheduled',
  `eventType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'performance',
  `capacity` int DEFAULT NULL,
  `attendees` int DEFAULT '0',
  `featured` tinyint(1) DEFAULT '0',
  `soldOut` tinyint(1) DEFAULT '0',
  `published` tinyint(1) DEFAULT '1',
  `seo_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seo_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `coverPhotoId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Event`
--

INSERT INTO `Event` (`id`, `title`, `slug`, `description`, `shortDescription`, `venue`, `address`, `city`, `country`, `coordinates`, `date`, `endDate`, `time`, `endTime`, `timezone`, `price`, `currency`, `ticketUrl`, `facebookUrl`, `instagramUrl`, `status`, `eventType`, `capacity`, `attendees`, `featured`, `soldOut`, `published`, `seo_title`, `seo_description`, `createdAt`, `updatedAt`, `coverPhotoId`) VALUES
(1, 'Josepe Live - Sala Madrid', 'josepe-live-sala-madrid', 'Concierto íntimo en Sala Madrid', 'Concierto íntimo el 2025-10-05', 'Sala Madrid', 'C/ Principal 10', 'Madrid', 'España', '40.4168,-3.7038', '2025-10-05 21:00:00', NULL, '21:00', '23:30', 'Europe/Madrid', '15', 'EUR', 'https://tickets.example/event/1', 'https://facebook.com/event/1', NULL, 'scheduled', 'performance', 300, 35, 1, 0, 1, 'Josepe Live - Sala Madrid', 'Concierto íntimo en Sala Madrid', '2025-06-01 12:00:00', '2025-06-02 12:00:00', 1),
(2, 'Festival Playa 2025', 'festival-playa-2025', 'Actuación principal en Festival Playa', 'Set al atardecer en la playa', 'Playa Central', 'Av. del Mar s/n', 'Valencia', 'España', '39.4699,-0.3763', '2025-08-15 19:00:00', '2025-08-15 23:59:00', '19:00', '23:59', 'Europe/Madrid', 'Free', 'EUR', NULL, NULL, 'https://instagram.com/festival/playa', 'scheduled', 'festival', 20000, 5000, 1, 0, 1, 'Festival Playa 2025', 'Set principal en el festival', '2025-01-01 09:00:00', '2025-01-20 09:00:00', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `GalleryPhoto`
--

CREATE TABLE `GalleryPhoto` (
  `id` int NOT NULL,
  `filename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `alt` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tags` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sizeOriginal` int DEFAULT NULL,
  `sizeMedium` int DEFAULT NULL,
  `sizeThumb` int DEFAULT NULL,
  `width` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `exifData` json DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `featured` tinyint(1) DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `isPublic` tinyint(1) DEFAULT '1',
  `thumbDataUri` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `GalleryPhoto`
--

INSERT INTO `GalleryPhoto` (`id`, `filename`, `path`, `hash`, `title`, `description`, `alt`, `tags`, `category`, `mime`, `sizeOriginal`, `sizeMedium`, `sizeThumb`, `width`, `height`, `exifData`, `location`, `featured`, `createdAt`, `isPublic`, `thumbDataUri`) VALUES
(1, 'a1b2c3d4.webp', '/uploads/gallery/a1b2c3d4.webp', 'a1b2c3d4', 'Josepe en el escenario', 'Foto en directo en sala pequeña', 'Josepe tocando en sala', 'live,portrait', 'concert', 'image/webp', 123456, 65432, 12345, 2000, 1333, '{\"camera\": \"Fujifilm X-T3\", \"aperture\": \"f/2.8\"}', 'Madrid, Spain', 1, '2024-06-15 21:30:00', 1, NULL),
(2, 'b2c3d4e5.webp', '/uploads/gallery/b2c3d4e5.webp', 'b2c3d4e5', 'Backstage', 'Charlando con el equipo', 'Backstage con el equipo', 'backstage,team', 'concert', 'image/webp', 98765, 43210, 9876, 1600, 1067, '{\"camera\": \"iPhone 12\", \"orientation\": \"landscape\"}', 'Valencia, Spain', 0, '2024-06-16 00:10:00', 1, NULL),
(3, 'c3d4e5f6.webp', '/uploads/gallery/c3d4e5f6.webp', 'c3d4e5f6', 'Festival set', 'Set en festival al atardecer', 'Josepe set festival', 'festival,sunset', 'festival', 'image/webp', 223344, 112233, 22334, 1920, 1080, NULL, 'Barcelona, Spain', 1, '2024-07-05 20:45:00', 1, NULL),
(4, 'd4e5f6g7.webp', '/uploads/gallery/d4e5f6g7.webp', 'd4e5f6g7', 'Promo cover', 'Imagen para portada de lanzamiento', 'Portada single', 'promo,cover', 'promo', 'image/webp', 54321, 32100, 5432, 1200, 1200, '{\"software\": \"Photoshop\"}', 'Madrid, Spain', 0, '2025-01-10 09:00:00', 1, NULL),
(5, 'e5f6g7h8.webp', '/uploads/gallery/e5f6g7h8.webp', 'e5f6g7h8', 'Thumb set', 'Thumbnail para lista de sets', 'Thumbnail set', 'thumb,set', 'assets', 'image/webp', 11111, 5555, 1111, 300, 300, NULL, 'Sevilla, Spain', 0, '2025-03-20 15:30:00', 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `MusicSet`
--

CREATE TABLE `MusicSet` (
  `id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `genre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subgenre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bpm` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `releaseDate` datetime DEFAULT NULL,
  `recordedAt` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mood` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tags` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `soundcloudUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mixcloudUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `youtubeUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spotifyUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `beatportUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `downloadUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `featured` tinyint(1) DEFAULT '0',
  `exclusive` tinyint(1) DEFAULT '0',
  `liveRecording` tinyint(1) DEFAULT '0',
  `quality` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'high',
  `seo_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seo_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT '1',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `coverPhotoId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `MusicSet`
--

INSERT INTO `MusicSet` (`id`, `title`, `slug`, `description`, `genre`, `subgenre`, `bpm`, `duration`, `releaseDate`, `recordedAt`, `mood`, `tags`, `soundcloudUrl`, `mixcloudUrl`, `youtubeUrl`, `spotifyUrl`, `beatportUrl`, `downloadUrl`, `featured`, `exclusive`, `liveRecording`, `quality`, `seo_title`, `seo_description`, `published`, `createdAt`, `updatedAt`, `coverPhotoId`) VALUES
(1, 'Sunset Mix 2024', 'sunset-mix-2024', 'Mix de atardecer con temas deep house', 'Deep House', 'Melodic', '120-125', '01:20:00', '2024-07-01 00:00:00', 'Studio Madrid', NULL, ' chill,deephouse', 'https://soundcloud.com/josepe/sunset', 'https://mixcloud.com/josepe/sunset', NULL, NULL, NULL, 'https://downloads.example/sunset-mix.zip', 1, 0, 1, 'high', 'Sunset Mix 2024', 'Mix para atardeceres', 1, '2024-07-01 10:00:00', '2024-07-01 10:05:00', 5),
(2, 'Peak Time Tech', 'peak-time-tech', 'Set en club con tracks energéticos', 'Tech House', 'Peak', '125-128', '00:50:00', '2025-03-10 00:00:00', 'Club Electron', NULL, 'energetic,club', 'https://soundcloud.com/josepe/peak', 'https://mixcloud.com/josepe/peak', NULL, NULL, NULL, NULL, 1, 0, 0, 'high', 'Peak Time Tech', 'Set para club', 1, '2025-03-10 00:30:00', '2025-03-10 01:00:00', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Notification`
--

CREATE TABLE `Notification` (
  `id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'info',
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'system',
  `read` tinyint(1) DEFAULT '0',
  `actionUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `expiresAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Notification`
--

INSERT INTO `Notification` (`id`, `title`, `message`, `type`, `category`, `read`, `actionUrl`, `metadata`, `expiresAt`, `createdAt`) VALUES
(1, 'Nuevo mensaje de contacto', 'Tienes un nuevo mensaje de booking.', 'info', 'booking', 0, '/admin/contacts/1', NULL, NULL, '2025-09-01 08:00:00'),
(2, 'Recordatorio evento', 'Recordatorio: Josepe Live - Sala Madrid el 2025-10-05.', 'warning', 'system', 0, NULL, '{\"eventId\": 1}', '2025-10-06 00:00:00', '2025-09-15 09:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `SiteConfig`
--

CREATE TABLE `SiteConfig` (
  `id` int NOT NULL,
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'string',
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'general',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `isPublic` tinyint(1) DEFAULT '0',
  `editable` tinyint(1) DEFAULT '1',
  `validationRules` json DEFAULT NULL,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `SiteConfig`
--

INSERT INTO `SiteConfig` (`id`, `key`, `value`, `type`, `category`, `description`, `isPublic`, `editable`, `validationRules`, `updatedAt`, `createdAt`) VALUES
(1, 'site_title', 'Josepe Live', 'string', 'general', 'Título principal del sitio', 1, 1, NULL, '2025-09-12 11:00:00', '2025-09-12 11:00:00'),
(2, 'contact_email', 'booking@josepe.example', 'string', 'general', 'Email de contacto para reservas', 0, 1, NULL, '2025-09-12 11:05:00', '2025-09-12 11:05:00'),
(3, 'ga_measurement_id', 'G-XXXXXXX', 'string', 'analytics', 'Google Analytics Measurement ID', 0, 1, NULL, '2025-09-12 11:10:00', '2025-09-12 11:10:00'),
(4, 'homepage_show_featured', 'true', 'boolean', 'appearance', 'Mostrar sección de destacados en home', 1, 1, '{\"required\": true}', '2025-09-12 11:12:00', '2025-09-12 11:12:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Track`
--

CREATE TABLE `Track` (
  `id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `artist` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `album` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `label` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year` int DEFAULT NULL,
  `genre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bpm` int DEFAULT NULL,
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `durationSeconds` int DEFAULT NULL,
  `position` int DEFAULT NULL,
  `startTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `transition` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spotifyId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `beatportId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `setId` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Track`
--

INSERT INTO `Track` (`id`, `title`, `artist`, `album`, `label`, `year`, `genre`, `bpm`, `key`, `duration`, `durationSeconds`, `position`, `startTime`, `endTime`, `notes`, `transition`, `spotifyId`, `beatportId`, `setId`, `createdAt`) VALUES
(1, 'Opening Groove', 'Artist A', 'Album X', 'Label One', 2020, 'Deep House', 122, 'A minor', '05:20', 320, 1, '00:00', '05:20', 'Intro suave', 'blend', NULL, NULL, 1, '2024-07-01 10:01:00'),
(2, 'Late Sunset', 'Artist B', 'Single Y', 'Label Two', 2021, 'Deep House', 123, 'C minor', '06:05', 365, 2, '05:20', '11:25', 'Melodía vocal', 'cut', NULL, NULL, 1, '2024-07-01 10:02:00'),
(3, 'Drive Beat', 'Artist C', NULL, 'Label Three', 2019, 'Tech House', 126, 'D minor', '04:30', 270, 1, '00:00', '04:30', 'Track potente', 'hard', NULL, NULL, 2, '2025-03-10 00:35:00'),
(4, 'Peak Energy', 'Artist D', NULL, 'Label Four', 2018, 'Tech House', 127, 'E minor', '05:00', 300, 2, '04:30', '09:30', 'Subida principal', 'mix', NULL, NULL, 2, '2025-03-10 00:36:00'),
(5, 'Chill Outro', 'Artist A', 'Album X', 'Label One', 2020, 'Downtempo', 110, 'G major', '03:45', 225, 3, '11:25', '15:10', 'Cierre suave', 'fade', NULL, NULL, 1, '2024-07-01 10:03:00'),
(6, 'Bonus Track', 'Artist E', NULL, 'Indie Label', 2022, 'Electronic', 120, 'F minor', '04:00', 240, 3, '09:30', '13:30', 'Track extra', 'cut', NULL, NULL, 2, '2025-03-10 00:40:00');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Analytics`
--
ALTER TABLE `Analytics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_analytics_metric` (`metric`),
  ADD KEY `idx_analytics_date` (`date`),
  ADD KEY `idx_analytics_page` (`page`),
  ADD KEY `idx_analytics_country` (`country`),
  ADD KEY `idx_analytics_device` (`device`);

--
-- Indices de la tabla `BlogComment`
--
ALTER TABLE `BlogComment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_blogcomment_postid` (`postId`),
  ADD KEY `idx_blogcomment_approved` (`approved`),
  ADD KEY `idx_blogcomment_createdat` (`createdAt`),
  ADD KEY `fk_blogcomment_parent` (`parentId`);

--
-- Indices de la tabla `BlogPost`
--
ALTER TABLE `BlogPost`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_blogpost_slug` (`slug`),
  ADD KEY `idx_blogpost_status` (`status`),
  ADD KEY `idx_blogpost_featured` (`featured`),
  ADD KEY `idx_blogpost_publishedat` (`publishedAt`),
  ADD KEY `fk_blogpost_coverphoto` (`coverPhotoId`);

--
-- Indices de la tabla `ContactMessage`
--
ALTER TABLE `ContactMessage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_contactmessage_status` (`status`),
  ADD KEY `idx_contactmessage_type` (`type`),
  ADD KEY `idx_contactmessage_priority` (`priority`),
  ADD KEY `idx_contactmessage_createdat` (`createdAt`),
  ADD KEY `idx_contactmessage_read` (`read`);

--
-- Indices de la tabla `DJAuth`
--
ALTER TABLE `DJAuth`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `Event`
--
ALTER TABLE `Event`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_event_date` (`date`),
  ADD KEY `idx_event_status` (`status`),
  ADD KEY `idx_event_featured` (`featured`),
  ADD KEY `idx_event_city` (`city`),
  ADD KEY `idx_event_eventtype` (`eventType`),
  ADD KEY `idx_event_slug` (`slug`),
  ADD KEY `fk_event_coverphoto` (`coverPhotoId`);

--
-- Indices de la tabla `GalleryPhoto`
--
ALTER TABLE `GalleryPhoto`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `hash` (`hash`),
  ADD KEY `idx_galleryphoto_createdat` (`createdAt`),
  ADD KEY `idx_galleryphoto_category` (`category`),
  ADD KEY `idx_galleryphoto_featured` (`featured`),
  ADD KEY `idx_galleryphoto_ispublic` (`isPublic`);

--
-- Indices de la tabla `MusicSet`
--
ALTER TABLE `MusicSet`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_musicset_releasedate` (`releaseDate`),
  ADD KEY `idx_musicset_genre` (`genre`),
  ADD KEY `idx_musicset_featured` (`featured`),
  ADD KEY `idx_musicset_published` (`published`),
  ADD KEY `idx_musicset_slug` (`slug`),
  ADD KEY `fk_musicset_coverphoto` (`coverPhotoId`);

--
-- Indices de la tabla `Notification`
--
ALTER TABLE `Notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notification_read` (`read`),
  ADD KEY `idx_notification_type` (`type`),
  ADD KEY `idx_notification_createdat` (`createdAt`),
  ADD KEY `idx_notification_expiresat` (`expiresAt`);

--
-- Indices de la tabla `SiteConfig`
--
ALTER TABLE `SiteConfig`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key` (`key`),
  ADD KEY `idx_siteconfig_category` (`category`),
  ADD KEY `idx_siteconfig_key` (`key`);

--
-- Indices de la tabla `Track`
--
ALTER TABLE `Track`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_track_setid` (`setId`),
  ADD KEY `idx_track_position` (`position`),
  ADD KEY `idx_track_artist` (`artist`),
  ADD KEY `idx_track_genre` (`genre`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Analytics`
--
ALTER TABLE `Analytics`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `BlogComment`
--
ALTER TABLE `BlogComment`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `BlogPost`
--
ALTER TABLE `BlogPost`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `ContactMessage`
--
ALTER TABLE `ContactMessage`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `DJAuth`
--
ALTER TABLE `DJAuth`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `Event`
--
ALTER TABLE `Event`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `GalleryPhoto`
--
ALTER TABLE `GalleryPhoto`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `MusicSet`
--
ALTER TABLE `MusicSet`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `Notification`
--
ALTER TABLE `Notification`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `SiteConfig`
--
ALTER TABLE `SiteConfig`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `Track`
--
ALTER TABLE `Track`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `BlogComment`
--
ALTER TABLE `BlogComment`
  ADD CONSTRAINT `fk_blogcomment_parent` FOREIGN KEY (`parentId`) REFERENCES `BlogComment` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_blogcomment_post` FOREIGN KEY (`postId`) REFERENCES `BlogPost` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `BlogPost`
--
ALTER TABLE `BlogPost`
  ADD CONSTRAINT `fk_blogpost_coverphoto` FOREIGN KEY (`coverPhotoId`) REFERENCES `GalleryPhoto` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `Event`
--
ALTER TABLE `Event`
  ADD CONSTRAINT `fk_event_coverphoto` FOREIGN KEY (`coverPhotoId`) REFERENCES `GalleryPhoto` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `MusicSet`
--
ALTER TABLE `MusicSet`
  ADD CONSTRAINT `fk_musicset_coverphoto` FOREIGN KEY (`coverPhotoId`) REFERENCES `GalleryPhoto` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `Track`
--
ALTER TABLE `Track`
  ADD CONSTRAINT `fk_track_set` FOREIGN KEY (`setId`) REFERENCES `MusicSet` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
