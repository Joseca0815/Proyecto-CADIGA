-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: infraestructura_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Juan_Secret','seto@ejemplo.com','$2b$10$syyzV71SzHjtOTYB9j628OgfJokCLYdSA/xULCbBv9XouBDSnlrHG','2026-06-05 07:48:41'),(4,'Juan_Secrdt','seto@ejdplo.com','mipassdord_seguro','2026-06-05 08:53:46'),(5,'Saturnino','Saturnino@ejemplo.com','mipassdddrd_seguro','2026-06-12 05:07:32'),(6,'Juan_Sddddddt','seto@dddddddjplo.com','mipasddsdddrd_seguro','2026-06-12 05:12:07'),(7,'Jossse Pedddddd','Pedro@ejedddsssslo.com','passworddd1111','2026-06-12 05:12:16'),(9,'Jossse Pesssssssd','Pedro@ejedddssssssslo.com','passworddssd1111','2026-06-12 05:47:55'),(11,'Juan_Sddddddddt','seto@ddddddddsdjplo.com','mipasddsdddddrd_seguro','2026-06-12 05:56:01'),(12,'Juan_Sicritito','seto@ddddddssddsdjplo.com','mipasddsssecrettttdrd_seguro','2026-06-12 05:56:33'),(14,'Jossse Pessssssd','Pedro@ejedddsddssssslo.com','passworddsdd1111','2026-06-12 06:04:51'),(16,'Jossse EstoyartoJefe','sss@gmail.com','$2b$10$z.gcD3jZs.vUNxonSGpzNeTAMFWO/mj2EVgTYc9RCObFFuq6iLylG','2026-06-12 06:10:16'),(17,'Juan_Sicrititos','seto@ddddddssdds.com','$2b$10$ADpaYxIa2wzC/f06051rSOtm6kX9O2GpNeyC3utjnD5DY60TX0y..','2026-06-12 06:11:10');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-12  6:16:36
