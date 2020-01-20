/*
 Navicat MySQL Data Transfer

 Source Server         : 123
 Source Server Type    : MySQL
 Source Server Version : 50726
 Source Host           : localhost:3306
 Source Schema         : fcjs_fix

 Target Server Type    : MySQL
 Target Server Version : 50726
 File Encoding         : 65001

 Date: 20/01/2020 17:26:20
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
  `createTime` datetime(6) NOT NULL COMMENT '创建时间',
  `overdue` datetime(6) NOT NULL COMMENT '过期时间',
  `create_man` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-对应员工号，添加人',
  `clickcount` int(11) NOT NULL DEFAULT 0 COMMENT '点击次数',
  `startdue` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '开始时间',
  `priority` int(11) NOT NULL COMMENT '优先级-1为最高',
  `isshow` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否显示（删除）',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `adinfo_shopid`(`shopid`) USING BTREE,
  CONSTRAINT `adinfo_shopid` FOREIGN KEY (`shopid`) REFERENCES `shopinfo` (`shop_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '广告信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for article_info
-- ----------------------------
DROP TABLE IF EXISTS `article_info`;
CREATE TABLE `article_info`  (
  `aticleId` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键-详情id',
  `shopid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-商品id',
  `aticle_content` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`aticleId`) USING BTREE,
  INDEX `articleshopid`(`shopid`) USING BTREE,
  CONSTRAINT `articleshopid` FOREIGN KEY (`shopid`) REFERENCES `shopinfo` (`shop_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for brandinfo
-- ----------------------------
DROP TABLE IF EXISTS `brandinfo`;
CREATE TABLE `brandinfo`  (
  `brandid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '品牌id',
  `brandname` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '品牌中文名',
  `brandename` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '品牌英文名',
  `isfix` tinyint(1) NOT NULL COMMENT '是否提供维修',
  PRIMARY KEY (`brandid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '品牌表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of brandinfo
-- ----------------------------
INSERT INTO `brandinfo` VALUES ('1', '小米', 'xiaomi', 1);

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
-- Table structure for express
-- ----------------------------
DROP TABLE IF EXISTS `express`;
CREATE TABLE `express`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `express_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '快递单号',
  `order_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-对应订单号',
  `expresscompany_id` int(11) NOT NULL COMMENT '外键-对应快递公司',
  `start_due` datetime(6) NOT NULL COMMENT '发货时间',
  `over_due` datetime(6) NULL DEFAULT NULL COMMENT '签收时间，可空',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `express_orderid`(`order_id`) USING BTREE,
  CONSTRAINT `express_orderid` FOREIGN KEY (`order_id`) REFERENCES `orderinfo` (`order_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '快递信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for fixmodel
-- ----------------------------
DROP TABLE IF EXISTS `fixmodel`;
CREATE TABLE `fixmodel`  (
  `brandid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-品牌id',
  `modelid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '机型id',
  `modelname` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '机型名称',
  `modelename` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '机型英文名称',
  `isdelete` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '删除标记',
  PRIMARY KEY (`modelid`) USING BTREE,
  INDEX `fbrandid`(`brandid`) USING BTREE,
  CONSTRAINT `fbrandid` FOREIGN KEY (`brandid`) REFERENCES `brandinfo` (`brandid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '维修机型' ROW_FORMAT = Dynamic;

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
  `pay_method` int(11) NOT NULL COMMENT '支付方式',
  `pay_card` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '支付卡号',
  `issuccess` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否支付成功，默认为支付中0，成功1，失败2',
  `pay_bdate` datetime(6) NOT NULL COMMENT '支付创建时间',
  `pay_odate` datetime(6) NULL DEFAULT NULL COMMENT '支付结束时间，一个订单的支付时间为5分钟',
  `order_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '订单号，可为空',
  PRIMARY KEY (`pay_id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `order_id`(`order_id`) USING BTREE,
  INDEX `payinfo_ibfk_3`(`pay_method`) USING BTREE,
  CONSTRAINT `payinfo_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `userinfo` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `payinfo_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orderinfo` (`order_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `payinfo_ibfk_3` FOREIGN KEY (`pay_method`) REFERENCES `paymlist` (`paym_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
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
-- Table structure for recommend
-- ----------------------------
DROP TABLE IF EXISTS `recommend`;
CREATE TABLE `recommend`  (
  `recommentid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '推荐id',
  `shopid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-绑定的shopid',
  `createTime` datetime(6) NOT NULL COMMENT '创建时间',
  `startdue` datetime(6) NOT NULL COMMENT '开始日期',
  `overdue` datetime(6) NOT NULL COMMENT '结束日期',
  `createMan` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-员工id',
  PRIMARY KEY (`recommentid`) USING BTREE,
  INDEX `recomment_shopid`(`shopid`) USING BTREE,
  CONSTRAINT `recomment_shopid` FOREIGN KEY (`shopid`) REFERENCES `shopinfo` (`shop_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '发现好货（官方推荐）' ROW_FORMAT = Dynamic;

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
-- Table structure for shopimg
-- ----------------------------
DROP TABLE IF EXISTS `shopimg`;
CREATE TABLE `shopimg`  (
  `imgid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品图片id',
  `shopid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-商品id',
  `path` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '图片路径',
  `createTime` datetime(6) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`imgid`) USING BTREE
) ENGINE = MyISAM CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of shopimg
-- ----------------------------
INSERT INTO `shopimg` VALUES ('1', '12', 'test.png', '2020-01-20 15:18:56.000000');
INSERT INTO `shopimg` VALUES ('2', '12', 'test1.png', '2020-01-20 16:19:52.000000');
INSERT INTO `shopimg` VALUES ('3', '13', 't1', '2020-01-20 16:41:42.000000');
INSERT INTO `shopimg` VALUES ('4', '12', '2', '2020-01-20 16:41:51.000000');

-- ----------------------------
-- Table structure for shopinfo
-- ----------------------------
DROP TABLE IF EXISTS `shopinfo`;
CREATE TABLE `shopinfo`  (
  `shop_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '主键-商品id（添加时间+品类编号+编号）',
  `shopname` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品名称',
  `shopdes` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '商品介绍',
  `shopsort` int(11) NOT NULL COMMENT '外键-分类id',
  `delete` tinyint(1) NOT NULL COMMENT '是否删除',
  `catName` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '分类名',
  `brandid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-品牌id',
  `createTime` datetime(6) NOT NULL COMMENT '创建日期',
  `isold` tinyint(1) NOT NULL COMMENT '是否为二手',
  `old_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '二手程度',
  PRIMARY KEY (`shop_id`) USING BTREE,
  INDEX `brandid`(`brandid`) USING BTREE,
  INDEX `sortid`(`shopsort`) USING BTREE,
  CONSTRAINT `brandid` FOREIGN KEY (`brandid`) REFERENCES `brandinfo` (`brandid`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `sortid` FOREIGN KEY (`shopsort`) REFERENCES `sortinfo` (`sortid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '商品信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of shopinfo
-- ----------------------------
INSERT INTO `shopinfo` VALUES ('12', '测试手机', '8', 1, 0, '手机', '1', '2020-01-19 21:53:27.000000', 0, '');
INSERT INTO `shopinfo` VALUES ('13', '测试手机2', '9', 1, 0, '手机', '1', '2020-01-19 22:00:41.000000', 0, NULL);

-- ----------------------------
-- Table structure for sortinfo
-- ----------------------------
DROP TABLE IF EXISTS `sortinfo`;
CREATE TABLE `sortinfo`  (
  `sortid` int(11) NOT NULL AUTO_INCREMENT COMMENT '分类id',
  `sortname` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '分类名',
  `isshow` tinyint(1) NOT NULL COMMENT '是否显示',
  `createTime` datetime(6) NOT NULL COMMENT '添加时间',
  `sortename` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '分类英文名，必须为大写',
  PRIMARY KEY (`sortid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '商品分类表\r\n' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sortinfo
-- ----------------------------
INSERT INTO `sortinfo` VALUES (1, '手机', 1, '2020-01-02 21:49:46.717000', 'PHONE');

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
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '用户昵称',
  `sex` tinyint(1) NULL DEFAULT 1 COMMENT '用户性别，默认为男，用数字1，2代替',
  `id` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '国内身份证，实名制标记',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '用户真实姓名，实名制标记',
  `phone` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '用户电话号码，常用，不可缺。',
  `birthday` datetime(6) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '用户生日，实名制标记',
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '用户邮箱-暂不使用，预留。',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '用户密码，加密。',
  `headimg` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '用户头像，不为空，若用户不设置有默认头像。',
  `lastmoney` decimal(8, 2) NULL DEFAULT 0.00 COMMENT '用户余额',
  `regisitertime` datetime(6) NOT NULL COMMENT '注册时间',
  `isname` tinyint(1) NULL DEFAULT 2 COMMENT '是否实名制',
  `nametime` datetime(6) NULL DEFAULT NULL COMMENT '实名制时间',
  PRIMARY KEY (`user_id`) USING BTREE,
  INDEX `phone`(`phone`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '用户信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of userinfo
-- ----------------------------
INSERT INTO `userinfo` VALUES ('1579012573', 'KEKE', 1, NULL, NULL, '15359639488', NULL, NULL, '96e79218965eb72c92a549dd5a330112', NULL, 0.00, '2020-01-14 22:07:18.000000', 2, NULL);
INSERT INTO `userinfo` VALUES ('1579016000', 'KESHAOYE', 1, '350103199808141910', '李柯伟', '18960784341', '2020-01-15 22:46:48.577805', NULL, '25d55ad283aa400af464c76d713c07ad', '/userHead/default.png', 0.00, '2020-01-14 22:32:54.000000', 1, '2020-01-14 22:47:21.000000');
INSERT INTO `userinfo` VALUES ('1579017318', 'KESHAOYE', 1, NULL, NULL, '15005097517', NULL, NULL, '25d55ad283aa400af464c76d713c07ad', NULL, 0.00, '2020-01-14 22:22:38.000000', 2, NULL);
INSERT INTO `userinfo` VALUES ('1579021812', 'KEKE', 1, '350103199808141910', '李柯伟', '15366669999', '2020-01-15 22:46:20.077925', NULL, 'e10adc3949ba59abbe56e057f20f883e', '/userHead/default.png', 0.00, '2020-01-14 22:53:59.000000', 1, '2020-01-14 22:56:21.000000');
INSERT INTO `userinfo` VALUES ('1579180837', 'KESHAOYE', 1, '350103199808141910', '李柯伟', '15359639480', '1998-08-14 00:00:00.000000', NULL, '25f9e794323b453885f5181f1b624d0b', '/userHead/20201521102533222.png', 0.00, '2020-01-16 21:09:57.000000', 1, '2020-01-16 21:10:25.000000');

SET FOREIGN_KEY_CHECKS = 1;
