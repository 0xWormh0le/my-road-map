/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MariaDB
 Source Server Version : 100419
 Source Host           : localhost:3306
 Source Schema         : myroadmap

 Target Server Type    : MariaDB
 Target Server Version : 100419
 File Encoding         : 65001

 Date: 21/06/2021 14:39:12
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for api_peertopeermessage
-- ----------------------------
DROP TABLE IF EXISTS `api_peertopeermessage`;
CREATE TABLE `api_peertopeermessage`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(4096) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` bigint(20) NOT NULL,
  `latest` tinyint(1) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `api_peertopeermessage_receiver_id_41fc4eb8_fk_dashboard_user_id`(`receiver_id`) USING BTREE,
  INDEX `api_peertopeermessage_sender_id_b57683b9_fk_dashboard_user_id`(`sender_id`) USING BTREE,
  CONSTRAINT `api_peertopeermessage_receiver_id_41fc4eb8_fk_dashboard_user_id` FOREIGN KEY (`receiver_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `api_peertopeermessage_sender_id_b57683b9_fk_dashboard_user_id` FOREIGN KEY (`sender_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 37 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of api_peertopeermessage
-- ----------------------------
INSERT INTO `api_peertopeermessage` VALUES (1, 'asdfsadf', 12324235235, 1, 16, 22);
INSERT INTO `api_peertopeermessage` VALUES (4, '234', 12324235235, 1, 16, 22);
INSERT INTO `api_peertopeermessage` VALUES (6, '44', 12324235235, 1, 16, 22);
INSERT INTO `api_peertopeermessage` VALUES (7, '222', 12324235235, 1, 16, 22);
INSERT INTO `api_peertopeermessage` VALUES (8, '555', 12324235235, 1, 16, 22);
INSERT INTO `api_peertopeermessage` VALUES (10, '12312', 12324235235, 1, 16, 22);
INSERT INTO `api_peertopeermessage` VALUES (11, 'edfwa', 12324235235, 1, 16, 22);
INSERT INTO `api_peertopeermessage` VALUES (12, '54', 12324235235, 1, 16, 22);
INSERT INTO `api_peertopeermessage` VALUES (13, 'tttttttttt', 1615489797892, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (14, 'ertertert', 1615552091688, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (15, 'ertert', 1615552093174, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (16, 'erter', 1615552094266, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (17, 'rtert', 1615552095162, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (18, 'erte', 1615552096125, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (19, 'rtertert', 1615552097408, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (20, 'ertert', 1615552098728, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (21, 'ertertert', 1615552100260, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (22, 'ertertert', 1615552102008, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (23, '345345345345', 1615552105102, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (24, '345345345', 1615552107605, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (25, 'trtrtrtrtrtrt', 1615552161632, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (26, 'werwer', 1615552165766, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (27, 'werwer', 1615552168211, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (28, 'sddddddddddddddddddddddddddddddddddddddfwerwer werwerwersdfqwerqesdsdf', 1616033562694, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (29, 'asdas wqeqweqwe qweqwasdaszxcqwe qweqweqweqweqweqwe', 1616036620816, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (30, 'ccccccccccccccccccccccccccccccccccccccccccccccccqweqwe qw qweqweqwe', 1616036669605, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (31, 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd', 1616036676502, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (32, '23432rfefsdf', 1616614252501, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (33, 'sdfaasdf', 1616614259941, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (34, 'asdfffffffffffffffffffffffffffffffasdfffffffffffffffffffffffffffffffasdfffffffffffffffffffffffffffffffasdfffffffffffffffffffffffffffffffasdfffffffffffffffffffffffffffffffasdfffffffffffffffffffffffffffffff', 1616615032918, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (35, 'fgdsfg', 1616705477930, 0, 23, 22);
INSERT INTO `api_peertopeermessage` VALUES (36, '\';l\'', 1616705494658, 1, 23, 22);

-- ----------------------------
-- Table structure for api_recentcompetency
-- ----------------------------
DROP TABLE IF EXISTS `api_recentcompetency`;
CREATE TABLE `api_recentcompetency`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `competency_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `api_recentcompetency_competency_id_64f23f93_fk_dashboard`(`competency_id`) USING BTREE,
  INDEX `api_recentcompetency_user_id_be67b6d7_fk_dashboard_user_id`(`user_id`) USING BTREE,
  CONSTRAINT `api_recentcompetency_competency_id_64f23f93_fk_dashboard` FOREIGN KEY (`competency_id`) REFERENCES `dashboard_competency` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `api_recentcompetency_user_id_be67b6d7_fk_dashboard_user_id` FOREIGN KEY (`user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2019 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of api_recentcompetency
-- ----------------------------
INSERT INTO `api_recentcompetency` VALUES (618, 13, 23);
INSERT INTO `api_recentcompetency` VALUES (1494, 13, 22);
INSERT INTO `api_recentcompetency` VALUES (1725, 37, 22);
INSERT INTO `api_recentcompetency` VALUES (2018, 35, 22);

-- ----------------------------
-- Table structure for auth_group
-- ----------------------------
DROP TABLE IF EXISTS `auth_group`;
CREATE TABLE `auth_group`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_group
-- ----------------------------
INSERT INTO `auth_group` VALUES (3, 'Admin');
INSERT INTO `auth_group` VALUES (2, 'Coach');
INSERT INTO `auth_group` VALUES (1, 'User');

-- ----------------------------
-- Table structure for auth_group_permissions
-- ----------------------------
DROP TABLE IF EXISTS `auth_group_permissions`;
CREATE TABLE `auth_group_permissions`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `auth_group_permissions_group_id_permission_id_0cd325b0_uniq`(`group_id`, `permission_id`) USING BTREE,
  INDEX `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm`(`permission_id`) USING BTREE,
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_group_permissions
-- ----------------------------

-- ----------------------------
-- Table structure for auth_permission
-- ----------------------------
DROP TABLE IF EXISTS `auth_permission`;
CREATE TABLE `auth_permission`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `auth_permission_content_type_id_codename_01ab375a_uniq`(`content_type_id`, `codename`) USING BTREE,
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 153 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_permission
-- ----------------------------
INSERT INTO `auth_permission` VALUES (1, 'Can add notification', 3, 'add_notification');
INSERT INTO `auth_permission` VALUES (2, 'Can change notification', 3, 'change_notification');
INSERT INTO `auth_permission` VALUES (3, 'Can delete notification', 3, 'delete_notification');
INSERT INTO `auth_permission` VALUES (4, 'Can view notification', 3, 'view_notification');
INSERT INTO `auth_permission` VALUES (5, 'Can add notice type', 4, 'add_noticetype');
INSERT INTO `auth_permission` VALUES (6, 'Can change notice type', 4, 'change_noticetype');
INSERT INTO `auth_permission` VALUES (7, 'Can delete notice type', 4, 'delete_noticetype');
INSERT INTO `auth_permission` VALUES (8, 'Can view notice type', 4, 'view_noticetype');
INSERT INTO `auth_permission` VALUES (9, 'Can add user', 5, 'add_user');
INSERT INTO `auth_permission` VALUES (10, 'Can change user', 5, 'change_user');
INSERT INTO `auth_permission` VALUES (11, 'Can delete user', 5, 'delete_user');
INSERT INTO `auth_permission` VALUES (12, 'Can view user', 5, 'view_user');
INSERT INTO `auth_permission` VALUES (13, 'Can add action item assessment', 6, 'add_actionitemassessment');
INSERT INTO `auth_permission` VALUES (14, 'Can change action item assessment', 6, 'change_actionitemassessment');
INSERT INTO `auth_permission` VALUES (15, 'Can delete action item assessment', 6, 'delete_actionitemassessment');
INSERT INTO `auth_permission` VALUES (16, 'Can view action item assessment', 6, 'view_actionitemassessment');
INSERT INTO `auth_permission` VALUES (17, 'Can add Action Item', 7, 'add_actionitemglobal');
INSERT INTO `auth_permission` VALUES (18, 'Can change Action Item', 7, 'change_actionitemglobal');
INSERT INTO `auth_permission` VALUES (19, 'Can delete Action Item', 7, 'delete_actionitemglobal');
INSERT INTO `auth_permission` VALUES (20, 'Can view Action Item', 7, 'view_actionitemglobal');
INSERT INTO `auth_permission` VALUES (21, 'Can add assessment', 8, 'add_assessment');
INSERT INTO `auth_permission` VALUES (22, 'Can change assessment', 8, 'change_assessment');
INSERT INTO `auth_permission` VALUES (23, 'Can delete assessment', 8, 'delete_assessment');
INSERT INTO `auth_permission` VALUES (24, 'Can view assessment', 8, 'view_assessment');
INSERT INTO `auth_permission` VALUES (25, 'Can add cohort', 9, 'add_cohort');
INSERT INTO `auth_permission` VALUES (26, 'Can change cohort', 9, 'change_cohort');
INSERT INTO `auth_permission` VALUES (27, 'Can delete cohort', 9, 'delete_cohort');
INSERT INTO `auth_permission` VALUES (28, 'Can view cohort', 9, 'view_cohort');
INSERT INTO `auth_permission` VALUES (29, 'Can add comment', 10, 'add_comment');
INSERT INTO `auth_permission` VALUES (30, 'Can change comment', 10, 'change_comment');
INSERT INTO `auth_permission` VALUES (31, 'Can delete comment', 10, 'delete_comment');
INSERT INTO `auth_permission` VALUES (32, 'Can view comment', 10, 'view_comment');
INSERT INTO `auth_permission` VALUES (33, 'Can add company', 11, 'add_company');
INSERT INTO `auth_permission` VALUES (34, 'Can change company', 11, 'change_company');
INSERT INTO `auth_permission` VALUES (35, 'Can delete company', 11, 'delete_company');
INSERT INTO `auth_permission` VALUES (36, 'Can view company', 11, 'view_company');
INSERT INTO `auth_permission` VALUES (37, 'Can add competency', 12, 'add_competency');
INSERT INTO `auth_permission` VALUES (38, 'Can change competency', 12, 'change_competency');
INSERT INTO `auth_permission` VALUES (39, 'Can delete competency', 12, 'delete_competency');
INSERT INTO `auth_permission` VALUES (40, 'Can view competency', 12, 'view_competency');
INSERT INTO `auth_permission` VALUES (41, 'Can add roadmap', 13, 'add_roadmap');
INSERT INTO `auth_permission` VALUES (42, 'Can change roadmap', 13, 'change_roadmap');
INSERT INTO `auth_permission` VALUES (43, 'Can delete roadmap', 13, 'delete_roadmap');
INSERT INTO `auth_permission` VALUES (44, 'Can view roadmap', 13, 'view_roadmap');
INSERT INTO `auth_permission` VALUES (45, 'Can add stage', 14, 'add_stage');
INSERT INTO `auth_permission` VALUES (46, 'Can change stage', 14, 'change_stage');
INSERT INTO `auth_permission` VALUES (47, 'Can delete stage', 14, 'delete_stage');
INSERT INTO `auth_permission` VALUES (48, 'Can view stage', 14, 'view_stage');
INSERT INTO `auth_permission` VALUES (49, 'Can add note', 15, 'add_note');
INSERT INTO `auth_permission` VALUES (50, 'Can change note', 15, 'change_note');
INSERT INTO `auth_permission` VALUES (51, 'Can delete note', 15, 'delete_note');
INSERT INTO `auth_permission` VALUES (52, 'Can view note', 15, 'view_note');
INSERT INTO `auth_permission` VALUES (53, 'Can add attachment', 16, 'add_attachment');
INSERT INTO `auth_permission` VALUES (54, 'Can change attachment', 16, 'change_attachment');
INSERT INTO `auth_permission` VALUES (55, 'Can delete attachment', 16, 'delete_attachment');
INSERT INTO `auth_permission` VALUES (56, 'Can view attachment', 16, 'view_attachment');
INSERT INTO `auth_permission` VALUES (57, 'Can add roadmap assignment', 17, 'add_roadmapassignment');
INSERT INTO `auth_permission` VALUES (58, 'Can change roadmap assignment', 17, 'change_roadmapassignment');
INSERT INTO `auth_permission` VALUES (59, 'Can delete roadmap assignment', 17, 'delete_roadmapassignment');
INSERT INTO `auth_permission` VALUES (60, 'Can view roadmap assignment', 17, 'view_roadmapassignment');
INSERT INTO `auth_permission` VALUES (61, 'Can add question answer', 18, 'add_questionanswer');
INSERT INTO `auth_permission` VALUES (62, 'Can change question answer', 18, 'change_questionanswer');
INSERT INTO `auth_permission` VALUES (63, 'Can delete question answer', 18, 'delete_questionanswer');
INSERT INTO `auth_permission` VALUES (64, 'Can view question answer', 18, 'view_questionanswer');
INSERT INTO `auth_permission` VALUES (65, 'Can add Question', 19, 'add_questionglobal');
INSERT INTO `auth_permission` VALUES (66, 'Can change Question', 19, 'change_questionglobal');
INSERT INTO `auth_permission` VALUES (67, 'Can delete Question', 19, 'delete_questionglobal');
INSERT INTO `auth_permission` VALUES (68, 'Can view Question', 19, 'view_questionglobal');
INSERT INTO `auth_permission` VALUES (69, 'Can add content global', 20, 'add_contentglobal');
INSERT INTO `auth_permission` VALUES (70, 'Can change content global', 20, 'change_contentglobal');
INSERT INTO `auth_permission` VALUES (71, 'Can delete content global', 20, 'delete_contentglobal');
INSERT INTO `auth_permission` VALUES (72, 'Can view content global', 20, 'view_contentglobal');
INSERT INTO `auth_permission` VALUES (73, 'Can add content response', 21, 'add_contentresponse');
INSERT INTO `auth_permission` VALUES (74, 'Can change content response', 21, 'change_contentresponse');
INSERT INTO `auth_permission` VALUES (75, 'Can delete content response', 21, 'delete_contentresponse');
INSERT INTO `auth_permission` VALUES (76, 'Can view content response', 21, 'view_contentresponse');
INSERT INTO `auth_permission` VALUES (77, 'Can add follow up item', 22, 'add_followupitem');
INSERT INTO `auth_permission` VALUES (78, 'Can change follow up item', 22, 'change_followupitem');
INSERT INTO `auth_permission` VALUES (79, 'Can delete follow up item', 22, 'delete_followupitem');
INSERT INTO `auth_permission` VALUES (80, 'Can view follow up item', 22, 'view_followupitem');
INSERT INTO `auth_permission` VALUES (81, 'Can add assigned roadmap', 23, 'add_assignedroadmap');
INSERT INTO `auth_permission` VALUES (82, 'Can change assigned roadmap', 23, 'change_assignedroadmap');
INSERT INTO `auth_permission` VALUES (83, 'Can delete assigned roadmap', 23, 'delete_assignedroadmap');
INSERT INTO `auth_permission` VALUES (84, 'Can view assigned roadmap', 23, 'view_assignedroadmap');
INSERT INTO `auth_permission` VALUES (85, 'Can add assigned company', 24, 'add_assignedcompany');
INSERT INTO `auth_permission` VALUES (86, 'Can change assigned company', 24, 'change_assignedcompany');
INSERT INTO `auth_permission` VALUES (87, 'Can delete assigned company', 24, 'delete_assignedcompany');
INSERT INTO `auth_permission` VALUES (88, 'Can view assigned company', 24, 'view_assignedcompany');
INSERT INTO `auth_permission` VALUES (89, 'Can add log entry', 25, 'add_logentry');
INSERT INTO `auth_permission` VALUES (90, 'Can change log entry', 25, 'change_logentry');
INSERT INTO `auth_permission` VALUES (91, 'Can delete log entry', 25, 'delete_logentry');
INSERT INTO `auth_permission` VALUES (92, 'Can view log entry', 25, 'view_logentry');
INSERT INTO `auth_permission` VALUES (93, 'Can add permission', 26, 'add_permission');
INSERT INTO `auth_permission` VALUES (94, 'Can change permission', 26, 'change_permission');
INSERT INTO `auth_permission` VALUES (95, 'Can delete permission', 26, 'delete_permission');
INSERT INTO `auth_permission` VALUES (96, 'Can view permission', 26, 'view_permission');
INSERT INTO `auth_permission` VALUES (97, 'Can add group', 27, 'add_group');
INSERT INTO `auth_permission` VALUES (98, 'Can change group', 27, 'change_group');
INSERT INTO `auth_permission` VALUES (99, 'Can delete group', 27, 'delete_group');
INSERT INTO `auth_permission` VALUES (100, 'Can view group', 27, 'view_group');
INSERT INTO `auth_permission` VALUES (101, 'Can add content type', 28, 'add_contenttype');
INSERT INTO `auth_permission` VALUES (102, 'Can change content type', 28, 'change_contenttype');
INSERT INTO `auth_permission` VALUES (103, 'Can delete content type', 28, 'delete_contenttype');
INSERT INTO `auth_permission` VALUES (104, 'Can view content type', 28, 'view_contenttype');
INSERT INTO `auth_permission` VALUES (105, 'Can add session', 29, 'add_session');
INSERT INTO `auth_permission` VALUES (106, 'Can change session', 29, 'change_session');
INSERT INTO `auth_permission` VALUES (107, 'Can delete session', 29, 'delete_session');
INSERT INTO `auth_permission` VALUES (108, 'Can view session', 29, 'view_session');
INSERT INTO `auth_permission` VALUES (109, 'Can add site', 30, 'add_site');
INSERT INTO `auth_permission` VALUES (110, 'Can change site', 30, 'change_site');
INSERT INTO `auth_permission` VALUES (111, 'Can delete site', 30, 'delete_site');
INSERT INTO `auth_permission` VALUES (112, 'Can view site', 30, 'view_site');
INSERT INTO `auth_permission` VALUES (113, 'Can add message', 1, 'add_message');
INSERT INTO `auth_permission` VALUES (114, 'Can change message', 1, 'change_message');
INSERT INTO `auth_permission` VALUES (115, 'Can delete message', 1, 'delete_message');
INSERT INTO `auth_permission` VALUES (116, 'Can view message', 1, 'view_message');
INSERT INTO `auth_permission` VALUES (117, 'Can add pending message', 2, 'add_pendingmessage');
INSERT INTO `auth_permission` VALUES (118, 'Can change pending message', 2, 'change_pendingmessage');
INSERT INTO `auth_permission` VALUES (119, 'Can delete pending message', 2, 'delete_pendingmessage');
INSERT INTO `auth_permission` VALUES (120, 'Can view pending message', 2, 'view_pendingmessage');
INSERT INTO `auth_permission` VALUES (121, 'Can add APNS device', 31, 'add_apnsdevice');
INSERT INTO `auth_permission` VALUES (122, 'Can change APNS device', 31, 'change_apnsdevice');
INSERT INTO `auth_permission` VALUES (123, 'Can delete APNS device', 31, 'delete_apnsdevice');
INSERT INTO `auth_permission` VALUES (124, 'Can view APNS device', 31, 'view_apnsdevice');
INSERT INTO `auth_permission` VALUES (125, 'Can add GCM device', 32, 'add_gcmdevice');
INSERT INTO `auth_permission` VALUES (126, 'Can change GCM device', 32, 'change_gcmdevice');
INSERT INTO `auth_permission` VALUES (127, 'Can delete GCM device', 32, 'delete_gcmdevice');
INSERT INTO `auth_permission` VALUES (128, 'Can view GCM device', 32, 'view_gcmdevice');
INSERT INTO `auth_permission` VALUES (129, 'Can add WNS device', 33, 'add_wnsdevice');
INSERT INTO `auth_permission` VALUES (130, 'Can change WNS device', 33, 'change_wnsdevice');
INSERT INTO `auth_permission` VALUES (131, 'Can delete WNS device', 33, 'delete_wnsdevice');
INSERT INTO `auth_permission` VALUES (132, 'Can view WNS device', 33, 'view_wnsdevice');
INSERT INTO `auth_permission` VALUES (133, 'Can add WebPush device', 34, 'add_webpushdevice');
INSERT INTO `auth_permission` VALUES (134, 'Can change WebPush device', 34, 'change_webpushdevice');
INSERT INTO `auth_permission` VALUES (135, 'Can delete WebPush device', 34, 'delete_webpushdevice');
INSERT INTO `auth_permission` VALUES (136, 'Can view WebPush device', 34, 'view_webpushdevice');
INSERT INTO `auth_permission` VALUES (137, 'Can add Token', 35, 'add_token');
INSERT INTO `auth_permission` VALUES (138, 'Can change Token', 35, 'change_token');
INSERT INTO `auth_permission` VALUES (139, 'Can delete Token', 35, 'delete_token');
INSERT INTO `auth_permission` VALUES (140, 'Can view Token', 35, 'view_token');
INSERT INTO `auth_permission` VALUES (141, 'Can add recent competency', 36, 'add_recentcompetency');
INSERT INTO `auth_permission` VALUES (142, 'Can change recent competency', 36, 'change_recentcompetency');
INSERT INTO `auth_permission` VALUES (143, 'Can delete recent competency', 36, 'delete_recentcompetency');
INSERT INTO `auth_permission` VALUES (144, 'Can view recent competency', 36, 'view_recentcompetency');
INSERT INTO `auth_permission` VALUES (145, 'Can add peer last read message timestamp', 37, 'add_peerlastreadmessagetimestamp');
INSERT INTO `auth_permission` VALUES (146, 'Can change peer last read message timestamp', 37, 'change_peerlastreadmessagetimestamp');
INSERT INTO `auth_permission` VALUES (147, 'Can delete peer last read message timestamp', 37, 'delete_peerlastreadmessagetimestamp');
INSERT INTO `auth_permission` VALUES (148, 'Can view peer last read message timestamp', 37, 'view_peerlastreadmessagetimestamp');
INSERT INTO `auth_permission` VALUES (149, 'Can add peer to peer message', 38, 'add_peertopeermessage');
INSERT INTO `auth_permission` VALUES (150, 'Can change peer to peer message', 38, 'change_peertopeermessage');
INSERT INTO `auth_permission` VALUES (151, 'Can delete peer to peer message', 38, 'delete_peertopeermessage');
INSERT INTO `auth_permission` VALUES (152, 'Can view peer to peer message', 38, 'view_peertopeermessage');

-- ----------------------------
-- Table structure for authtoken_token
-- ----------------------------
DROP TABLE IF EXISTS `authtoken_token`;
CREATE TABLE `authtoken_token`  (
  `key` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`key`) USING BTREE,
  UNIQUE INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `authtoken_token_user_id_35299eff_fk_dashboard_user_id` FOREIGN KEY (`user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of authtoken_token
-- ----------------------------
INSERT INTO `authtoken_token` VALUES ('1fed112911380338a45b15fd15045821322bf0eb', '2020-11-10 18:35:07.896462', 23);
INSERT INTO `authtoken_token` VALUES ('616a3109a8c14d80dfaaa50af19584125eb547ba', '2020-11-10 13:20:27.879599', 2);
INSERT INTO `authtoken_token` VALUES ('7b186f6dff51a6178663dc54bf990af3e4ea4f01', '2020-11-10 13:20:31.509062', 8);
INSERT INTO `authtoken_token` VALUES ('80b12cfa00961d6fa633ac5e3b1b7b9ed027515f', '2021-03-11 00:28:42.228696', 43);
INSERT INTO `authtoken_token` VALUES ('83cf3d8846ca15d249d05edb3e20d4c64044284f', '2020-11-10 15:55:01.714451', 22);
INSERT INTO `authtoken_token` VALUES ('b3bab551671444c53d6f0a6d6b43eec71386f160', '2020-12-25 13:57:27.884495', 29);
INSERT INTO `authtoken_token` VALUES ('c49e328f8105aa6d7b7e591ff0846c3a0e77f864', '2020-11-10 15:07:19.363590', 1);
INSERT INTO `authtoken_token` VALUES ('faaadb7d75ecea4c2a615523a6d6e3299f736c13', '2020-11-18 21:43:52.955394', 4);

-- ----------------------------
-- Table structure for dashboard_actionitemassessment
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_actionitemassessment`;
CREATE TABLE `dashboard_actionitemassessment`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `due_date` date NULL DEFAULT NULL,
  `marked_done` tinyint(1) NOT NULL,
  `date_marked_done` date NULL DEFAULT NULL,
  `approved_done` tinyint(1) NOT NULL,
  `date_approved_done` date NULL DEFAULT NULL,
  `archived` tinyint(1) NOT NULL,
  `competency_id` int(11) NULL DEFAULT NULL,
  `parent_id` int(11) NULL DEFAULT NULL,
  `student_id` int(11) NOT NULL,
  `notes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `order` int(11) NOT NULL,
  `send_follow_up_email_on_due_date` tinyint(1) NOT NULL,
  `assessmentAttachment` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `assessmentAudio` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `assessmentScreen` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `dashboard_actionitemasse_student_id_parent_id_5ad19b78_uniq`(`student_id`, `parent_id`) USING BTREE,
  INDEX `dashboard_actionitem_competency_id_6f888595_fk_dashboard`(`competency_id`) USING BTREE,
  INDEX `dashboard_actionitem_parent_id_4a84fe44_fk_dashboard`(`parent_id`) USING BTREE,
  CONSTRAINT `dashboard_actionitem_competency_id_6f888595_fk_dashboard` FOREIGN KEY (`competency_id`) REFERENCES `dashboard_competency` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_actionitem_parent_id_4a84fe44_fk_dashboard` FOREIGN KEY (`parent_id`) REFERENCES `dashboard_actionitemglobal` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_actionitem_student_id_51227fbe_fk_dashboard` FOREIGN KEY (`student_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_actionitemassessment
-- ----------------------------
INSERT INTO `dashboard_actionitemassessment` VALUES (1, 'test', '2021-02-26', 0, NULL, 0, NULL, 0, 13, NULL, 22, NULL, 0, 1, '', '', '');
INSERT INTO `dashboard_actionitemassessment` VALUES (2, 'aaaaa', '2021-02-19', 0, NULL, 0, NULL, 0, 26, NULL, 22, NULL, 0, 1, '', '', '');
INSERT INTO `dashboard_actionitemassessment` VALUES (3, 'sadf', '2021-02-21', 0, NULL, 0, NULL, 0, 25, NULL, 22, NULL, 0, 1, '', '', '');
INSERT INTO `dashboard_actionitemassessment` VALUES (4, 'asdfsdf', '2021-02-25', 0, NULL, 0, NULL, 0, 35, NULL, 22, NULL, 0, 1, '', '', '');

-- ----------------------------
-- Table structure for dashboard_actionitemglobal
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_actionitemglobal`;
CREATE TABLE `dashboard_actionitemglobal`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `due_date` date NULL DEFAULT NULL,
  `date_created` date NOT NULL,
  `competency_id` int(11) NOT NULL,
  `order` int(11) NOT NULL,
  `aiAttachment` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `aiDescription` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `hidden` tinyint(1) NOT NULL,
  `required` tinyint(1) NOT NULL,
  `aiTitle` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `resolutions` varchar(101) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dashboard_actionitem_competency_id_6a1eac95_fk_dashboard`(`competency_id`) USING BTREE,
  CONSTRAINT `dashboard_actionitem_competency_id_6a1eac95_fk_dashboard` FOREIGN KEY (`competency_id`) REFERENCES `dashboard_competency` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_actionitemglobal
-- ----------------------------
INSERT INTO `dashboard_actionitemglobal` VALUES (9, NULL, '2021-02-25', 13, 0, '', '<p>werwerwer</p>', '', 0, 0, 'werwer', 'mark_complete');
INSERT INTO `dashboard_actionitemglobal` VALUES (10, NULL, '2021-02-28', 13, 0, '', '<p>dfgdfgdfg</p>', '', 0, 0, 'dfgdf', 'mark_complete');

-- ----------------------------
-- Table structure for dashboard_actionitemglobal_cohort
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_actionitemglobal_cohort`;
CREATE TABLE `dashboard_actionitemglobal_cohort`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `actionitemglobal_id` int(11) NOT NULL,
  `cohort_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `dashboard_actionitemglob_actionitemglobal_id_coho_599f3f3e_uniq`(`actionitemglobal_id`, `cohort_id`) USING BTREE,
  INDEX `dashboard_actionitem_cohort_id_d96fd91e_fk_dashboard`(`cohort_id`) USING BTREE,
  CONSTRAINT `dashboard_actionitem_actionitemglobal_id_c6122f0b_fk_dashboard` FOREIGN KEY (`actionitemglobal_id`) REFERENCES `dashboard_actionitemglobal` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_actionitem_cohort_id_d96fd91e_fk_dashboard` FOREIGN KEY (`cohort_id`) REFERENCES `dashboard_cohort` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_actionitemglobal_cohort
-- ----------------------------

-- ----------------------------
-- Table structure for dashboard_assessment
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_assessment`;
CREATE TABLE `dashboard_assessment`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `comment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `approved` tinyint(1) NOT NULL,
  `rejected` tinyint(1) NOT NULL,
  `review_date` date NULL DEFAULT NULL,
  `competency_id` int(11) NOT NULL,
  `reviewer_id` int(11) NULL DEFAULT NULL,
  `student_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `slider_status` double NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dashboard_assessment_competency_id_12644e55_fk_dashboard`(`competency_id`) USING BTREE,
  INDEX `dashboard_assessment_reviewer_id_7f702210_fk_dashboard_user_id`(`reviewer_id`) USING BTREE,
  INDEX `dashboard_assessment_student_id_7bd821a4_fk_dashboard_user_id`(`student_id`) USING BTREE,
  INDEX `dashboard_assessment_user_id_fc118ffc_fk_dashboard_user_id`(`user_id`) USING BTREE,
  CONSTRAINT `dashboard_assessment_competency_id_12644e55_fk_dashboard` FOREIGN KEY (`competency_id`) REFERENCES `dashboard_competency` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_assessment_reviewer_id_7f702210_fk_dashboard_user_id` FOREIGN KEY (`reviewer_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_assessment_student_id_7bd821a4_fk_dashboard_user_id` FOREIGN KEY (`student_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_assessment_user_id_fc118ffc_fk_dashboard_user_id` FOREIGN KEY (`user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1065 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_assessment
-- ----------------------------
INSERT INTO `dashboard_assessment` VALUES (1, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (2, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (3, '3', '2020-11-10', '', 0, 0, NULL, 36, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (4, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (5, '1', '2020-11-10', '', 0, 0, NULL, 33, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (6, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (7, '2', '2020-11-10', '', 0, 0, NULL, 31, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (8, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (9, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (10, '3', '2020-11-10', '', 0, 0, NULL, 36, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (11, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (12, '1', '2020-11-10', '', 0, 0, NULL, 33, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (13, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (14, '2', '2020-11-10', '', 0, 0, NULL, 31, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (15, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (16, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (17, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (18, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (19, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (20, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (21, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (22, '3', '2020-11-10', '', 0, 0, NULL, 36, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (23, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (24, '1', '2020-11-10', '', 0, 0, NULL, 33, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (25, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (26, '2', '2020-11-10', '', 0, 0, NULL, 31, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (27, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (28, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (29, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (30, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (31, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (32, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (33, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (34, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (35, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (36, '3', '2020-11-10', '', 0, 0, NULL, 28, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (37, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (38, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (39, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (40, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (41, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (42, '3', '2020-11-10', '', 0, 0, NULL, 36, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (43, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (44, '1', '2020-11-10', '', 0, 0, NULL, 33, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (45, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (46, '2', '2020-11-10', '', 0, 0, NULL, 31, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (47, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (48, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (49, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (50, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (51, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (52, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (53, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (54, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (55, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (56, '3', '2020-11-10', '', 0, 0, NULL, 28, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (57, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (58, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (59, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (60, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (61, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (62, '1', '2020-11-10', '', 0, 0, NULL, 32, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (63, '1', '2020-11-10', '', 0, 0, NULL, 36, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (64, '3', '2020-11-10', '', 0, 0, NULL, 30, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (65, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (66, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (67, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (68, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (69, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (70, '3', '2020-11-10', '', 0, 0, NULL, 36, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (71, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (72, '1', '2020-11-10', '', 0, 0, NULL, 33, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (73, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (74, '2', '2020-11-10', '', 0, 0, NULL, 31, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (75, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (76, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (77, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (78, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (79, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (80, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (81, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (82, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (83, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (84, '3', '2020-11-10', '', 0, 0, NULL, 28, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (85, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (86, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (87, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (88, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (89, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (90, '1', '2020-11-10', '', 0, 0, NULL, 32, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (91, '1', '2020-11-10', '', 0, 0, NULL, 36, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (92, '3', '2020-11-10', '', 0, 0, NULL, 30, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (93, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (94, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (95, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (96, '2', '2020-11-10', '', 0, 0, NULL, 41, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (97, '1', '2020-11-10', '', 0, 0, NULL, 45, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (98, '3', '2020-11-10', '', 0, 0, NULL, 44, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (99, '1', '2020-11-10', '', 0, 0, NULL, 46, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (100, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (101, '1', '2020-11-10', '', 0, 0, NULL, 40, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (102, '3', '2020-11-10', '', 0, 0, NULL, 37, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (103, '1', '2020-11-10', '', 0, 0, NULL, 55, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (104, '2', '2020-11-10', '', 0, 0, NULL, 50, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (105, '1', '2020-11-10', '', 0, 0, NULL, 52, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (106, '1', '2020-11-10', '', 0, 0, NULL, 56, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (109, '2', '2020-11-10', '', 0, 0, NULL, 53, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (110, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (111, '2', '2020-11-10', '', 0, 0, NULL, 32, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (112, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (113, '1', '2020-11-10', '', 0, 0, NULL, 31, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (114, '1', '2020-11-10', '', 0, 0, NULL, 26, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (115, '2', '2020-11-10', '', 0, 0, NULL, 29, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (116, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (117, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (118, '3', '2020-11-10', '', 0, 0, NULL, 36, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (119, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (120, '1', '2020-11-10', '', 0, 0, NULL, 33, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (121, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (122, '2', '2020-11-10', '', 0, 0, NULL, 31, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (123, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (124, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (125, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (126, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (127, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (128, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (129, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (130, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (131, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (132, '3', '2020-11-10', '', 0, 0, NULL, 28, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (133, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (134, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (135, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (136, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (137, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (138, '1', '2020-11-10', '', 0, 0, NULL, 32, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (139, '1', '2020-11-10', '', 0, 0, NULL, 36, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (140, '3', '2020-11-10', '', 0, 0, NULL, 30, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (141, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (142, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (143, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (144, '2', '2020-11-10', '', 0, 0, NULL, 41, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (145, '1', '2020-11-10', '', 0, 0, NULL, 45, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (146, '3', '2020-11-10', '', 0, 0, NULL, 44, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (147, '1', '2020-11-10', '', 0, 0, NULL, 46, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (148, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (149, '1', '2020-11-10', '', 0, 0, NULL, 40, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (150, '3', '2020-11-10', '', 0, 0, NULL, 37, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (151, '1', '2020-11-10', '', 0, 0, NULL, 55, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (152, '2', '2020-11-10', '', 0, 0, NULL, 50, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (153, '1', '2020-11-10', '', 0, 0, NULL, 52, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (154, '1', '2020-11-10', '', 0, 0, NULL, 56, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (157, '2', '2020-11-10', '', 0, 0, NULL, 53, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (158, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (159, '2', '2020-11-10', '', 0, 0, NULL, 32, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (160, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (161, '1', '2020-11-10', '', 0, 0, NULL, 31, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (162, '1', '2020-11-10', '', 0, 0, NULL, 26, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (163, '2', '2020-11-10', '', 0, 0, NULL, 29, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (164, '3', '2020-11-10', '', 0, 0, NULL, 43, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (165, '1', '2020-11-10', '', 0, 0, NULL, 42, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (166, '2', '2020-11-10', '', 0, 0, NULL, 47, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (167, '1', '2020-11-10', '', 0, 0, NULL, 40, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (168, '2', '2020-11-10', '', 0, 0, NULL, 37, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (169, '1', '2020-11-10', '', 0, 0, NULL, 39, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (170, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (171, '2', '2020-11-10', '', 0, 0, NULL, 45, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (172, '3', '2020-11-10', '', 0, 0, NULL, 55, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (173, '1', '2020-11-10', '', 0, 0, NULL, 52, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (174, '1', '2020-11-10', '', 0, 0, NULL, 49, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (175, '1', '2020-11-10', '', 0, 0, NULL, 56, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (176, '1', '2020-11-10', '', 0, 0, NULL, 51, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (177, '3', '2020-11-10', '', 0, 0, NULL, 29, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (178, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (179, '1', '2020-11-10', '', 0, 0, NULL, 31, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (180, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (181, '1', '2020-11-10', '', 0, 0, NULL, 34, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (182, '1', '2020-11-10', '', 0, 0, NULL, 36, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (183, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (184, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (185, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (186, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (187, '3', '2020-11-10', '', 0, 0, NULL, 36, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (188, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (189, '1', '2020-11-10', '', 0, 0, NULL, 33, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (190, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (191, '2', '2020-11-10', '', 0, 0, NULL, 31, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (192, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (193, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (194, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (195, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (196, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (197, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (198, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (199, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (200, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (201, '3', '2020-11-10', '', 0, 0, NULL, 28, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (202, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (203, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (204, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (205, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (206, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (207, '1', '2020-11-10', '', 0, 0, NULL, 32, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (208, '1', '2020-11-10', '', 0, 0, NULL, 36, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (209, '3', '2020-11-10', '', 0, 0, NULL, 30, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (210, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (211, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (212, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (213, '2', '2020-11-10', '', 0, 0, NULL, 41, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (214, '1', '2020-11-10', '', 0, 0, NULL, 45, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (215, '3', '2020-11-10', '', 0, 0, NULL, 44, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (216, '1', '2020-11-10', '', 0, 0, NULL, 46, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (217, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (218, '1', '2020-11-10', '', 0, 0, NULL, 40, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (219, '3', '2020-11-10', '', 0, 0, NULL, 37, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (220, '1', '2020-11-10', '', 0, 0, NULL, 55, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (221, '2', '2020-11-10', '', 0, 0, NULL, 50, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (222, '1', '2020-11-10', '', 0, 0, NULL, 52, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (223, '1', '2020-11-10', '', 0, 0, NULL, 56, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (226, '2', '2020-11-10', '', 0, 0, NULL, 53, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (227, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (228, '2', '2020-11-10', '', 0, 0, NULL, 32, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (229, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (230, '1', '2020-11-10', '', 0, 0, NULL, 31, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (231, '1', '2020-11-10', '', 0, 0, NULL, 26, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (232, '2', '2020-11-10', '', 0, 0, NULL, 29, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (233, '3', '2020-11-10', '', 0, 0, NULL, 43, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (234, '1', '2020-11-10', '', 0, 0, NULL, 42, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (235, '2', '2020-11-10', '', 0, 0, NULL, 47, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (236, '1', '2020-11-10', '', 0, 0, NULL, 40, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (237, '2', '2020-11-10', '', 0, 0, NULL, 37, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (238, '1', '2020-11-10', '', 0, 0, NULL, 39, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (239, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (240, '2', '2020-11-10', '', 0, 0, NULL, 45, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (241, '3', '2020-11-10', '', 0, 0, NULL, 55, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (242, '1', '2020-11-10', '', 0, 0, NULL, 52, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (243, '1', '2020-11-10', '', 0, 0, NULL, 49, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (244, '1', '2020-11-10', '', 0, 0, NULL, 56, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (245, '1', '2020-11-10', '', 0, 0, NULL, 51, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (246, '3', '2020-11-10', '', 0, 0, NULL, 29, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (247, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (248, '1', '2020-11-10', '', 0, 0, NULL, 31, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (249, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (250, '1', '2020-11-10', '', 0, 0, NULL, 34, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (251, '1', '2020-11-10', '', 0, 0, NULL, 36, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (252, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (253, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (254, '1', '2020-11-10', '', 0, 0, NULL, 43, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (255, '1', '2020-11-10', '', 0, 0, NULL, 45, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (256, '3', '2020-11-10', '', 0, 0, NULL, 44, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (257, '3', '2020-11-10', '', 0, 0, NULL, 41, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (258, '3', '2020-11-10', '', 0, 0, NULL, 37, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (259, '1', '2020-11-10', '', 0, 0, NULL, 48, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (260, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (261, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (262, '3', '2020-11-10', '', 0, 0, NULL, 32, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (263, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (264, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (265, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (266, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (267, '3', '2020-11-10', '', 0, 0, NULL, 36, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (268, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (269, '1', '2020-11-10', '', 0, 0, NULL, 33, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (270, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (271, '2', '2020-11-10', '', 0, 0, NULL, 31, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (272, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (273, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (274, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (275, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (276, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (277, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (278, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (279, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (280, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (281, '3', '2020-11-10', '', 0, 0, NULL, 28, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (282, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (283, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (284, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (285, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (286, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (287, '1', '2020-11-10', '', 0, 0, NULL, 32, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (288, '1', '2020-11-10', '', 0, 0, NULL, 36, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (289, '3', '2020-11-10', '', 0, 0, NULL, 30, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (290, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (291, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (292, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (293, '2', '2020-11-10', '', 0, 0, NULL, 41, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (294, '1', '2020-11-10', '', 0, 0, NULL, 45, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (295, '3', '2020-11-10', '', 0, 0, NULL, 44, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (296, '1', '2020-11-10', '', 0, 0, NULL, 46, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (297, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (298, '1', '2020-11-10', '', 0, 0, NULL, 40, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (299, '3', '2020-11-10', '', 0, 0, NULL, 37, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (300, '1', '2020-11-10', '', 0, 0, NULL, 55, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (301, '2', '2020-11-10', '', 0, 0, NULL, 50, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (302, '1', '2020-11-10', '', 0, 0, NULL, 52, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (303, '1', '2020-11-10', '', 0, 0, NULL, 56, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (306, '2', '2020-11-10', '', 0, 0, NULL, 53, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (307, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (308, '2', '2020-11-10', '', 0, 0, NULL, 32, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (309, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (310, '1', '2020-11-10', '', 0, 0, NULL, 31, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (311, '1', '2020-11-10', '', 0, 0, NULL, 26, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (312, '2', '2020-11-10', '', 0, 0, NULL, 29, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (313, '3', '2020-11-10', '', 0, 0, NULL, 43, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (314, '1', '2020-11-10', '', 0, 0, NULL, 42, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (315, '2', '2020-11-10', '', 0, 0, NULL, 47, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (316, '1', '2020-11-10', '', 0, 0, NULL, 40, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (317, '2', '2020-11-10', '', 0, 0, NULL, 37, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (318, '1', '2020-11-10', '', 0, 0, NULL, 39, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (319, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (320, '2', '2020-11-10', '', 0, 0, NULL, 45, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (321, '3', '2020-11-10', '', 0, 0, NULL, 55, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (322, '1', '2020-11-10', '', 0, 0, NULL, 52, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (323, '1', '2020-11-10', '', 0, 0, NULL, 49, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (324, '1', '2020-11-10', '', 0, 0, NULL, 56, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (325, '1', '2020-11-10', '', 0, 0, NULL, 51, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (326, '3', '2020-11-10', '', 0, 0, NULL, 29, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (327, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (328, '1', '2020-11-10', '', 0, 0, NULL, 31, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (329, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (330, '1', '2020-11-10', '', 0, 0, NULL, 34, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (331, '1', '2020-11-10', '', 0, 0, NULL, 36, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (332, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (333, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (334, '1', '2020-11-10', '', 0, 0, NULL, 43, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (335, '1', '2020-11-10', '', 0, 0, NULL, 45, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (336, '3', '2020-11-10', '', 0, 0, NULL, 44, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (337, '3', '2020-11-10', '', 0, 0, NULL, 41, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (338, '3', '2020-11-10', '', 0, 0, NULL, 37, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (339, '1', '2020-11-10', '', 0, 0, NULL, 48, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (340, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (341, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (342, '3', '2020-11-10', '', 0, 0, NULL, 32, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (343, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (344, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (345, '2', '2020-11-10', '', 0, 0, NULL, 55, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (346, '1', '2020-11-10', '', 0, 0, NULL, 53, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (348, '3', '2020-11-10', '', 0, 0, NULL, 49, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (350, '3', '2020-11-10', '', 0, 0, NULL, 54, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (352, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (353, '2', '2020-11-10', '', 0, 0, NULL, 29, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (354, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (355, '2', '2020-11-10', '', 0, 0, NULL, 31, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (356, '2', '2020-11-10', '', 0, 0, NULL, 32, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (357, '1', '2020-11-10', '', 0, 0, NULL, 33, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (358, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (359, '1', '2020-11-10', '', 0, 0, NULL, 28, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (360, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (361, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (362, '3', '2020-11-10', '', 0, 0, NULL, 36, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (363, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (364, '1', '2020-11-10', '', 0, 0, NULL, 33, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (365, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (366, '2', '2020-11-10', '', 0, 0, NULL, 31, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (367, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (368, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (369, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (370, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (371, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (372, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (373, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (374, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (375, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (376, '3', '2020-11-10', '', 0, 0, NULL, 28, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (377, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (378, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (379, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (380, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (381, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (382, '1', '2020-11-10', '', 0, 0, NULL, 32, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (383, '1', '2020-11-10', '', 0, 0, NULL, 36, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (384, '3', '2020-11-10', '', 0, 0, NULL, 30, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (385, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (386, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (387, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (388, '2', '2020-11-10', '', 0, 0, NULL, 41, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (389, '1', '2020-11-10', '', 0, 0, NULL, 45, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (390, '3', '2020-11-10', '', 0, 0, NULL, 44, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (391, '1', '2020-11-10', '', 0, 0, NULL, 46, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (392, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (393, '1', '2020-11-10', '', 0, 0, NULL, 40, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (394, '3', '2020-11-10', '', 0, 0, NULL, 37, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (395, '1', '2020-11-10', '', 0, 0, NULL, 55, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (396, '2', '2020-11-10', '', 0, 0, NULL, 50, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (397, '1', '2020-11-10', '', 0, 0, NULL, 52, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (398, '1', '2020-11-10', '', 0, 0, NULL, 56, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (401, '2', '2020-11-10', '', 0, 0, NULL, 53, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (402, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (403, '2', '2020-11-10', '', 0, 0, NULL, 32, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (404, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (405, '1', '2020-11-10', '', 0, 0, NULL, 31, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (406, '1', '2020-11-10', '', 0, 0, NULL, 26, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (407, '2', '2020-11-10', '', 0, 0, NULL, 29, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (408, '3', '2020-11-10', '', 0, 0, NULL, 43, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (409, '1', '2020-11-10', '', 0, 0, NULL, 42, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (410, '2', '2020-11-10', '', 0, 0, NULL, 47, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (411, '1', '2020-11-10', '', 0, 0, NULL, 40, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (412, '2', '2020-11-10', '', 0, 0, NULL, 37, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (413, '1', '2020-11-10', '', 0, 0, NULL, 39, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (414, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (415, '2', '2020-11-10', '', 0, 0, NULL, 45, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (416, '3', '2020-11-10', '', 0, 0, NULL, 55, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (417, '1', '2020-11-10', '', 0, 0, NULL, 52, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (418, '1', '2020-11-10', '', 0, 0, NULL, 49, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (419, '1', '2020-11-10', '', 0, 0, NULL, 56, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (420, '1', '2020-11-10', '', 0, 0, NULL, 51, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (421, '3', '2020-11-10', '', 0, 0, NULL, 29, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (422, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (423, '1', '2020-11-10', '', 0, 0, NULL, 31, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (424, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (425, '1', '2020-11-10', '', 0, 0, NULL, 34, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (426, '1', '2020-11-10', '', 0, 0, NULL, 36, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (427, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (428, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (429, '1', '2020-11-10', '', 0, 0, NULL, 43, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (430, '1', '2020-11-10', '', 0, 0, NULL, 45, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (431, '3', '2020-11-10', '', 0, 0, NULL, 44, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (432, '3', '2020-11-10', '', 0, 0, NULL, 41, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (433, '3', '2020-11-10', '', 0, 0, NULL, 37, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (434, '1', '2020-11-10', '', 0, 0, NULL, 48, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (435, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (436, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (437, '3', '2020-11-10', '', 0, 0, NULL, 32, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (438, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (439, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (440, '2', '2020-11-10', '', 0, 0, NULL, 55, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (441, '1', '2020-11-10', '', 0, 0, NULL, 53, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (443, '3', '2020-11-10', '', 0, 0, NULL, 49, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (445, '3', '2020-11-10', '', 0, 0, NULL, 54, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (447, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (448, '2', '2020-11-10', '', 0, 0, NULL, 29, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (449, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (450, '2', '2020-11-10', '', 0, 0, NULL, 31, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (451, '2', '2020-11-10', '', 0, 0, NULL, 32, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (452, '1', '2020-11-10', '', 0, 0, NULL, 33, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (453, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (454, '1', '2020-11-10', '', 0, 0, NULL, 28, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (455, '1', '2020-11-10', '', 0, 0, NULL, 43, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (456, '3', '2020-11-10', '', 0, 0, NULL, 37, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (457, '1', '2020-11-10', '', 0, 0, NULL, 45, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (458, '2', '2020-11-10', '', 0, 0, NULL, 39, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (459, '2', '2020-11-10', '', 0, 0, NULL, 40, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (460, '1', '2020-11-10', '', 0, 0, NULL, 46, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (461, '3', '2020-11-10', '', 0, 0, NULL, 42, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (462, '1', '2020-11-10', '', 0, 0, NULL, 44, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (463, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (464, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (465, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (466, '2', '2020-11-10', '', 0, 0, NULL, 26, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (467, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (468, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (469, '1', '2020-11-10', '', 0, 0, NULL, 35, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (470, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (471, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (472, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (473, '3', '2020-11-10', '', 0, 0, NULL, 36, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (474, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (475, '1', '2020-11-10', '', 0, 0, NULL, 33, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (476, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (477, '2', '2020-11-10', '', 0, 0, NULL, 31, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (478, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (479, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (480, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (481, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (482, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (483, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (484, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (485, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (486, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (487, '3', '2020-11-10', '', 0, 0, NULL, 28, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (488, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (489, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (490, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (491, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (492, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (493, '1', '2020-11-10', '', 0, 0, NULL, 32, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (494, '1', '2020-11-10', '', 0, 0, NULL, 36, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (495, '3', '2020-11-10', '', 0, 0, NULL, 30, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (496, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (497, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (498, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (499, '2', '2020-11-10', '', 0, 0, NULL, 41, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (500, '1', '2020-11-10', '', 0, 0, NULL, 45, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (501, '3', '2020-11-10', '', 0, 0, NULL, 44, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (502, '1', '2020-11-10', '', 0, 0, NULL, 46, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (503, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (504, '1', '2020-11-10', '', 0, 0, NULL, 40, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (505, '3', '2020-11-10', '', 0, 0, NULL, 37, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (506, '1', '2020-11-10', '', 0, 0, NULL, 55, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (507, '2', '2020-11-10', '', 0, 0, NULL, 50, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (508, '1', '2020-11-10', '', 0, 0, NULL, 52, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (509, '1', '2020-11-10', '', 0, 0, NULL, 56, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (512, '2', '2020-11-10', '', 0, 0, NULL, 53, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (513, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (514, '2', '2020-11-10', '', 0, 0, NULL, 32, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (515, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (516, '1', '2020-11-10', '', 0, 0, NULL, 31, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (517, '1', '2020-11-10', '', 0, 0, NULL, 26, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (518, '2', '2020-11-10', '', 0, 0, NULL, 29, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (519, '3', '2020-11-10', '', 0, 0, NULL, 43, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (520, '1', '2020-11-10', '', 0, 0, NULL, 42, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (521, '2', '2020-11-10', '', 0, 0, NULL, 47, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (522, '1', '2020-11-10', '', 0, 0, NULL, 40, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (523, '2', '2020-11-10', '', 0, 0, NULL, 37, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (524, '1', '2020-11-10', '', 0, 0, NULL, 39, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (525, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (526, '2', '2020-11-10', '', 0, 0, NULL, 45, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (527, '3', '2020-11-10', '', 0, 0, NULL, 55, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (528, '1', '2020-11-10', '', 0, 0, NULL, 52, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (529, '1', '2020-11-10', '', 0, 0, NULL, 49, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (530, '1', '2020-11-10', '', 0, 0, NULL, 56, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (531, '1', '2020-11-10', '', 0, 0, NULL, 51, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (532, '3', '2020-11-10', '', 0, 0, NULL, 29, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (533, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (534, '1', '2020-11-10', '', 0, 0, NULL, 31, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (535, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (536, '1', '2020-11-10', '', 0, 0, NULL, 34, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (537, '1', '2020-11-10', '', 0, 0, NULL, 36, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (538, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (539, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (540, '1', '2020-11-10', '', 0, 0, NULL, 43, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (541, '1', '2020-11-10', '', 0, 0, NULL, 45, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (542, '3', '2020-11-10', '', 0, 0, NULL, 44, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (543, '3', '2020-11-10', '', 0, 0, NULL, 41, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (544, '3', '2020-11-10', '', 0, 0, NULL, 37, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (545, '1', '2020-11-10', '', 0, 0, NULL, 48, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (546, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (547, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (548, '3', '2020-11-10', '', 0, 0, NULL, 32, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (549, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (550, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (551, '2', '2020-11-10', '', 0, 0, NULL, 55, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (552, '1', '2020-11-10', '', 0, 0, NULL, 53, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (554, '3', '2020-11-10', '', 0, 0, NULL, 49, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (556, '3', '2020-11-10', '', 0, 0, NULL, 54, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (558, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (559, '2', '2020-11-10', '', 0, 0, NULL, 29, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (560, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (561, '2', '2020-11-10', '', 0, 0, NULL, 31, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (562, '2', '2020-11-10', '', 0, 0, NULL, 32, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (563, '1', '2020-11-10', '', 0, 0, NULL, 33, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (564, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (565, '1', '2020-11-10', '', 0, 0, NULL, 28, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (566, '1', '2020-11-10', '', 0, 0, NULL, 43, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (567, '3', '2020-11-10', '', 0, 0, NULL, 37, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (568, '1', '2020-11-10', '', 0, 0, NULL, 45, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (569, '2', '2020-11-10', '', 0, 0, NULL, 39, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (570, '2', '2020-11-10', '', 0, 0, NULL, 40, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (571, '1', '2020-11-10', '', 0, 0, NULL, 46, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (572, '3', '2020-11-10', '', 0, 0, NULL, 42, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (573, '1', '2020-11-10', '', 0, 0, NULL, 44, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (574, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (575, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (576, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (577, '2', '2020-11-10', '', 0, 0, NULL, 26, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (578, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (579, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (580, '1', '2020-11-10', '', 0, 0, NULL, 35, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (581, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (582, '3', '2020-11-10', '', 0, 0, NULL, 45, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (583, '1', '2020-11-10', '', 0, 0, NULL, 44, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (584, '3', '2020-11-10', '', 0, 0, NULL, 40, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (585, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (586, '2', '2020-11-10', '', 0, 0, NULL, 39, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (587, '1', '2020-11-10', '', 0, 0, NULL, 47, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (588, '1', '2020-11-10', '', 0, 0, NULL, 37, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (589, '3', '2020-11-10', '', 0, 0, NULL, 29, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (590, '3', '2020-11-10', '', 0, 0, NULL, 30, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (591, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (592, '2', '2020-11-10', '', 0, 0, NULL, 35, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (593, '3', '2020-11-10', '', 0, 0, NULL, 36, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (594, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (595, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (596, '1', '2020-11-10', '', 0, 0, NULL, 34, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (597, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (598, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (599, '3', '2020-11-10', '', 0, 0, NULL, 36, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (600, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (601, '1', '2020-11-10', '', 0, 0, NULL, 33, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (602, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (603, '2', '2020-11-10', '', 0, 0, NULL, 31, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (604, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (605, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (606, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (607, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (608, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (609, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (610, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (611, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (612, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (613, '3', '2020-11-10', '', 0, 0, NULL, 28, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (614, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (615, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (616, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (617, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (618, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (619, '1', '2020-11-10', '', 0, 0, NULL, 32, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (620, '1', '2020-11-10', '', 0, 0, NULL, 36, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (621, '3', '2020-11-10', '', 0, 0, NULL, 30, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (622, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (623, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (624, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (625, '2', '2020-11-10', '', 0, 0, NULL, 41, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (626, '1', '2020-11-10', '', 0, 0, NULL, 45, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (627, '3', '2020-11-10', '', 0, 0, NULL, 44, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (628, '1', '2020-11-10', '', 0, 0, NULL, 46, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (629, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (630, '1', '2020-11-10', '', 0, 0, NULL, 40, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (631, '3', '2020-11-10', '', 0, 0, NULL, 37, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (632, '1', '2020-11-10', '', 0, 0, NULL, 55, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (633, '2', '2020-11-10', '', 0, 0, NULL, 50, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (634, '1', '2020-11-10', '', 0, 0, NULL, 52, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (635, '1', '2020-11-10', '', 0, 0, NULL, 56, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (638, '2', '2020-11-10', '', 0, 0, NULL, 53, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (639, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (640, '2', '2020-11-10', '', 0, 0, NULL, 32, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (641, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (642, '1', '2020-11-10', '', 0, 0, NULL, 31, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (643, '1', '2020-11-10', '', 0, 0, NULL, 26, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (644, '2', '2020-11-10', '', 0, 0, NULL, 29, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (645, '3', '2020-11-10', '', 0, 0, NULL, 43, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (646, '1', '2020-11-10', '', 0, 0, NULL, 42, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (647, '2', '2020-11-10', '', 0, 0, NULL, 47, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (648, '1', '2020-11-10', '', 0, 0, NULL, 40, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (649, '2', '2020-11-10', '', 0, 0, NULL, 37, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (650, '1', '2020-11-10', '', 0, 0, NULL, 39, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (651, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (652, '2', '2020-11-10', '', 0, 0, NULL, 45, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (653, '3', '2020-11-10', '', 0, 0, NULL, 55, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (654, '1', '2020-11-10', '', 0, 0, NULL, 52, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (655, '1', '2020-11-10', '', 0, 0, NULL, 49, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (656, '1', '2020-11-10', '', 0, 0, NULL, 56, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (657, '1', '2020-11-10', '', 0, 0, NULL, 51, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (658, '3', '2020-11-10', '', 0, 0, NULL, 29, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (659, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (660, '1', '2020-11-10', '', 0, 0, NULL, 31, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (661, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (662, '1', '2020-11-10', '', 0, 0, NULL, 34, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (663, '1', '2020-11-10', '', 0, 0, NULL, 36, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (664, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (665, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (666, '1', '2020-11-10', '', 0, 0, NULL, 43, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (667, '1', '2020-11-10', '', 0, 0, NULL, 45, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (668, '3', '2020-11-10', '', 0, 0, NULL, 44, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (669, '3', '2020-11-10', '', 0, 0, NULL, 41, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (670, '3', '2020-11-10', '', 0, 0, NULL, 37, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (671, '1', '2020-11-10', '', 0, 0, NULL, 48, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (672, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (673, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (674, '3', '2020-11-10', '', 0, 0, NULL, 32, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (675, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (676, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (677, '2', '2020-11-10', '', 0, 0, NULL, 55, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (678, '1', '2020-11-10', '', 0, 0, NULL, 53, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (680, '3', '2020-11-10', '', 0, 0, NULL, 49, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (682, '3', '2020-11-10', '', 0, 0, NULL, 54, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (684, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (685, '2', '2020-11-10', '', 0, 0, NULL, 29, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (686, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (687, '2', '2020-11-10', '', 0, 0, NULL, 31, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (688, '2', '2020-11-10', '', 0, 0, NULL, 32, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (689, '1', '2020-11-10', '', 0, 0, NULL, 33, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (690, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (691, '1', '2020-11-10', '', 0, 0, NULL, 28, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (692, '1', '2020-11-10', '', 0, 0, NULL, 43, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (693, '3', '2020-11-10', '', 0, 0, NULL, 37, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (694, '1', '2020-11-10', '', 0, 0, NULL, 45, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (695, '2', '2020-11-10', '', 0, 0, NULL, 39, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (696, '2', '2020-11-10', '', 0, 0, NULL, 40, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (697, '1', '2020-11-10', '', 0, 0, NULL, 46, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (698, '3', '2020-11-10', '', 0, 0, NULL, 42, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (699, '1', '2020-11-10', '', 0, 0, NULL, 44, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (700, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (701, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (702, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (703, '2', '2020-11-10', '', 0, 0, NULL, 26, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (704, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (705, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (706, '1', '2020-11-10', '', 0, 0, NULL, 35, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (707, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (708, '3', '2020-11-10', '', 0, 0, NULL, 45, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (709, '1', '2020-11-10', '', 0, 0, NULL, 44, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (710, '3', '2020-11-10', '', 0, 0, NULL, 40, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (711, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (712, '2', '2020-11-10', '', 0, 0, NULL, 39, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (713, '1', '2020-11-10', '', 0, 0, NULL, 47, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (714, '1', '2020-11-10', '', 0, 0, NULL, 37, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (715, '3', '2020-11-10', '', 0, 0, NULL, 29, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (716, '3', '2020-11-10', '', 0, 0, NULL, 30, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (717, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (718, '2', '2020-11-10', '', 0, 0, NULL, 35, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (719, '3', '2020-11-10', '', 0, 0, NULL, 36, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (720, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (721, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (722, '1', '2020-11-10', '', 0, 0, NULL, 34, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (723, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 19, 19, NULL);
INSERT INTO `dashboard_assessment` VALUES (724, '3', '2020-11-10', '', 0, 0, NULL, 34, NULL, 19, 19, NULL);
INSERT INTO `dashboard_assessment` VALUES (725, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 19, 19, NULL);
INSERT INTO `dashboard_assessment` VALUES (726, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 19, 19, NULL);
INSERT INTO `dashboard_assessment` VALUES (727, '3', '2020-11-10', '', 0, 0, NULL, 36, NULL, 19, 19, NULL);
INSERT INTO `dashboard_assessment` VALUES (728, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (729, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (730, '3', '2020-11-10', '', 0, 0, NULL, 36, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (731, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (732, '1', '2020-11-10', '', 0, 0, NULL, 33, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (733, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (734, '2', '2020-11-10', '', 0, 0, NULL, 31, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (735, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (736, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (737, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (738, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (739, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (740, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (741, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (742, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (743, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (744, '3', '2020-11-10', '', 0, 0, NULL, 28, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (745, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (746, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (747, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (748, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (749, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (750, '1', '2020-11-10', '', 0, 0, NULL, 32, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (751, '1', '2020-11-10', '', 0, 0, NULL, 36, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (752, '3', '2020-11-10', '', 0, 0, NULL, 30, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (753, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (754, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (755, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (756, '2', '2020-11-10', '', 0, 0, NULL, 41, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (757, '1', '2020-11-10', '', 0, 0, NULL, 45, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (758, '3', '2020-11-10', '', 0, 0, NULL, 44, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (759, '1', '2020-11-10', '', 0, 0, NULL, 46, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (760, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (761, '1', '2020-11-10', '', 0, 0, NULL, 40, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (762, '3', '2020-11-10', '', 0, 0, NULL, 37, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (763, '1', '2020-11-10', '', 0, 0, NULL, 55, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (764, '2', '2020-11-10', '', 0, 0, NULL, 50, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (765, '1', '2020-11-10', '', 0, 0, NULL, 52, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (766, '1', '2020-11-10', '', 0, 0, NULL, 56, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (769, '2', '2020-11-10', '', 0, 0, NULL, 53, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (770, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (771, '2', '2020-11-10', '', 0, 0, NULL, 32, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (772, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (773, '1', '2020-11-10', '', 0, 0, NULL, 31, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (774, '1', '2020-11-10', '', 0, 0, NULL, 26, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (775, '2', '2020-11-10', '', 0, 0, NULL, 29, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (776, '3', '2020-11-10', '', 0, 0, NULL, 43, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (777, '1', '2020-11-10', '', 0, 0, NULL, 42, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (778, '2', '2020-11-10', '', 0, 0, NULL, 47, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (779, '1', '2020-11-10', '', 0, 0, NULL, 40, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (780, '2', '2020-11-10', '', 0, 0, NULL, 37, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (781, '1', '2020-11-10', '', 0, 0, NULL, 39, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (782, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (783, '2', '2020-11-10', '', 0, 0, NULL, 45, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (784, '3', '2020-11-10', '', 0, 0, NULL, 55, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (785, '1', '2020-11-10', '', 0, 0, NULL, 52, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (786, '1', '2020-11-10', '', 0, 0, NULL, 49, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (787, '1', '2020-11-10', '', 0, 0, NULL, 56, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (788, '1', '2020-11-10', '', 0, 0, NULL, 51, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (789, '3', '2020-11-10', '', 0, 0, NULL, 29, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (790, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (791, '1', '2020-11-10', '', 0, 0, NULL, 31, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (792, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (793, '1', '2020-11-10', '', 0, 0, NULL, 34, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (794, '1', '2020-11-10', '', 0, 0, NULL, 36, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (795, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (796, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (797, '1', '2020-11-10', '', 0, 0, NULL, 43, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (798, '1', '2020-11-10', '', 0, 0, NULL, 45, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (799, '3', '2020-11-10', '', 0, 0, NULL, 44, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (800, '3', '2020-11-10', '', 0, 0, NULL, 41, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (801, '3', '2020-11-10', '', 0, 0, NULL, 37, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (802, '1', '2020-11-10', '', 0, 0, NULL, 48, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (803, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (804, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (805, '3', '2020-11-10', '', 0, 0, NULL, 32, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (806, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (807, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (808, '2', '2020-11-10', '', 0, 0, NULL, 55, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (809, '1', '2020-11-10', '', 0, 0, NULL, 53, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (811, '3', '2020-11-10', '', 0, 0, NULL, 49, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (813, '3', '2020-11-10', '', 0, 0, NULL, 54, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (815, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (816, '2', '2020-11-10', '', 0, 0, NULL, 29, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (817, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (818, '2', '2020-11-10', '', 0, 0, NULL, 31, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (819, '2', '2020-11-10', '', 0, 0, NULL, 32, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (820, '1', '2020-11-10', '', 0, 0, NULL, 33, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (821, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (822, '1', '2020-11-10', '', 0, 0, NULL, 28, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (823, '1', '2020-11-10', '', 0, 0, NULL, 43, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (824, '3', '2020-11-10', '', 0, 0, NULL, 37, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (825, '1', '2020-11-10', '', 0, 0, NULL, 45, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (826, '2', '2020-11-10', '', 0, 0, NULL, 39, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (827, '2', '2020-11-10', '', 0, 0, NULL, 40, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (828, '1', '2020-11-10', '', 0, 0, NULL, 46, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (829, '3', '2020-11-10', '', 0, 0, NULL, 42, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (830, '1', '2020-11-10', '', 0, 0, NULL, 44, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (831, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (832, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (833, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (834, '2', '2020-11-10', '', 0, 0, NULL, 26, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (835, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (836, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (837, '1', '2020-11-10', '', 0, 0, NULL, 35, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (838, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (839, '3', '2020-11-10', '', 0, 0, NULL, 45, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (840, '1', '2020-11-10', '', 0, 0, NULL, 44, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (841, '3', '2020-11-10', '', 0, 0, NULL, 40, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (842, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (843, '2', '2020-11-10', '', 0, 0, NULL, 39, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (844, '1', '2020-11-10', '', 0, 0, NULL, 47, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (845, '1', '2020-11-10', '', 0, 0, NULL, 37, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (846, '3', '2020-11-10', '', 0, 0, NULL, 29, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (847, '3', '2020-11-10', '', 0, 0, NULL, 30, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (848, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (849, '2', '2020-11-10', '', 0, 0, NULL, 35, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (850, '3', '2020-11-10', '', 0, 0, NULL, 36, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (851, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (852, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (853, '1', '2020-11-10', '', 0, 0, NULL, 34, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (854, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 19, 19, NULL);
INSERT INTO `dashboard_assessment` VALUES (855, '3', '2020-11-10', '', 0, 0, NULL, 34, NULL, 19, 19, NULL);
INSERT INTO `dashboard_assessment` VALUES (856, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 19, 19, NULL);
INSERT INTO `dashboard_assessment` VALUES (857, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 19, 19, NULL);
INSERT INTO `dashboard_assessment` VALUES (858, '3', '2020-11-10', '', 0, 0, NULL, 36, NULL, 19, 19, NULL);
INSERT INTO `dashboard_assessment` VALUES (859, '2', '2020-11-10', '', 0, 0, NULL, 47, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (860, '3', '2020-11-10', '', 0, 0, NULL, 48, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (861, '1', '2020-11-10', '', 0, 0, NULL, 37, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (862, '2', '2020-11-10', '', 0, 0, NULL, 43, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (863, '3', '2020-11-10', '', 0, 0, NULL, 46, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (864, '1', '2020-11-10', '', 0, 0, NULL, 44, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (865, '1', '2020-11-10', '', 0, 0, NULL, 51, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (867, '2', '2020-11-10', '', 0, 0, NULL, 55, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (868, '1', '2020-11-10', '', 0, 0, NULL, 56, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (870, '1', '2020-11-10', '', 0, 0, NULL, 54, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (871, '3', '2020-11-10', '', 0, 0, NULL, 30, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (872, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (873, '1', '2020-11-10', '', 0, 0, NULL, 36, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (874, '1', '2020-11-10', '', 0, 0, NULL, 32, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (875, '3', '2020-11-10', '', 0, 0, NULL, 29, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (876, '3', '2020-11-10', '', 0, 0, NULL, 33, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (877, '3', '2020-11-10', '', 0, 0, NULL, 34, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (878, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (879, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (880, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (881, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (882, '3', '2020-11-10', '', 0, 0, NULL, 36, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (883, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (884, '1', '2020-11-10', '', 0, 0, NULL, 33, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (885, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (886, '2', '2020-11-10', '', 0, 0, NULL, 31, NULL, 9, 9, NULL);
INSERT INTO `dashboard_assessment` VALUES (887, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (888, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (889, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (890, '3', '2020-11-10', '', 0, 0, NULL, 27, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (891, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 10, 10, NULL);
INSERT INTO `dashboard_assessment` VALUES (892, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (893, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (894, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (895, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (896, '3', '2020-11-10', '', 0, 0, NULL, 28, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (897, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (898, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (899, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 11, 11, NULL);
INSERT INTO `dashboard_assessment` VALUES (900, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (901, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (902, '1', '2020-11-10', '', 0, 0, NULL, 32, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (903, '1', '2020-11-10', '', 0, 0, NULL, 36, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (904, '3', '2020-11-10', '', 0, 0, NULL, 30, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (905, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (906, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (907, '3', '2020-11-10', '', 0, 0, NULL, 31, NULL, 12, 12, NULL);
INSERT INTO `dashboard_assessment` VALUES (908, '2', '2020-11-10', '', 0, 0, NULL, 41, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (909, '1', '2020-11-10', '', 0, 0, NULL, 45, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (910, '3', '2020-11-10', '', 0, 0, NULL, 44, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (911, '1', '2020-11-10', '', 0, 0, NULL, 46, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (912, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (913, '1', '2020-11-10', '', 0, 0, NULL, 40, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (914, '3', '2020-11-10', '', 0, 0, NULL, 37, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (915, '1', '2020-11-10', '', 0, 0, NULL, 55, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (916, '2', '2020-11-10', '', 0, 0, NULL, 50, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (917, '1', '2020-11-10', '', 0, 0, NULL, 52, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (918, '1', '2020-11-10', '', 0, 0, NULL, 56, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (921, '2', '2020-11-10', '', 0, 0, NULL, 53, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (922, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (923, '2', '2020-11-10', '', 0, 0, NULL, 32, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (924, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (925, '1', '2020-11-10', '', 0, 0, NULL, 31, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (926, '1', '2020-11-10', '', 0, 0, NULL, 26, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (927, '2', '2020-11-10', '', 0, 0, NULL, 29, NULL, 13, 13, NULL);
INSERT INTO `dashboard_assessment` VALUES (928, '3', '2020-11-10', '', 0, 0, NULL, 43, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (929, '1', '2020-11-10', '', 0, 0, NULL, 42, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (930, '2', '2020-11-10', '', 0, 0, NULL, 47, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (931, '1', '2020-11-10', '', 0, 0, NULL, 40, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (932, '2', '2020-11-10', '', 0, 0, NULL, 37, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (933, '1', '2020-11-10', '', 0, 0, NULL, 39, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (934, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (935, '2', '2020-11-10', '', 0, 0, NULL, 45, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (936, '3', '2020-11-10', '', 0, 0, NULL, 55, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (937, '1', '2020-11-10', '', 0, 0, NULL, 52, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (938, '1', '2020-11-10', '', 0, 0, NULL, 49, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (939, '1', '2020-11-10', '', 0, 0, NULL, 56, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (940, '1', '2020-11-10', '', 0, 0, NULL, 51, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (941, '3', '2020-11-10', '', 0, 0, NULL, 29, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (942, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (943, '1', '2020-11-10', '', 0, 0, NULL, 31, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (944, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (945, '1', '2020-11-10', '', 0, 0, NULL, 34, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (946, '1', '2020-11-10', '', 0, 0, NULL, 36, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (947, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (948, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 14, 14, NULL);
INSERT INTO `dashboard_assessment` VALUES (949, '1', '2020-11-10', '', 0, 0, NULL, 43, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (950, '1', '2020-11-10', '', 0, 0, NULL, 45, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (951, '3', '2020-11-10', '', 0, 0, NULL, 44, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (952, '3', '2020-11-10', '', 0, 0, NULL, 41, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (953, '3', '2020-11-10', '', 0, 0, NULL, 37, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (954, '1', '2020-11-10', '', 0, 0, NULL, 48, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (955, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (956, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (957, '3', '2020-11-10', '', 0, 0, NULL, 32, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (958, '2', '2020-11-10', '', 0, 0, NULL, 36, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (959, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 15, 15, NULL);
INSERT INTO `dashboard_assessment` VALUES (960, '2', '2020-11-10', '', 0, 0, NULL, 55, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (961, '1', '2020-11-10', '', 0, 0, NULL, 53, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (963, '3', '2020-11-10', '', 0, 0, NULL, 49, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (965, '3', '2020-11-10', '', 0, 0, NULL, 54, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (967, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (968, '2', '2020-11-10', '', 0, 0, NULL, 29, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (969, '1', '2020-11-10', '', 0, 0, NULL, 25, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (970, '2', '2020-11-10', '', 0, 0, NULL, 31, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (971, '2', '2020-11-10', '', 0, 0, NULL, 32, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (972, '1', '2020-11-10', '', 0, 0, NULL, 33, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (973, '1', '2020-11-10', '', 0, 0, NULL, 27, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (974, '1', '2020-11-10', '', 0, 0, NULL, 28, NULL, 16, 16, NULL);
INSERT INTO `dashboard_assessment` VALUES (975, '1', '2020-11-10', '', 0, 0, NULL, 43, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (976, '3', '2020-11-10', '', 0, 0, NULL, 37, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (977, '1', '2020-11-10', '', 0, 0, NULL, 45, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (978, '2', '2020-11-10', '', 0, 0, NULL, 39, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (979, '2', '2020-11-10', '', 0, 0, NULL, 40, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (980, '1', '2020-11-10', '', 0, 0, NULL, 46, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (981, '3', '2020-11-10', '', 0, 0, NULL, 42, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (982, '1', '2020-11-10', '', 0, 0, NULL, 44, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (983, '2', '2020-11-10', '', 0, 0, NULL, 34, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (984, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (985, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (986, '2', '2020-11-10', '', 0, 0, NULL, 26, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (987, '1', '2020-11-10', '', 0, 0, NULL, 30, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (988, '2', '2020-11-10', '', 0, 0, NULL, 33, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (989, '1', '2020-11-10', '', 0, 0, NULL, 35, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (990, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 17, 17, NULL);
INSERT INTO `dashboard_assessment` VALUES (991, '3', '2020-11-10', '', 0, 0, NULL, 45, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (992, '1', '2020-11-10', '', 0, 0, NULL, 44, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (993, '3', '2020-11-10', '', 0, 0, NULL, 40, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (994, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (995, '2', '2020-11-10', '', 0, 0, NULL, 39, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (996, '1', '2020-11-10', '', 0, 0, NULL, 47, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (997, '1', '2020-11-10', '', 0, 0, NULL, 37, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (998, '3', '2020-11-10', '', 0, 0, NULL, 29, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (999, '3', '2020-11-10', '', 0, 0, NULL, 30, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (1000, '3', '2020-11-10', '', 0, 0, NULL, 26, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (1001, '2', '2020-11-10', '', 0, 0, NULL, 35, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (1002, '3', '2020-11-10', '', 0, 0, NULL, 36, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (1003, '2', '2020-11-10', '', 0, 0, NULL, 28, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (1004, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (1005, '1', '2020-11-10', '', 0, 0, NULL, 34, NULL, 18, 18, NULL);
INSERT INTO `dashboard_assessment` VALUES (1006, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 19, 19, NULL);
INSERT INTO `dashboard_assessment` VALUES (1007, '3', '2020-11-10', '', 0, 0, NULL, 34, NULL, 19, 19, NULL);
INSERT INTO `dashboard_assessment` VALUES (1008, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 19, 19, NULL);
INSERT INTO `dashboard_assessment` VALUES (1009, '1', '2020-11-10', '', 0, 0, NULL, 29, NULL, 19, 19, NULL);
INSERT INTO `dashboard_assessment` VALUES (1010, '3', '2020-11-10', '', 0, 0, NULL, 36, NULL, 19, 19, NULL);
INSERT INTO `dashboard_assessment` VALUES (1011, '2', '2020-11-10', '', 0, 0, NULL, 47, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (1012, '3', '2020-11-10', '', 0, 0, NULL, 48, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (1013, '1', '2020-11-10', '', 0, 0, NULL, 37, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (1014, '2', '2020-11-10', '', 0, 0, NULL, 43, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (1015, '3', '2020-11-10', '', 0, 0, NULL, 46, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (1016, '1', '2020-11-10', '', 0, 0, NULL, 44, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (1017, '1', '2020-11-10', '', 0, 0, NULL, 51, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (1019, '2', '2020-11-10', '', 0, 0, NULL, 55, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (1020, '1', '2020-11-10', '', 0, 0, NULL, 56, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (1022, '1', '2020-11-10', '', 0, 0, NULL, 54, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (1023, '3', '2020-11-10', '', 0, 0, NULL, 30, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (1024, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (1025, '1', '2020-11-10', '', 0, 0, NULL, 36, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (1026, '1', '2020-11-10', '', 0, 0, NULL, 32, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (1027, '3', '2020-11-10', '', 0, 0, NULL, 29, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (1028, '3', '2020-11-10', '', 0, 0, NULL, 33, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (1029, '3', '2020-11-10', '', 0, 0, NULL, 34, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (1030, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (1031, '3', '2020-11-10', '', 0, 0, NULL, 25, NULL, 20, 20, NULL);
INSERT INTO `dashboard_assessment` VALUES (1032, '1', '2020-11-10', '', 0, 0, NULL, 42, NULL, 21, 21, NULL);
INSERT INTO `dashboard_assessment` VALUES (1033, '1', '2020-11-10', '', 0, 0, NULL, 48, NULL, 21, 21, NULL);
INSERT INTO `dashboard_assessment` VALUES (1034, '2', '2020-11-10', '', 0, 0, NULL, 39, NULL, 21, 21, NULL);
INSERT INTO `dashboard_assessment` VALUES (1035, '1', '2020-11-10', '', 0, 0, NULL, 46, NULL, 21, 21, NULL);
INSERT INTO `dashboard_assessment` VALUES (1036, '2', '2020-11-10', '', 0, 0, NULL, 47, NULL, 21, 21, NULL);
INSERT INTO `dashboard_assessment` VALUES (1037, '3', '2020-11-10', '', 0, 0, NULL, 40, NULL, 21, 21, NULL);
INSERT INTO `dashboard_assessment` VALUES (1038, '2', '2020-11-10', '', 0, 0, NULL, 44, NULL, 21, 21, NULL);
INSERT INTO `dashboard_assessment` VALUES (1039, '1', '2020-11-10', '', 0, 0, NULL, 38, NULL, 21, 21, NULL);
INSERT INTO `dashboard_assessment` VALUES (1040, '2', '2020-11-10', '', 0, 0, NULL, 31, NULL, 21, 21, NULL);
INSERT INTO `dashboard_assessment` VALUES (1041, '2', '2020-11-10', '', 0, 0, NULL, 27, NULL, 21, 21, NULL);
INSERT INTO `dashboard_assessment` VALUES (1042, '3', '2020-11-10', '', 0, 0, NULL, 35, NULL, 21, 21, NULL);
INSERT INTO `dashboard_assessment` VALUES (1043, '3', '2020-11-10', '', 0, 0, NULL, 30, NULL, 21, 21, NULL);
INSERT INTO `dashboard_assessment` VALUES (1044, '2', '2020-11-10', '', 1, 0, NULL, 14, NULL, 22, 22, NULL);
INSERT INTO `dashboard_assessment` VALUES (1045, '2', '2020-11-10', '', 1, 0, NULL, 13, NULL, 22, 22, NULL);
INSERT INTO `dashboard_assessment` VALUES (1061, '3', '2021-03-23', '', 0, 0, NULL, 25, NULL, 22, 22, NULL);
INSERT INTO `dashboard_assessment` VALUES (1062, '2', '2021-03-23', '', 1, 0, '2021-03-23', 26, 22, 22, 22, NULL);
INSERT INTO `dashboard_assessment` VALUES (1063, '3', '2021-03-23', '', 0, 1, '2021-03-23', 26, 22, 22, 22, NULL);
INSERT INTO `dashboard_assessment` VALUES (1064, '2', '2021-03-23', '', 1, 0, NULL, 25, NULL, 22, 22, NULL);

-- ----------------------------
-- Table structure for dashboard_assignedcompany
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_assignedcompany`;
CREATE TABLE `dashboard_assignedcompany`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `is_approved` tinyint(1) NOT NULL,
  `company_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dashboard_assignedco_company_id_7c759ba1_fk_dashboard`(`company_id`) USING BTREE,
  CONSTRAINT `dashboard_assignedco_company_id_7c759ba1_fk_dashboard` FOREIGN KEY (`company_id`) REFERENCES `dashboard_company` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_assignedcompany
-- ----------------------------
INSERT INTO `dashboard_assignedcompany` VALUES (1, 1, 1);
INSERT INTO `dashboard_assignedcompany` VALUES (2, 1, 1);
INSERT INTO `dashboard_assignedcompany` VALUES (3, 1, 1);
INSERT INTO `dashboard_assignedcompany` VALUES (4, 1, 2);
INSERT INTO `dashboard_assignedcompany` VALUES (5, 1, 1);
INSERT INTO `dashboard_assignedcompany` VALUES (6, 1, 1);
INSERT INTO `dashboard_assignedcompany` VALUES (7, 1, 1);
INSERT INTO `dashboard_assignedcompany` VALUES (8, 1, 1);

-- ----------------------------
-- Table structure for dashboard_assignedcompany_cohort
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_assignedcompany_cohort`;
CREATE TABLE `dashboard_assignedcompany_cohort`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `assignedcompany_id` int(11) NOT NULL,
  `cohort_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `dashboard_assignedcompan_assignedcompany_id_cohor_7d843e51_uniq`(`assignedcompany_id`, `cohort_id`) USING BTREE,
  INDEX `dashboard_assignedco_cohort_id_9bd43d25_fk_dashboard`(`cohort_id`) USING BTREE,
  CONSTRAINT `dashboard_assignedco_assignedcompany_id_c3ff7af2_fk_dashboard` FOREIGN KEY (`assignedcompany_id`) REFERENCES `dashboard_assignedcompany` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_assignedco_cohort_id_9bd43d25_fk_dashboard` FOREIGN KEY (`cohort_id`) REFERENCES `dashboard_cohort` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_assignedcompany_cohort
-- ----------------------------
INSERT INTO `dashboard_assignedcompany_cohort` VALUES (2, 1, 1);
INSERT INTO `dashboard_assignedcompany_cohort` VALUES (1, 2, 1);

-- ----------------------------
-- Table structure for dashboard_assignedcompany_groups
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_assignedcompany_groups`;
CREATE TABLE `dashboard_assignedcompany_groups`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `assignedcompany_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `dashboard_assignedcompan_assignedcompany_id_group_db94c717_uniq`(`assignedcompany_id`, `group_id`) USING BTREE,
  INDEX `dashboard_assignedco_group_id_928f57e6_fk_auth_grou`(`group_id`) USING BTREE,
  CONSTRAINT `dashboard_assignedco_assignedcompany_id_889318ff_fk_dashboard` FOREIGN KEY (`assignedcompany_id`) REFERENCES `dashboard_assignedcompany` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_assignedco_group_id_928f57e6_fk_auth_grou` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_assignedcompany_groups
-- ----------------------------
INSERT INTO `dashboard_assignedcompany_groups` VALUES (1, 1, 1);
INSERT INTO `dashboard_assignedcompany_groups` VALUES (2, 1, 2);
INSERT INTO `dashboard_assignedcompany_groups` VALUES (3, 1, 3);
INSERT INTO `dashboard_assignedcompany_groups` VALUES (4, 2, 2);
INSERT INTO `dashboard_assignedcompany_groups` VALUES (5, 3, 1);
INSERT INTO `dashboard_assignedcompany_groups` VALUES (6, 3, 2);
INSERT INTO `dashboard_assignedcompany_groups` VALUES (7, 3, 3);
INSERT INTO `dashboard_assignedcompany_groups` VALUES (10, 4, 3);
INSERT INTO `dashboard_assignedcompany_groups` VALUES (11, 5, 2);
INSERT INTO `dashboard_assignedcompany_groups` VALUES (12, 6, 2);
INSERT INTO `dashboard_assignedcompany_groups` VALUES (13, 7, 2);
INSERT INTO `dashboard_assignedcompany_groups` VALUES (14, 8, 2);

-- ----------------------------
-- Table structure for dashboard_assignedroadmap
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_assignedroadmap`;
CREATE TABLE `dashboard_assignedroadmap`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coach_id` int(11) NULL DEFAULT NULL,
  `roadmap_id` int(11) NULL DEFAULT NULL,
  `student_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dashboard_assignedroadmap_coach_id_d833dd53_fk_dashboard_user_id`(`coach_id`) USING BTREE,
  INDEX `dashboard_assignedro_roadmap_id_5afeb86a_fk_dashboard`(`roadmap_id`) USING BTREE,
  INDEX `dashboard_assignedro_student_id_5cd6a454_fk_dashboard`(`student_id`) USING BTREE,
  CONSTRAINT `dashboard_assignedro_roadmap_id_5afeb86a_fk_dashboard` FOREIGN KEY (`roadmap_id`) REFERENCES `dashboard_roadmap` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_assignedro_student_id_5cd6a454_fk_dashboard` FOREIGN KEY (`student_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_assignedroadmap_coach_id_d833dd53_fk_dashboard_user_id` FOREIGN KEY (`coach_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_assignedroadmap
-- ----------------------------
INSERT INTO `dashboard_assignedroadmap` VALUES (13, 22, 3, 22);
INSERT INTO `dashboard_assignedroadmap` VALUES (14, 23, 3, 22);

-- ----------------------------
-- Table structure for dashboard_attachment
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_attachment`;
CREATE TABLE `dashboard_attachment`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `attachment` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `filename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attacher_id` int(11) NULL DEFAULT NULL,
  `competency_id` int(11) NOT NULL,
  `user_id` int(11) NULL DEFAULT NULL,
  `date_attached` datetime(6) NULL DEFAULT NULL,
  `file_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `actionItem_id` int(11) NULL DEFAULT NULL,
  `file_category` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `external_url` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dashboard_attachment_competency_id_2373b0b2_fk_dashboard`(`competency_id`) USING BTREE,
  INDEX `dashboard_attachment_attacher_id_1e3fc061_fk_dashboard_user_id`(`attacher_id`) USING BTREE,
  INDEX `dashboard_attachment_user_id_c77f3c2c_fk_dashboard_user_id`(`user_id`) USING BTREE,
  INDEX `dashboard_attachment_actionItem_id_05239fbc_fk_dashboard`(`actionItem_id`) USING BTREE,
  CONSTRAINT `dashboard_attachment_actionItem_id_05239fbc_fk_dashboard` FOREIGN KEY (`actionItem_id`) REFERENCES `dashboard_actionitemassessment` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_attachment_attacher_id_1e3fc061_fk_dashboard_user_id` FOREIGN KEY (`attacher_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_attachment_competency_id_2373b0b2_fk_dashboard` FOREIGN KEY (`competency_id`) REFERENCES `dashboard_competency` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_attachment_user_id_c77f3c2c_fk_dashboard_user_id` FOREIGN KEY (`user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_attachment
-- ----------------------------
INSERT INTO `dashboard_attachment` VALUES (1, 'attachments/1.png', '1.png', 22, 35, 22, '2021-02-25 01:02:46.155162', 'image', NULL, 'ATTACHMENT', '');
INSERT INTO `dashboard_attachment` VALUES (3, 'attachments/1_S7CKM87.png', '2.png', 22, 13, 22, '2021-02-25 02:12:52.599051', 'image', NULL, 'ATTACHMENT', '');
INSERT INTO `dashboard_attachment` VALUES (4, 'attachments/1_vkbZcVv.png', '1.png', 22, 35, 22, '2021-02-28 09:16:54.537502', 'image', NULL, 'ATTACHMENT', '');
INSERT INTO `dashboard_attachment` VALUES (5, 'attachments/1_4ULAKTY.png', '1.png', 22, 35, 22, '2021-02-28 09:17:15.837554', 'image', NULL, 'ATTACHMENT', '');

-- ----------------------------
-- Table structure for dashboard_cohort
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_cohort`;
CREATE TABLE `dashboard_cohort`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `signup_url` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_id` int(11) NULL DEFAULT NULL,
  `created` datetime(6) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `signup_url`(`signup_url`) USING BTREE,
  INDEX `dashboard_cohort_company_id_52b72ef1_fk_dashboard_company_id`(`company_id`) USING BTREE,
  CONSTRAINT `dashboard_cohort_company_id_52b72ef1_fk_dashboard_company_id` FOREIGN KEY (`company_id`) REFERENCES `dashboard_company` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_cohort
-- ----------------------------
INSERT INTO `dashboard_cohort` VALUES (1, 'Marketing Department', 'revroad_marketing', 'RevRoad Marketing Department', 2, '2021-02-01 00:05:22.160920');
INSERT INTO `dashboard_cohort` VALUES (2, 'Marketing Department111', 'sss', 'fdfdfdfderew', 1, '2021-02-01 00:05:22.160920');
INSERT INTO `dashboard_cohort` VALUES (3, 'dsfsdf', 'sdfsdf', 'sdfsdf', 1, '2021-02-11 09:57:34.342112');

-- ----------------------------
-- Table structure for dashboard_cohort_roadmaps
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_cohort_roadmaps`;
CREATE TABLE `dashboard_cohort_roadmaps`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cohort_id` int(11) NOT NULL,
  `roadmap_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `dashboard_cohort_roadmaps_cohort_id_roadmap_id_7a308627_uniq`(`cohort_id`, `roadmap_id`) USING BTREE,
  INDEX `dashboard_cohort_roa_roadmap_id_5a0b9da2_fk_dashboard`(`roadmap_id`) USING BTREE,
  CONSTRAINT `dashboard_cohort_roa_cohort_id_811bf983_fk_dashboard` FOREIGN KEY (`cohort_id`) REFERENCES `dashboard_cohort` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_cohort_roa_roadmap_id_5a0b9da2_fk_dashboard` FOREIGN KEY (`roadmap_id`) REFERENCES `dashboard_roadmap` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_cohort_roadmaps
-- ----------------------------

-- ----------------------------
-- Table structure for dashboard_comment
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_comment`;
CREATE TABLE `dashboard_comment`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime(6) NOT NULL,
  `text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `competency_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dashboard_comment_competency_id_51042f8f_fk_dashboard`(`competency_id`) USING BTREE,
  INDEX `dashboard_comment_user_id_fcb057e3_fk_dashboard_user_id`(`user_id`) USING BTREE,
  INDEX `dashboard_comment_student_id_42f69edd_fk_dashboard_user_id`(`student_id`) USING BTREE,
  CONSTRAINT `dashboard_comment_competency_id_51042f8f_fk_dashboard` FOREIGN KEY (`competency_id`) REFERENCES `dashboard_competency` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_comment_student_id_42f69edd_fk_dashboard_user_id` FOREIGN KEY (`student_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_comment_user_id_fcb057e3_fk_dashboard_user_id` FOREIGN KEY (`user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 49 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_comment
-- ----------------------------
INSERT INTO `dashboard_comment` VALUES (1, '2021-03-10 18:02:09.661000', 'RERERER', 25, 22, 22);
INSERT INTO `dashboard_comment` VALUES (2, '2021-03-10 18:02:17.751000', 'DFSDF', 25, 22, 22);
INSERT INTO `dashboard_comment` VALUES (3, '2021-03-10 18:02:22.816000', 'SDFWERWERWER', 25, 22, 22);
INSERT INTO `dashboard_comment` VALUES (4, '2021-03-10 18:02:25.857000', 'QWERWERWER', 25, 22, 22);
INSERT INTO `dashboard_comment` VALUES (5, '2021-03-10 18:02:29.073000', 'FDSA', 25, 22, 22);
INSERT INTO `dashboard_comment` VALUES (6, '2021-03-10 18:02:31.579000', 'WER', 25, 22, 22);
INSERT INTO `dashboard_comment` VALUES (20, '2021-03-11 16:29:24.315000', 'werwer', 25, 22, 22);
INSERT INTO `dashboard_comment` VALUES (21, '2021-03-11 16:29:28.908000', '234234234', 25, 22, 22);
INSERT INTO `dashboard_comment` VALUES (23, '2021-03-12 12:26:46.651000', 'sdfgsdfgsdfg', 25, 22, 22);
INSERT INTO `dashboard_comment` VALUES (24, '2021-03-12 12:27:43.318000', 'bvcbwerwerwer', 25, 22, 22);
INSERT INTO `dashboard_comment` VALUES (25, '2021-03-12 12:27:45.652000', 'werwerwer', 25, 22, 22);
INSERT INTO `dashboard_comment` VALUES (26, '2021-03-12 12:29:37.299000', 'sdfsfdsdf', 25, 22, 22);
INSERT INTO `dashboard_comment` VALUES (27, '2021-03-15 16:44:33.767000', 'sdfsdfsdf', 25, 22, 22);
INSERT INTO `dashboard_comment` VALUES (28, '2021-03-15 16:45:15.594000', 'sdfsdfsdf', 25, 22, 22);
INSERT INTO `dashboard_comment` VALUES (29, '2021-03-18 02:10:57.803000', 'sassssssssssssssssssssssssssssssssssssssssssssssssssssssssssqweq', 25, 22, 22);
INSERT INTO `dashboard_comment` VALUES (30, '2021-03-18 02:11:10.736000', 'qweqweqweqweqweqweqweqweqweqweqweqweqweqw', 25, 22, 22);
INSERT INTO `dashboard_comment` VALUES (31, '2021-03-19 01:05:56.642000', 'fwerwerwer', 25, 22, 22);
INSERT INTO `dashboard_comment` VALUES (32, '2021-03-19 01:06:26.302000', 'ttttttererer', 25, 22, 22);
INSERT INTO `dashboard_comment` VALUES (33, '2021-03-24 00:50:39.634000', 'asdf', 35, 22, 22);
INSERT INTO `dashboard_comment` VALUES (34, '2021-03-24 00:50:45.992000', 'asdf', 35, 22, 22);
INSERT INTO `dashboard_comment` VALUES (35, '2021-03-24 00:50:49.528000', 'asdf', 35, 22, 22);
INSERT INTO `dashboard_comment` VALUES (36, '2021-03-24 00:50:52.616000', 'asdf', 35, 22, 22);
INSERT INTO `dashboard_comment` VALUES (37, '2021-03-24 00:50:54.850000', 'asdf', 35, 22, 22);
INSERT INTO `dashboard_comment` VALUES (38, '2021-03-24 00:50:57.503000', 'asdf', 35, 22, 22);
INSERT INTO `dashboard_comment` VALUES (39, '2021-03-24 00:52:34.072000', 'asdf', 35, 22, 22);
INSERT INTO `dashboard_comment` VALUES (40, '2021-03-24 02:38:40.285000', 'sdf', 26, 22, 22);
INSERT INTO `dashboard_comment` VALUES (41, '2021-03-24 02:38:44.647000', 'asdf', 26, 22, 22);
INSERT INTO `dashboard_comment` VALUES (42, '2021-03-24 03:17:04.612000', 'asdfasdf', 26, 22, 22);
INSERT INTO `dashboard_comment` VALUES (43, '2021-03-24 15:32:09.154000', 'asdfsdfa', 26, 22, 22);
INSERT INTO `dashboard_comment` VALUES (44, '2021-03-24 17:51:33.926000', '12333 33333 333fsw12333 fadasdf33333333fsw1233333333333fsw1233333333333fsw1233333333333fsw1233333333333fsw', 26, 22, 22);
INSERT INTO `dashboard_comment` VALUES (45, '2021-03-24 19:09:37.013000', 'asdfasdfasfasdfasdfasfasdfasdfasfasdfasdfasfasdfasdfasfasdfasdfasfasdfasdfasfasdfasdfasfasdfasdfasfasdfasdfasfasdfasdfasfasdfasdfasfasdfasdfasf', 26, 22, 22);
INSERT INTO `dashboard_comment` VALUES (46, '2021-03-24 19:10:23.526000', '3213123123 3213123123 3213123123321312312332131231233213123123321312312332131231233213123123asdfsdf', 26, 22, 22);
INSERT INTO `dashboard_comment` VALUES (47, '2021-03-24 19:10:27.198000', 'sdf', 26, 22, 22);
INSERT INTO `dashboard_comment` VALUES (48, '2021-03-24 19:14:44.781000', 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf', 25, 22, 22);

-- ----------------------------
-- Table structure for dashboard_company
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_company`;
CREATE TABLE `dashboard_company`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `logo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `private_labeled` tinyint(1) NOT NULL,
  `requires_approval` tinyint(1) NOT NULL,
  `coach_can_asssign_roadmaps` tinyint(1) NOT NULL,
  `users_can_attach_files` tinyint(1) NOT NULL,
  `conversations` tinyint(1) NOT NULL,
  `users_can_assign_coach` tinyint(1) NOT NULL,
  `coach_synonym` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `terms_and_conditions` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `users_can_erase_their_account` tinyint(1) NOT NULL,
  `user_can_asssign_roadmaps` tinyint(1) NOT NULL,
  `user_synonym` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `competency_notes_journal_section` tinyint(1) NOT NULL,
  `coach_notes` tinyint(1) NOT NULL,
  `archive_roadmaps` tinyint(1) NOT NULL,
  `group_specific_roadmaps` tinyint(1) NOT NULL,
  `coach_admin_assign_user_specifc_objectives` tinyint(1) NOT NULL,
  `coach_admin_edit_visibility_user_objectives` tinyint(1) NOT NULL,
  `hide_roadmaps_from_users` tinyint(1) NOT NULL,
  `pin_roadmaps_for_users` tinyint(1) NOT NULL,
  `assign_roadmaps_to_all_users` tinyint(1) NOT NULL,
  `users_can_add_action_items` tinyint(1) NOT NULL,
  `coaches_admin_can_assess_objectives` tinyint(1) NOT NULL,
  `show_print_competency_detail_button` tinyint(1) NOT NULL,
  `email_welcome_message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `follow_up_schedule` tinyint(1) NOT NULL,
  `default_green_assessment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `default_red_assessment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `default_yellow_assessment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `users_can_assign_specific_coaches_for_specific_roadmaps` tinyint(1) NOT NULL,
  `app_welcome_message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `privacy_policy` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `assessment_synonym` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `coaches_approve_green_assessments` tinyint(1) NOT NULL,
  `default_green_assessment_prompt` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `default_red_assessment_prompt` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `default_yellow_assessment_prompt` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `default_theme` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `users_can_invite_coach` tinyint(1) NOT NULL,
  `slider_for_competency_assessment` tinyint(1) NOT NULL,
  `django_frontend_base_url` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `from_email` varchar(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `legal_address` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `react_frontend_base_url` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `dashboard_company_name_7ce2027a_uniq`(`name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_company
-- ----------------------------
INSERT INTO `dashboard_company` VALUES (1, 'MyRoadmap', '', 0, 0, 1, 1, 0, 1, 'Coach', NULL, 1, 0, 'User', 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, '', 0, '', '', '', 1, 'Select a Roadmap below to get started.', NULL, 'Assessment', 1, '', '', '', '', 1, 0, '', '', '', '');
INSERT INTO `dashboard_company` VALUES (2, 'RevRoad', '', 0, 0, 1, 1, 0, 1, 'Coach', NULL, 1, 0, 'User', 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, '', 0, '', '', '', 0, 'Select a Roadmap below to get started.', NULL, 'Assessment', 1, '', '', '', 'dark', 1, 0, '', '', '', '');

-- ----------------------------
-- Table structure for dashboard_competency
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_competency`;
CREATE TABLE `dashboard_competency`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `red_description` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `yellow_description` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `green_description` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int(11) NULL DEFAULT NULL,
  `created` datetime(6) NOT NULL,
  `updated` datetime(6) NOT NULL,
  `user_defined` tinyint(1) NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `parent_id` int(11) NULL DEFAULT NULL,
  `stage_id` int(11) NOT NULL,
  `student_id` int(11) NULL DEFAULT NULL,
  `coach_notes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ai_visible` tinyint(1) NOT NULL,
  `comments_visible` tinyint(1) NOT NULL,
  `daily_assessment` tinyint(1) NOT NULL,
  `attachments_visible` tinyint(1) NOT NULL,
  `hidden_for_all_users` tinyint(1) NOT NULL,
  `daily_assessment_green` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `daily_assessment_question` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `daily_assessment_red` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `daily_assessment_yellow` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dashboard_competency_parent_id_71da0ee5_fk_dashboard`(`parent_id`) USING BTREE,
  INDEX `dashboard_competency_stage_id_70e58661_fk_dashboard_stage_id`(`stage_id`) USING BTREE,
  INDEX `dashboard_competency_student_id_a2988d13_fk_dashboard_user_id`(`student_id`) USING BTREE,
  CONSTRAINT `dashboard_competency_parent_id_71da0ee5_fk_dashboard` FOREIGN KEY (`parent_id`) REFERENCES `dashboard_competency` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_competency_stage_id_70e58661_fk_dashboard_stage_id` FOREIGN KEY (`stage_id`) REFERENCES `dashboard_stage` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_competency_student_id_a2988d13_fk_dashboard_user_id` FOREIGN KEY (`student_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 71 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_competency
-- ----------------------------
INSERT INTO `dashboard_competency` VALUES (13, 'Stage 1 Objective 1', '<figure class=\"media\"><div data-oembed-url=\"https://www.youtube.com/watch?v=12D8zEdOPYo\"><div style=\"position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;\"><iframe src=\"https://www.youtube.com/embed/12D8zEdOPYo\" style=\"position: absolute; width: 100%; height: 100%; top: 0; left: 0;\" frameborder=\"0\" allow=\"autoplay; encrypted-media\" allowfullscreen=\"\"></iframe></div></div></figure>', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', 0, '2020-11-10 13:20:26.781481', '2021-03-23 01:07:39.428224', 0, '<figure class=\"image\"><img src=\"https://s3.us-west-2.amazonaws.com/dev.myroadmap.io/uploads/leo.esaki426%2Badmin%40gmail.com/2021/02/23/1.png\"></figure><figure class=\"media\"><div data-oembed-url=\"https://www.youtube.com/watch?v=12D8zEdOPYo\"><div style=\"position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;\"><iframe src=\"https://www.youtube.com/embed/12D8zEdOPYo\" style=\"position: absolute; width: 100%; height: 100%; top: 0; left: 0;\" frameborder=\"0\" allow=\"autoplay; encrypted-media\" allowfullscreen=\"\"></iframe></div></div></figure><p>This is a supplemental content. You can include image, formatted text, content etc.</p>', NULL, 4, NULL, 'asdasdasdasd', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (14, 'Stage 1 Objective 2', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', 1, '2020-11-10 13:20:26.814848', '2021-03-23 01:07:39.430663', 0, 'Some content', NULL, 4, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (15, 'Stage 1 Objective 3', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', 2, '2020-11-10 13:20:26.839377', '2021-03-23 01:07:39.433152', 0, 'Some content', NULL, 4, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (16, 'Stage 1 Objective 4', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', 3, '2020-11-10 13:20:26.873470', '2021-03-23 01:07:39.434881', 0, 'Some content', NULL, 4, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (17, 'Stage 2 Objective 1', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', 1, '2020-11-10 13:20:26.923490', '2021-02-16 19:06:35.531949', 0, 'Some content', NULL, 5, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (18, 'Stage 2 Objective 3', '<p>This is competency description</p>', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', 0, '2020-11-10 13:20:26.947576', '2021-02-19 02:40:24.491009', 0, 'Some content', NULL, 5, NULL, 'sdfsdfsdfsdf', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (19, 'Stage 2 Objective 2', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', 2, '2020-11-10 13:20:26.973172', '2021-02-19 13:51:17.930381', 0, 'Some content', NULL, 5, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (20, 'Stage 2 Objective 4', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', 3, '2020-11-10 13:20:26.998206', '2021-02-16 19:06:35.538392', 0, 'Some content', NULL, 5, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (21, 'Stage 3 Objective 1', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:27.048687', '2020-11-10 13:20:27.049293', 0, 'Some content', NULL, 6, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (22, 'Stage 3 Objective 2', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:27.081571', '2020-11-10 13:20:27.081880', 0, 'Some content', NULL, 6, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (23, 'Stage 3 Objective 3', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:27.123369', '2020-11-10 13:20:27.123795', 0, 'Some content', NULL, 6, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (24, 'Stage 3 Objective 4', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:27.147800', '2020-11-10 13:20:27.148326', 0, 'Some content', NULL, 6, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (25, 'Stage 1 Objective 1', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:28.331506', '2020-11-10 13:20:28.332003', 0, 'Some content', NULL, 7, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (26, 'Stage 1 Objective 2', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:28.355536', '2020-11-10 13:20:28.355753', 0, 'Some content', NULL, 7, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (27, 'Stage 1 Objective 3', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:28.381629', '2020-11-10 13:20:28.381820', 0, 'Some content', NULL, 7, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (28, 'Stage 1 Objective 4', '<figure class=\"media\"><div data-oembed-url=\"https://www.youtube.com/watch?v=12D8zEdOPYo\"><div style=\"position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;\"><iframe src=\"https://www.youtube.com/embed/12D8zEdOPYo\" style=\"position: absolute; width: 100%; height: 100%; top: 0; left: 0;\" frameborder=\"0\" allow=\"autoplay; encrypted-media\" allowfullscreen=\"\"></iframe></div></div></figure><figure class=\"image\"><img src=\"https://s3.us-west-2.amazonaws.com/dev.myroadmap.io/uploads/leo.esaki426%2Badmin%40gmail.com/2021/03/03/1.png\"></figure><p>Competency description here</p>', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:28.406610', '2021-03-03 17:40:56.404173', 0, '<figure class=\"media\"><div data-oembed-url=\"https://www.youtube.com/watch?v=12D8zEdOPYo\"><div style=\"position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;\"><iframe src=\"https://www.youtube.com/embed/12D8zEdOPYo\" style=\"position: absolute; width: 100%; height: 100%; top: 0; left: 0;\" frameborder=\"0\" allow=\"autoplay; encrypted-media\" allowfullscreen=\"\"></iframe></div></div></figure><p><br>Some content</p>', NULL, 7, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (29, 'Stage 2 Objective 1', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:28.456453', '2020-11-10 13:20:28.456701', 0, 'Some content', NULL, 8, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (30, 'Stage 2 Objective 2', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:28.561354', '2020-11-10 13:20:28.561938', 0, 'Some content', NULL, 8, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (31, 'Stage 2 Objective 3', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:28.682183', '2020-11-10 13:20:28.682828', 0, 'Some content', NULL, 8, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (32, 'Stage 2 Objective 4', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:28.715491', '2020-11-10 13:20:28.716065', 0, 'Some content', NULL, 8, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (33, 'Stage 3 Objective 1', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:28.782207', '2020-11-10 13:20:28.782758', 0, 'Some content', NULL, 9, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (34, 'Stage 3 Objective 2', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:28.831631', '2020-11-10 13:20:28.831829', 0, 'Some content', NULL, 9, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (35, 'Stage 3 Objective 3', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:28.940502', '2020-11-10 13:20:28.941051', 0, 'Some content', NULL, 9, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (36, 'Stage 3 Objective 4', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:29.006960', '2020-11-10 13:20:29.007527', 0, 'Some content', NULL, 9, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (37, 'Stage 1 Objective 1', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:29.131582', '2020-11-10 13:20:29.131812', 0, 'Some content', NULL, 10, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (38, 'Stage 1 Objective 2', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:29.156431', '2020-11-10 13:20:29.156621', 0, 'Some content', NULL, 10, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (39, 'Stage 1 Objective 3', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:29.181692', '2020-11-10 13:20:29.181933', 0, 'Some content', NULL, 10, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (40, 'Stage 1 Objective 4', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:29.205767', '2020-11-10 13:20:29.206109', 0, 'Some content', NULL, 10, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (41, 'Stage 2 Objective 1', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:29.265502', '2020-11-10 13:20:29.266101', 0, 'Some content', NULL, 11, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (42, 'Stage 2 Objective 2', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:29.298233', '2020-11-10 13:20:29.298421', 0, 'Some content', NULL, 11, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (43, 'Stage 2 Objective 3', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:29.323344', '2020-11-10 13:20:29.323598', 0, 'Some content', NULL, 11, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (44, 'Stage 2 Objective 4', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:29.348531', '2020-11-10 13:20:29.348938', 0, 'Some content', NULL, 11, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (45, 'Stage 3 Objective 1', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:29.398821', '2020-11-10 13:20:29.399464', 0, 'Some content', NULL, 12, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (46, 'Stage 3 Objective 2', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:29.422489', '2020-11-10 13:20:29.422876', 0, 'Some content', NULL, 12, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (47, 'Stage 3 Objective 3', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:29.449032', '2020-11-10 13:20:29.449356', 0, 'Some content', NULL, 12, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (48, 'Stage 3 Objective 4', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:29.473491', '2020-11-10 13:20:29.473944', 0, 'Some content', NULL, 12, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (49, 'Stage 1 Objective 1', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:29.548818', '2020-11-10 13:20:29.549011', 0, 'Some content', NULL, 13, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (50, 'Stage 1 Objective 2', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:29.573220', '2020-11-10 13:20:29.573413', 0, 'Some content', NULL, 13, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (51, 'Stage 1 Objective 3', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:29.623565', '2020-11-10 13:20:29.623777', 0, 'Some content', NULL, 13, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (52, 'Stage 1 Objective 4', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:29.673540', '2020-11-10 13:20:29.674022', 0, 'Some content', NULL, 13, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (53, 'Stage 2 Objective 1', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:29.723292', '2020-11-10 13:20:29.723500', 0, 'Some content', NULL, 14, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (54, 'Stage 2 Objective 2', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:29.748890', '2020-11-10 13:20:29.749076', 0, 'Some content', NULL, 14, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (55, 'Stage 2 Objective 3', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:29.787870', '2020-11-10 13:20:29.788091', 0, 'Some content', NULL, 14, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (56, 'Stage 2 Objective 4', 'Competency description here', 'Do some preliminary research.', 'Expand on the preliminary research and do some intermediary research.', 'Expand on the preliminary and intermediary research and do some advanced research and implement the solution.', NULL, '2020-11-10 13:20:29.815775', '2020-11-10 13:20:29.816072', 0, 'Some content', NULL, 14, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');
INSERT INTO `dashboard_competency` VALUES (65, 'Untitled Objective', '', '', '', '', 1, '2021-02-18 18:18:35.136757', '2021-02-18 18:18:35.137046', 0, NULL, NULL, 44, NULL, '', 1, 1, 0, 1, 0, '', '', '', '');

-- ----------------------------
-- Table structure for dashboard_competency_hidden_for
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_competency_hidden_for`;
CREATE TABLE `dashboard_competency_hidden_for`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `competency_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `dashboard_competency_hid_competency_id_user_id_6eb60133_uniq`(`competency_id`, `user_id`) USING BTREE,
  INDEX `dashboard_competency_user_id_304a39ba_fk_dashboard`(`user_id`) USING BTREE,
  CONSTRAINT `dashboard_competency_competency_id_bdfbbfc9_fk_dashboard` FOREIGN KEY (`competency_id`) REFERENCES `dashboard_competency` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_competency_user_id_304a39ba_fk_dashboard` FOREIGN KEY (`user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_competency_hidden_for
-- ----------------------------
INSERT INTO `dashboard_competency_hidden_for` VALUES (1, 25, 22);

-- ----------------------------
-- Table structure for dashboard_contentglobal
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_contentglobal`;
CREATE TABLE `dashboard_contentglobal`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int(11) NOT NULL,
  `competency_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dashboard_contentglo_competency_id_52846779_fk_dashboard`(`competency_id`) USING BTREE,
  CONSTRAINT `dashboard_contentglo_competency_id_52846779_fk_dashboard` FOREIGN KEY (`competency_id`) REFERENCES `dashboard_competency` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_contentglobal
-- ----------------------------

-- ----------------------------
-- Table structure for dashboard_contentresponse
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_contentresponse`;
CREATE TABLE `dashboard_contentresponse`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `order` int(11) NOT NULL,
  `competency_id` int(11) NULL DEFAULT NULL,
  `parent_id` int(11) NULL DEFAULT NULL,
  `student_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `dashboard_contentresponse_student_id_parent_id_b8e1c362_uniq`(`student_id`, `parent_id`) USING BTREE,
  INDEX `dashboard_contentres_competency_id_8de59c96_fk_dashboard`(`competency_id`) USING BTREE,
  INDEX `dashboard_contentres_parent_id_d4187a7c_fk_dashboard`(`parent_id`) USING BTREE,
  CONSTRAINT `dashboard_contentres_competency_id_8de59c96_fk_dashboard` FOREIGN KEY (`competency_id`) REFERENCES `dashboard_competency` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_contentres_parent_id_d4187a7c_fk_dashboard` FOREIGN KEY (`parent_id`) REFERENCES `dashboard_contentglobal` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_contentres_student_id_766f2c18_fk_dashboard` FOREIGN KEY (`student_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_contentresponse
-- ----------------------------

-- ----------------------------
-- Table structure for dashboard_followupitem
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_followupitem`;
CREATE TABLE `dashboard_followupitem`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `due_date` date NULL DEFAULT NULL,
  `marked_done` tinyint(1) NOT NULL,
  `date_marked_done` date NULL DEFAULT NULL,
  `archived` tinyint(1) NOT NULL,
  `student_id` int(11) NOT NULL,
  `attempted_to_contact` tinyint(1) NOT NULL,
  `contacted` tinyint(1) NOT NULL,
  `no_attempt_to_contact` tinyint(1) NOT NULL,
  `notes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dashboard_followupitem_student_id_b40fbd32_fk_dashboard_user_id`(`student_id`) USING BTREE,
  CONSTRAINT `dashboard_followupitem_student_id_b40fbd32_fk_dashboard_user_id` FOREIGN KEY (`student_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_followupitem
-- ----------------------------

-- ----------------------------
-- Table structure for dashboard_note
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_note`;
CREATE TABLE `dashboard_note`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `competency_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dashboard_note_competency_id_9015223e_fk_dashboard_competency_id`(`competency_id`) USING BTREE,
  INDEX `dashboard_note_student_id_89a94e69_fk_dashboard_user_id`(`student_id`) USING BTREE,
  CONSTRAINT `dashboard_note_competency_id_9015223e_fk_dashboard_competency_id` FOREIGN KEY (`competency_id`) REFERENCES `dashboard_competency` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_note_student_id_89a94e69_fk_dashboard_user_id` FOREIGN KEY (`student_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_note
-- ----------------------------
INSERT INTO `dashboard_note` VALUES (8, '', 25, 22);

-- ----------------------------
-- Table structure for dashboard_questionanswer
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_questionanswer`;
CREATE TABLE `dashboard_questionanswer`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `answer` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `competency_id` int(11) NULL DEFAULT NULL,
  `parent_id` int(11) NULL DEFAULT NULL,
  `student_id` int(11) NOT NULL,
  `order` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `dashboard_questionanswer_student_id_parent_id_36d50011_uniq`(`student_id`, `parent_id`) USING BTREE,
  INDEX `dashboard_questionan_competency_id_9a303d6c_fk_dashboard`(`competency_id`) USING BTREE,
  INDEX `dashboard_questionan_parent_id_bc445403_fk_dashboard`(`parent_id`) USING BTREE,
  CONSTRAINT `dashboard_questionan_competency_id_9a303d6c_fk_dashboard` FOREIGN KEY (`competency_id`) REFERENCES `dashboard_competency` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_questionan_parent_id_bc445403_fk_dashboard` FOREIGN KEY (`parent_id`) REFERENCES `dashboard_questionglobal` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_questionan_student_id_c6c0c7b9_fk_dashboard` FOREIGN KEY (`student_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_questionanswer
-- ----------------------------
INSERT INTO `dashboard_questionanswer` VALUES (1, 'asdf', 28, 10, 22, 0);
INSERT INTO `dashboard_questionanswer` VALUES (2, 'tttttt', 28, 11, 22, 0);

-- ----------------------------
-- Table structure for dashboard_questionglobal
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_questionglobal`;
CREATE TABLE `dashboard_questionglobal`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int(11) NOT NULL,
  `competency_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dashboard_questiongl_competency_id_28564c83_fk_dashboard`(`competency_id`) USING BTREE,
  CONSTRAINT `dashboard_questiongl_competency_id_28564c83_fk_dashboard` FOREIGN KEY (`competency_id`) REFERENCES `dashboard_competency` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_questionglobal
-- ----------------------------
INSERT INTO `dashboard_questionglobal` VALUES (9, '', 'werwerwer', 0, 13);
INSERT INTO `dashboard_questionglobal` VALUES (10, '', 'qweqweqweqweqwe', 0, 28);
INSERT INTO `dashboard_questionglobal` VALUES (11, '', 'gfgfgfgfgfgfg', 0, 28);
INSERT INTO `dashboard_questionglobal` VALUES (12, '', 'This is a question', 0, 25);

-- ----------------------------
-- Table structure for dashboard_roadmap
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_roadmap`;
CREATE TABLE `dashboard_roadmap`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `company_id` int(11) NULL DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL,
  `icon` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `assign_to_all_users` tinyint(1) NOT NULL,
  `hidden_from_users` tinyint(1) NOT NULL,
  `pinned` tinyint(1) NOT NULL,
  `users_can_edit_ai` tinyint(1) NOT NULL,
  `users_can_edit_content` tinyint(1) NOT NULL,
  `simplified_ai` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dashboard_roadmap_company_id_b8150b2a_fk_dashboard_company_id`(`company_id`) USING BTREE,
  CONSTRAINT `dashboard_roadmap_company_id_b8150b2a_fk_dashboard_company_id` FOREIGN KEY (`company_id`) REFERENCES `dashboard_company` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 36 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_roadmap
-- ----------------------------
INSERT INTO `dashboard_roadmap` VALUES (2, 'Personal Finance Template', 'Roadmap for personal finance progression', 1, 1, 'images/roadmap_icons/1.png', 0, 0, 0, 1, 1, 0);
INSERT INTO `dashboard_roadmap` VALUES (3, 'Product Launch', 'Roadmap to help launch new products', 1, 1, '', 0, 0, 0, 1, 1, 0);
INSERT INTO `dashboard_roadmap` VALUES (4, 'Product Launch 2', 'Roadmap to help launch new products', 1, 1, '', 0, 0, 0, 1, 1, 0);
INSERT INTO `dashboard_roadmap` VALUES (5, 'Product Launch 3', 'Roadmap to help launch new products', 1, 1, '', 0, 0, 0, 1, 1, 0);
INSERT INTO `dashboard_roadmap` VALUES (16, 'testestest', 'sesetset', NULL, 0, '', 0, 0, 0, 1, 1, 0);
INSERT INTO `dashboard_roadmap` VALUES (30, 'tetetet', 'etetetetwerwerwerwer', 1, 1, '', 0, 0, 0, 1, 1, 0);
INSERT INTO `dashboard_roadmap` VALUES (33, 'tetetet (copy)', 'etetetetwerwerwerwer', 1, 0, '', 0, 0, 0, 1, 1, 0);
INSERT INTO `dashboard_roadmap` VALUES (34, 'Untitled Roadmap', '', 1, 0, '', 0, 0, 0, 1, 1, 0);
INSERT INTO `dashboard_roadmap` VALUES (35, 'Untitled Roadmap', 'dfdfdf', 1, 0, '', 0, 0, 0, 1, 1, 0);

-- ----------------------------
-- Table structure for dashboard_roadmap_cohorts
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_roadmap_cohorts`;
CREATE TABLE `dashboard_roadmap_cohorts`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roadmap_id` int(11) NOT NULL,
  `cohort_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `dashboard_roadmap_cohorts_roadmap_id_cohort_id_23d74e24_uniq`(`roadmap_id`, `cohort_id`) USING BTREE,
  INDEX `dashboard_roadmap_co_cohort_id_d17341f6_fk_dashboard`(`cohort_id`) USING BTREE,
  CONSTRAINT `dashboard_roadmap_co_cohort_id_d17341f6_fk_dashboard` FOREIGN KEY (`cohort_id`) REFERENCES `dashboard_cohort` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_roadmap_co_roadmap_id_f040a08a_fk_dashboard` FOREIGN KEY (`roadmap_id`) REFERENCES `dashboard_roadmap` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_roadmap_cohorts
-- ----------------------------
INSERT INTO `dashboard_roadmap_cohorts` VALUES (2, 2, 2);
INSERT INTO `dashboard_roadmap_cohorts` VALUES (1, 30, 2);

-- ----------------------------
-- Table structure for dashboard_roadmapassignment
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_roadmapassignment`;
CREATE TABLE `dashboard_roadmapassignment`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_assigned` datetime(6) NULL DEFAULT NULL,
  `roadmap_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dashboard_roadmapass_roadmap_id_2c36f55a_fk_dashboard`(`roadmap_id`) USING BTREE,
  INDEX `dashboard_roadmapass_user_id_3db07ef6_fk_dashboard`(`user_id`) USING BTREE,
  CONSTRAINT `dashboard_roadmapass_roadmap_id_2c36f55a_fk_dashboard` FOREIGN KEY (`roadmap_id`) REFERENCES `dashboard_roadmap` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_roadmapass_user_id_3db07ef6_fk_dashboard` FOREIGN KEY (`user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_roadmapassignment
-- ----------------------------
INSERT INTO `dashboard_roadmapassignment` VALUES (1, '2020-12-03 15:42:30.000000', 2, 23);
INSERT INTO `dashboard_roadmapassignment` VALUES (4, '2020-12-08 16:26:46.056747', 2, 3);

-- ----------------------------
-- Table structure for dashboard_stage
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_stage`;
CREATE TABLE `dashboard_stage`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int(11) NULL DEFAULT NULL,
  `roadmap_id` int(11) NULL DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `coach_notes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `hidden_from_users` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dashboard_stage_roadmap_id_6a16d3be_fk_dashboard_roadmap_id`(`roadmap_id`) USING BTREE,
  CONSTRAINT `dashboard_stage_roadmap_id_6a16d3be_fk_dashboard_roadmap_id` FOREIGN KEY (`roadmap_id`) REFERENCES `dashboard_roadmap` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 46 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_stage
-- ----------------------------
INSERT INTO `dashboard_stage` VALUES (4, 'Stage 1', 0, 2, NULL, '', 0);
INSERT INTO `dashboard_stage` VALUES (5, 'Stage 2', 1, 2, NULL, '', 0);
INSERT INTO `dashboard_stage` VALUES (6, 'Stage 3', 2, 2, NULL, '', 0);
INSERT INTO `dashboard_stage` VALUES (7, 'Stage 1', 0, 3, NULL, '', 0);
INSERT INTO `dashboard_stage` VALUES (8, 'Stage 2', 1, 3, NULL, '', 0);
INSERT INTO `dashboard_stage` VALUES (9, 'Stage 3', 2, 3, NULL, '', 0);
INSERT INTO `dashboard_stage` VALUES (10, 'Stage 1', 1, 4, NULL, '', 0);
INSERT INTO `dashboard_stage` VALUES (11, 'Stage 2', 2, 4, NULL, '', 0);
INSERT INTO `dashboard_stage` VALUES (12, 'Stage 3', 3, 4, NULL, '', 0);
INSERT INTO `dashboard_stage` VALUES (13, 'Stage 1', 0, 5, NULL, '', 0);
INSERT INTO `dashboard_stage` VALUES (14, 'Stage 2', 1, 5, NULL, '', 0);
INSERT INTO `dashboard_stage` VALUES (15, 'Stage 3', 2, 5, NULL, '', 0);
INSERT INTO `dashboard_stage` VALUES (29, 'stage test', NULL, NULL, NULL, '', 0);
INSERT INTO `dashboard_stage` VALUES (30, 'asdfasdfasdf', NULL, NULL, NULL, '', 0);
INSERT INTO `dashboard_stage` VALUES (41, 'Untitled Stage', 0, 33, NULL, '', 0);
INSERT INTO `dashboard_stage` VALUES (42, 'Untitled Stage', 0, 33, NULL, '', 0);
INSERT INTO `dashboard_stage` VALUES (43, 'Untitled Stage', 0, 33, NULL, '', 0);
INSERT INTO `dashboard_stage` VALUES (44, 'Untitled Stage', 1, 34, 'rty', '', 0);
INSERT INTO `dashboard_stage` VALUES (45, 'Untitled Stage', 1, 35, NULL, '', 0);

-- ----------------------------
-- Table structure for dashboard_user
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_user`;
CREATE TABLE `dashboard_user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) NULL DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `email` varchar(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `is_approved` tinyint(1) NOT NULL,
  `phone_number` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bio` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_seen` datetime(6) NULL DEFAULT NULL,
  `sidebar_list` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `last_downloaded_competencies` datetime(6) NULL DEFAULT NULL,
  `notes_for_coach` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `coach_notes_regarding_student` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_id` int(11) NULL DEFAULT NULL,
  `facebook_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `google_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `unsubscribed` tinyint(1) NOT NULL,
  `valid_email` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE,
  UNIQUE INDEX `dashboard_user_email_company_id_a273b323_uniq`(`email`, `company_id`) USING BTREE,
  INDEX `dashboard_user_company_id_8ec400c8_fk_dashboard_company_id`(`company_id`) USING BTREE,
  CONSTRAINT `dashboard_user_company_id_8ec400c8_fk_dashboard_company_id` FOREIGN KEY (`company_id`) REFERENCES `dashboard_company` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 45 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_user
-- ----------------------------
INSERT INTO `dashboard_user` VALUES (1, 'pbkdf2_sha256$150000$fmBLGb7vjVVv$r819XfpfVCsqrTFhJQTdRD6cD3wc5BGg61mPyyu2nuM=', '2021-03-11 00:25:50.219289', 1, 'super', 'Super', 'User', 1, 1, '2020-11-10 13:20:25.455715', 'super@myroadmap.io', 1, '', '', '', '2021-03-12 13:24:52.618100', NULL, NULL, '', '', NULL, '', '', 1, 1);
INSERT INTO `dashboard_user` VALUES (2, 'pbkdf2_sha256$150000$CnTy5oL78Ak3$JME0IcvBHqMZ48SVxB5gH5iNTCTWhLgtLEXGomUN77k=', '2020-12-21 20:08:38.951020', 0, 'admin@myroadmap.io', 'Admin', 'User', 0, 1, '2020-11-10 13:20:27.173297', 'admin@myroadmap.io', 1, '', '', 'images/profiles/photo_2.jpg', '2020-12-21 20:08:49.665464', NULL, NULL, '', '', 1, '', '', 1, 1);
INSERT INTO `dashboard_user` VALUES (3, 'pbkdf2_sha256$150000$I8Yro2w9i9pl$t6bka/AoP3+ZCPBjNiECGB4sXry2kR/gD0VBtgjM1iE=', NULL, 0, 'user@myroadmap.io', 'User', 'User', 0, 1, '2020-11-10 13:20:27.731532', 'user@myroadmap.io', 1, '', '', '', NULL, NULL, NULL, '', '', 1, '', '', 1, 1);
INSERT INTO `dashboard_user` VALUES (4, 'pbkdf2_sha256$150000$zP0gHwax912K$CRJI+oxafwN1kqndsuAah3lVJbvuVVQO30wC/xaVGA8=', NULL, 0, 'coach@myroadmap.io', 'Coach', 'User', 0, 1, '2020-11-10 13:20:27.980956', 'coach@myroadmap.io', 1, '', '', '', NULL, NULL, NULL, '', '', 1, '', '', 1, 1);
INSERT INTO `dashboard_user` VALUES (5, 'pbkdf2_sha256$150000$hmU1Qzvf8gyK$nr8IHQV5HDYi2RA2C8Sian/iqn2UyozEoMb13o5Rdg4=', NULL, 0, 'user@revroad.com', 'RevRoad', 'User', 0, 1, '2020-11-10 13:20:30.215630', 'user@revroad.com', 1, '', '', '', NULL, NULL, NULL, '', '', 2, '', '', 1, 1);
INSERT INTO `dashboard_user` VALUES (7, 'pbkdf2_sha256$150000$DONRbrqvZjm0$OM7SSzfCR7JToCaelQyDy52HMIIWF1KXGrGku92Z8+Q=', NULL, 0, 'coach@revroad.com', 'RevRoad', 'Coach', 0, 1, '2020-11-10 13:20:30.433646', 'coach@revroad.com', 1, '', '', '', NULL, NULL, NULL, '', '', 2, '', '', 1, 1);
INSERT INTO `dashboard_user` VALUES (8, 'pbkdf2_sha256$150000$579CNTrf4K3r$o92AUdRoHn8oNKWl3I8mgFrHfWhQZpGhUDA2Xd8NIh0=', NULL, 0, 'admin@revroad.com', 'RevRoad', 'Admin', 0, 1, '2020-11-10 13:20:30.527185', 'admin@revroad.com', 1, '', '', '', NULL, NULL, NULL, '', '', 2, '', '', 1, 1);
INSERT INTO `dashboard_user` VALUES (9, 'pbkdf2_sha256$150000$kfzRW6cguHEm$4jJl8Z5wBYe/F/wa1lGTcmBnqYms2OXLjy8PvStXsGk=', NULL, 0, 'user2@revroad.com', 'Kelli', 'Jones', 0, 1, '2020-11-10 13:20:31.383493', 'user2@revroad.com', 1, '', '', '', NULL, NULL, NULL, '', '', 2, '', '', 1, 1);
INSERT INTO `dashboard_user` VALUES (10, 'pbkdf2_sha256$150000$9jyVvzFKd2Pr$10SVRFDESkfe+u8PN9VnvbWj4OiCD+tXhUyJuTDRnz8=', NULL, 0, 'user3@revroad.com', 'Brooke', 'Smith', 0, 1, '2020-11-10 13:20:31.797862', 'user3@revroad.com', 1, '', '', '', NULL, NULL, NULL, '', '', 2, '', '', 1, 1);
INSERT INTO `dashboard_user` VALUES (11, 'pbkdf2_sha256$150000$evdulif4mg79$PCrQdRSrRzs87V1ihOscVDKa6HmJOUpgDeuF0hpCGlM=', NULL, 0, 'user4@revroad.com', 'Mary', 'Reynolds', 0, 1, '2020-11-10 13:20:32.407891', 'user4@revroad.com', 1, '', '', '', NULL, NULL, NULL, '', '', 2, '', '', 1, 1);
INSERT INTO `dashboard_user` VALUES (12, 'pbkdf2_sha256$150000$xmP1ExF3axEs$3BrZ+hr3BRxEbUhx2tzKGiIBRWLgwfiqBThF0iXdM68=', NULL, 0, 'user5@revroad.com', 'Lisa', 'Adams', 0, 1, '2020-11-10 13:20:32.706486', 'user5@revroad.com', 1, '', '', '', NULL, NULL, NULL, '', '', 2, '', '', 1, 1);
INSERT INTO `dashboard_user` VALUES (13, 'pbkdf2_sha256$150000$95Gk7e1msjms$sAcRK5AJQyRYjfUnibkJK/ygZfkETJC+jjWSRktnknk=', NULL, 0, 'user6@revroad.com', 'Charles', 'Green', 0, 1, '2020-11-10 13:20:32.965547', 'user6@revroad.com', 1, '', '', '', NULL, NULL, NULL, '', '', 2, '', '', 1, 1);
INSERT INTO `dashboard_user` VALUES (14, 'pbkdf2_sha256$150000$wolU15EY59DD$uni7i4ROSGVrDC8n8VO85zZp2uZjZ7VRRS0IvONkAJk=', NULL, 0, 'user7@revroad.com', 'Kristy', 'Jones', 0, 1, '2020-11-10 13:20:33.726872', 'user7@revroad.com', 1, '', '', '', NULL, NULL, NULL, '', '', 2, '', '', 1, 1);
INSERT INTO `dashboard_user` VALUES (15, 'pbkdf2_sha256$150000$KajSMmZUhamV$01p5cgELvHkG3jq5ob2EBrW4CXtB3g8n+RtP4q9xscY=', NULL, 0, 'user8@revroad.com', 'Shelley', 'Smith', 0, 1, '2020-11-10 13:20:34.259589', 'user8@revroad.com', 1, '', '', '', NULL, NULL, NULL, '', '', 2, '', '', 1, 1);
INSERT INTO `dashboard_user` VALUES (16, 'pbkdf2_sha256$150000$Eb57viFibQKA$PFqaUzMg7gx/zEgH4P2Z5v90yrxeHCe6rH8gZ9ERXMQ=', NULL, 0, 'user9@revroad.com', 'Thomas', 'Andrews', 0, 1, '2020-11-10 13:20:34.582275', 'user9@revroad.com', 1, '', '', '', NULL, NULL, NULL, '', '', 2, '', '', 1, 1);
INSERT INTO `dashboard_user` VALUES (17, 'pbkdf2_sha256$150000$krmjW8MPiSRv$7fHHP5Wbdn8WUK0lIHCXtLGHTmodhnfMZbT/ViOHeTQ=', NULL, 0, 'user10@revroad.com', 'Victoria', 'Silva', 0, 1, '2020-11-10 13:20:35.090735', 'user10@revroad.com', 1, '', '', '', NULL, NULL, NULL, '', '', 2, '', '', 1, 1);
INSERT INTO `dashboard_user` VALUES (18, 'pbkdf2_sha256$150000$Kh794zREoD39$xF1BveezZg3MH3AvVSJywBkfD2d44o2PnL8IjPm796k=', NULL, 0, 'user11@revroad.com', 'Kevin', 'Watkins', 0, 1, '2020-11-10 13:20:35.607869', 'user11@revroad.com', 1, '', '', '', NULL, NULL, NULL, '', '', 2, '', '', 1, 1);
INSERT INTO `dashboard_user` VALUES (19, 'pbkdf2_sha256$150000$pMXa3sYn92RT$GubXqTc3BrfDU16ew5mTg8SQ1KrxJ3t647m+/tdipdU=', NULL, 0, 'user12@revroad.com', 'Jacob', 'Meyer', 0, 1, '2020-11-10 13:20:36.117064', 'user12@revroad.com', 1, '', '', '', NULL, NULL, NULL, '', '', 2, '', '', 1, 1);
INSERT INTO `dashboard_user` VALUES (20, 'pbkdf2_sha256$150000$tBCo38VIqOMc$pUpkmfe8x3KU4xoMlSpxc/dDbnw38jH9zCgaetMhD/c=', NULL, 0, 'user13@revroad.com', 'Elizabeth', 'Murray', 0, 1, '2020-11-10 13:20:36.607849', 'user13@revroad.com', 1, '', '', '', NULL, NULL, NULL, '', '', 2, '', '', 1, 1);
INSERT INTO `dashboard_user` VALUES (21, 'pbkdf2_sha256$150000$lNTuLTnVTE2f$D2RkYsEl8U0rDrnio/ZRfkKCdiWRWh0iXbDIXPYHpHk=', NULL, 0, 'user14@revroad.com', 'Audrey', 'Diaz', 0, 1, '2020-11-10 13:20:37.091390', 'user14@revroad.com', 1, '', '', '', NULL, NULL, NULL, '', '', 2, '', '', 1, 1);
INSERT INTO `dashboard_user` VALUES (22, 'pbkdf2_sha256$150000$sSRICMNoCbMX$q4RTOCRs6wf9CAmqD+rRYdnMVJQHNOukJicJO1W1J1o=', '2021-03-23 15:33:01.993956', 0, 'leo.esaki426+admin@gmail.com', 'Leo', 'Esaki', 0, 1, '2020-11-10 15:07:19.220934', 'leo.esaki426+admin@gmail.com', 1, '12334', '123', 'images/profiles/photo_22.jpg', '2021-03-26 18:35:28.260432', NULL, NULL, '', '', 1, '', '', 0, 1);
INSERT INTO `dashboard_user` VALUES (23, 'pbkdf2_sha256$150000$oL8n37O3lq8x$nne/ZJYKhjd7d+835iQy9WykMJhNmBatjyrm145ab1w=', '2020-11-30 15:21:02.353551', 0, 'leo.esaki426.couch@gmail.com', 'Leo', 'Esaki', 0, 1, '2020-11-10 18:31:20.104625', 'aeo.esaki426.couch@gmail.com', 1, '12321', 'dd', '', '2020-11-30 15:21:02.571887', NULL, NULL, '', '', 1, '', '', 0, 1);
INSERT INTO `dashboard_user` VALUES (29, 'pbkdf2_sha256$150000$0xFIaoYvJJYH$YwFXA0NAwSDi58CD40SREPpfemxg3CLWE1kxq1j7kHo=', '2020-12-25 14:43:11.680857', 0, 'eugenemathew93@gmail.com', 'Uzen', 'Masao', 0, 1, '2020-12-25 13:57:23.297642', 'eugenemathew93@gmail.com', 0, '', '', '', '2020-12-25 19:25:36.715675', NULL, NULL, '', '', 1, '', '', 0, 1);
INSERT INTO `dashboard_user` VALUES (36, '', NULL, 0, 'lleo_eesak', 'lleo', 'eesak', 0, 0, '2021-01-20 12:19:20.198603', 'leeeo@gmail.com', 1, '332123', '', '', NULL, NULL, NULL, '', '', NULL, '', '', 0, 1);
INSERT INTO `dashboard_user` VALUES (40, '!1qhRnuW9kNUw2VeMVfhlMUTPFoIP1LlXIo2EMjLv', NULL, 0, '706538bc-c651-46f6-a69b-f00a75f93aed', 'TEE', 'EET', 0, 1, '2021-03-10 17:52:02.836223', 'nsiwko0811@gmail.com', 1, '234324', '', '', NULL, NULL, NULL, '', '', 1, '', '', 0, 1);
INSERT INTO `dashboard_user` VALUES (41, '!gqjQcrfzwYUypEFf7xRuzGq7gn98F9CLNEXqEXWO', NULL, 0, '8090dba9-2e9b-4c3e-9b67-736952d9540b', 'GDSD', 'SDG', 0, 1, '2021-03-10 17:57:24.479912', 'asd@gmail.com', 1, '', '', '', NULL, NULL, NULL, '', '', 1, '', '', 0, 1);
INSERT INTO `dashboard_user` VALUES (42, '!a2dKaC3mSrLrE9ty408MjkjQTiQUgBsuA2dYLSJB', NULL, 0, 'c84394ea-8268-407c-9902-14210cb52eaa', 'rerere', 'rerer', 0, 1, '2021-03-10 18:36:18.773400', 'wer@gmail.com', 1, '23123', '', '', NULL, NULL, NULL, '', '', 1, '', '', 0, 1);
INSERT INTO `dashboard_user` VALUES (43, 'pbkdf2_sha256$150000$tosRxREhHI8u$QAjJ1zm1wnt/otEPwraNiFjHqUBNGg4QebaenJRDVik=', '2021-03-11 00:28:42.240739', 0, 'te', 'Le', 'Te', 0, 1, '2021-03-11 00:26:38.952622', 'tele@gmail.com', 1, '123123', '', '', '2021-03-11 16:12:25.763046', NULL, NULL, '', '', 1, '', '', 0, 1);
INSERT INTO `dashboard_user` VALUES (44, '!yYuAunJJBnFjXAH3uaR7NSr9adFu7Hg6W68N07v4', NULL, 0, '92d2e662-b2b9-4dfd-b781-85e59a6f1b2a', 'hfhfgff', 'gfgfgf', 0, 1, '2021-03-11 00:29:40.962513', 'ert@gmail.com', 1, '34234234', '', '', NULL, NULL, NULL, '', '', 1, '', '', 0, 1);

-- ----------------------------
-- Table structure for dashboard_user_archived_roadmaps
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_user_archived_roadmaps`;
CREATE TABLE `dashboard_user_archived_roadmaps`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `roadmap_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `dashboard_user_archived__user_id_roadmap_id_f3bb7c1e_uniq`(`user_id`, `roadmap_id`) USING BTREE,
  INDEX `dashboard_user_archi_roadmap_id_3f84458f_fk_dashboard`(`roadmap_id`) USING BTREE,
  CONSTRAINT `dashboard_user_archi_roadmap_id_3f84458f_fk_dashboard` FOREIGN KEY (`roadmap_id`) REFERENCES `dashboard_roadmap` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_user_archi_user_id_ef4acf40_fk_dashboard` FOREIGN KEY (`user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_user_archived_roadmaps
-- ----------------------------

-- ----------------------------
-- Table structure for dashboard_user_assigned_roadmaps
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_user_assigned_roadmaps`;
CREATE TABLE `dashboard_user_assigned_roadmaps`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `assignedroadmap_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `dashboard_user_assigned__user_id_assignedroadmap__31847b9b_uniq`(`user_id`, `assignedroadmap_id`) USING BTREE,
  INDEX `dashboard_user_assig_assignedroadmap_id_f7ae43ea_fk_dashboard`(`assignedroadmap_id`) USING BTREE,
  CONSTRAINT `dashboard_user_assig_assignedroadmap_id_f7ae43ea_fk_dashboard` FOREIGN KEY (`assignedroadmap_id`) REFERENCES `dashboard_assignedroadmap` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_user_assig_user_id_84db9541_fk_dashboard` FOREIGN KEY (`user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_user_assigned_roadmaps
-- ----------------------------
INSERT INTO `dashboard_user_assigned_roadmaps` VALUES (13, 22, 13);
INSERT INTO `dashboard_user_assigned_roadmaps` VALUES (14, 22, 14);

-- ----------------------------
-- Table structure for dashboard_user_coach
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_user_coach`;
CREATE TABLE `dashboard_user_coach`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from_user_id` int(11) NOT NULL,
  `to_user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `dashboard_user_coach_from_user_id_to_user_id_d80e770b_uniq`(`from_user_id`, `to_user_id`) USING BTREE,
  INDEX `dashboard_user_coach_to_user_id_d0520f75_fk_dashboard_user_id`(`to_user_id`) USING BTREE,
  CONSTRAINT `dashboard_user_coach_from_user_id_6847c9a5_fk_dashboard_user_id` FOREIGN KEY (`from_user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_user_coach_to_user_id_d0520f75_fk_dashboard_user_id` FOREIGN KEY (`to_user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 55 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_user_coach
-- ----------------------------
INSERT INTO `dashboard_user_coach` VALUES (1, 5, 7);
INSERT INTO `dashboard_user_coach` VALUES (2, 9, 7);
INSERT INTO `dashboard_user_coach` VALUES (3, 10, 7);
INSERT INTO `dashboard_user_coach` VALUES (4, 11, 7);
INSERT INTO `dashboard_user_coach` VALUES (5, 12, 7);
INSERT INTO `dashboard_user_coach` VALUES (6, 13, 7);
INSERT INTO `dashboard_user_coach` VALUES (7, 14, 7);
INSERT INTO `dashboard_user_coach` VALUES (8, 15, 7);
INSERT INTO `dashboard_user_coach` VALUES (9, 16, 7);
INSERT INTO `dashboard_user_coach` VALUES (10, 17, 7);
INSERT INTO `dashboard_user_coach` VALUES (11, 18, 7);
INSERT INTO `dashboard_user_coach` VALUES (12, 19, 7);
INSERT INTO `dashboard_user_coach` VALUES (13, 20, 7);
INSERT INTO `dashboard_user_coach` VALUES (14, 21, 7);
INSERT INTO `dashboard_user_coach` VALUES (15, 23, 4);
INSERT INTO `dashboard_user_coach` VALUES (34, 23, 22);

-- ----------------------------
-- Table structure for dashboard_user_cohort
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_user_cohort`;
CREATE TABLE `dashboard_user_cohort`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `cohort_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `dashboard_user_cohort_user_id_cohort_id_c4721e9c_uniq`(`user_id`, `cohort_id`) USING BTREE,
  INDEX `dashboard_user_cohort_cohort_id_e1b498d6_fk_dashboard_cohort_id`(`cohort_id`) USING BTREE,
  CONSTRAINT `dashboard_user_cohort_cohort_id_e1b498d6_fk_dashboard_cohort_id` FOREIGN KEY (`cohort_id`) REFERENCES `dashboard_cohort` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_user_cohort_user_id_fb99cd69_fk_dashboard_user_id` FOREIGN KEY (`user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_user_cohort
-- ----------------------------
INSERT INTO `dashboard_user_cohort` VALUES (1, 5, 1);
INSERT INTO `dashboard_user_cohort` VALUES (3, 7, 1);
INSERT INTO `dashboard_user_cohort` VALUES (13, 22, 1);
INSERT INTO `dashboard_user_cohort` VALUES (5, 23, 1);
INSERT INTO `dashboard_user_cohort` VALUES (30, 43, 1);

-- ----------------------------
-- Table structure for dashboard_user_groups
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_user_groups`;
CREATE TABLE `dashboard_user_groups`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `dashboard_user_groups_user_id_group_id_2c570fca_uniq`(`user_id`, `group_id`) USING BTREE,
  INDEX `dashboard_user_groups_group_id_54086039_fk_auth_group_id`(`group_id`) USING BTREE,
  CONSTRAINT `dashboard_user_groups_group_id_54086039_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_user_groups_user_id_a915c7fc_fk_dashboard_user_id` FOREIGN KEY (`user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 61 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_user_groups
-- ----------------------------
INSERT INTO `dashboard_user_groups` VALUES (7, 1, 3);
INSERT INTO `dashboard_user_groups` VALUES (3, 2, 1);
INSERT INTO `dashboard_user_groups` VALUES (2, 2, 2);
INSERT INTO `dashboard_user_groups` VALUES (1, 2, 3);
INSERT INTO `dashboard_user_groups` VALUES (4, 3, 1);
INSERT INTO `dashboard_user_groups` VALUES (6, 4, 1);
INSERT INTO `dashboard_user_groups` VALUES (5, 4, 2);
INSERT INTO `dashboard_user_groups` VALUES (8, 5, 1);
INSERT INTO `dashboard_user_groups` VALUES (10, 7, 2);
INSERT INTO `dashboard_user_groups` VALUES (13, 8, 1);
INSERT INTO `dashboard_user_groups` VALUES (12, 8, 2);
INSERT INTO `dashboard_user_groups` VALUES (11, 8, 3);
INSERT INTO `dashboard_user_groups` VALUES (14, 9, 1);
INSERT INTO `dashboard_user_groups` VALUES (15, 10, 1);
INSERT INTO `dashboard_user_groups` VALUES (16, 11, 1);
INSERT INTO `dashboard_user_groups` VALUES (17, 12, 1);
INSERT INTO `dashboard_user_groups` VALUES (18, 13, 1);
INSERT INTO `dashboard_user_groups` VALUES (19, 14, 1);
INSERT INTO `dashboard_user_groups` VALUES (20, 15, 1);
INSERT INTO `dashboard_user_groups` VALUES (21, 16, 1);
INSERT INTO `dashboard_user_groups` VALUES (22, 17, 1);
INSERT INTO `dashboard_user_groups` VALUES (23, 18, 1);
INSERT INTO `dashboard_user_groups` VALUES (24, 19, 1);
INSERT INTO `dashboard_user_groups` VALUES (44, 22, 1);
INSERT INTO `dashboard_user_groups` VALUES (45, 22, 2);
INSERT INTO `dashboard_user_groups` VALUES (25, 22, 3);
INSERT INTO `dashboard_user_groups` VALUES (35, 23, 2);
INSERT INTO `dashboard_user_groups` VALUES (43, 29, 2);
INSERT INTO `dashboard_user_groups` VALUES (52, 36, 1);
INSERT INTO `dashboard_user_groups` VALUES (59, 43, 3);
INSERT INTO `dashboard_user_groups` VALUES (60, 44, 1);

-- ----------------------------
-- Table structure for dashboard_user_mentors
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_user_mentors`;
CREATE TABLE `dashboard_user_mentors`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from_user_id` int(11) NOT NULL,
  `to_user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `dashboard_user_mentors_from_user_id_to_user_id_f219f8d9_uniq`(`from_user_id`, `to_user_id`) USING BTREE,
  INDEX `dashboard_user_mentors_to_user_id_7e83d81d_fk_dashboard_user_id`(`to_user_id`) USING BTREE,
  CONSTRAINT `dashboard_user_mento_from_user_id_08b6b1a4_fk_dashboard` FOREIGN KEY (`from_user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_user_mentors_to_user_id_7e83d81d_fk_dashboard_user_id` FOREIGN KEY (`to_user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_user_mentors
-- ----------------------------

-- ----------------------------
-- Table structure for dashboard_user_roadmaps
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_user_roadmaps`;
CREATE TABLE `dashboard_user_roadmaps`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `roadmap_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `dashboard_user_roadmaps_user_id_roadmap_id_e3e42438_uniq`(`user_id`, `roadmap_id`) USING BTREE,
  INDEX `dashboard_user_roadm_roadmap_id_58455b92_fk_dashboard`(`roadmap_id`) USING BTREE,
  CONSTRAINT `dashboard_user_roadm_roadmap_id_58455b92_fk_dashboard` FOREIGN KEY (`roadmap_id`) REFERENCES `dashboard_roadmap` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_user_roadmaps_user_id_d89e3a5c_fk_dashboard_user_id` FOREIGN KEY (`user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 73 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_user_roadmaps
-- ----------------------------
INSERT INTO `dashboard_user_roadmaps` VALUES (58, 2, 3);
INSERT INTO `dashboard_user_roadmaps` VALUES (39, 3, 2);
INSERT INTO `dashboard_user_roadmaps` VALUES (49, 4, 2);
INSERT INTO `dashboard_user_roadmaps` VALUES (51, 4, 4);
INSERT INTO `dashboard_user_roadmaps` VALUES (1, 5, 3);
INSERT INTO `dashboard_user_roadmaps` VALUES (2, 5, 4);
INSERT INTO `dashboard_user_roadmaps` VALUES (3, 9, 3);
INSERT INTO `dashboard_user_roadmaps` VALUES (4, 10, 3);
INSERT INTO `dashboard_user_roadmaps` VALUES (5, 11, 3);
INSERT INTO `dashboard_user_roadmaps` VALUES (6, 12, 3);
INSERT INTO `dashboard_user_roadmaps` VALUES (7, 13, 3);
INSERT INTO `dashboard_user_roadmaps` VALUES (8, 13, 4);
INSERT INTO `dashboard_user_roadmaps` VALUES (9, 13, 5);
INSERT INTO `dashboard_user_roadmaps` VALUES (10, 14, 3);
INSERT INTO `dashboard_user_roadmaps` VALUES (11, 14, 4);
INSERT INTO `dashboard_user_roadmaps` VALUES (12, 14, 5);
INSERT INTO `dashboard_user_roadmaps` VALUES (13, 15, 3);
INSERT INTO `dashboard_user_roadmaps` VALUES (14, 15, 4);
INSERT INTO `dashboard_user_roadmaps` VALUES (15, 16, 3);
INSERT INTO `dashboard_user_roadmaps` VALUES (16, 16, 5);
INSERT INTO `dashboard_user_roadmaps` VALUES (17, 17, 3);
INSERT INTO `dashboard_user_roadmaps` VALUES (18, 17, 4);
INSERT INTO `dashboard_user_roadmaps` VALUES (19, 18, 3);
INSERT INTO `dashboard_user_roadmaps` VALUES (20, 18, 4);
INSERT INTO `dashboard_user_roadmaps` VALUES (21, 19, 3);
INSERT INTO `dashboard_user_roadmaps` VALUES (22, 20, 3);
INSERT INTO `dashboard_user_roadmaps` VALUES (23, 20, 4);
INSERT INTO `dashboard_user_roadmaps` VALUES (24, 20, 5);
INSERT INTO `dashboard_user_roadmaps` VALUES (25, 21, 3);
INSERT INTO `dashboard_user_roadmaps` VALUES (26, 21, 4);
INSERT INTO `dashboard_user_roadmaps` VALUES (32, 22, 3);
INSERT INTO `dashboard_user_roadmaps` VALUES (66, 23, 3);
INSERT INTO `dashboard_user_roadmaps` VALUES (67, 23, 4);
INSERT INTO `dashboard_user_roadmaps` VALUES (68, 23, 5);

-- ----------------------------
-- Table structure for dashboard_user_user_permissions
-- ----------------------------
DROP TABLE IF EXISTS `dashboard_user_user_permissions`;
CREATE TABLE `dashboard_user_user_permissions`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `dashboard_user_user_perm_user_id_permission_id_550d0c70_uniq`(`user_id`, `permission_id`) USING BTREE,
  INDEX `dashboard_user_user__permission_id_70269958_fk_auth_perm`(`permission_id`) USING BTREE,
  CONSTRAINT `dashboard_user_user__permission_id_70269958_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `dashboard_user_user__user_id_ea9b20c2_fk_dashboard` FOREIGN KEY (`user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dashboard_user_user_permissions
-- ----------------------------

-- ----------------------------
-- Table structure for django_admin_log
-- ----------------------------
DROP TABLE IF EXISTS `django_admin_log`;
CREATE TABLE `django_admin_log`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `object_repr` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL,
  `change_message` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `content_type_id` int(11) NULL DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `django_admin_log_content_type_id_c4bce8eb_fk_django_co`(`content_type_id`) USING BTREE,
  INDEX `django_admin_log_user_id_c564eba6_fk_dashboard_user_id`(`user_id`) USING BTREE,
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_dashboard_user_id` FOREIGN KEY (`user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 43 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of django_admin_log
-- ----------------------------
INSERT INTO `django_admin_log` VALUES (1, '2020-11-10 15:07:19.368431', '22', ' ', 1, '[{\"added\": {}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (2, '2020-11-10 15:28:12.327338', '22', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"username\", \"first_name\", \"last_name\", \"email\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (3, '2020-11-10 15:30:36.398524', '22', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"is_staff\", \"is_superuser\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (4, '2020-11-10 15:31:22.396915', '22', 'Leo Esaki', 2, '[]', 5, 1);
INSERT INTO `django_admin_log` VALUES (5, '2020-11-10 15:33:27.364161', '22', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"is_approved\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (6, '2020-11-10 15:36:45.859323', '22', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"groups\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (7, '2020-11-10 15:53:03.804892', '22', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"companies\"]}}]', 5, 22);
INSERT INTO `django_admin_log` VALUES (8, '2020-11-10 15:54:05.559151', '22', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"username\", \"email\"]}}]', 5, 22);
INSERT INTO `django_admin_log` VALUES (9, '2020-11-10 15:54:53.322868', '22', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"company\"]}}]', 5, 22);
INSERT INTO `django_admin_log` VALUES (10, '2020-11-10 18:35:04.181562', '23', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"password\"]}}]', 5, 22);
INSERT INTO `django_admin_log` VALUES (11, '2020-11-11 13:27:31.522523', '22', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"roadmaps\"]}}]', 5, 22);
INSERT INTO `django_admin_log` VALUES (12, '2020-11-11 13:33:26.200838', '22', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"groups\"]}}]', 5, 22);
INSERT INTO `django_admin_log` VALUES (13, '2020-11-11 13:34:42.516575', '22', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"archived_roadmaps\"]}}]', 5, 22);
INSERT INTO `django_admin_log` VALUES (14, '2020-11-11 13:35:13.537594', '22', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"is_superuser\"]}}]', 5, 22);
INSERT INTO `django_admin_log` VALUES (15, '2020-11-11 13:51:56.006428', '22', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"coach\", \"cohort\", \"is_staff\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (16, '2020-11-17 13:55:28.971643', '23', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"companies\", \"cohort\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (17, '2020-11-17 14:03:13.546306', '23', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"roadmaps\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (18, '2020-11-17 14:24:52.004383', '22', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"roadmaps\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (19, '2020-11-17 14:26:06.311380', '22', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"coach\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (20, '2020-11-17 18:58:44.972106', '2', 'RevRoad', 2, '[{\"changed\": {\"fields\": [\"users_can_erase_their_account\"]}}]', 11, 1);
INSERT INTO `django_admin_log` VALUES (21, '2020-11-17 18:58:54.507217', '1', 'MyRoadmap', 2, '[{\"changed\": {\"fields\": [\"users_can_erase_their_account\"]}}]', 11, 1);
INSERT INTO `django_admin_log` VALUES (22, '2020-11-19 16:57:49.216817', '2', 'Admin User', 2, '[{\"changed\": {\"fields\": [\"password\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (23, '2020-12-20 05:58:43.487331', '22', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"coach\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (24, '2020-12-20 07:21:14.613711', '22', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"coach\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (25, '2020-12-20 07:22:50.119564', '22', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"coach\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (26, '2020-12-20 07:25:03.773278', '22', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"coach\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (27, '2020-12-21 15:04:02.108512', '22', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"coach\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (28, '2020-12-21 15:04:17.601815', '22', 'Leo Esaki', 2, '[{\"changed\": {\"fields\": [\"coach\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (29, '2020-12-24 20:14:35.497749', '26', ' ', 1, '[{\"added\": {}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (30, '2020-12-24 20:15:05.953489', '26', 'Uzen Masao', 2, '[{\"changed\": {\"fields\": [\"first_name\", \"last_name\", \"email\", \"groups\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (31, '2020-12-25 12:53:58.932238', '26', 'Uzen Masao', 3, '', 5, 1);
INSERT INTO `django_admin_log` VALUES (32, '2020-12-25 13:47:31.584409', '27', 'Eugene Mathew', 3, '', 5, 1);
INSERT INTO `django_admin_log` VALUES (33, '2020-12-25 13:49:28.305985', '28', 'Eugene Mathew', 3, '', 5, 1);
INSERT INTO `django_admin_log` VALUES (34, '2020-12-25 13:58:48.918037', '29', 'Uzen Masao', 2, '[{\"changed\": {\"fields\": [\"is_approved\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (35, '2020-12-25 14:40:42.494100', '29', 'Uzen Masao', 2, '[{\"changed\": {\"fields\": [\"is_approved\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (36, '2020-12-25 14:42:10.775893', '29', 'Uzen Masao', 2, '[{\"changed\": {\"fields\": [\"is_approved\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (37, '2021-03-11 00:26:40.389469', '43', ' ', 1, '[{\"added\": {}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (38, '2021-03-11 00:28:21.307385', '43', 'Le Te', 2, '[{\"changed\": {\"fields\": [\"first_name\", \"last_name\", \"email\", \"phone_number\", \"company\", \"is_approved\", \"groups\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (39, '2021-03-11 00:31:13.383190', '43', 'Le Te', 2, '[{\"changed\": {\"fields\": [\"cohort\"]}}]', 5, 1);
INSERT INTO `django_admin_log` VALUES (40, '2021-03-12 13:16:27.202169', '1', 'MyRoadmap', 2, '[]', 11, 1);
INSERT INTO `django_admin_log` VALUES (41, '2021-03-12 13:24:44.867688', '1', 'MyRoadmap', 2, '[]', 11, 1);
INSERT INTO `django_admin_log` VALUES (42, '2021-03-12 13:24:48.317338', '1', 'MyRoadmap', 2, '[]', 11, 1);

-- ----------------------------
-- Table structure for django_content_type
-- ----------------------------
DROP TABLE IF EXISTS `django_content_type`;
CREATE TABLE `django_content_type`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `model` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `django_content_type_app_label_model_76bd3d3b_uniq`(`app_label`, `model`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 39 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of django_content_type
-- ----------------------------
INSERT INTO `django_content_type` VALUES (25, 'admin', 'logentry');
INSERT INTO `django_content_type` VALUES (37, 'api', 'peerlastreadmessagetimestamp');
INSERT INTO `django_content_type` VALUES (38, 'api', 'peertopeermessage');
INSERT INTO `django_content_type` VALUES (36, 'api', 'recentcompetency');
INSERT INTO `django_content_type` VALUES (27, 'auth', 'group');
INSERT INTO `django_content_type` VALUES (26, 'auth', 'permission');
INSERT INTO `django_content_type` VALUES (35, 'authtoken', 'token');
INSERT INTO `django_content_type` VALUES (28, 'contenttypes', 'contenttype');
INSERT INTO `django_content_type` VALUES (6, 'dashboard', 'actionitemassessment');
INSERT INTO `django_content_type` VALUES (7, 'dashboard', 'actionitemglobal');
INSERT INTO `django_content_type` VALUES (8, 'dashboard', 'assessment');
INSERT INTO `django_content_type` VALUES (24, 'dashboard', 'assignedcompany');
INSERT INTO `django_content_type` VALUES (23, 'dashboard', 'assignedroadmap');
INSERT INTO `django_content_type` VALUES (16, 'dashboard', 'attachment');
INSERT INTO `django_content_type` VALUES (9, 'dashboard', 'cohort');
INSERT INTO `django_content_type` VALUES (10, 'dashboard', 'comment');
INSERT INTO `django_content_type` VALUES (11, 'dashboard', 'company');
INSERT INTO `django_content_type` VALUES (12, 'dashboard', 'competency');
INSERT INTO `django_content_type` VALUES (20, 'dashboard', 'contentglobal');
INSERT INTO `django_content_type` VALUES (21, 'dashboard', 'contentresponse');
INSERT INTO `django_content_type` VALUES (22, 'dashboard', 'followupitem');
INSERT INTO `django_content_type` VALUES (15, 'dashboard', 'note');
INSERT INTO `django_content_type` VALUES (18, 'dashboard', 'questionanswer');
INSERT INTO `django_content_type` VALUES (19, 'dashboard', 'questionglobal');
INSERT INTO `django_content_type` VALUES (13, 'dashboard', 'roadmap');
INSERT INTO `django_content_type` VALUES (17, 'dashboard', 'roadmapassignment');
INSERT INTO `django_content_type` VALUES (14, 'dashboard', 'stage');
INSERT INTO `django_content_type` VALUES (5, 'dashboard', 'user');
INSERT INTO `django_content_type` VALUES (4, 'notifications', 'noticetype');
INSERT INTO `django_content_type` VALUES (3, 'notifications', 'notification');
INSERT INTO `django_content_type` VALUES (1, 'postman', 'message');
INSERT INTO `django_content_type` VALUES (2, 'postman', 'pendingmessage');
INSERT INTO `django_content_type` VALUES (31, 'push_notifications', 'apnsdevice');
INSERT INTO `django_content_type` VALUES (32, 'push_notifications', 'gcmdevice');
INSERT INTO `django_content_type` VALUES (34, 'push_notifications', 'webpushdevice');
INSERT INTO `django_content_type` VALUES (33, 'push_notifications', 'wnsdevice');
INSERT INTO `django_content_type` VALUES (29, 'sessions', 'session');
INSERT INTO `django_content_type` VALUES (30, 'sites', 'site');

-- ----------------------------
-- Table structure for django_migrations
-- ----------------------------
DROP TABLE IF EXISTS `django_migrations`;
CREATE TABLE `django_migrations`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 184 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of django_migrations
-- ----------------------------
INSERT INTO `django_migrations` VALUES (1, 'contenttypes', '0001_initial', '2020-11-10 13:15:50.010404');
INSERT INTO `django_migrations` VALUES (2, 'contenttypes', '0002_remove_content_type_name', '2020-11-10 13:15:50.808668');
INSERT INTO `django_migrations` VALUES (3, 'auth', '0001_initial', '2020-11-10 13:15:52.192062');
INSERT INTO `django_migrations` VALUES (4, 'auth', '0002_alter_permission_name_max_length', '2020-11-10 13:15:57.717360');
INSERT INTO `django_migrations` VALUES (5, 'auth', '0003_alter_user_email_max_length', '2020-11-10 13:15:57.792180');
INSERT INTO `django_migrations` VALUES (6, 'auth', '0004_alter_user_username_opts', '2020-11-10 13:15:57.846875');
INSERT INTO `django_migrations` VALUES (7, 'auth', '0005_alter_user_last_login_null', '2020-11-10 13:15:57.884880');
INSERT INTO `django_migrations` VALUES (8, 'auth', '0006_require_contenttypes_0002', '2020-11-10 13:15:57.963703');
INSERT INTO `django_migrations` VALUES (9, 'auth', '0007_alter_validators_add_error_messages', '2020-11-10 13:15:58.148732');
INSERT INTO `django_migrations` VALUES (10, 'auth', '0008_alter_user_username_max_length', '2020-11-10 13:15:58.203046');
INSERT INTO `django_migrations` VALUES (11, 'auth', '0009_alter_user_last_name_max_length', '2020-11-10 13:15:58.233020');
INSERT INTO `django_migrations` VALUES (12, 'dashboard', '0001_initial', '2020-11-10 13:16:07.740019');
INSERT INTO `django_migrations` VALUES (13, 'admin', '0001_initial', '2020-11-10 13:16:36.401405');
INSERT INTO `django_migrations` VALUES (14, 'admin', '0002_logentry_remove_auto_add', '2020-11-10 13:16:37.957773');
INSERT INTO `django_migrations` VALUES (15, 'admin', '0003_logentry_add_action_flag_choices', '2020-11-10 13:16:38.016505');
INSERT INTO `django_migrations` VALUES (16, 'postman', '0001_initial', '2020-11-10 13:16:38.328225');
INSERT INTO `django_migrations` VALUES (17, 'notifications', '0001_initial', '2020-11-10 13:16:43.848188');
INSERT INTO `django_migrations` VALUES (18, 'dashboard', '0002_add_comment_student_field', '2020-11-10 13:16:47.852135');
INSERT INTO `django_migrations` VALUES (19, 'dashboard', '0003_auto_20180606_1428', '2020-11-10 13:16:49.341381');
INSERT INTO `django_migrations` VALUES (20, 'dashboard', '0004_auto_20180613_1505', '2020-11-10 13:16:50.125290');
INSERT INTO `django_migrations` VALUES (21, 'dashboard', '0005_auto_20180615_1629', '2020-11-10 13:16:52.487717');
INSERT INTO `django_migrations` VALUES (22, 'dashboard', '0006_auto_20180618_1340', '2020-11-10 13:16:52.917839');
INSERT INTO `django_migrations` VALUES (23, 'dashboard', '0007_remove_competency_video', '2020-11-10 13:16:54.804529');
INSERT INTO `django_migrations` VALUES (24, 'dashboard', '0008_auto_20180824_1635', '2020-11-10 13:16:57.144389');
INSERT INTO `django_migrations` VALUES (25, 'dashboard', '0009_auto_20181001_1606', '2020-11-10 13:16:57.725050');
INSERT INTO `django_migrations` VALUES (26, 'dashboard', '0010_auto_20181023_0835', '2020-11-10 13:16:59.676347');
INSERT INTO `django_migrations` VALUES (27, 'dashboard', '0011_auto_20181023_0853', '2020-11-10 13:16:59.883806');
INSERT INTO `django_migrations` VALUES (28, 'dashboard', '0012_auto_20181114_1100', '2020-11-10 13:17:00.017878');
INSERT INTO `django_migrations` VALUES (29, 'dashboard', '0013_convert_to_utf8mb4', '2020-11-10 13:17:13.041385');
INSERT INTO `django_migrations` VALUES (30, 'dashboard', '0014_auto_20181204_1105', '2020-11-10 13:17:13.313787');
INSERT INTO `django_migrations` VALUES (31, 'dashboard', '0015_company_private_labeled', '2020-11-10 13:17:13.569455');
INSERT INTO `django_migrations` VALUES (32, 'dashboard', '0016_attachment', '2020-11-10 13:17:13.801219');
INSERT INTO `django_migrations` VALUES (33, 'dashboard', '0017_auto_20181220_1020', '2020-11-10 13:17:17.231308');
INSERT INTO `django_migrations` VALUES (34, 'dashboard', '0018_auto_20190102_0905', '2020-11-10 13:17:19.536638');
INSERT INTO `django_migrations` VALUES (35, 'dashboard', '0019_company_requires_approval', '2020-11-10 13:17:19.733256');
INSERT INTO `django_migrations` VALUES (36, 'dashboard', '0020_auto_20190211_1540', '2020-11-10 13:17:22.212019');
INSERT INTO `django_migrations` VALUES (37, 'dashboard', '0021_user_valid_email', '2020-11-10 13:17:22.448649');
INSERT INTO `django_migrations` VALUES (38, 'dashboard', '0022_auto_20190301_1015', '2020-11-10 13:17:22.571931');
INSERT INTO `django_migrations` VALUES (39, 'dashboard', '0023_actionitemassessment_order', '2020-11-10 13:17:22.714849');
INSERT INTO `django_migrations` VALUES (40, 'dashboard', '0024_actionitemglobal_order', '2020-11-10 13:17:22.849762');
INSERT INTO `django_migrations` VALUES (41, 'dashboard', '0025_auto_20190731_1031', '2020-11-10 13:17:23.206491');
INSERT INTO `django_migrations` VALUES (42, 'dashboard', '0026_company_users_can_attach_files', '2020-11-10 13:17:23.376699');
INSERT INTO `django_migrations` VALUES (43, 'dashboard', '0027_auto_20190905_1505', '2020-11-10 13:17:24.487449');
INSERT INTO `django_migrations` VALUES (44, 'dashboard', '0028_auto_20190905_1548', '2020-11-10 13:17:24.863023');
INSERT INTO `django_migrations` VALUES (45, 'dashboard', '0029_company_conversations', '2020-11-10 13:17:24.983751');
INSERT INTO `django_migrations` VALUES (46, 'dashboard', '0030_stage_description', '2020-11-10 13:17:25.147255');
INSERT INTO `django_migrations` VALUES (47, 'dashboard', '0031_auto_20190913_1004', '2020-11-10 13:17:26.593721');
INSERT INTO `django_migrations` VALUES (48, 'dashboard', '0032_company_users_can_assign_coach', '2020-11-10 13:17:26.734332');
INSERT INTO `django_migrations` VALUES (49, 'dashboard', '0033_company_coach_synonym', '2020-11-10 13:17:26.954166');
INSERT INTO `django_migrations` VALUES (50, 'dashboard', '0034_company_terms_and_conditions', '2020-11-10 13:17:27.069798');
INSERT INTO `django_migrations` VALUES (51, 'dashboard', '0035_company_users_can_erase_their_account', '2020-11-10 13:17:27.208178');
INSERT INTO `django_migrations` VALUES (52, 'dashboard', '0036_roadmap_icon', '2020-11-10 13:17:27.397229');
INSERT INTO `django_migrations` VALUES (53, 'dashboard', '0037_auto_20191003_1242', '2020-11-10 13:17:27.733415');
INSERT INTO `django_migrations` VALUES (54, 'dashboard', '0038_auto_20191003_1507', '2020-11-10 13:17:27.770935');
INSERT INTO `django_migrations` VALUES (55, 'dashboard', '0039_auto_20191004_2050', '2020-11-10 13:17:27.822046');
INSERT INTO `django_migrations` VALUES (56, 'dashboard', '0040_company_user_synonym', '2020-11-10 13:17:27.999618');
INSERT INTO `django_migrations` VALUES (57, 'dashboard', '0041_company_dark_ui', '2020-11-10 13:17:28.159711');
INSERT INTO `django_migrations` VALUES (58, 'dashboard', '0042_company_competency_notes_journal_section', '2020-11-10 13:17:28.282445');
INSERT INTO `django_migrations` VALUES (59, 'dashboard', '0043_auto_20191009_1112', '2020-11-10 13:17:28.959482');
INSERT INTO `django_migrations` VALUES (60, 'dashboard', '0044_company_coach_notes', '2020-11-10 13:17:29.180471');
INSERT INTO `django_migrations` VALUES (61, 'dashboard', '0045_auto_20191009_1543', '2020-11-10 13:17:29.223043');
INSERT INTO `django_migrations` VALUES (62, 'dashboard', '0046_auto_20191009_1552', '2020-11-10 13:17:29.256247');
INSERT INTO `django_migrations` VALUES (63, 'dashboard', '0047_auto_20191009_2349', '2020-11-10 13:17:29.444197');
INSERT INTO `django_migrations` VALUES (64, 'dashboard', '0048_auto_20191010_0028', '2020-11-10 13:17:32.078077');
INSERT INTO `django_migrations` VALUES (65, 'dashboard', '0049_auto_20191010_0034', '2020-11-10 13:17:37.147229');
INSERT INTO `django_migrations` VALUES (66, 'dashboard', '0050_auto_20191010_1526', '2020-11-10 13:17:37.460218');
INSERT INTO `django_migrations` VALUES (67, 'dashboard', '0051_auto_20191014_1036', '2020-11-10 13:17:37.611787');
INSERT INTO `django_migrations` VALUES (68, 'dashboard', '0052_auto_20191014_1534', '2020-11-10 13:17:37.814761');
INSERT INTO `django_migrations` VALUES (69, 'dashboard', '0053_auto_20191014_2310', '2020-11-10 13:17:38.104981');
INSERT INTO `django_migrations` VALUES (70, 'dashboard', '0054_auto_20191016_0037', '2020-11-10 13:17:40.695243');
INSERT INTO `django_migrations` VALUES (71, 'dashboard', '0055_auto_20191016_0043', '2020-11-10 13:17:40.950714');
INSERT INTO `django_migrations` VALUES (72, 'dashboard', '0056_auto_20191017_2307', '2020-11-10 13:17:44.057426');
INSERT INTO `django_migrations` VALUES (73, 'dashboard', '0057_auto_20191017_2314', '2020-11-10 13:17:46.075381');
INSERT INTO `django_migrations` VALUES (74, 'dashboard', '0058_auto_20191017_2318', '2020-11-10 13:17:51.457466');
INSERT INTO `django_migrations` VALUES (75, 'dashboard', '0059_auto_20191018_1536', '2020-11-10 13:17:55.865529');
INSERT INTO `django_migrations` VALUES (76, 'dashboard', '0060_auto_20191022_0958', '2020-11-10 13:17:56.622180');
INSERT INTO `django_migrations` VALUES (77, 'dashboard', '0061_auto_20191022_1218', '2020-11-10 13:18:01.045074');
INSERT INTO `django_migrations` VALUES (78, 'dashboard', '0062_auto_20191022_1222', '2020-11-10 13:18:01.431476');
INSERT INTO `django_migrations` VALUES (79, 'dashboard', '0063_auto_20191022_1359', '2020-11-10 13:18:04.246611');
INSERT INTO `django_migrations` VALUES (80, 'dashboard', '0064_auto_20191022_1522', '2020-11-10 13:18:05.571224');
INSERT INTO `django_migrations` VALUES (81, 'dashboard', '0065_auto_20191023_1415', '2020-11-10 13:18:06.502448');
INSERT INTO `django_migrations` VALUES (82, 'dashboard', '0066_auto_20191023_1731', '2020-11-10 13:18:06.612823');
INSERT INTO `django_migrations` VALUES (83, 'dashboard', '0067_auto_20191023_1732', '2020-11-10 13:18:07.114152');
INSERT INTO `django_migrations` VALUES (84, 'dashboard', '0068_auto_20191023_1746', '2020-11-10 13:18:13.896159');
INSERT INTO `django_migrations` VALUES (85, 'dashboard', '0069_auto_20191023_2117', '2020-11-10 13:18:17.774725');
INSERT INTO `django_migrations` VALUES (86, 'dashboard', '0070_auto_20191023_2131', '2020-11-10 13:18:18.275024');
INSERT INTO `django_migrations` VALUES (87, 'dashboard', '0071_auto_20191024_0004', '2020-11-10 13:18:18.730846');
INSERT INTO `django_migrations` VALUES (88, 'dashboard', '0072_auto_20191024_0034', '2020-11-10 13:18:18.905519');
INSERT INTO `django_migrations` VALUES (89, 'dashboard', '0073_auto_20191025_1401', '2020-11-10 13:18:18.976007');
INSERT INTO `django_migrations` VALUES (90, 'dashboard', '0074_auto_20191028_2030', '2020-11-10 13:18:19.216523');
INSERT INTO `django_migrations` VALUES (91, 'dashboard', '0075_auto_20191028_2054', '2020-11-10 13:18:19.521707');
INSERT INTO `django_migrations` VALUES (92, 'dashboard', '0076_auto_20191109_1025', '2020-11-10 13:18:19.857611');
INSERT INTO `django_migrations` VALUES (93, 'dashboard', '0077_auto_20191109_2306', '2020-11-10 13:18:20.817023');
INSERT INTO `django_migrations` VALUES (94, 'dashboard', '0078_auto_20191110_1030', '2020-11-10 13:18:25.506833');
INSERT INTO `django_migrations` VALUES (95, 'dashboard', '0079_auto_20191110_2303', '2020-11-10 13:18:26.213665');
INSERT INTO `django_migrations` VALUES (96, 'dashboard', '0080_auto_20191110_2350', '2020-11-10 13:18:30.577613');
INSERT INTO `django_migrations` VALUES (97, 'dashboard', '0081_auto_20191111_0004', '2020-11-10 13:18:30.697024');
INSERT INTO `django_migrations` VALUES (98, 'dashboard', '0082_auto_20191112_1059', '2020-11-10 13:18:31.063028');
INSERT INTO `django_migrations` VALUES (99, 'dashboard', '0083_auto_20191112_1154', '2020-11-10 13:18:31.340521');
INSERT INTO `django_migrations` VALUES (100, 'dashboard', '0084_auto_20191112_1218', '2020-11-10 13:18:31.813263');
INSERT INTO `django_migrations` VALUES (101, 'dashboard', '0085_auto_20191113_1658', '2020-11-10 13:18:32.235821');
INSERT INTO `django_migrations` VALUES (102, 'dashboard', '0086_auto_20191121_1016', '2020-11-10 13:18:32.522634');
INSERT INTO `django_migrations` VALUES (103, 'dashboard', '0087_auto_20191121_1656', '2020-11-10 13:18:35.004896');
INSERT INTO `django_migrations` VALUES (104, 'dashboard', '0088_auto_20191126_1358', '2020-11-10 13:18:35.125564');
INSERT INTO `django_migrations` VALUES (105, 'dashboard', '0089_auto_20191126_1936', '2020-11-10 13:18:35.302888');
INSERT INTO `django_migrations` VALUES (106, 'dashboard', '0090_auto_20191202_1030', '2020-11-10 13:18:35.471380');
INSERT INTO `django_migrations` VALUES (107, 'dashboard', '0091_auto_20191219_1214', '2020-11-10 13:18:35.738605');
INSERT INTO `django_migrations` VALUES (108, 'dashboard', '0092_auto_20191219_1227', '2020-11-10 13:18:35.958258');
INSERT INTO `django_migrations` VALUES (109, 'dashboard', '0093_auto_20191219_1230', '2020-11-10 13:18:37.022508');
INSERT INTO `django_migrations` VALUES (110, 'dashboard', '0094_auto_20191220_2120', '2020-11-10 13:18:37.150813');
INSERT INTO `django_migrations` VALUES (111, 'dashboard', '0095_auto_20200107_1649', '2020-11-10 13:18:37.385280');
INSERT INTO `django_migrations` VALUES (112, 'dashboard', '0096_auto_20200107_1659', '2020-11-10 13:18:39.361205');
INSERT INTO `django_migrations` VALUES (113, 'dashboard', '0097_auto_20200204_1315', '2020-11-10 13:18:39.419439');
INSERT INTO `django_migrations` VALUES (114, 'dashboard', '0098_auto_20200226_1647', '2020-11-10 13:18:39.672638');
INSERT INTO `django_migrations` VALUES (115, 'dashboard', '0099_auto_20200310_2034', '2020-11-10 13:18:39.847536');
INSERT INTO `django_migrations` VALUES (116, 'dashboard', '0100_auto_20200310_2058', '2020-11-10 13:18:39.993040');
INSERT INTO `django_migrations` VALUES (117, 'dashboard', '0101_auto_20200319_1229', '2020-11-10 13:18:40.546555');
INSERT INTO `django_migrations` VALUES (118, 'dashboard', '0102_auto_20200323_1719', '2020-11-10 13:18:41.020976');
INSERT INTO `django_migrations` VALUES (119, 'dashboard', '0103_auto_20200323_1737', '2020-11-10 13:18:46.413685');
INSERT INTO `django_migrations` VALUES (120, 'dashboard', '0104_auto_20200330_1446', '2020-11-10 13:18:46.852632');
INSERT INTO `django_migrations` VALUES (121, 'dashboard', '0105_auto_20200406_1716', '2020-11-10 13:18:47.109583');
INSERT INTO `django_migrations` VALUES (122, 'dashboard', '0106_auto_20200406_1754', '2020-11-10 13:18:49.442698');
INSERT INTO `django_migrations` VALUES (123, 'dashboard', '0107_auto_20200414_2212', '2020-11-10 13:18:50.275070');
INSERT INTO `django_migrations` VALUES (124, 'dashboard', '0108_auto_20200414_2225', '2020-11-10 13:18:56.398510');
INSERT INTO `django_migrations` VALUES (125, 'dashboard', '0109_auto_20200418_2238', '2020-11-10 13:18:59.532613');
INSERT INTO `django_migrations` VALUES (126, 'dashboard', '0110_auto_20200423_0056', '2020-11-10 13:18:59.669339');
INSERT INTO `django_migrations` VALUES (127, 'dashboard', '0111_auto_20200427_1820', '2020-11-10 13:18:59.759395');
INSERT INTO `django_migrations` VALUES (128, 'dashboard', '0112_auto_20200505_2222', '2020-11-10 13:18:59.910245');
INSERT INTO `django_migrations` VALUES (129, 'dashboard', '0113_auto_20200602_1357', '2020-11-10 13:19:00.177962');
INSERT INTO `django_migrations` VALUES (130, 'dashboard', '0114_auto_20200604_0839', '2020-11-10 13:19:00.375054');
INSERT INTO `django_migrations` VALUES (131, 'dashboard', '0115_auto_20200604_0842', '2020-11-10 13:19:00.604220');
INSERT INTO `django_migrations` VALUES (132, 'dashboard', '0116_auto_20200604_1036', '2020-11-10 13:19:00.830260');
INSERT INTO `django_migrations` VALUES (133, 'dashboard', '0117_auto_20200722_1447', '2020-11-10 13:19:01.593822');
INSERT INTO `django_migrations` VALUES (134, 'dashboard', '0118_auto_20200729_1607', '2020-11-10 13:19:02.829290');
INSERT INTO `django_migrations` VALUES (135, 'dashboard', '0119_remove_actionitemglobal_description', '2020-11-10 13:19:02.939408');
INSERT INTO `django_migrations` VALUES (136, 'dashboard', '0120_remove_actionitemglobal_resolutions', '2020-11-10 13:19:03.051622');
INSERT INTO `django_migrations` VALUES (137, 'dashboard', '0121_actionitemglobal_resolutions', '2020-11-10 13:19:03.209792');
INSERT INTO `django_migrations` VALUES (138, 'dashboard', '0122_auto_20200731_0201', '2020-11-10 13:19:04.112272');
INSERT INTO `django_migrations` VALUES (139, 'dashboard', '0123_attachment_actionitem', '2020-11-10 13:19:04.244780');
INSERT INTO `django_migrations` VALUES (140, 'dashboard', '0124_actionitemglobal_description', '2020-11-10 13:19:05.608603');
INSERT INTO `django_migrations` VALUES (141, 'dashboard', '0125_auto_20200803_1720', '2020-11-10 13:19:06.472186');
INSERT INTO `django_migrations` VALUES (142, 'dashboard', '0126_auto_20200803_1925', '2020-11-10 13:19:06.619222');
INSERT INTO `django_migrations` VALUES (143, 'dashboard', '0127_auto_20200907_1203', '2020-11-10 13:19:07.191325');
INSERT INTO `django_migrations` VALUES (144, 'api', '0001_initial', '2020-11-10 13:19:07.390659');
INSERT INTO `django_migrations` VALUES (145, 'api', '0002_peerlastreadmessagetimestamp', '2020-11-10 13:19:09.401450');
INSERT INTO `django_migrations` VALUES (146, 'api', '0003_peertopeermessage', '2020-11-10 13:19:10.830686');
INSERT INTO `django_migrations` VALUES (147, 'auth', '0010_alter_group_name_max_length', '2020-11-10 13:19:13.601623');
INSERT INTO `django_migrations` VALUES (148, 'auth', '0011_update_proxy_permissions', '2020-11-10 13:19:13.742495');
INSERT INTO `django_migrations` VALUES (149, 'authtoken', '0001_initial', '2020-11-10 13:19:13.947176');
INSERT INTO `django_migrations` VALUES (150, 'authtoken', '0002_auto_20160226_1747', '2020-11-10 13:19:15.661520');
INSERT INTO `django_migrations` VALUES (151, 'dashboard', '0128_auto_20201020_1026', '2020-11-10 13:19:16.884084');
INSERT INTO `django_migrations` VALUES (152, 'notifications', '0002_auto_20181221_0816', '2020-11-10 13:19:16.932791');
INSERT INTO `django_migrations` VALUES (153, 'notifications', '0003_auto_20190104_1139', '2020-11-10 13:19:16.984695');
INSERT INTO `django_migrations` VALUES (154, 'notifications', '0004_auto_20190206_0743', '2020-11-10 13:19:17.120313');
INSERT INTO `django_migrations` VALUES (155, 'notifications', '0005_auto_20191219_1214', '2020-11-10 13:19:17.180551');
INSERT INTO `django_migrations` VALUES (156, 'notifications', '0006_auto_20200310_2034', '2020-11-10 13:19:17.258439');
INSERT INTO `django_migrations` VALUES (157, 'notifications', '0007_noticetype', '2020-11-10 13:19:17.691061');
INSERT INTO `django_migrations` VALUES (158, 'notifications', '0008_notification_sender_company', '2020-11-10 13:19:17.867736');
INSERT INTO `django_migrations` VALUES (159, 'push_notifications', '0001_initial', '2020-11-10 13:19:19.399698');
INSERT INTO `django_migrations` VALUES (160, 'push_notifications', '0002_auto_20160106_0850', '2020-11-10 13:19:21.856321');
INSERT INTO `django_migrations` VALUES (161, 'push_notifications', '0003_wnsdevice', '2020-11-10 13:19:22.229502');
INSERT INTO `django_migrations` VALUES (162, 'push_notifications', '0004_fcm', '2020-11-10 13:19:24.897359');
INSERT INTO `django_migrations` VALUES (163, 'push_notifications', '0005_applicationid', '2020-11-10 13:19:25.426495');
INSERT INTO `django_migrations` VALUES (164, 'push_notifications', '0006_webpushdevice', '2020-11-10 13:19:25.967139');
INSERT INTO `django_migrations` VALUES (165, 'push_notifications', '0007_uniquesetting', '2020-11-10 13:19:27.558134');
INSERT INTO `django_migrations` VALUES (166, 'sessions', '0001_initial', '2020-11-10 13:19:27.799562');
INSERT INTO `django_migrations` VALUES (167, 'sites', '0001_initial', '2020-11-10 13:19:28.361246');
INSERT INTO `django_migrations` VALUES (168, 'sites', '0002_alter_domain_unique', '2020-11-10 13:19:28.623122');
INSERT INTO `django_migrations` VALUES (169, 'dashboard', '0129_attachment_file_category', '2020-11-23 13:13:17.618048');
INSERT INTO `django_migrations` VALUES (170, 'dashboard', '0130_company_default_theme', '2020-11-30 15:47:37.750627');
INSERT INTO `django_migrations` VALUES (171, 'dashboard', '0131_auto_20201215_0959', '2020-12-20 02:43:46.221422');
INSERT INTO `django_migrations` VALUES (172, 'dashboard', '0132_auto_20201218_1118', '2020-12-20 02:43:46.274577');
INSERT INTO `django_migrations` VALUES (173, 'dashboard', '0133_company_users_can_invite_coach', '2020-12-20 02:43:46.492449');
INSERT INTO `django_migrations` VALUES (174, 'notifications', '0009_auto_20201217_0913', '2020-12-20 02:43:46.594388');
INSERT INTO `django_migrations` VALUES (175, 'dashboard', '0134_auto_20201218_1131', '2021-01-04 13:35:25.236032');
INSERT INTO `django_migrations` VALUES (176, 'dashboard', '0135_auto_20201218_1131', '2021-01-04 13:35:25.314971');
INSERT INTO `django_migrations` VALUES (177, 'dashboard', '0136_auto_20201230_0952', '2021-01-15 00:52:51.232390');
INSERT INTO `django_migrations` VALUES (178, 'dashboard', '0137_auto_20210113_1026', '2021-01-15 00:52:51.279022');
INSERT INTO `django_migrations` VALUES (179, 'dashboard', '0138_auto_20210113_1142', '2021-01-19 01:17:04.055111');
INSERT INTO `django_migrations` VALUES (180, 'dashboard', '0139_auto_20210115_1053', '2021-01-19 01:17:04.256245');
INSERT INTO `django_migrations` VALUES (181, 'dashboard', '0140_auto_20210115_1102', '2021-02-01 00:05:22.238346');
INSERT INTO `django_migrations` VALUES (182, 'dashboard', '0141_auto_20210226_1112', '2021-02-28 08:58:34.194733');
INSERT INTO `django_migrations` VALUES (183, 'dashboard', '0142_auto_20210323_0902', '2021-03-23 15:02:27.908415');

-- ----------------------------
-- Table structure for django_session
-- ----------------------------
DROP TABLE IF EXISTS `django_session`;
CREATE TABLE `django_session`  (
  `session_key` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`) USING BTREE,
  INDEX `django_session_expire_date_a5c62663`(`expire_date`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of django_session
-- ----------------------------
INSERT INTO `django_session` VALUES ('01nrnzcfac6m6b6crdnauzv14cvz2y33', 'ZjllOTE2NmE3MGNhYWE0ZGQ5OWNmZTYwODg2YzJlODRjNTEzMzViMDp7InByaXZhdGVfY29tcGFueV9pZCI6IiJ9', '2030-11-08 15:57:09.566154');
INSERT INTO `django_session` VALUES ('09ua56c29um4ovgkn7mm1bzrqgl87qxi', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-21 19:39:03.911386');
INSERT INTO `django_session` VALUES ('09xv7sadrxowhqdcszxt95uffgbvyehu', 'YmUwYWU2ZmY1MzQ0ZWMzZWQ3YWE4NTRmM2U0Zjg5MjJhYzI3MTg0ZTp7InByaXZhdGVfY29tcGFueV9pZCI6IiIsIl9hdXRoX3VzZXJfaWQiOiIxIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJhYmUwM2Y0YzMzZmEzMzVhYmNiMTY0MTlkYTk1YjQyNTZmMWIzMTljIn0=', '2030-11-17 16:57:49.808773');
INSERT INTO `django_session` VALUES ('0tmxqf9o7njtj7v7p0b98k8tded92yha', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-11-28 15:21:14.844498');
INSERT INTO `django_session` VALUES ('0v2kcs1ouj067ot08c5k3iwtoyt5tpts', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-21 19:17:17.164651');
INSERT INTO `django_session` VALUES ('0vpwbi5ylu62j1gtk3ldmvsdmnntua21', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2031-01-10 18:45:51.732350');
INSERT INTO `django_session` VALUES ('1816ksvmifaqokmey9ysf2ricx95ix1v', 'ZWVjZTEyN2MwNGQ3MzkwMmM0ZjJlNTc2ZjA0OThhZWJhMjY4ZjI5NDp7InByaXZhdGVfY29tcGFueV9pZCI6IiIsIl9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-11-08 18:35:04.955111');
INSERT INTO `django_session` VALUES ('18o3mpsd6txrlu4yv05733q5vo8kemte', 'YjZkYTA2YjU4NDRkMjRkZTRmMWNhZTcxZjFhMDkwYjQ1MzUzYTMxYjp7Il9hdXRoX3VzZXJfaWQiOiIyMyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzgzNzI2NGEwYmQ0OTdkNTk5ZmFkZmI3ODAxNDIzMDQxMmM3YmY1YSJ9', '2030-11-23 14:32:32.046772');
INSERT INTO `django_session` VALUES ('1xts9rmkts7mslvf833nr4a2pxgy162c', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-26 16:05:46.342391');
INSERT INTO `django_session` VALUES ('21fv6pg0fs0f5qnlwj28dacr5una16hr', 'YjZkYTA2YjU4NDRkMjRkZTRmMWNhZTcxZjFhMDkwYjQ1MzUzYTMxYjp7Il9hdXRoX3VzZXJfaWQiOiIyMyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzgzNzI2NGEwYmQ0OTdkNTk5ZmFkZmI3ODAxNDIzMDQxMmM3YmY1YSJ9', '2030-11-15 18:47:08.271047');
INSERT INTO `django_session` VALUES ('27ovbh2xjel7wtz5vuydc6mo0dbaiujg', 'ZWVjZTEyN2MwNGQ3MzkwMmM0ZjJlNTc2ZjA0OThhZWJhMjY4ZjI5NDp7InByaXZhdGVfY29tcGFueV9pZCI6IiIsIl9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-19 20:08:25.484251');
INSERT INTO `django_session` VALUES ('2pb6wepd9wcei9xfg480xk0803ncgv69', 'MzlhZmY5MTQ4ZTI0NzZmMGExZTk2OGE2NTc2ZTU4OTZmOWExNzliZDp7Il9hdXRoX3VzZXJfaWQiOiIyNyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiN2E4MDEzNDBhYzRiOGQxYWRjOTZiZTg5MGNkNDljNDZhYjAzMjMwYSJ9', '2030-12-23 13:43:18.622364');
INSERT INTO `django_session` VALUES ('2prsuibxmfqew41ue81fz9qqskvj7cf4', 'NTkyMDQwMGFmZGI5MGUyNjk0ZjIyY2NlNTQ3OGJjZjdhNjRiNjExZDp7InByaXZhdGVfY29tcGFueV9pZCI6IiIsIl9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-01-30 00:44:52.419026');
INSERT INTO `django_session` VALUES ('2u524gg3ywv66zg2w68gyldhk4hmraoa', 'YjZkYTA2YjU4NDRkMjRkZTRmMWNhZTcxZjFhMDkwYjQ1MzUzYTMxYjp7Il9hdXRoX3VzZXJfaWQiOiIyMyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzgzNzI2NGEwYmQ0OTdkNTk5ZmFkZmI3ODAxNDIzMDQxMmM3YmY1YSJ9', '2030-11-15 14:03:43.706527');
INSERT INTO `django_session` VALUES ('39rg9a7zzidcqpnhyt4pkydagw8y7wxv', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-03-16 01:31:10.707942');
INSERT INTO `django_session` VALUES ('3vsgk8l6wp9hczbstq8746i6up0wg4uf', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-06 18:18:33.724534');
INSERT INTO `django_session` VALUES ('46z3wxsz89ty3b8v6gjy98biqoncjwg6', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-21 19:18:18.199960');
INSERT INTO `django_session` VALUES ('4apzfstn9bhsrpwaig3efx9wnc82vnfc', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 15:49:37.622594');
INSERT INTO `django_session` VALUES ('4o236fn6ekq7zq9ec8mf27jj25ny7jb7', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 16:04:01.077856');
INSERT INTO `django_session` VALUES ('516kcabsepd7zl2y1g4qdt0jp192whsh', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 15:47:36.025039');
INSERT INTO `django_session` VALUES ('56o3c1ptljkmen4x0txk2yt02cvswad1', 'YmUwYWU2ZmY1MzQ0ZWMzZWQ3YWE4NTRmM2U0Zjg5MjJhYzI3MTg0ZTp7InByaXZhdGVfY29tcGFueV9pZCI6IiIsIl9hdXRoX3VzZXJfaWQiOiIxIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJhYmUwM2Y0YzMzZmEzMzVhYmNiMTY0MTlkYTk1YjQyNTZmMWIzMTljIn0=', '2030-11-11 20:54:32.862711');
INSERT INTO `django_session` VALUES ('5he87anz124p6zcur8s2rloobot25arg', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 16:02:12.900875');
INSERT INTO `django_session` VALUES ('62xb2xze5proif8uil6gk5xg8jz96d43', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-01-13 13:57:37.893071');
INSERT INTO `django_session` VALUES ('63x8ts69gz6t58elr0nyw6bi5qhqi8g7', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-11-08 18:22:18.449290');
INSERT INTO `django_session` VALUES ('6fyypn26onabo1b5s45z2tii5llhptz3', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-09 10:22:47.563361');
INSERT INTO `django_session` VALUES ('6qzbzapnseumktfy3qr4jxev6663mus6', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-21 19:16:11.111894');
INSERT INTO `django_session` VALUES ('6z8akq4noiir9pszw4c601n8jxieqh53', 'MmFmNDUxMzk1MThmZGI1Y2UzYTRlMWZhMjk3Yzc4ODE3NTE2NDE3ZTp7Il9hdXRoX3VzZXJfaWQiOiIyNiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiMDBlNTMyMzk0YjQ3OThkODBlYmQ3Nzk3Mzk4ZTRjNDgxZDAxYTU3NiJ9', '2030-12-22 21:35:31.115163');
INSERT INTO `django_session` VALUES ('74e73qjdssnlowqmv2v0hbsp2v0d8cy0', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-06 17:59:23.898228');
INSERT INTO `django_session` VALUES ('74ywc1dcksj84rlrsgd54e5r6dtnezld', 'YmUwYWU2ZmY1MzQ0ZWMzZWQ3YWE4NTRmM2U0Zjg5MjJhYzI3MTg0ZTp7InByaXZhdGVfY29tcGFueV9pZCI6IiIsIl9hdXRoX3VzZXJfaWQiOiIxIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJhYmUwM2Y0YzMzZmEzMzVhYmNiMTY0MTlkYTk1YjQyNTZmMWIzMTljIn0=', '2030-12-23 14:42:11.596623');
INSERT INTO `django_session` VALUES ('7b443l7nap6wn83iw8hp6josuxyxk91p', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2031-01-05 01:03:54.806633');
INSERT INTO `django_session` VALUES ('7eewf8qwqxf6omorva4u1cjhx2tmnuwp', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 15:50:56.945015');
INSERT INTO `django_session` VALUES ('7gbmqadyrzrwfyku20oos5t3odd0m1qu', 'MDg0NjJkOGU0ODM4ODc1NWI2OGI2YWI4ODFhMjk4Yzc0MWU0ZjJlMzp7Il9hdXRoX3VzZXJfaWQiOiIyOSIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiYmE0NzY3ZGQ4Y2YyODI4Y2QyZTJlYTNiZDFhMDJkYWYxN2FjYzI1MiJ9', '2030-12-23 14:40:25.341477');
INSERT INTO `django_session` VALUES ('7n12ditqddg4uccmc39lxxssijxw4ais', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-21 19:41:44.169379');
INSERT INTO `django_session` VALUES ('7we0z7l8fpzot2fyg6vrescbvgpykmie', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-06 18:01:49.294617');
INSERT INTO `django_session` VALUES ('7yirggxx7t6zuhil8peftshrlgf6fbxk', 'MDg0NjJkOGU0ODM4ODc1NWI2OGI2YWI4ODFhMjk4Yzc0MWU0ZjJlMzp7Il9hdXRoX3VzZXJfaWQiOiIyOSIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiYmE0NzY3ZGQ4Y2YyODI4Y2QyZTJlYTNiZDFhMDJkYWYxN2FjYzI1MiJ9', '2030-12-23 14:04:34.414422');
INSERT INTO `django_session` VALUES ('8bq4mx1mehh68lzp5eza16v9gj0c1l8u', 'ZjllOTE2NmE3MGNhYWE0ZGQ5OWNmZTYwODg2YzJlODRjNTEzMzViMDp7InByaXZhdGVfY29tcGFueV9pZCI6IiJ9', '2030-12-21 20:01:00.718683');
INSERT INTO `django_session` VALUES ('8gfnuuj3buudqxxytnow3xuod5u34zry', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 16:11:08.577270');
INSERT INTO `django_session` VALUES ('8j8jutbitrmn46wtu4rkitekiw5i75wj', 'YjZkYTA2YjU4NDRkMjRkZTRmMWNhZTcxZjFhMDkwYjQ1MzUzYTMxYjp7Il9hdXRoX3VzZXJfaWQiOiIyMyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzgzNzI2NGEwYmQ0OTdkNTk5ZmFkZmI3ODAxNDIzMDQxMmM3YmY1YSJ9', '2030-11-23 20:56:00.927898');
INSERT INTO `django_session` VALUES ('8nrj4s4tidovl4z09d55noj3j9y6of1g', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-06 18:02:19.352292');
INSERT INTO `django_session` VALUES ('9hr860bh4vwth9olz8f67z22k3ru23na', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-01-18 00:13:37.821738');
INSERT INTO `django_session` VALUES ('9rt5gddf0mqmn9ths4x43aos2hq37rx5', 'OWI1YzM3Zjk1MGViYThhMjY2NzFlYjljZTFmNWY4YzhkNmM5ZWM1YTp7InByaXZhdGVfY29tcGFueV9pZCI6IiIsIl9hdXRoX3VzZXJfaWQiOiIyIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIwMWNiNDY3NGZjNTIzMzk2OTE4MWQ3OWY4NmJlZTBiZDI4YjQ5MWM2In0=', '2030-12-18 05:57:29.367157');
INSERT INTO `django_session` VALUES ('aahcqnb695ofprgkcpne7n2bzzn8v39p', 'N2Q1ZWQ4ZjcxMGQ3NDYxOGE0MDY1YjE0NzBjMWRmZmMzZTI3ZjNmYjp7Il9hdXRoX3VzZXJfaWQiOiIxIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJhYmUwM2Y0YzMzZmEzMzVhYmNiMTY0MTlkYTk1YjQyNTZmMWIzMTljIiwicHJpdmF0ZV9jb21wYW55X2lkIjoiIn0=', '2030-12-19 20:26:05.890782');
INSERT INTO `django_session` VALUES ('aar6qoswdbdqbw90cuptlsudu98xzd44', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 15:28:52.818448');
INSERT INTO `django_session` VALUES ('b3r2huzka56im2mqtsc1twc4l814gqev', 'YjZkYTA2YjU4NDRkMjRkZTRmMWNhZTcxZjFhMDkwYjQ1MzUzYTMxYjp7Il9hdXRoX3VzZXJfaWQiOiIyMyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzgzNzI2NGEwYmQ0OTdkNTk5ZmFkZmI3ODAxNDIzMDQxMmM3YmY1YSJ9', '2030-11-18 17:14:09.183589');
INSERT INTO `django_session` VALUES ('b4677ihvybc2efrj2ot2jooshfzhx5i7', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-03-16 03:10:14.314283');
INSERT INTO `django_session` VALUES ('b9a9xwb1yfg9n2w5cx7syxy7r4ednw7h', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 16:18:25.026337');
INSERT INTO `django_session` VALUES ('bc0b1zlczvdbp9um4jvt8ta2zg8u2bin', 'ZjllOTE2NmE3MGNhYWE0ZGQ5OWNmZTYwODg2YzJlODRjNTEzMzViMDp7InByaXZhdGVfY29tcGFueV9pZCI6IiJ9', '2031-01-04 13:10:27.836576');
INSERT INTO `django_session` VALUES ('bhr75j589tresungq4n7su9r1jr83mks', 'MDg0NjJkOGU0ODM4ODc1NWI2OGI2YWI4ODFhMjk4Yzc0MWU0ZjJlMzp7Il9hdXRoX3VzZXJfaWQiOiIyOSIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiYmE0NzY3ZGQ4Y2YyODI4Y2QyZTJlYTNiZDFhMDJkYWYxN2FjYzI1MiJ9', '2030-12-23 14:07:37.498875');
INSERT INTO `django_session` VALUES ('botv2qfa31bawamypcqnp495f0bdf9xk', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 16:04:11.748777');
INSERT INTO `django_session` VALUES ('cstybdag52im348hw1aigbabsg938sqb', 'YjY0ZjYwMWJiMzhkYjkwYzVhYzBmMWQ5ZjJkMjAzY2YyZmY5OWMyZDp7Il9hdXRoX3VzZXJfaWQiOiI0MyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6IjlmMDZjMDRkY2Q1YzRlZTY0ZDM4NTAxZTc4ZTk3YWE1NzlhMzllZGYifQ==', '2031-03-09 00:28:42.268655');
INSERT INTO `django_session` VALUES ('d26aeqlx0sc0b763s1tu1rba1t7lt08o', 'MzgxN2RmM2RhMTczYzNmNTBkMzllOTk3YWEwZWI0NjVhODEyOWJmZjp7Il9hdXRoX3VzZXJfaWQiOiIyOCIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiOTdiYzM0ZjgyMzExYzBjMDRjNGE1N2I2MzIzYTk0OWZlNzUzNGQwNyJ9', '2030-12-23 13:48:24.223133');
INSERT INTO `django_session` VALUES ('d7byjd30t19m30peks1ej9kezg4wl8g1', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-01-30 00:14:07.141038');
INSERT INTO `django_session` VALUES ('db3dz5q3o6hvlyb7bmv3mbtvf00ezgml', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-06 18:01:17.470453');
INSERT INTO `django_session` VALUES ('djz8raa20zldzu8i51von7idjtmlpbo1', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 16:00:40.242163');
INSERT INTO `django_session` VALUES ('dk2bji83b9ma8286aejnl08vubyboowy', 'YjZkYTA2YjU4NDRkMjRkZTRmMWNhZTcxZjFhMDkwYjQ1MzUzYTMxYjp7Il9hdXRoX3VzZXJfaWQiOiIyMyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzgzNzI2NGEwYmQ0OTdkNTk5ZmFkZmI3ODAxNDIzMDQxMmM3YmY1YSJ9', '2030-11-23 14:30:53.324918');
INSERT INTO `django_session` VALUES ('dl486q53qe29zkuabrxsfhilql7z7bkb', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-11-08 16:26:46.658681');
INSERT INTO `django_session` VALUES ('dz4vbx8wbq9a1rtvt5r8mqycv0q7phmc', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-03-07 15:35:09.606321');
INSERT INTO `django_session` VALUES ('e6zegmfgyuc8kvl0a3lywzb6d7djhm4t', 'YmUwYWU2ZmY1MzQ0ZWMzZWQ3YWE4NTRmM2U0Zjg5MjJhYzI3MTg0ZTp7InByaXZhdGVfY29tcGFueV9pZCI6IiIsIl9hdXRoX3VzZXJfaWQiOiIxIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJhYmUwM2Y0YzMzZmEzMzVhYmNiMTY0MTlkYTk1YjQyNTZmMWIzMTljIn0=', '2030-11-17 16:53:18.770305');
INSERT INTO `django_session` VALUES ('eetpqx0lz4ivgvthqd6di2eidejj7yzz', 'YjZkYTA2YjU4NDRkMjRkZTRmMWNhZTcxZjFhMDkwYjQ1MzUzYTMxYjp7Il9hdXRoX3VzZXJfaWQiOiIyMyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzgzNzI2NGEwYmQ0OTdkNTk5ZmFkZmI3ODAxNDIzMDQxMmM3YmY1YSJ9', '2030-11-08 18:35:08.004012');
INSERT INTO `django_session` VALUES ('eo924rilhybih1i9ir8gws8wisl5hr3t', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-06 18:20:08.041494');
INSERT INTO `django_session` VALUES ('ets4gqk4dlljbj17n9qdten7votqv5w8', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2031-01-06 16:50:02.645442');
INSERT INTO `django_session` VALUES ('f1cj0cng4mv1z8r5pbl6flvvatez4agv', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 15:25:30.462042');
INSERT INTO `django_session` VALUES ('f98bsvp0q9fzjkixnfpmvip49wi08s66', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-01-23 01:14:53.113492');
INSERT INTO `django_session` VALUES ('fajb69ho5wez7psysevwmpiqbuui5mty', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-03-21 15:33:02.051573');
INSERT INTO `django_session` VALUES ('fhs7svlt2ogm8v5feimw310iiec7ampg', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-21 19:18:41.587315');
INSERT INTO `django_session` VALUES ('fq92q6lnq2aof02549fjdz4dwnm0d5up', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-01-13 13:58:18.643233');
INSERT INTO `django_session` VALUES ('fzyhykhsgjtiufmmfl7dx5fuuy939rwh', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-21 19:39:45.443143');
INSERT INTO `django_session` VALUES ('g6r3z86jwqi5k4zmpmqg9a48msux4kah', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-21 19:37:52.542259');
INSERT INTO `django_session` VALUES ('h2xp0p7o9deb5kk0ec6j6heitvybopzl', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-03-07 16:18:41.062929');
INSERT INTO `django_session` VALUES ('h7kv2fz8oouwmz1dv2dbqzkkaqygless', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-21 19:42:06.735302');
INSERT INTO `django_session` VALUES ('h8p7q7wbem5wnw6dahmom8q4h3yfn6rm', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-06 18:00:06.522020');
INSERT INTO `django_session` VALUES ('hslfakmuig3pk4xyqt3i5r7yeumrjr5x', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2031-01-06 16:49:34.420507');
INSERT INTO `django_session` VALUES ('hvtdx4kh1pk2qwpzxwn23s0ox6mtbt5x', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-03-03 18:33:12.437958');
INSERT INTO `django_session` VALUES ('hwovbascd7sehy96t6ov15vq27cbf2i3', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 16:07:08.579392');
INSERT INTO `django_session` VALUES ('i2gpr68ezqkti3sczetmsh5hsw5r4q41', 'ZWVjZTEyN2MwNGQ3MzkwMmM0ZjJlNTc2ZjA0OThhZWJhMjY4ZjI5NDp7InByaXZhdGVfY29tcGFueV9pZCI6IiIsIl9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-11-08 15:38:06.351423');
INSERT INTO `django_session` VALUES ('ilivz1cns507iewdt5pc4j9qqhrujb3u', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 16:20:16.141433');
INSERT INTO `django_session` VALUES ('j2bvd1k8bdxa4lnk0igoywvgryhejs3e', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 16:23:38.705672');
INSERT INTO `django_session` VALUES ('jghysevoq3rnlrf1fkk9coj6j2m3tb3f', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 16:02:21.396993');
INSERT INTO `django_session` VALUES ('jyr63w3zz0v2axznbwgnfc95jbpf19bn', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-01-18 00:47:36.322018');
INSERT INTO `django_session` VALUES ('jz38o0isqgyeluadr48z6dzz18rooz71', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-21 19:36:25.724836');
INSERT INTO `django_session` VALUES ('k7fsucwdt9aonlcgbix7y8am9e8dmjzs', 'ZjllOTE2NmE3MGNhYWE0ZGQ5OWNmZTYwODg2YzJlODRjNTEzMzViMDp7InByaXZhdGVfY29tcGFueV9pZCI6IiJ9', '2031-02-01 13:57:26.466399');
INSERT INTO `django_session` VALUES ('kc847v02i7eq16ybohelxrtac4mdk2is', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-01-17 19:45:26.642281');
INSERT INTO `django_session` VALUES ('ke31q7lwa3bwiyed8i53wnzpk3gbmp9x', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-03-09 16:12:39.443101');
INSERT INTO `django_session` VALUES ('kfxzmsuzh12se1wkwfjz8ccwqtmjmcez', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-11-08 19:04:57.676338');
INSERT INTO `django_session` VALUES ('kq9mwkswzx5z47sd1wpntrxxr4ta5cj1', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-21 19:36:50.831567');
INSERT INTO `django_session` VALUES ('kyr1mcowyyzzi8uupy06npvjgdp9trrt', 'ZjllOTE2NmE3MGNhYWE0ZGQ5OWNmZTYwODg2YzJlODRjNTEzMzViMDp7InByaXZhdGVfY29tcGFueV9pZCI6IiJ9', '2030-11-10 16:02:50.383961');
INSERT INTO `django_session` VALUES ('l35n6efo6rrzc37tonexk4gql7ah1zx6', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2031-01-10 18:46:08.246813');
INSERT INTO `django_session` VALUES ('l9vxvrumb3n3xz0r2c8ec0ewzuitiky1', 'YmUwYWU2ZmY1MzQ0ZWMzZWQ3YWE4NTRmM2U0Zjg5MjJhYzI3MTg0ZTp7InByaXZhdGVfY29tcGFueV9pZCI6IiIsIl9hdXRoX3VzZXJfaWQiOiIxIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJhYmUwM2Y0YzMzZmEzMzVhYmNiMTY0MTlkYTk1YjQyNTZmMWIzMTljIn0=', '2030-11-17 16:47:58.673986');
INSERT INTO `django_session` VALUES ('m479lmg3m3csjv011wpo36aey4rlvwwu', 'NTkyMDQwMGFmZGI5MGUyNjk0ZjIyY2NlNTQ3OGJjZjdhNjRiNjExZDp7InByaXZhdGVfY29tcGFueV9pZCI6IiIsIl9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-03-01 00:27:05.253478');
INSERT INTO `django_session` VALUES ('mcpw423cctmzyxb2sxjrq3tusp77vw9m', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-21 19:38:34.753813');
INSERT INTO `django_session` VALUES ('mmpjvovq92wj0m8rr85jwmylbjwh2j5s', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-01-17 19:53:02.274799');
INSERT INTO `django_session` VALUES ('mqqcylm3a2pzdpztwui3cf51tq4deypp', 'ZWVjZTEyN2MwNGQ3MzkwMmM0ZjJlNTc2ZjA0OThhZWJhMjY4ZjI5NDp7InByaXZhdGVfY29tcGFueV9pZCI6IiIsIl9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-12-22 20:13:53.750061');
INSERT INTO `django_session` VALUES ('mrve6ay2e6sp6pfnl0fspufvm09pto0f', 'OWI1YzM3Zjk1MGViYThhMjY2NzFlYjljZTFmNWY4YzhkNmM5ZWM1YTp7InByaXZhdGVfY29tcGFueV9pZCI6IiIsIl9hdXRoX3VzZXJfaWQiOiIyIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIwMWNiNDY3NGZjNTIzMzk2OTE4MWQ3OWY4NmJlZTBiZDI4YjQ5MWM2In0=', '2030-12-19 16:56:04.045102');
INSERT INTO `django_session` VALUES ('n8tb5qqogbgyyyd481zo9ioqsq6rmoz2', 'YmUwYWU2ZmY1MzQ0ZWMzZWQ3YWE4NTRmM2U0Zjg5MjJhYzI3MTg0ZTp7InByaXZhdGVfY29tcGFueV9pZCI6IiIsIl9hdXRoX3VzZXJfaWQiOiIxIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJhYmUwM2Y0YzMzZmEzMzVhYmNiMTY0MTlkYTk1YjQyNTZmMWIzMTljIn0=', '2030-12-19 17:25:53.278080');
INSERT INTO `django_session` VALUES ('na2cw7l36j3qu1q79vx81nrgbrinb28k', 'YjZkYTA2YjU4NDRkMjRkZTRmMWNhZTcxZjFhMDkwYjQ1MzUzYTMxYjp7Il9hdXRoX3VzZXJfaWQiOiIyMyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzgzNzI2NGEwYmQ0OTdkNTk5ZmFkZmI3ODAxNDIzMDQxMmM3YmY1YSJ9', '2030-11-18 18:30:22.886452');
INSERT INTO `django_session` VALUES ('no7viv30zfmmcwilf1gx2at8zp43ytog', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 17:15:55.695126');
INSERT INTO `django_session` VALUES ('o1h12co1l45b8sb2p44k46i8v0ql95iu', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-11-29 14:37:02.098366');
INSERT INTO `django_session` VALUES ('o9rl9qoffa55f8og50mmvmv5v52ltlek', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 16:08:03.698454');
INSERT INTO `django_session` VALUES ('odj0efmyz8r696zcfwcznzgrwy7kfxyl', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-03-07 15:39:16.740762');
INSERT INTO `django_session` VALUES ('os2gtp07fg6zkr95e5jw1ensoujltezm', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-03-16 00:45:27.064350');
INSERT INTO `django_session` VALUES ('ov83su28g3na1fyo8lqoy8hp1lrjrwe1', 'ZjllOTE2NmE3MGNhYWE0ZGQ5OWNmZTYwODg2YzJlODRjNTEzMzViMDp7InByaXZhdGVfY29tcGFueV9pZCI6IiJ9', '2030-11-08 15:34:15.957664');
INSERT INTO `django_session` VALUES ('p1831dln19i32dnaj1eomnkczmo7wbri', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-11-15 14:07:50.412916');
INSERT INTO `django_session` VALUES ('pasfjosp9wjm1lifspg0lbv37p1vbm12', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 16:03:13.804447');
INSERT INTO `django_session` VALUES ('pj6sp405j9vjqjk5ve9x9be6xj223llz', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2030-11-09 01:01:23.090243');
INSERT INTO `django_session` VALUES ('po9gofrkcxrqnlp3trx45a8ewtwkn041', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2031-01-06 16:29:52.382786');
INSERT INTO `django_session` VALUES ('ppgrukowtcyiwaui3j21qbzu4pmpd41w', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 16:04:52.057367');
INSERT INTO `django_session` VALUES ('pwi1jehf57wsscajol0rlrefxkt9lt6h', 'YjZkYTA2YjU4NDRkMjRkZTRmMWNhZTcxZjFhMDkwYjQ1MzUzYTMxYjp7Il9hdXRoX3VzZXJfaWQiOiIyMyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzgzNzI2NGEwYmQ0OTdkNTk5ZmFkZmI3ODAxNDIzMDQxMmM3YmY1YSJ9', '2030-11-28 15:21:02.408257');
INSERT INTO `django_session` VALUES ('qm3crpiausr5vac4gjspl4inbicscn3o', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-02 01:24:26.345224');
INSERT INTO `django_session` VALUES ('qujgdzm2mhmbhx93fqkpk4kimy7fceur', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 19:25:44.040837');
INSERT INTO `django_session` VALUES ('qy0vqqbtom6z9d93vcp20jrrj410icuf', 'YjZkYTA2YjU4NDRkMjRkZTRmMWNhZTcxZjFhMDkwYjQ1MzUzYTMxYjp7Il9hdXRoX3VzZXJfaWQiOiIyMyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzgzNzI2NGEwYmQ0OTdkNTk5ZmFkZmI3ODAxNDIzMDQxMmM3YmY1YSJ9', '2030-11-15 18:51:55.821308');
INSERT INTO `django_session` VALUES ('r5j584pl0p0ahl1j399gduql83qke08k', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-01-17 01:35:36.953753');
INSERT INTO `django_session` VALUES ('rf5kkytslkgtorpaemvq9t4iugaqhzlh', 'YjZkYTA2YjU4NDRkMjRkZTRmMWNhZTcxZjFhMDkwYjQ1MzUzYTMxYjp7Il9hdXRoX3VzZXJfaWQiOiIyMyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzgzNzI2NGEwYmQ0OTdkNTk5ZmFkZmI3ODAxNDIzMDQxMmM3YmY1YSJ9', '2030-11-23 14:07:50.230457');
INSERT INTO `django_session` VALUES ('rj1gqa06wq4gsulfch9380kxcmbvrpnw', 'MTY1MDE2NjRjM2VhN2VjNWQzZTQ1MDM4NWU1NWJhYTE2NTkxMjI3NTp7InByaXZhdGVfY29tcGFueV9pZCI6IiIsIl9hdXRoX3VzZXJfaWQiOiIxIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoibG9naW4uYmFja2VuZHMuRW1haWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiYWJlMDNmNGMzM2ZhMzM1YWJjYjE2NDE5ZGE5NWI0MjU2ZjFiMzE5YyJ9', '2031-03-10 13:24:52.621147');
INSERT INTO `django_session` VALUES ('s1vvgar03huo6hnz2vmpgbui2uv9jcxo', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 14:55:13.968324');
INSERT INTO `django_session` VALUES ('sfwixg0fwota01y69sqacsc0yuls692n', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-01-13 13:56:17.167338');
INSERT INTO `django_session` VALUES ('skegwjvfnkkoyicxmsl6uaa72r1ly5tw', 'MDg0NjJkOGU0ODM4ODc1NWI2OGI2YWI4ODFhMjk4Yzc0MWU0ZjJlMzp7Il9hdXRoX3VzZXJfaWQiOiIyOSIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiYmE0NzY3ZGQ4Y2YyODI4Y2QyZTJlYTNiZDFhMDJkYWYxN2FjYzI1MiJ9', '2030-12-23 14:43:11.731090');
INSERT INTO `django_session` VALUES ('t0j8f7gfmttq5u1tplygubdj27lmdrlp', 'YjZkYTA2YjU4NDRkMjRkZTRmMWNhZTcxZjFhMDkwYjQ1MzUzYTMxYjp7Il9hdXRoX3VzZXJfaWQiOiIyMyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzgzNzI2NGEwYmQ0OTdkNTk5ZmFkZmI3ODAxNDIzMDQxMmM3YmY1YSJ9', '2030-11-15 14:27:01.393773');
INSERT INTO `django_session` VALUES ('t3nkmor3z7mk75saw3dd61myb3fzfmh1', 'MDg0NjJkOGU0ODM4ODc1NWI2OGI2YWI4ODFhMjk4Yzc0MWU0ZjJlMzp7Il9hdXRoX3VzZXJfaWQiOiIyOSIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiYmE0NzY3ZGQ4Y2YyODI4Y2QyZTJlYTNiZDFhMDJkYWYxN2FjYzI1MiJ9', '2030-12-23 14:41:17.908564');
INSERT INTO `django_session` VALUES ('t5ahlwvdn8dc1j5t8aeudog6bik9wmej', 'YmUwYWU2ZmY1MzQ0ZWMzZWQ3YWE4NTRmM2U0Zjg5MjJhYzI3MTg0ZTp7InByaXZhdGVfY29tcGFueV9pZCI6IiIsIl9hdXRoX3VzZXJfaWQiOiIxIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJhYmUwM2Y0YzMzZmEzMzVhYmNiMTY0MTlkYTk1YjQyNTZmMWIzMTljIn0=', '2030-12-19 16:56:23.668661');
INSERT INTO `django_session` VALUES ('umqc397nsr1b82fusg0d46qo59r5lkyf', 'NTkyMDQwMGFmZGI5MGUyNjk0ZjIyY2NlNTQ3OGJjZjdhNjRiNjExZDp7InByaXZhdGVfY29tcGFueV9pZCI6IiIsIl9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-01-24 01:45:24.842731');
INSERT INTO `django_session` VALUES ('ur7bsnj2y75sioskkckjus1d7wamgk3w', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 14:58:12.687054');
INSERT INTO `django_session` VALUES ('vcrzfnaw50dfg274d6yqlo2hnpbjfyej', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-01-13 13:51:08.938738');
INSERT INTO `django_session` VALUES ('vtrcb80lbnbwl1xsszvxx7u7yr866ms5', 'YmUwYWU2ZmY1MzQ0ZWMzZWQ3YWE4NTRmM2U0Zjg5MjJhYzI3MTg0ZTp7InByaXZhdGVfY29tcGFueV9pZCI6IiIsIl9hdXRoX3VzZXJfaWQiOiIxIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJhYmUwM2Y0YzMzZmEzMzVhYmNiMTY0MTlkYTk1YjQyNTZmMWIzMTljIn0=', '2030-11-11 21:10:03.296089');
INSERT INTO `django_session` VALUES ('wh18nm9gem912fqjhdis1qw77cfuomd8', 'YmUwYWU2ZmY1MzQ0ZWMzZWQ3YWE4NTRmM2U0Zjg5MjJhYzI3MTg0ZTp7InByaXZhdGVfY29tcGFueV9pZCI6IiIsIl9hdXRoX3VzZXJfaWQiOiIxIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJhYmUwM2Y0YzMzZmEzMzVhYmNiMTY0MTlkYTk1YjQyNTZmMWIzMTljIn0=', '2030-11-15 18:58:54.801439');
INSERT INTO `django_session` VALUES ('wx17nf0ynltn3elh1fk4a48bd9fyeuz1', 'YmUwYWU2ZmY1MzQ0ZWMzZWQ3YWE4NTRmM2U0Zjg5MjJhYzI3MTg0ZTp7InByaXZhdGVfY29tcGFueV9pZCI6IiIsIl9hdXRoX3VzZXJfaWQiOiIxIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJhYmUwM2Y0YzMzZmEzMzVhYmNiMTY0MTlkYTk1YjQyNTZmMWIzMTljIn0=', '2030-11-11 02:43:50.975856');
INSERT INTO `django_session` VALUES ('wxs9wa1yxfzb9ospnquq0xkc1vmcs597', 'OTZkZGIxM2MzMzU1Y2NhZDg5ODZiNTcxOWQ1M2YyNTMzNmFlZDlmNTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzk0ODAyNjQ4OTkzMDNmM2JhN2Q1NDExNDkzYzcwNDcwNWI3MTVjYiJ9', '2031-01-06 16:26:25.509502');
INSERT INTO `django_session` VALUES ('xjxvu2pypxrrweyrzg5sqccvretejwk3', 'YmUwYWU2ZmY1MzQ0ZWMzZWQ3YWE4NTRmM2U0Zjg5MjJhYzI3MTg0ZTp7InByaXZhdGVfY29tcGFueV9pZCI6IiIsIl9hdXRoX3VzZXJfaWQiOiIxIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiJhYmUwM2Y0YzMzZmEzMzVhYmNiMTY0MTlkYTk1YjQyNTZmMWIzMTljIn0=', '2030-11-15 13:55:29.724238');
INSERT INTO `django_session` VALUES ('yo07l4xr4yh579eo5eljddaaik02ndbx', 'N2RmNjM0ZjljODVjODczMzJkODcxOTIzYWE4ZjU1ZTE2NWY1MWE1MTp7Il9hdXRoX3VzZXJfaWQiOiIyMiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImxvZ2luLmJhY2tlbmRzLkVtYWlsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6Ijc5NDgwMjY0ODk5MzAzZjNiYTdkNTQxMTQ5M2M3MDQ3MDViNzE1Y2IifQ==', '2031-02-21 16:04:17.018085');
INSERT INTO `django_session` VALUES ('yye1yzbne2bw0jf9iuttp1imtwkpmbby', 'YjZkYTA2YjU4NDRkMjRkZTRmMWNhZTcxZjFhMDkwYjQ1MzUzYTMxYjp7Il9hdXRoX3VzZXJfaWQiOiIyMyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNzgzNzI2NGEwYmQ0OTdkNTk5ZmFkZmI3ODAxNDIzMDQxMmM3YmY1YSJ9', '2030-11-15 18:50:27.349135');
INSERT INTO `django_session` VALUES ('zjfv9w0rf0ccpb25dc5l4aprhqnxgm2i', 'MDg0NjJkOGU0ODM4ODc1NWI2OGI2YWI4ODFhMjk4Yzc0MWU0ZjJlMzp7Il9hdXRoX3VzZXJfaWQiOiIyOSIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiYmE0NzY3ZGQ4Y2YyODI4Y2QyZTJlYTNiZDFhMDJkYWYxN2FjYzI1MiJ9', '2030-12-23 13:57:37.615205');
INSERT INTO `django_session` VALUES ('zvbc03zqjq7mz2wqj1il7rec2kcp607y', 'MmFmNDUxMzk1MThmZGI1Y2UzYTRlMWZhMjk3Yzc4ODE3NTE2NDE3ZTp7Il9hdXRoX3VzZXJfaWQiOiIyNiIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiMDBlNTMyMzk0YjQ3OThkODBlYmQ3Nzk3Mzk4ZTRjNDgxZDAxYTU3NiJ9', '2030-12-22 21:36:16.247211');

-- ----------------------------
-- Table structure for django_site
-- ----------------------------
DROP TABLE IF EXISTS `django_site`;
CREATE TABLE `django_site`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `domain` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `django_site_domain_a2e37b91_uniq`(`domain`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of django_site
-- ----------------------------
INSERT INTO `django_site` VALUES (1, 'example.com', 'example.com');

-- ----------------------------
-- Table structure for notifications_noticetype
-- ----------------------------
DROP TABLE IF EXISTS `notifications_noticetype`;
CREATE TABLE `notifications_noticetype`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of notifications_noticetype
-- ----------------------------

-- ----------------------------
-- Table structure for notifications_notification
-- ----------------------------
DROP TABLE IF EXISTS `notifications_notification`;
CREATE TABLE `notifications_notification`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_object_id` int(10) UNSIGNED NOT NULL,
  `verb` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_object_id` int(10) UNSIGNED NULL DEFAULT NULL,
  `target_object_id` int(10) UNSIGNED NULL DEFAULT NULL,
  `read` tinyint(1) NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `action_content_type_id` int(11) NULL DEFAULT NULL,
  `recipient_id` int(11) NOT NULL,
  `sender_content_type_id` int(11) NOT NULL,
  `target_content_type_id` int(11) NULL DEFAULT NULL,
  `sender_company_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `notifications_notifi_action_content_type__d8945165_fk_django_co`(`action_content_type_id`) USING BTREE,
  INDEX `notifications_notifi_recipient_id_d055f3f0_fk_dashboard`(`recipient_id`) USING BTREE,
  INDEX `notifications_notifi_sender_content_type__2c1a38e3_fk_django_co`(`sender_content_type_id`) USING BTREE,
  INDEX `notifications_notifi_target_content_type__ccb24d88_fk_django_co`(`target_content_type_id`) USING BTREE,
  INDEX `notifications_notifi_sender_company_id_5d006d2c_fk_dashboard`(`sender_company_id`) USING BTREE,
  CONSTRAINT `notifications_notifi_action_content_type__d8945165_fk_django_co` FOREIGN KEY (`action_content_type_id`) REFERENCES `django_content_type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `notifications_notifi_recipient_id_d055f3f0_fk_dashboard` FOREIGN KEY (`recipient_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `notifications_notifi_sender_company_id_5d006d2c_fk_dashboard` FOREIGN KEY (`sender_company_id`) REFERENCES `dashboard_company` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `notifications_notifi_sender_content_type__2c1a38e3_fk_django_co` FOREIGN KEY (`sender_content_type_id`) REFERENCES `django_content_type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `notifications_notifi_target_content_type__ccb24d88_fk_django_co` FOREIGN KEY (`target_content_type_id`) REFERENCES `django_content_type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 162 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of notifications_notification
-- ----------------------------
INSERT INTO `notifications_notification` VALUES (1, 3, 'NEW_USER', NULL, NULL, 0, '2020-11-10 13:20:27.833793', NULL, 2, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (2, 4, 'NEW_USER', NULL, NULL, 1, '2020-11-10 13:20:28.074687', NULL, 2, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (3, 9, 'NEW_USER', NULL, NULL, 0, '2020-11-10 13:20:31.483120', NULL, 8, 5, NULL, 2);
INSERT INTO `notifications_notification` VALUES (4, 10, 'NEW_USER', NULL, NULL, 0, '2020-11-10 13:20:32.108382', NULL, 8, 5, NULL, 2);
INSERT INTO `notifications_notification` VALUES (5, 11, 'NEW_USER', NULL, NULL, 0, '2020-11-10 13:20:32.533575', NULL, 8, 5, NULL, 2);
INSERT INTO `notifications_notification` VALUES (6, 12, 'NEW_USER', NULL, NULL, 0, '2020-11-10 13:20:32.808863', NULL, 8, 5, NULL, 2);
INSERT INTO `notifications_notification` VALUES (7, 13, 'NEW_USER', NULL, NULL, 0, '2020-11-10 13:20:33.066790', NULL, 8, 5, NULL, 2);
INSERT INTO `notifications_notification` VALUES (8, 14, 'NEW_USER', NULL, NULL, 0, '2020-11-10 13:20:33.825178', NULL, 8, 5, NULL, 2);
INSERT INTO `notifications_notification` VALUES (9, 15, 'NEW_USER', NULL, NULL, 0, '2020-11-10 13:20:34.358287', NULL, 8, 5, NULL, 2);
INSERT INTO `notifications_notification` VALUES (10, 16, 'NEW_USER', NULL, NULL, 0, '2020-11-10 13:20:34.782542', NULL, 8, 5, NULL, 2);
INSERT INTO `notifications_notification` VALUES (11, 17, 'NEW_USER', NULL, NULL, 0, '2020-11-10 13:20:35.191963', NULL, 8, 5, NULL, 2);
INSERT INTO `notifications_notification` VALUES (12, 18, 'NEW_USER', NULL, NULL, 0, '2020-11-10 13:20:35.739283', NULL, 8, 5, NULL, 2);
INSERT INTO `notifications_notification` VALUES (13, 19, 'NEW_USER', NULL, NULL, 0, '2020-11-10 13:20:36.239224', NULL, 8, 5, NULL, 2);
INSERT INTO `notifications_notification` VALUES (14, 20, 'NEW_USER', NULL, NULL, 0, '2020-11-10 13:20:36.717456', NULL, 8, 5, NULL, 2);
INSERT INTO `notifications_notification` VALUES (15, 21, 'NEW_USER', NULL, NULL, 0, '2020-11-10 13:20:37.193855', NULL, 8, 5, NULL, 2);
INSERT INTO `notifications_notification` VALUES (16, 22, 'NEW_USER', NULL, NULL, 0, '2020-11-10 15:07:19.296327', NULL, 1, 5, NULL, NULL);
INSERT INTO `notifications_notification` VALUES (17, 23, 'NEW_USER', NULL, NULL, 1, '2020-11-10 18:31:20.608291', NULL, 2, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (18, 23, 'NEW_USER', NULL, NULL, 1, '2020-11-10 18:31:20.759503', NULL, 22, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (19, 22, 'NEEDS_APPROVAL', NULL, 1, 1, '2020-11-18 21:43:52.859930', NULL, 2, 5, 12, 1);
INSERT INTO `notifications_notification` VALUES (20, 22, 'NEEDS_APPROVAL', NULL, 1, 0, '2020-11-18 21:43:52.919653', NULL, 4, 5, 12, 1);
INSERT INTO `notifications_notification` VALUES (21, 2, 'NEW_ACTION_ITEM', NULL, 1, 1, '2020-11-19 17:33:28.298002', NULL, 22, 5, 12, 1);
INSERT INTO `notifications_notification` VALUES (25, 29, 'NEW_USER', NULL, NULL, 0, '2020-12-25 13:57:23.326773', NULL, 1, 5, NULL, NULL);
INSERT INTO `notifications_notification` VALUES (26, 22, 'APPROVED', NULL, NULL, 1, '2021-01-08 16:49:41.995602', NULL, 22, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (27, 22, 'APPROVED', NULL, NULL, 1, '2021-01-08 17:04:36.673784', NULL, 22, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (28, 22, 'APPROVED', NULL, NULL, 1, '2021-01-08 17:26:12.020987', NULL, 22, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (29, 22, 'APPROVED', NULL, NULL, 1, '2021-01-08 17:31:16.411408', NULL, 22, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (30, 22, 'APPROVED', NULL, 1, 1, '2021-01-09 13:39:12.743210', NULL, 22, 5, 12, 1);
INSERT INTO `notifications_notification` VALUES (31, 30, 'NEW_USER', NULL, NULL, 0, '2021-01-19 20:43:10.281003', NULL, 1, 5, NULL, NULL);
INSERT INTO `notifications_notification` VALUES (32, 31, 'NEW_USER', NULL, NULL, 0, '2021-01-20 02:23:03.784118', NULL, 1, 5, NULL, NULL);
INSERT INTO `notifications_notification` VALUES (33, 32, 'NEW_USER', NULL, NULL, 0, '2021-01-20 02:27:23.626735', NULL, 1, 5, NULL, NULL);
INSERT INTO `notifications_notification` VALUES (34, 33, 'NEW_USER', NULL, NULL, 0, '2021-01-20 02:35:50.043162', NULL, 1, 5, NULL, NULL);
INSERT INTO `notifications_notification` VALUES (35, 34, 'NEW_USER', NULL, NULL, 0, '2021-01-20 02:47:37.965263', NULL, 1, 5, NULL, NULL);
INSERT INTO `notifications_notification` VALUES (36, 35, 'NEW_USER', NULL, NULL, 0, '2021-01-20 11:56:13.166674', NULL, 1, 5, NULL, NULL);
INSERT INTO `notifications_notification` VALUES (37, 36, 'NEW_USER', NULL, NULL, 0, '2021-01-20 12:19:20.226593', NULL, 1, 5, NULL, NULL);
INSERT INTO `notifications_notification` VALUES (38, 22, 'APPROVED', NULL, NULL, 1, '2021-01-25 02:38:49.194877', NULL, 22, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (39, 22, 'APPROVED', NULL, 1, 1, '2021-02-03 17:42:31.510238', NULL, 22, 5, 12, 1);
INSERT INTO `notifications_notification` VALUES (40, 22, 'NEW_FILE_ATTACHED', NULL, 1, 0, '2021-02-25 01:02:50.191806', NULL, 22, 5, 16, 1);
INSERT INTO `notifications_notification` VALUES (41, 22, 'NEW_FILE_ATTACHED', NULL, 4, 0, '2021-02-28 09:16:58.182423', NULL, 22, 5, 16, 1);
INSERT INTO `notifications_notification` VALUES (42, 22, 'NEW_FILE_ATTACHED', NULL, 5, 0, '2021-02-28 09:17:19.229288', NULL, 22, 5, 16, 1);
INSERT INTO `notifications_notification` VALUES (43, 37, 'NEW_USER', NULL, NULL, 0, '2021-03-10 17:24:40.475524', NULL, 2, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (44, 37, 'NEW_USER', NULL, NULL, 0, '2021-03-10 17:24:40.527484', NULL, 22, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (45, 38, 'NEW_USER', NULL, NULL, 0, '2021-03-10 17:27:55.491349', NULL, 2, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (46, 38, 'NEW_USER', NULL, NULL, 0, '2021-03-10 17:27:55.509523', NULL, 22, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (47, 39, 'NEW_USER', NULL, NULL, 0, '2021-03-10 17:36:17.469998', NULL, 2, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (48, 39, 'NEW_USER', NULL, NULL, 0, '2021-03-10 17:36:17.508805', NULL, 22, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (49, 40, 'NEW_USER', NULL, NULL, 0, '2021-03-10 17:52:02.861680', NULL, 2, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (50, 40, 'NEW_USER', NULL, NULL, 0, '2021-03-10 17:52:02.882837', NULL, 22, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (51, 41, 'NEW_USER', NULL, NULL, 0, '2021-03-10 17:57:24.502131', NULL, 2, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (52, 41, 'NEW_USER', NULL, NULL, 0, '2021-03-10 17:57:24.525648', NULL, 22, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (53, 22, 'COMMENTED', NULL, 1, 1, '2021-03-10 18:02:09.704340', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (54, 22, 'COMMENTED', NULL, 1, 0, '2021-03-10 18:02:10.403451', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (55, 22, 'COMMENTED', NULL, 2, 1, '2021-03-10 18:02:17.812058', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (56, 22, 'COMMENTED', NULL, 2, 0, '2021-03-10 18:02:18.562062', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (57, 22, 'COMMENTED', NULL, 3, 1, '2021-03-10 18:02:22.858942', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (58, 22, 'COMMENTED', NULL, 3, 0, '2021-03-10 18:02:23.387126', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (59, 22, 'COMMENTED', NULL, 4, 1, '2021-03-10 18:02:25.896551', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (60, 22, 'COMMENTED', NULL, 4, 0, '2021-03-10 18:02:27.391132', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (61, 22, 'COMMENTED', NULL, 5, 1, '2021-03-10 18:02:29.113617', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (62, 22, 'COMMENTED', NULL, 5, 0, '2021-03-10 18:02:30.332609', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (63, 22, 'COMMENTED', NULL, 6, 1, '2021-03-10 18:02:31.643436', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (64, 22, 'COMMENTED', NULL, 6, 0, '2021-03-10 18:02:32.137338', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (65, 22, 'COMMENTED', NULL, 7, 1, '2021-03-10 18:02:33.850858', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (66, 22, 'COMMENTED', NULL, 7, 0, '2021-03-10 18:02:34.401692', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (67, 22, 'COMMENTED', NULL, 8, 1, '2021-03-10 18:02:35.980241', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (68, 22, 'COMMENTED', NULL, 8, 0, '2021-03-10 18:02:36.844844', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (69, 22, 'COMMENTED', NULL, 9, 1, '2021-03-10 18:02:39.425361', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (70, 22, 'COMMENTED', NULL, 9, 0, '2021-03-10 18:02:40.036978', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (71, 22, 'COMMENTED', NULL, 10, 1, '2021-03-10 18:02:42.943897', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (72, 22, 'COMMENTED', NULL, 10, 0, '2021-03-10 18:02:43.469037', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (73, 22, 'COMMENTED', NULL, 11, 1, '2021-03-10 18:02:50.953893', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (74, 22, 'COMMENTED', NULL, 11, 0, '2021-03-10 18:02:51.447837', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (75, 42, 'NEW_USER', NULL, NULL, 0, '2021-03-10 18:36:18.800188', NULL, 2, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (76, 42, 'NEW_USER', NULL, NULL, 0, '2021-03-10 18:36:18.820515', NULL, 22, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (77, 43, 'NEW_USER', NULL, NULL, 0, '2021-03-11 00:26:39.053241', NULL, 1, 5, NULL, NULL);
INSERT INTO `notifications_notification` VALUES (78, 44, 'NEW_USER', NULL, NULL, 0, '2021-03-11 00:29:40.982228', NULL, 2, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (79, 44, 'NEW_USER', NULL, NULL, 0, '2021-03-11 00:29:40.998932', NULL, 22, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (80, 44, 'NEW_USER', NULL, NULL, 0, '2021-03-11 00:29:42.194508', NULL, 43, 5, NULL, 1);
INSERT INTO `notifications_notification` VALUES (81, 22, 'COMMENTED', NULL, 12, 1, '2021-03-11 16:12:55.708832', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (82, 22, 'COMMENTED', NULL, 12, 0, '2021-03-11 16:12:56.764556', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (83, 22, 'COMMENTED', NULL, 13, 1, '2021-03-11 16:13:00.760391', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (84, 22, 'COMMENTED', NULL, 13, 0, '2021-03-11 16:13:01.251177', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (85, 22, 'COMMENTED', NULL, 14, 1, '2021-03-11 16:15:47.564140', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (86, 22, 'COMMENTED', NULL, 14, 0, '2021-03-11 16:15:48.296360', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (87, 22, 'COMMENTED', NULL, 15, 1, '2021-03-11 16:27:09.551597', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (88, 22, 'COMMENTED', NULL, 15, 0, '2021-03-11 16:27:11.290749', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (89, 22, 'COMMENTED', NULL, 16, 1, '2021-03-11 16:27:58.945172', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (90, 22, 'COMMENTED', NULL, 16, 0, '2021-03-11 16:28:00.090895', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (91, 22, 'COMMENTED', NULL, 17, 1, '2021-03-11 16:28:05.575717', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (92, 22, 'COMMENTED', NULL, 17, 0, '2021-03-11 16:28:06.088409', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (93, 22, 'COMMENTED', NULL, 18, 1, '2021-03-11 16:28:09.036933', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (94, 22, 'COMMENTED', NULL, 18, 0, '2021-03-11 16:28:09.528340', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (95, 22, 'COMMENTED', NULL, 19, 0, '2021-03-11 16:28:24.607238', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (96, 22, 'COMMENTED', NULL, 19, 0, '2021-03-11 16:28:25.567902', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (97, 22, 'COMMENTED', NULL, 20, 1, '2021-03-11 16:29:24.367757', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (98, 22, 'COMMENTED', NULL, 20, 0, '2021-03-11 16:29:25.057292', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (99, 22, 'COMMENTED', NULL, 21, 1, '2021-03-11 16:29:28.961116', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (100, 22, 'COMMENTED', NULL, 21, 0, '2021-03-11 16:29:30.896071', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (101, 22, 'COMMENTED', NULL, 22, 0, '2021-03-11 16:29:34.080088', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (102, 22, 'COMMENTED', NULL, 22, 0, '2021-03-11 16:29:34.605358', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (103, 22, 'COMMENTED', NULL, 23, 1, '2021-03-12 12:26:46.691993', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (104, 22, 'COMMENTED', NULL, 23, 0, '2021-03-12 12:26:47.708212', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (105, 22, 'COMMENTED', NULL, 24, 1, '2021-03-12 12:27:43.359344', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (106, 22, 'COMMENTED', NULL, 24, 0, '2021-03-12 12:27:43.820572', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (107, 22, 'COMMENTED', NULL, 25, 1, '2021-03-12 12:27:45.702860', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (108, 22, 'COMMENTED', NULL, 25, 0, '2021-03-12 12:27:46.200552', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (109, 22, 'COMMENTED', NULL, 26, 1, '2021-03-12 12:29:37.336014', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (110, 22, 'COMMENTED', NULL, 26, 0, '2021-03-12 12:29:38.854168', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (111, 22, 'COMMENTED', NULL, 27, 1, '2021-03-15 16:44:33.847178', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (112, 22, 'COMMENTED', NULL, 27, 0, '2021-03-15 16:44:34.895916', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (113, 22, 'COMMENTED', NULL, 28, 1, '2021-03-15 16:45:15.639023', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (114, 22, 'COMMENTED', NULL, 28, 0, '2021-03-15 16:45:17.166248', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (115, 22, 'COMMENTED', NULL, 29, 1, '2021-03-18 02:10:57.932011', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (116, 22, 'COMMENTED', NULL, 29, 0, '2021-03-18 02:10:59.410379', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (117, 22, 'COMMENTED', NULL, 30, 1, '2021-03-18 02:11:10.780752', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (118, 22, 'COMMENTED', NULL, 30, 0, '2021-03-18 02:11:12.044507', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (119, 22, 'COMMENTED', NULL, 31, 1, '2021-03-19 01:05:56.706932', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (120, 22, 'COMMENTED', NULL, 31, 0, '2021-03-19 01:05:58.031596', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (121, 22, 'COMMENTED', NULL, 32, 1, '2021-03-19 01:06:26.369122', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (122, 22, 'COMMENTED', NULL, 32, 0, '2021-03-19 01:06:26.918207', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (123, 22, 'COMMENTED', NULL, 33, 1, '2021-03-24 00:50:39.804757', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (124, 22, 'COMMENTED', NULL, 33, 0, '2021-03-24 00:50:41.745772', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (125, 22, 'COMMENTED', NULL, 34, 1, '2021-03-24 00:50:46.106662', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (126, 22, 'COMMENTED', NULL, 34, 0, '2021-03-24 00:50:47.234759', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (127, 22, 'COMMENTED', NULL, 35, 1, '2021-03-24 00:50:49.634567', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (128, 22, 'COMMENTED', NULL, 35, 0, '2021-03-24 00:50:50.789710', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (129, 22, 'COMMENTED', NULL, 36, 1, '2021-03-24 00:50:52.701282', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (130, 22, 'COMMENTED', NULL, 36, 0, '2021-03-24 00:50:53.812574', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (131, 22, 'COMMENTED', NULL, 37, 1, '2021-03-24 00:50:54.948786', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (132, 22, 'COMMENTED', NULL, 37, 0, '2021-03-24 00:50:56.304878', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (133, 22, 'COMMENTED', NULL, 38, 1, '2021-03-24 00:50:57.612651', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (134, 22, 'COMMENTED', NULL, 38, 0, '2021-03-24 00:50:58.837479', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (135, 22, 'COMMENTED', NULL, 39, 1, '2021-03-24 00:52:34.149775', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (136, 22, 'COMMENTED', NULL, 39, 0, '2021-03-24 00:52:36.392594', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (137, 22, 'NEEDS_APPROVAL', NULL, 25, 0, '2021-03-24 00:57:30.297676', NULL, 22, 5, 12, 1);
INSERT INTO `notifications_notification` VALUES (138, 22, 'NEEDS_APPROVAL', NULL, 25, 0, '2021-03-24 00:57:31.466404', NULL, 23, 5, 12, 1);
INSERT INTO `notifications_notification` VALUES (139, 22, 'APPROVED', NULL, 26, 0, '2021-03-24 01:26:30.402657', NULL, 22, 5, 12, 1);
INSERT INTO `notifications_notification` VALUES (140, 22, 'NEEDS_APPROVAL', NULL, 26, 0, '2021-03-24 01:26:30.428527', NULL, 22, 5, 12, 1);
INSERT INTO `notifications_notification` VALUES (141, 22, 'NEEDS_APPROVAL', NULL, 26, 0, '2021-03-24 01:26:31.911230', NULL, 23, 5, 12, 1);
INSERT INTO `notifications_notification` VALUES (142, 22, 'COMMENTED', NULL, 40, 1, '2021-03-24 02:38:40.366708', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (143, 22, 'COMMENTED', NULL, 40, 0, '2021-03-24 02:38:41.577330', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (144, 22, 'COMMENTED', NULL, 41, 1, '2021-03-24 02:38:44.709653', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (145, 22, 'COMMENTED', NULL, 41, 0, '2021-03-24 02:38:45.682272', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (146, 22, 'APPROVED', NULL, 26, 0, '2021-03-24 03:13:50.196440', NULL, 22, 5, 12, 1);
INSERT INTO `notifications_notification` VALUES (147, 22, 'NEEDS_WORK', NULL, 26, 0, '2021-03-24 03:13:55.636687', NULL, 22, 5, 12, 1);
INSERT INTO `notifications_notification` VALUES (148, 22, 'COMMENTED', NULL, 42, 1, '2021-03-24 03:17:04.688668', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (149, 22, 'COMMENTED', NULL, 42, 0, '2021-03-24 03:17:06.460936', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (150, 22, 'COMMENTED', NULL, 43, 1, '2021-03-24 15:32:09.236434', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (151, 22, 'COMMENTED', NULL, 43, 0, '2021-03-24 15:32:11.047688', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (152, 22, 'COMMENTED', NULL, 44, 1, '2021-03-24 17:51:34.014496', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (153, 22, 'COMMENTED', NULL, 44, 0, '2021-03-24 17:51:35.244006', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (154, 22, 'COMMENTED', NULL, 45, 1, '2021-03-24 19:09:37.060629', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (155, 22, 'COMMENTED', NULL, 45, 0, '2021-03-24 19:09:38.247503', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (156, 22, 'COMMENTED', NULL, 46, 1, '2021-03-24 19:10:23.580857', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (157, 22, 'COMMENTED', NULL, 46, 0, '2021-03-24 19:10:24.543936', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (158, 22, 'COMMENTED', NULL, 47, 1, '2021-03-24 19:10:27.250314', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (159, 22, 'COMMENTED', NULL, 47, 0, '2021-03-24 19:10:28.263191', NULL, 23, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (160, 22, 'COMMENTED', NULL, 48, 1, '2021-03-24 19:14:44.840917', NULL, 22, 5, 10, 1);
INSERT INTO `notifications_notification` VALUES (161, 22, 'COMMENTED', NULL, 48, 0, '2021-03-24 19:14:45.947564', NULL, 23, 5, 10, 1);

-- ----------------------------
-- Table structure for postman_message
-- ----------------------------
DROP TABLE IF EXISTS `postman_message`;
CREATE TABLE `postman_message`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sent_at` datetime(6) NOT NULL,
  `read_at` datetime(6) NULL DEFAULT NULL,
  `replied_at` datetime(6) NULL DEFAULT NULL,
  `sender_archived` tinyint(1) NOT NULL,
  `recipient_archived` tinyint(1) NOT NULL,
  `sender_deleted_at` datetime(6) NULL DEFAULT NULL,
  `recipient_deleted_at` datetime(6) NULL DEFAULT NULL,
  `moderation_status` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `moderation_date` datetime(6) NULL DEFAULT NULL,
  `moderation_reason` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `moderation_by_id` int(11) NULL DEFAULT NULL,
  `parent_id` int(11) NULL DEFAULT NULL,
  `recipient_id` int(11) NULL DEFAULT NULL,
  `sender_id` int(11) NULL DEFAULT NULL,
  `thread_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `postman_message_moderation_by_id_f0d43d80_fk_dashboard_user_id`(`moderation_by_id`) USING BTREE,
  INDEX `postman_message_parent_id_4b6238da_fk_postman_message_id`(`parent_id`) USING BTREE,
  INDEX `postman_message_recipient_id_5f2df2fc_fk_dashboard_user_id`(`recipient_id`) USING BTREE,
  INDEX `postman_message_sender_id_6d102a43_fk_dashboard_user_id`(`sender_id`) USING BTREE,
  INDEX `postman_message_thread_id_cd603329_fk_postman_message_id`(`thread_id`) USING BTREE,
  CONSTRAINT `postman_message_moderation_by_id_f0d43d80_fk_dashboard_user_id` FOREIGN KEY (`moderation_by_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `postman_message_parent_id_4b6238da_fk_postman_message_id` FOREIGN KEY (`parent_id`) REFERENCES `postman_message` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `postman_message_recipient_id_5f2df2fc_fk_dashboard_user_id` FOREIGN KEY (`recipient_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `postman_message_sender_id_6d102a43_fk_dashboard_user_id` FOREIGN KEY (`sender_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `postman_message_thread_id_cd603329_fk_postman_message_id` FOREIGN KEY (`thread_id`) REFERENCES `postman_message` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of postman_message
-- ----------------------------

-- ----------------------------
-- Table structure for push_notifications_apnsdevice
-- ----------------------------
DROP TABLE IF EXISTS `push_notifications_apnsdevice`;
CREATE TABLE `push_notifications_apnsdevice`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `active` tinyint(1) NOT NULL,
  `date_created` datetime(6) NULL DEFAULT NULL,
  `device_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `registration_id` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) NULL DEFAULT NULL,
  `application_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `push_notifications_a_user_id_44cc44d2_fk_dashboard`(`user_id`) USING BTREE,
  INDEX `push_notifications_apnsdevice_device_id_0ac3cde3`(`device_id`) USING BTREE,
  CONSTRAINT `push_notifications_a_user_id_44cc44d2_fk_dashboard` FOREIGN KEY (`user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of push_notifications_apnsdevice
-- ----------------------------

-- ----------------------------
-- Table structure for push_notifications_gcmdevice
-- ----------------------------
DROP TABLE IF EXISTS `push_notifications_gcmdevice`;
CREATE TABLE `push_notifications_gcmdevice`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `active` tinyint(1) NOT NULL,
  `date_created` datetime(6) NULL DEFAULT NULL,
  `device_id` bigint(20) UNSIGNED NULL DEFAULT NULL,
  `registration_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) NULL DEFAULT NULL,
  `cloud_message_type` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `application_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `push_notifications_g_user_id_f3752f1b_fk_dashboard`(`user_id`) USING BTREE,
  INDEX `push_notifications_gcmdevice_device_id_0b22a9c4`(`device_id`) USING BTREE,
  CONSTRAINT `push_notifications_g_user_id_f3752f1b_fk_dashboard` FOREIGN KEY (`user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of push_notifications_gcmdevice
-- ----------------------------

-- ----------------------------
-- Table structure for push_notifications_webpushdevice
-- ----------------------------
DROP TABLE IF EXISTS `push_notifications_webpushdevice`;
CREATE TABLE `push_notifications_webpushdevice`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `active` tinyint(1) NOT NULL,
  `date_created` datetime(6) NULL DEFAULT NULL,
  `application_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `registration_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `p256dh` varchar(88) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `auth` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `browser` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `push_notifications_w_user_id_e867e0a1_fk_dashboard`(`user_id`) USING BTREE,
  CONSTRAINT `push_notifications_w_user_id_e867e0a1_fk_dashboard` FOREIGN KEY (`user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of push_notifications_webpushdevice
-- ----------------------------
INSERT INTO `push_notifications_webpushdevice` VALUES (1, 'Browser', 1, '2020-11-19 15:54:24.976964', NULL, 'cr5q1YHAigI:APA91bEtHTFJSN0rTpPDws1dhXlk2w4vrO7H9G53uKv2RZEf09IvChGxI8oiGqdOyGvluHZPt_L2cnzd19yPYYak-8_xWbRjNcOEubWggQjJv1VOLd4IlPHn5KpKk-i7jnZ8sqD0wr13', 'BBYomK5+q8n6rQTlc/7F4fN/n84+DxC5R9VfmS08WzrHQmHEU/gjVcGg9JTt0nA5Nkkn1gEo7LinjBpVa63vmF4=', 'GN5k5zaQayqg1K9Smx0QHw==', 'CHROME', 22);
INSERT INTO `push_notifications_webpushdevice` VALUES (2, 'Browser', 1, '2020-12-21 20:25:57.278999', NULL, 'ffKCilScAv4:APA91bFizWjJ3EZSi__AjWhortYPNeyJzgk3QGSNGy7J9xCSV-DH6Yp09H3Q4PDUoaLW680aI5IlEHyHgBsF5fomYa41mSm3uzFbKnyl0D0WxDA_mM6yssMA_HmS-Ev5Pb1f-g-0vwS6', 'BFmntUdFJ4ErXKgdNOAtMAsG6tuSew+GwhuxgKd+FLecua9at3i4R0qv6fwr2RH13fnR2ICgxOaasJQxNg3KStE=', 'jgeTCq+2P61VbPP21OPK4g==', 'CHROME', 1);
INSERT INTO `push_notifications_webpushdevice` VALUES (3, 'Browser', 1, '2020-12-21 20:26:40.201187', NULL, 'd9S8YM_qcjs:APA91bF0Jw0Hva_0-UEnjVzY68AqLwd7s4O6_UCb_hnkE5AHcTAbfNBkwrpYDLHCvW3j7WlSBv4GHaxrUbdJ1LUIfLlG4KArENCwAnCR3DojA-bJX_ZwB3lzN9yLvW3Ah6m-lGZrgDBz', 'BDSu5cA+b2v7zcmRkd17QCBQ4BgnoR8YuicwPUGP0WLTASfCMBn0aXyAMiBgkTPTl3dwMUQYc6aiDYW6EPCPBOo=', '1hDUlp+dtWmH4n1LylbeTw==', 'CHROME', 22);

-- ----------------------------
-- Table structure for push_notifications_wnsdevice
-- ----------------------------
DROP TABLE IF EXISTS `push_notifications_wnsdevice`;
CREATE TABLE `push_notifications_wnsdevice`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `active` tinyint(1) NOT NULL,
  `date_created` datetime(6) NULL DEFAULT NULL,
  `device_id` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `registration_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) NULL DEFAULT NULL,
  `application_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `push_notifications_w_user_id_670eff0d_fk_dashboard`(`user_id`) USING BTREE,
  INDEX `push_notifications_wnsdevice_device_id_7e1c24c4`(`device_id`) USING BTREE,
  CONSTRAINT `push_notifications_w_user_id_670eff0d_fk_dashboard` FOREIGN KEY (`user_id`) REFERENCES `dashboard_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of push_notifications_wnsdevice
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
