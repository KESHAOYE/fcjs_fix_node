/*
 Navicat Premium Data Transfer

 Source Server         : 123
 Source Server Type    : MySQL
 Source Server Version : 50726
 Source Host           : localhost:3306
 Source Schema         : fcjs_fix

 Target Server Type    : MySQL
 Target Server Version : 50726
 File Encoding         : 65001

 Date: 02/12/2019 17:22:32
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for address_info
-- ----------------------------
DROP TABLE IF EXISTS `address_info`;
CREATE TABLE `address_info`  (
  `addressid` int(11) NOT NULL COMMENT '主键=地址id',
  `userid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-用户id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '收货人姓名',
  `phone` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '收货人电话',
  `area` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '地区',
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '详细地址',
  `isDefault` tinyint(1) NOT NULL COMMENT '是否默认地址 0否 1是',
  `delete` tinyint(1) NOT NULL COMMENT '是否删除',
  `createTime` datetime(6) NOT NULL ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  PRIMARY KEY (`addressid`) USING BTREE,
  INDEX `auserid`(`userid`) USING BTREE,
  CONSTRAINT `auserid` FOREIGN KEY (`userid`) REFERENCES `userinfo` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '用户地址表\n' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for adinfo
-- ----------------------------
DROP TABLE IF EXISTS `adinfo`;
CREATE TABLE `adinfo`  (
  `id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '广告id',
  `adid` int(11) NOT NULL COMMENT '对应广告位',
  `adimg` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '广告图',
  `shopid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-对应商品id',
  `create_time` datetime(6) NOT NULL COMMENT '创建时间',
  `overdue` datetime(6) NOT NULL COMMENT '过期时间',
  `create_man` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-对应员工号，添加人',
  `clickcount` int(11) NOT NULL DEFAULT 0 COMMENT '点击次数',
  `startdue` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '开始时间',
  `priority` int(11) NOT NULL COMMENT '优先级-1为最高',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '广告信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of adinfo
-- ----------------------------
INSERT INTO `adinfo` VALUES ('26d9d3aa14e511eaa4951c83410e3a81', 1, 'ad/2019122172142', '111', '2019-12-02 17:21:42.007000', '2020-11-30 08:00:00.000000', '0', 0, '2019-12-30 08:00:00.000', 1);

-- ----------------------------
-- Table structure for article_info
-- ----------------------------
DROP TABLE IF EXISTS `article_info`;
CREATE TABLE `article_info`  (
  `aticleId` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键-详情id',
  `shopid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-商品id',
  `aticle_content` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`aticleId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for brandinfo
-- ----------------------------
DROP TABLE IF EXISTS `brandinfo`;
CREATE TABLE `brandinfo`  (
  `brandid` int(11) NOT NULL COMMENT '品牌id',
  `brandname` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '品牌中文名',
  `brandename` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '品牌英文名',
  `isifx` tinyint(1) NOT NULL COMMENT '是否提供维修',
  PRIMARY KEY (`brandid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '品牌表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for comment_info
-- ----------------------------
DROP TABLE IF EXISTS `comment_info`;
CREATE TABLE `comment_info`  (
  `commentid` int(11) NOT NULL AUTO_INCREMENT COMMENT '评论id',
  `shopid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-商品id',
  `specsid` int(11) NOT NULL COMMENT '外键-规格id',
  `comment` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '评论内容',
  `userid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-用户id',
  `comment_time` datetime(6) NOT NULL COMMENT '评论时间',
  `score` int(11) NOT NULL COMMENT '评分0-5分',
  `isshow` int(11) NOT NULL COMMENT '是否因举报而不显示',
  `delete` int(11) NOT NULL COMMENT '用户是否删除',
  PRIMARY KEY (`commentid`) USING BTREE,
  INDEX `cshopid`(`shopid`) USING BTREE,
  INDEX `specid`(`specsid`) USING BTREE,
  INDEX `userid`(`userid`) USING BTREE,
  CONSTRAINT `cshopid` FOREIGN KEY (`shopid`) REFERENCES `shopinfo` (`shop_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `specid` FOREIGN KEY (`specsid`) REFERENCES `shop_specs` (`specs_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `userid` FOREIGN KEY (`userid`) REFERENCES `userinfo` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '评论商品表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for orderinfo
-- ----------------------------
DROP TABLE IF EXISTS `orderinfo`;
CREATE TABLE `orderinfo`  (
  `order_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '订单号，格式为类型（11，12，13）+日期4位+时间戳+4位随机数，不可重复。',
  `order_type` tinyint(1) NOT NULL COMMENT '订单类型，分为维修，回收，商品交易',
  `order_date` datetime(6) NOT NULL ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '订单日期，时间戳',
  `order_state` tinyint(2) NOT NULL COMMENT '状态，1.代付款，2.待维修，3.正在维修，41.待商家发货，42.待用户发货，5.待收货，6.待评价，7.完成。',
  `order_money` decimal(10, 0) NOT NULL COMMENT '价格',
  `pay_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '支付信息id，可为空，待付款成功后',
  `express_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '快递单号，可为空，发货后提交',
  `user_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-用户id，用户表外键',
  `isshow` tinyint(1) NOT NULL COMMENT '是否在前端显示-是否删除，0删1不删',
  `addressId` int(11) NOT NULL COMMENT '外键-地址id',
  PRIMARY KEY (`order_id`) USING BTREE,
  INDEX `pay_id`(`pay_id`) USING BTREE,
  INDEX `ouserid`(`user_id`) USING BTREE,
  INDEX `oaddress`(`addressId`) USING BTREE,
  CONSTRAINT `oaddress` FOREIGN KEY (`addressId`) REFERENCES `address_info` (`addressid`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `ouserid` FOREIGN KEY (`user_id`) REFERENCES `userinfo` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '订单信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for payinfo
-- ----------------------------
DROP TABLE IF EXISTS `payinfo`;
CREATE TABLE `payinfo`  (
  `user_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '用户id，外键',
  `pay_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '支付单id',
  `count` decimal(8, 2) NOT NULL COMMENT '金额',
  `pay_method` tinyint(1) NOT NULL COMMENT '支付方式，余额0，银行卡1，支付宝2，微信3',
  `pay_card` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '支付卡号',
  `issuccess` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否支付成功，默认为支付中0，成功1，失败2',
  `pay_bdate` datetime(6) NOT NULL COMMENT '支付创建时间',
  `pay_odate` datetime(6) NULL DEFAULT NULL COMMENT '支付结束时间，一个订单的支付时间为5分钟',
  `order_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '订单号，可为空',
  PRIMARY KEY (`pay_id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `order_id`(`order_id`) USING BTREE,
  CONSTRAINT `payinfo_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `userinfo` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `payinfo_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orderinfo` (`order_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '支付信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for paymlist
-- ----------------------------
DROP TABLE IF EXISTS `paymlist`;
CREATE TABLE `paymlist`  (
  `pay_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '支付方式名称',
  `pay_ename` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '支付方式英文名称',
  `paym_id` int(2) NOT NULL AUTO_INCREMENT COMMENT '支付方式id',
  `paymphone` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '支付公司联系电话',
  `paymdes` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '支付公司介绍',
  PRIMARY KEY (`paym_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '支付方式信息\n' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for searchrecord
-- ----------------------------
DROP TABLE IF EXISTS `searchrecord`;
CREATE TABLE `searchrecord`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '搜索记录id',
  `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '搜索记录信息',
  `time` datetime(6) NOT NULL COMMENT '搜索时间',
  `user_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '外键 用户id',
  `id_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '搜索IP地址',
  `isshow` tinyint(1) NOT NULL COMMENT '是否显示 0不显示 1显示',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `userinfo` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '搜索记录' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for shop_attribute
-- ----------------------------
DROP TABLE IF EXISTS `shop_attribute`;
CREATE TABLE `shop_attribute`  (
  `attributeid` int(11) NOT NULL AUTO_INCREMENT COMMENT '商品属性id',
  `shopid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-商品id',
  `attributename` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '属性名称',
  `attributecontent` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '属性内容',
  `isshow` tinyint(1) NOT NULL COMMENT '是否显示',
  PRIMARY KEY (`attributeid`) USING BTREE,
  INDEX `ashopid`(`shopid`) USING BTREE,
  CONSTRAINT `ashopid` FOREIGN KEY (`shopid`) REFERENCES `shopinfo` (`shop_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '商品属性表\n' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for shop_specs
-- ----------------------------
DROP TABLE IF EXISTS `shop_specs`;
CREATE TABLE `shop_specs`  (
  `specs_id` int(11) NOT NULL COMMENT '商品规格id',
  `specs_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品规格名称',
  `specs_price` decimal(10, 2) NOT NULL COMMENT '规格对应价格',
  `specs_img` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '规格对应图片',
  `shopid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-商品id',
  PRIMARY KEY (`specs_id`) USING BTREE,
  INDEX `shopid`(`shopid`) USING BTREE,
  CONSTRAINT `shopid` FOREIGN KEY (`shopid`) REFERENCES `shopinfo` (`shop_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '商品规格' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for shopinfo
-- ----------------------------
DROP TABLE IF EXISTS `shopinfo`;
CREATE TABLE `shopinfo`  (
  `shop_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '主键-商品id（添加时间+品类编号+编号）',
  `shopname` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品名称',
  `shopdes` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '商品介绍',
  `delete` tinyint(1) NOT NULL COMMENT '是否删除',
  `catName` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '分类名',
  `brandid` int(11) NOT NULL COMMENT '外键-品牌id',
  `createTime` datetime(6) NOT NULL COMMENT '创建日期',
  `isold` tinyint(1) NOT NULL COMMENT '是否为二手',
  `old_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '二手程度',
  PRIMARY KEY (`shop_id`) USING BTREE,
  INDEX `brandid`(`brandid`) USING BTREE,
  CONSTRAINT `brandid` FOREIGN KEY (`brandid`) REFERENCES `brandinfo` (`brandid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '商品信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sortinfo
-- ----------------------------
DROP TABLE IF EXISTS `sortinfo`;
CREATE TABLE `sortinfo`  (
  `sortid` int(11) NOT NULL AUTO_INCREMENT COMMENT '分类id',
  `sortname` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '分类名',
  `isshow` tinyint(1) NOT NULL COMMENT '是否显示',
  `createTime` datetime(6) NOT NULL COMMENT '添加时间',
  PRIMARY KEY (`sortid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '商品分类表\n' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_pay
-- ----------------------------
DROP TABLE IF EXISTS `user_pay`;
CREATE TABLE `user_pay`  (
  `user_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '用户id',
  `paym_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '支付方式id号',
  `paym_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '支付方式',
  `paym_cid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '该支付方式卡号',
  `paylist_id` int(11) NOT NULL COMMENT '外键，对应paymlist表中的id',
  `delete` tinyint(1) NOT NULL COMMENT '是否删除',
  `createTime` datetime(6) NOT NULL ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '添加时间',
  PRIMARY KEY (`paym_id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `user_pay_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `userinfo` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '用户绑定的支付方式卡号' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for userinfo
-- ----------------------------
DROP TABLE IF EXISTS `userinfo`;
CREATE TABLE `userinfo`  (
  `user_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '1000' COMMENT '用户id，唯一，规则时间戳+random',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '用户昵称',
  `sex` tinyint(1) NULL DEFAULT NULL COMMENT '用户性别，默认为男，用数字1，2代替',
  `id` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '国内身份证，实名制标记',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '用户真实姓名，实名制标记',
  `phone` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '用户电话号码，常用，不可缺。',
  `birthday` datetime(6) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '用户生日，实名制标记',
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '用户邮箱-暂不使用，预留。',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '用户密码，加密。',
  `headimg` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '用户头像，不为空，若用户不设置有默认头像。',
  `lastmoney` decimal(8, 2) NOT NULL DEFAULT 0.00 COMMENT '用户余额',
  `regisitertime` datetime(6) NOT NULL COMMENT '注册时间',
  `isname` tinyint(1) NOT NULL COMMENT '是否实名制',
  `nametime` datetime(6) NULL DEFAULT NULL COMMENT '实名制时间',
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '用户信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Triggers structure for table adinfo
-- ----------------------------
DROP TRIGGER IF EXISTS `newid`;
delimiter ;;
CREATE TRIGGER `newid` BEFORE INSERT ON `adinfo` FOR EACH ROW BEGIN
SET new.id=REPLACE(UUID(),'-','');
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
