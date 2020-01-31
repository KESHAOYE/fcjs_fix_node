/*
 Navicat MySQL Data Transfer

 Source Server         : KESHAOYE
 Source Server Type    : MySQL
 Source Server Version : 50726
 Source Host           : localhost:3306
 Source Schema         : fcjs_fix

 Target Server Type    : MySQL
 Target Server Version : 50726
 File Encoding         : 65001

 Date: 01/02/2020 01:20:18
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for adclick
-- ----------------------------
DROP TABLE IF EXISTS `adclick`;
CREATE TABLE `adclick`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `adid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键：广告id',
  `user` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'ip地址 或 用户id',
  `clickTime` datetime(6) NOT NULL COMMENT '点击时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `adclickid`(`adid`) USING BTREE,
  CONSTRAINT `adclickid` FOREIGN KEY (`adid`) REFERENCES `adinfo` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for address_info
-- ----------------------------
DROP TABLE IF EXISTS `address_info`;
CREATE TABLE `address_info`  (
  `addressid` int(11) NOT NULL COMMENT '主键=地址id',
  `user_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-用户id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '收货人姓名',
  `phone` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '收货人电话',
  `area` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '地区',
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '详细地址',
  `isDefault` tinyint(1) NOT NULL COMMENT '是否默认地址 0否 1是',
  `delete` tinyint(1) NOT NULL COMMENT '是否删除',
  `createTime` datetime(6) NOT NULL ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  PRIMARY KEY (`addressid`) USING BTREE,
  INDEX `addressuserid`(`user_id`) USING BTREE,
  CONSTRAINT `addressuserid` FOREIGN KEY (`user_id`) REFERENCES `userinfo` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '用户地址表\r\n' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for adinfo
-- ----------------------------
DROP TABLE IF EXISTS `adinfo`;
CREATE TABLE `adinfo`  (
  `id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '广告id',
  `adid` int(11) NOT NULL COMMENT '对应广告位',
  `adimg` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '广告图',
  `shopid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '外键-对应商品id',
  `createTime` datetime(6) NOT NULL COMMENT '创建时间',
  `startdue` date NOT NULL COMMENT '开始时间',
  `overdue` date NOT NULL COMMENT '过期时间',
  `create_man` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-对应员工号，添加人',
  `isshow` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否显示（删除）',
  `res` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `adinfo_shopid`(`shopid`) USING BTREE,
  INDEX `adid`(`adid`) USING BTREE,
  CONSTRAINT `adinfo_shopid` FOREIGN KEY (`shopid`) REFERENCES `shopinfo` (`shop_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '广告信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for article_info
-- ----------------------------
DROP TABLE IF EXISTS `article_info`;
CREATE TABLE `article_info`  (
  `aticleId` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键-详情id',
  `shopid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-商品id',
  `article_content` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`aticleId`) USING BTREE,
  INDEX `articleshopid`(`shopid`) USING BTREE,
  CONSTRAINT `articleshopid` FOREIGN KEY (`shopid`) REFERENCES `shopinfo` (`shop_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of article_info
-- ----------------------------
INSERT INTO `article_info` VALUES (1, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', '<p>test</p>');
INSERT INTO `article_info` VALUES (2, 'beb75e10-441d-11ea-bfbd-812f243dd1f9', '');

-- ----------------------------
-- Table structure for brandinfo
-- ----------------------------
DROP TABLE IF EXISTS `brandinfo`;
CREATE TABLE `brandinfo`  (
  `brandid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '品牌id',
  `brandname` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '品牌中文名',
  `brandename` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '品牌英文名',
  `brandimg` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '品牌logo',
  `isfix` tinyint(1) NOT NULL COMMENT '是否提供维修',
  PRIMARY KEY (`brandid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '品牌表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of brandinfo
-- ----------------------------
INSERT INTO `brandinfo` VALUES ('1', '小米', 'xiaomi', '/brand/20201620524488626.png', 1);
INSERT INTO `brandinfo` VALUES ('82885450-4362-11ea-9f28-0121c959f5e1', '苹果', 'APPLE', '/brand/20201521145640377.png', 1);
INSERT INTO `brandinfo` VALUES ('9246c930-4362-11ea-9f28-0121c959f5e1', '华为', 'HUAWEI', '/brand/20201521152281778.png', 1);
INSERT INTO `brandinfo` VALUES ('99f92740-4362-11ea-9f28-0121c959f5e1', '魅族', 'MEIZU', '/brand/20201521153573176.png', 1);
INSERT INTO `brandinfo` VALUES ('a397c4f0-4362-11ea-9f28-0121c959f5e1', '一加', 'ONEPLUS', '/brand/20201521155187065.png', 1);
INSERT INTO `brandinfo` VALUES ('ad8015d0-4362-11ea-9f28-0121c959f5e1', '欧珀', 'OPPO', '/brand/2020152116849225.png', 1);
INSERT INTO `brandinfo` VALUES ('af6bead0-4363-11ea-a2ce-ad6eaf55d11d', '三星', 'SAMSUNG', '/brand/20201521232120360.png', 1);
INSERT INTO `brandinfo` VALUES ('b9460ae0-4363-11ea-a2ce-ad6eaf55d11d', '维沃', 'VIVO', '/brand/20201521233774195.png', 1);

-- ----------------------------
-- Table structure for comment_info
-- ----------------------------
DROP TABLE IF EXISTS `comment_info`;
CREATE TABLE `comment_info`  (
  `commentid` int(11) NOT NULL AUTO_INCREMENT COMMENT '评论id',
  `shopid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-商品id',
  `specsid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-规格id',
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
  CONSTRAINT `userid` FOREIGN KEY (`userid`) REFERENCES `userinfo` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '评论商品表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for coupon
-- ----------------------------
DROP TABLE IF EXISTS `coupon`;
CREATE TABLE `coupon`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `coupon_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '优惠券ID',
  `type` tinyint(1) NOT NULL COMMENT '优惠券类型 0->全场赠券；1->购物赠券；2->注册赠券\'',
  `amount` decimal(10, 2) NOT NULL COMMENT '金额',
  `per_limit` int(11) NOT NULL COMMENT '每人限领数量',
  `min_price` decimal(10, 2) NOT NULL COMMENT '使用门槛',
  `start_time` datetime(6) NOT NULL COMMENT '开始使用时间',
  `over_time` datetime(6) NOT NULL COMMENT '结束使用时间',
  `use_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '使用类型：0->全场通用；1->指定分类；2->指定商品',
  `note` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '备注',
  `public_count` int(11) NOT NULL COMMENT '发行数量',
  `receive_count` int(11) NOT NULL DEFAULT 0 COMMENT '领取数量',
  `get_date` datetime(6) NOT NULL COMMENT '截至领取时间',
  `isshow` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `coupon_id`(`coupon_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of coupon
-- ----------------------------
INSERT INTO `coupon` VALUES (6, '1', 0, 100.00, 1, 101.00, '2020-01-23 00:00:00.000000', '2020-01-31 00:00:00.000000', '1', '测试优惠券', 100, 0, '2020-01-25 00:00:00.000000', 0);
INSERT INTO `coupon` VALUES (7, '1', 0, 100.00, 1, 101.00, '2020-01-23 00:00:00.000000', '2020-01-31 00:00:00.000000', '1', '测试优惠券', 100, 0, '2020-01-25 00:00:00.000000', 0);

-- ----------------------------
-- Table structure for coupon_shop
-- ----------------------------
DROP TABLE IF EXISTS `coupon_shop`;
CREATE TABLE `coupon_shop`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `coupon_id` bigint(20) NOT NULL COMMENT '外键: 优惠券id',
  `shop_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键：对应商品id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `couponshopcid`(`coupon_id`) USING BTREE,
  INDEX `couponshopsid`(`shop_id`) USING BTREE,
  CONSTRAINT `couponshopcid` FOREIGN KEY (`coupon_id`) REFERENCES `coupon` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `couponshopsid` FOREIGN KEY (`shop_id`) REFERENCES `shopinfo` (`shop_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for coupon_sort
-- ----------------------------
DROP TABLE IF EXISTS `coupon_sort`;
CREATE TABLE `coupon_sort`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `coupon_id` bigint(20) NOT NULL COMMENT '外键：优惠券id',
  `sort_id` int(11) NOT NULL COMMENT '外键：分类id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `couponsortcid`(`coupon_id`) USING BTREE,
  INDEX `couponsortsid`(`sort_id`) USING BTREE,
  CONSTRAINT `couponsortcid` FOREIGN KEY (`coupon_id`) REFERENCES `coupon` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `couponsortsid` FOREIGN KEY (`sort_id`) REFERENCES `sortinfo` (`sortid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

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
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu`  (
  `id` int(11) NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '菜单名称',
  `path` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '菜单路径',
  `icon` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '菜单图标',
  `parentId` int(11) NULL DEFAULT NULL COMMENT '子项',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `menucid`(`parentId`) USING BTREE,
  CONSTRAINT `menucid` FOREIGN KEY (`parentId`) REFERENCES `menu` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES (1, '首页', '/index', '', NULL);
INSERT INTO `menu` VALUES (2, '商品管理', '', NULL, NULL);
INSERT INTO `menu` VALUES (3, '类别属性设置', '/specManage', NULL, 2);
INSERT INTO `menu` VALUES (4, '库存管理', '/storageManage', NULL, 2);
INSERT INTO `menu` VALUES (5, '商品管理', '/shopManage', NULL, 2);
INSERT INTO `menu` VALUES (6, '广告管理', NULL, NULL, NULL);
INSERT INTO `menu` VALUES (7, '首页广告管理', '/indexAdManage', NULL, 6);
INSERT INTO `menu` VALUES (8, '商品推荐', '/shopRecomment', NULL, 6);
INSERT INTO `menu` VALUES (9, '基础运营配置', '', NULL, NULL);
INSERT INTO `menu` VALUES (10, '收款银行/账号设置', '/setBank', NULL, 9);
INSERT INTO `menu` VALUES (11, '运营人员管理', '/peopleManage', NULL, 9);
INSERT INTO `menu` VALUES (12, '部门权限设置', '/setAdmin', NULL, 9);
INSERT INTO `menu` VALUES (13, '品牌管理', '/brandManage', NULL, 9);
INSERT INTO `menu` VALUES (14, '活动管理', '', NULL, NULL);
INSERT INTO `menu` VALUES (15, '优惠券管理', '/couponManage', NULL, 14);
INSERT INTO `menu` VALUES (16, '活动管理', '/activityManage', NULL, 14);
INSERT INTO `menu` VALUES (17, '类别管理', '/sortManage', NULL, 9);
INSERT INTO `menu` VALUES (18, '社区(评论)管理', NULL, NULL, NULL);
INSERT INTO `menu` VALUES (19, '评论管理', '/commentManage', NULL, 18);
INSERT INTO `menu` VALUES (20, '举报管理', '/reportManage', NULL, 18);

-- ----------------------------
-- Table structure for menu_user
-- ----------------------------
DROP TABLE IF EXISTS `menu_user`;
CREATE TABLE `menu_user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleid` int(11) NOT NULL COMMENT '主/外 键：角色id',
  `menuid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键：菜单id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 74 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menu_user
-- ----------------------------
INSERT INTO `menu_user` VALUES (1, 1, '1');
INSERT INTO `menu_user` VALUES (2, 1, '2');
INSERT INTO `menu_user` VALUES (3, 1, '3');
INSERT INTO `menu_user` VALUES (4, 1, '4');
INSERT INTO `menu_user` VALUES (5, 1, '5');
INSERT INTO `menu_user` VALUES (6, 1, '6');
INSERT INTO `menu_user` VALUES (7, 1, '7');
INSERT INTO `menu_user` VALUES (8, 1, '8');
INSERT INTO `menu_user` VALUES (9, 2, '1');
INSERT INTO `menu_user` VALUES (10, 2, '2');
INSERT INTO `menu_user` VALUES (11, 2, '3');
INSERT INTO `menu_user` VALUES (12, 2, '4');
INSERT INTO `menu_user` VALUES (13, 2, '5');
INSERT INTO `menu_user` VALUES (14, 2, '6');
INSERT INTO `menu_user` VALUES (15, 2, '7');
INSERT INTO `menu_user` VALUES (16, 2, '8');
INSERT INTO `menu_user` VALUES (17, 3, '1');
INSERT INTO `menu_user` VALUES (18, 3, '2');
INSERT INTO `menu_user` VALUES (19, 3, '3');
INSERT INTO `menu_user` VALUES (20, 3, '4');
INSERT INTO `menu_user` VALUES (21, 3, '5');
INSERT INTO `menu_user` VALUES (22, 3, '6');
INSERT INTO `menu_user` VALUES (23, 3, '7');
INSERT INTO `menu_user` VALUES (24, 3, '8');
INSERT INTO `menu_user` VALUES (25, 4, '1');
INSERT INTO `menu_user` VALUES (26, 4, '2');
INSERT INTO `menu_user` VALUES (27, 4, '3');
INSERT INTO `menu_user` VALUES (28, 4, '4');
INSERT INTO `menu_user` VALUES (29, 4, '5');
INSERT INTO `menu_user` VALUES (30, 4, '6');
INSERT INTO `menu_user` VALUES (31, 4, '7');
INSERT INTO `menu_user` VALUES (32, 4, '8');
INSERT INTO `menu_user` VALUES (33, 5, '1');
INSERT INTO `menu_user` VALUES (34, 5, '2');
INSERT INTO `menu_user` VALUES (35, 5, '3');
INSERT INTO `menu_user` VALUES (36, 5, '4');
INSERT INTO `menu_user` VALUES (37, 5, '5');
INSERT INTO `menu_user` VALUES (38, 5, '6');
INSERT INTO `menu_user` VALUES (39, 5, '7');
INSERT INTO `menu_user` VALUES (40, 5, '8');
INSERT INTO `menu_user` VALUES (41, 6, '1');
INSERT INTO `menu_user` VALUES (42, 6, '2');
INSERT INTO `menu_user` VALUES (43, 6, '3');
INSERT INTO `menu_user` VALUES (44, 6, '4');
INSERT INTO `menu_user` VALUES (45, 6, '5');
INSERT INTO `menu_user` VALUES (46, 6, '6');
INSERT INTO `menu_user` VALUES (47, 6, '7');
INSERT INTO `menu_user` VALUES (48, 6, '8');
INSERT INTO `menu_user` VALUES (69, 7, '16');
INSERT INTO `menu_user` VALUES (68, 7, '15');
INSERT INTO `menu_user` VALUES (66, 7, '13');
INSERT INTO `menu_user` VALUES (67, 7, '14');
INSERT INTO `menu_user` VALUES (53, 7, '1');
INSERT INTO `menu_user` VALUES (54, 7, '2');
INSERT INTO `menu_user` VALUES (55, 7, '17');
INSERT INTO `menu_user` VALUES (56, 7, '4');
INSERT INTO `menu_user` VALUES (57, 7, '5');
INSERT INTO `menu_user` VALUES (58, 7, '6');
INSERT INTO `menu_user` VALUES (59, 7, '7');
INSERT INTO `menu_user` VALUES (60, 7, '8');
INSERT INTO `menu_user` VALUES (61, 7, '9');
INSERT INTO `menu_user` VALUES (62, 7, '10');
INSERT INTO `menu_user` VALUES (63, 7, '11');
INSERT INTO `menu_user` VALUES (64, 7, '12');
INSERT INTO `menu_user` VALUES (70, 7, '3');
INSERT INTO `menu_user` VALUES (71, 7, '18');
INSERT INTO `menu_user` VALUES (72, 7, '19');
INSERT INTO `menu_user` VALUES (73, 7, '20');

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
  `pay_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '支付单id',
  `user_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '用户id，外键',
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
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleid` int(11) NOT NULL COMMENT '0->客户，1->客服人员 , 2->快递仓储部，3->广告部, 4->维修部，5->商品部，6->超级管理员',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '角色名称',
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '角色描述',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (1, 0, 'USER', '普通用户');
INSERT INTO `role` VALUES (2, 1, 'CUSTOMER', '客服人员');
INSERT INTO `role` VALUES (3, 2, 'EXPRESS', '快递仓储人员');
INSERT INTO `role` VALUES (4, 3, 'AD', '广告部');
INSERT INTO `role` VALUES (5, 4, 'FIX', '手机维修部');
INSERT INTO `role` VALUES (6, 5, 'SHOP', '商品部');
INSERT INTO `role` VALUES (7, 6, 'SUPER', '超级管理员');

-- ----------------------------
-- Table structure for roleuser
-- ----------------------------
DROP TABLE IF EXISTS `roleuser`;
CREATE TABLE `roleuser`  (
  `roleid` int(11) NOT NULL COMMENT '外键: 角色id',
  `userid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键: 用户id',
  PRIMARY KEY (`userid`) USING BTREE,
  INDEX `roleuserroleid`(`roleid`) USING BTREE,
  CONSTRAINT `roleuserroleid` FOREIGN KEY (`roleid`) REFERENCES `role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of roleuser
-- ----------------------------
INSERT INTO `roleuser` VALUES (7, '1580038654');

-- ----------------------------
-- Table structure for searchrecord
-- ----------------------------
DROP TABLE IF EXISTS `searchrecord`;
CREATE TABLE `searchrecord`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '搜索记录id',
  `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '搜索记录信息',
  `time` datetime(6) NOT NULL COMMENT '搜索时间',
  `user_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '外键 用户id',
  `ip_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '搜索IP地址',
  `isshow` tinyint(1) NOT NULL COMMENT '是否显示 0不显示 1显示',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `userinfo` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '搜索记录' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for shop_sku_spec
-- ----------------------------
DROP TABLE IF EXISTS `shop_sku_spec`;
CREATE TABLE `shop_sku_spec`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sku_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT 'sku属性id',
  `price` decimal(10, 2) NOT NULL COMMENT '价格',
  `stock` int(11) NOT NULL COMMENT '库存',
  `shop_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键:对应商品id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of shop_sku_spec
-- ----------------------------
INSERT INTO `shop_sku_spec` VALUES (1, 'e3ff0e40-442a-11ea-aabe-35c76079655b', 300.00, 0, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9');
INSERT INTO `shop_sku_spec` VALUES (2, 'e3ff0e41-442a-11ea-aabe-35c76079655b', 400.00, 0, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9');
INSERT INTO `shop_sku_spec` VALUES (3, 'e3ff5c60-442a-11ea-aabe-35c76079655b', 0.00, 0, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9');
INSERT INTO `shop_sku_spec` VALUES (4, 'e3ff8370-442a-11ea-aabe-35c76079655b', 0.00, 0, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9');

-- ----------------------------
-- Table structure for shop_sku_spec_value
-- ----------------------------
DROP TABLE IF EXISTS `shop_sku_spec_value`;
CREATE TABLE `shop_sku_spec_value`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `spec_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键: 规格id',
  `sku_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键: skuid',
  `sku_value` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT 'sku值',
  `createTime` datetime(6) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of shop_sku_spec_value
-- ----------------------------
INSERT INTO `shop_sku_spec_value` VALUES (1, 'e19a7d80-437e-11ea-a8c9-27ce6b8279d2', 'e3ff0e40-442a-11ea-aabe-35c76079655b', '64G', '2020-01-31 21:09:19.000000');
INSERT INTO `shop_sku_spec_value` VALUES (2, 'e19a7d80-437e-11ea-a8c9-27ce6b8279d2', 'e3ff0e41-442a-11ea-aabe-35c76079655b', '128G', '2020-01-31 21:09:19.000000');
INSERT INTO `shop_sku_spec_value` VALUES (3, 'e9fca390-437e-11ea-a8c9-27ce6b8279d2', 'e3ff5c60-442a-11ea-aabe-35c76079655b', '黑色', '2020-01-31 21:09:19.000000');
INSERT INTO `shop_sku_spec_value` VALUES (4, 'e9fca390-437e-11ea-a8c9-27ce6b8279d2', 'e3ff8370-442a-11ea-aabe-35c76079655b', '白色', '2020-01-31 21:09:19.000000');

-- ----------------------------
-- Table structure for shop_spec
-- ----------------------------
DROP TABLE IF EXISTS `shop_spec`;
CREATE TABLE `shop_spec`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `spec_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品规格id',
  `spec_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品规格名称',
  `spec_des` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '描述',
  `createTime` datetime(6) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `specs_id`(`spec_id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of shop_spec
-- ----------------------------
INSERT INTO `shop_spec` VALUES (1, 'e19a7d80-437e-11ea-a8c9-27ce6b8279d2', '内存', '智能产品适用', '2020-01-31 00:38:01.000000');
INSERT INTO `shop_spec` VALUES (2, 'e9fca390-437e-11ea-a8c9-27ce6b8279d2', '颜色', '全品类适用', '2020-01-31 00:38:15.000000');
INSERT INTO `shop_spec` VALUES (3, 'f4d065e0-437e-11ea-a8c9-27ce6b8279d2', '摄像头数量', '手机，平板适用', '2020-01-31 00:38:34.000000');
INSERT INTO `shop_spec` VALUES (4, 'fd61d950-437e-11ea-a8c9-27ce6b8279d2', '处理器', '智能设备适用', '2020-01-31 00:38:48.000000');

-- ----------------------------
-- Table structure for shop_spec_value
-- ----------------------------
DROP TABLE IF EXISTS `shop_spec_value`;
CREATE TABLE `shop_spec_value`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `spec_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键: 规格id',
  `spec_value` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '规格值',
  `createTime` datetime(6) NOT NULL COMMENT '创建时间',
  `spu_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT 'spuid',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ssv_id`(`spec_id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 15 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of shop_spec_value
-- ----------------------------
INSERT INTO `shop_spec_value` VALUES (13, 'f4d065e0-437e-11ea-a8c9-27ce6b8279d2', '5', '2020-01-31 21:09:19.000000', 'e3fec020-442a-11ea-aabe-35c76079655b');
INSERT INTO `shop_spec_value` VALUES (14, 'fd61d950-437e-11ea-a8c9-27ce6b8279d2', '骁龙765', '2020-01-31 21:09:19.000000', 'e3fd1270-442a-11ea-aabe-35c76079655b');

-- ----------------------------
-- Table structure for shop_spu_spec
-- ----------------------------
DROP TABLE IF EXISTS `shop_spu_spec`;
CREATE TABLE `shop_spu_spec`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shop_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键: 商品id',
  `spec_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键: 规格id',
  `createTime` datetime(6) NOT NULL COMMENT '创建时间',
  `spu_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT 'spuid',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 15 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of shop_spu_spec
-- ----------------------------
INSERT INTO `shop_spu_spec` VALUES (1, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 'f4d065e0-437e-11ea-a8c9-27ce6b8279d2', '2020-01-31 19:32:57.000000', '6ddf9110-441d-11ea-bfbd-812f243dd1f9');
INSERT INTO `shop_spu_spec` VALUES (2, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 'fd61d950-437e-11ea-a8c9-27ce6b8279d2', '2020-01-31 19:32:57.000000', '6ddfb820-441d-11ea-bfbd-812f243dd1f9');
INSERT INTO `shop_spu_spec` VALUES (3, 'beb75e10-441d-11ea-bfbd-812f243dd1f9', 'fd61d950-437e-11ea-a8c9-27ce6b8279d2', '2020-01-31 19:35:13.000000', 'becd5710-441d-11ea-bfbd-812f243dd1f9');
INSERT INTO `shop_spu_spec` VALUES (4, 'beb75e10-441d-11ea-bfbd-812f243dd1f9', 'f4d065e0-437e-11ea-a8c9-27ce6b8279d2', '2020-01-31 19:35:13.000000', 'becd3000-441d-11ea-bfbd-812f243dd1f9');
INSERT INTO `shop_spu_spec` VALUES (8, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 'f4d065e0-437e-11ea-a8c9-27ce6b8279d2', '2020-01-31 19:55:50.000000', '9ff53170-4420-11ea-9dfb-f38d6d33b9b5');
INSERT INTO `shop_spu_spec` VALUES (7, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 'fd61d950-437e-11ea-a8c9-27ce6b8279d2', '2020-01-31 19:55:50.000000', '9ff55880-4420-11ea-9dfb-f38d6d33b9b5');
INSERT INTO `shop_spu_spec` VALUES (9, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 'f4d065e0-437e-11ea-a8c9-27ce6b8279d2', '2020-01-31 20:01:29.000000', '6a0c9340-4421-11ea-9dfb-f38d6d33b9b5');
INSERT INTO `shop_spu_spec` VALUES (10, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 'fd61d950-437e-11ea-a8c9-27ce6b8279d2', '2020-01-31 20:01:29.000000', '6a0cba50-4421-11ea-9dfb-f38d6d33b9b5');
INSERT INTO `shop_spu_spec` VALUES (11, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 'fd61d950-437e-11ea-a8c9-27ce6b8279d2', '2020-01-31 20:25:20.000000', 'bf1112a0-4424-11ea-9dfb-f38d6d33b9b5');
INSERT INTO `shop_spu_spec` VALUES (12, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 'f4d065e0-437e-11ea-a8c9-27ce6b8279d2', '2020-01-31 20:25:20.000000', 'bf10eb90-4424-11ea-9dfb-f38d6d33b9b5');
INSERT INTO `shop_spu_spec` VALUES (13, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 'f4d065e0-437e-11ea-a8c9-27ce6b8279d2', '2020-01-31 21:09:19.000000', 'e3fec020-442a-11ea-aabe-35c76079655b');
INSERT INTO `shop_spu_spec` VALUES (14, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 'fd61d950-437e-11ea-a8c9-27ce6b8279d2', '2020-01-31 21:09:19.000000', 'e3fd1270-442a-11ea-aabe-35c76079655b');

-- ----------------------------
-- Table structure for shopimg
-- ----------------------------
DROP TABLE IF EXISTS `shopimg`;
CREATE TABLE `shopimg`  (
  `imgid` int(11) NOT NULL AUTO_INCREMENT COMMENT '商品图片id',
  `shopid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-商品id',
  `path` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '图片路径',
  `createTime` datetime(6) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`imgid`) USING BTREE,
  INDEX `shopimgid`(`shopid`) USING BTREE,
  CONSTRAINT `shopimgid` FOREIGN KEY (`shopid`) REFERENCES `shopinfo` (`shop_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of shopimg
-- ----------------------------
INSERT INTO `shopimg` VALUES (2, 'beb75e10-441d-11ea-bfbd-812f243dd1f9', '/shop/20201619351340768.png', '2020-01-31 19:35:13.000000');
INSERT INTO `shopimg` VALUES (7, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', '/shop/2020162191925221.png', '2020-01-31 21:09:19.000000');

-- ----------------------------
-- Table structure for shopinfo
-- ----------------------------
DROP TABLE IF EXISTS `shopinfo`;
CREATE TABLE `shopinfo`  (
  `shop_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '主键-商品id（添加时间+品类编号+编号）',
  `shopname` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品名称',
  `shopdes` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '商品介绍',
  `shopsort` int(11) NOT NULL COMMENT '外键-分类id',
  `price` decimal(10, 2) NOT NULL COMMENT '最低价格',
  `brandid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-品牌id',
  `createTime` datetime(6) NOT NULL COMMENT '创建日期',
  `isold` tinyint(1) NOT NULL COMMENT '是否为二手',
  `old_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '二手程度',
  `delete` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`shop_id`) USING BTREE,
  INDEX `brandid`(`brandid`) USING BTREE,
  INDEX `sortid`(`shopsort`) USING BTREE,
  CONSTRAINT `brandid` FOREIGN KEY (`brandid`) REFERENCES `brandinfo` (`brandid`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `sortid` FOREIGN KEY (`shopsort`) REFERENCES `sortinfo` (`sortid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '商品信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of shopinfo
-- ----------------------------
INSERT INTO `shopinfo` VALUES ('1af5d400-441d-11ea-bfbd-812f243dd1f9', '小米CC9', '小米cc', 1, 1399.00, '1', '2020-01-31 19:30:38.000000', 0, '', 0);
INSERT INTO `shopinfo` VALUES ('2fbe6a50-441d-11ea-bfbd-812f243dd1f9', 'K30', 'redmi', 1, 1999.00, '1', '2020-01-31 19:31:13.000000', 0, '', 0);
INSERT INTO `shopinfo` VALUES ('6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 'cc9', 'x', 1, 1399.00, '1', '2020-01-31 19:32:57.000000', 0, 'undefined', 0);
INSERT INTO `shopinfo` VALUES ('beb75e10-441d-11ea-bfbd-812f243dd1f9', 'K30', 'xiaomi', 1, 1999.00, '1', '2020-01-31 19:35:13.000000', 0, '', 0);

-- ----------------------------
-- Table structure for sku_stock
-- ----------------------------
DROP TABLE IF EXISTS `sku_stock`;
CREATE TABLE `sku_stock`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shop_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '商品id',
  `price` decimal(10, 2) NOT NULL COMMENT '价格',
  `stock` int(11) NOT NULL DEFAULT 0 COMMENT '库存',
  `sku_concat` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '对应sku JSON',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `sku_concat`(`sku_concat`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sku_stock
-- ----------------------------
INSERT INTO `sku_stock` VALUES (4, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 1699.00, 105, '{\"内存\":\"64G\",\"颜色\":\"白色\"}');

-- ----------------------------
-- Table structure for sortinfo
-- ----------------------------
DROP TABLE IF EXISTS `sortinfo`;
CREATE TABLE `sortinfo`  (
  `sortid` int(11) NOT NULL AUTO_INCREMENT COMMENT '分类id',
  `sortname` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '分类名',
  `sortename` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '分类英文名，必须为大写',
  `isshow` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否显示',
  `createTime` datetime(6) NOT NULL COMMENT '添加时间',
  PRIMARY KEY (`sortid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '商品分类表\r\n' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sortinfo
-- ----------------------------
INSERT INTO `sortinfo` VALUES (1, '手机', 'PHONE', 1, '2020-01-02 21:49:46.717000');
INSERT INTO `sortinfo` VALUES (2, '电脑', 'COMPUTER', 1, '2020-01-28 22:35:12.000000');

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
-- Table structure for usercoupon
-- ----------------------------
DROP TABLE IF EXISTS `usercoupon`;
CREATE TABLE `usercoupon`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `coupon_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '外键:优惠券id',
  `user_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键:用户id',
  `get_type` tinyint(1) NOT NULL COMMENT '获取类型：0->后台赠送；1->主动获取',
  `createTime` datetime(6) NOT NULL COMMENT '获取时间',
  `use_status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '使用状态: 0->未使用 1-> 已使用  2-> 已过期',
  `use_time` datetime(6) NULL DEFAULT NULL COMMENT '使用时间',
  `order_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '外键:订单id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `couponcid`(`coupon_id`) USING BTREE,
  INDEX `couserid`(`user_id`) USING BTREE,
  INDEX `couponorderid`(`order_id`) USING BTREE,
  CONSTRAINT `couponcid` FOREIGN KEY (`coupon_id`) REFERENCES `coupon` (`coupon_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `couponorderid` FOREIGN KEY (`order_id`) REFERENCES `orderinfo` (`order_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `couserid` FOREIGN KEY (`user_id`) REFERENCES `userinfo` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for userinfo
-- ----------------------------
DROP TABLE IF EXISTS `userinfo`;
CREATE TABLE `userinfo`  (
  `user_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '' COMMENT '用户id，唯一，规则时间戳+random',
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
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '权限: 0->普通用户 ，1->普通管理员， 2->超级管理员',
  PRIMARY KEY (`user_id`) USING BTREE,
  INDEX `phone`(`phone`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '用户信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of userinfo
-- ----------------------------
INSERT INTO `userinfo` VALUES ('111', '1', 1, '1', '1', '1', '2020-01-26 19:31:40.000000', NULL, '1', '1', 0.00, '2020-01-26 19:31:44.000000', 2, NULL, 0);
INSERT INTO `userinfo` VALUES ('1234', '1', 1, '1', '1', '1', '2020-01-25 19:48:23.000000', '1', '1', '1', 0.00, '2020-01-25 19:48:29.000000', 2, NULL, 0);
INSERT INTO `userinfo` VALUES ('1580038654', 'ke', 1, NULL, NULL, '18089008889', NULL, NULL, 'e10adc3949ba59abbe56e057f20f883e', NULL, 0.00, '2020-01-26 17:55:42.000000', 2, NULL, 0);

-- ----------------------------
-- Procedure structure for couponshop
-- ----------------------------
DROP PROCEDURE IF EXISTS `couponshop`;
delimiter ;;
CREATE PROCEDURE `couponshop`(IN coupon_id VARCHAR(255),
 IN type TINYINT(1),
 IN amount DECIMAL(10,2),
 IN per_limit INT(11),
 IN min_price DECIMAL(10,2),
 IN start_time DATETIME(6),
 IN over_time DATETIME(6),
 IN use_type VARCHAR(255),
 IN note VARCHAR(255),
 IN public_count INT(11),
 IN get_date DATETIME(6),
 IN shop_id VARCHAR(255))
begin
DECLARE coupon_temp_id int;
insert into coupon(coupon_id,type,amount,per_limit,min_price,start_time,over_time,use_type,note,public_count,get_date) values(coupon_id,type,amount,per_limit,min_price,start_time,over_time,use_type,note,public_count,get_date);
SELECT MAX(id) from coupon INTO coupon_temp_id;
insert into coupon_shop(coupon_id,shop_id) VALUES(coupon_temp_id,shop_id);END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for couponsort
-- ----------------------------
DROP PROCEDURE IF EXISTS `couponsort`;
delimiter ;;
CREATE PROCEDURE `couponsort`(IN coupon_id VARCHAR(255),
 IN type TINYINT(1),
 IN amount DECIMAL(10,2),
 IN per_limit INT(11),
 IN min_price DECIMAL(10,2),
 IN start_time DATETIME(6),
 IN over_time DATETIME(6),
 IN use_type VARCHAR(255),
 IN note VARCHAR(255),
 IN public_count INT(11),
 IN get_date DATETIME(6),
 IN sort_id INT(11))
begin
DECLARE coupon_temp_id int;
insert into coupon(coupon_id,type,amount,per_limit,min_price,start_time,over_time,use_type,note,public_count,get_date) values(coupon_id,type,amount,per_limit,min_price,start_time,over_time,use_type,note,public_count,get_date);
SELECT MAX(id) from coupon INTO coupon_temp_id;
insert into coupon_sort(coupon_id,sort_id) VALUES(coupon_temp_id,sort_id);END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for insertrole
-- ----------------------------
DROP PROCEDURE IF EXISTS `insertrole`;
delimiter ;;
CREATE PROCEDURE `insertrole`()
BEGIN
DECLARE i INT DEFAULT 1;
WHILE i <= 12 DO
INSERT INTO menu_user(menuid,roleid) VALUES(i, 7);
SET i = i+1;
END WHILE;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for roleinfo
-- ----------------------------
DROP PROCEDURE IF EXISTS `roleinfo`;
delimiter ;;
CREATE PROCEDURE `roleinfo`()
BEGIN
    DECLARE rid INT(11);
    DECLARE userid varchar(255);
    SELECT user_id INTO userid from userinfo where phone = '18089008889';
    SELECT roleid INTO rid FROM roleuser where userid = userid;
    SELECT * FROM role where id = rid;
    END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
