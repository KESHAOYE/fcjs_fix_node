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

 Date: 11/02/2020 22:07:46
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for address_info
-- ----------------------------
DROP TABLE IF EXISTS `address_info`;
CREATE TABLE `address_info`  (
  `addressid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '主键=地址id',
  `user_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-用户id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '收货人姓名',
  `phone` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '收货人电话',
  `area` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '地区',
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '详细地址',
  `isDefault` tinyint(1) NOT NULL COMMENT '是否默认地址 0否 1是',
  `delete` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  `createTime` datetime(6) NOT NULL ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  PRIMARY KEY (`addressid`) USING BTREE,
  INDEX `addressuserid`(`user_id`) USING BTREE,
  CONSTRAINT `addressuserid` FOREIGN KEY (`user_id`) REFERENCES `userinfo` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '用户地址表\r\n' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of address_info
-- ----------------------------
INSERT INTO `address_info` VALUES ('1e47c1c0-4afa-11ea-8bc9-8f29d4524694', '1580038654', '李柯伟', '15359639480', '{\"province\":{\"key\":\"220000\",\"value\":\"吉林省\"},\"city\":{\"key\":\"222400\",\"value\":\"延边朝鲜族自治州\"},\"area\":{\"key\":\"222402\",\"value\":\"图们市\"},\"town\":null}', '测试地址', 1, 1, '2020-02-09 13:38:19.830566');
INSERT INTO `address_info` VALUES ('23bb2840-4bea-11ea-ba2b-cdccb05ac571', '1580886692', '李柯伟', '15359639480', '{\"province\":{\"key\":\"350000\",\"value\":\"福建省\"},\"city\":{\"key\":\"350500\",\"value\":\"泉州市\"},\"area\":{\"key\":\"350502\",\"value\":\"鲤城区\"},\"town\":null}', '泉州师范学院软件学院', 0, 0, '2020-02-10 17:45:58.000000');
INSERT INTO `address_info` VALUES ('86cb9920-4afe-11ea-861b-0fab6f5b071e', '1580038654', '李柯伟', '15359639480', '{\"province\":{\"key\":\"130000\",\"value\":\"河北省\"},\"city\":{\"key\":\"130700\",\"value\":\"张家口市\"},\"area\":{\"key\":\"130705\",\"value\":\"宣化区\"},\"town\":null}', 'test', 1, 1, '2020-02-09 13:39:28.124876');
INSERT INTO `address_info` VALUES ('8e686d30-4b1b-11ea-b3bc-4dd221a28ee2', '1580886692', '李柯伟', '15359639480', '{\"province\":{\"key\":\"350000\",\"value\":\"福建省\"},\"city\":{\"key\":\"350100\",\"value\":\"福州市\"},\"area\":{\"key\":\"350103\",\"value\":\"台江区\"},\"town\":null}', '上海街道交通路10号', 1, 0, '2020-02-09 17:07:11.000000');

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
-- Records of adinfo
-- ----------------------------
INSERT INTO `adinfo` VALUES ('361439b0-464e-11ea-8f12-8f1518e0433f', 2, '/ad/20202214301056574.png', '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', '2020-02-03 14:27:11.000000', '2020-02-02', '2020-03-30', '18089008889', 1, '一亿像素，照亮你的美');
INSERT INTO `adinfo` VALUES ('bab95640-465e-11ea-838a-cf1d551cc342', 1, '/ad/20202216252617961.png', NULL, '2020-02-03 16:25:26.000000', '2020-02-03', '2020-03-31', '18089008889', 0, NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of article_info
-- ----------------------------
INSERT INTO `article_info` VALUES (1, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', '<p>小米cc9 pro</p>');
INSERT INTO `article_info` VALUES (3, '8ab895d0-4750-11ea-9446-3f50e963da89', '<p>红米</p>');
INSERT INTO `article_info` VALUES (4, '468f98e0-4bd3-11ea-a6ec-85b70d8de374', '<p>测试电脑分类</p>');

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
  `sku_id` int(11) NOT NULL COMMENT '外键-规格id',
  `comment` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '评论内容',
  `userid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-用户id',
  `comment_time` datetime(6) NOT NULL COMMENT '评论时间',
  `likes` int(11) NOT NULL DEFAULT 0 COMMENT '点赞数',
  `score` int(11) NOT NULL COMMENT '评分0-5分',
  `isshow` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否因举报而不显示',
  `delete` tinyint(1) NOT NULL COMMENT '用户是否删除',
  `comment_img` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '存放图片JSON',
  PRIMARY KEY (`commentid`) USING BTREE,
  INDEX `cshopid`(`shopid`) USING BTREE,
  INDEX `userid`(`userid`) USING BTREE,
  INDEX `cskuid`(`sku_id`) USING BTREE,
  CONSTRAINT `cshopid` FOREIGN KEY (`shopid`) REFERENCES `shopinfo` (`shop_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `cskuid` FOREIGN KEY (`sku_id`) REFERENCES `sku_stock` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `userid` FOREIGN KEY (`userid`) REFERENCES `userinfo` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '评论商品表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comment_info
-- ----------------------------
INSERT INTO `comment_info` VALUES (1, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 1, '好棒啊，外观好看，屏幕素质好，耐用', '1580038654', '2020-02-06 20:56:24.000000', 4, 1, 1, 0, '');
INSERT INTO `comment_info` VALUES (2, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 1, '外观好看，真喜欢，爱了', '1580886692', '2020-02-06 20:56:57.000000', 3, 5, 1, 0, '');

-- ----------------------------
-- Table structure for coupon
-- ----------------------------
DROP TABLE IF EXISTS `coupon`;
CREATE TABLE `coupon`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `coupon_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '优惠券ID',
  `type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '优惠券类型 0->全场赠券；1->购物赠券；2->注册赠券\'',
  `amount` decimal(10, 2) NOT NULL COMMENT '金额',
  `per_limit` int(11) NOT NULL DEFAULT 1 COMMENT '每人限领数量',
  `min_price` decimal(10, 2) NOT NULL COMMENT '使用门槛',
  `start_time` datetime(6) NOT NULL COMMENT '开始使用时间',
  `over_time` datetime(6) NOT NULL COMMENT '结束使用时间',
  `use_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '使用类型：0->全场通用；1->指定分类；2->指定商品',
  `note` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '备注',
  `public_count` int(11) NOT NULL COMMENT '发行数量',
  `receive_count` int(11) NOT NULL DEFAULT 0 COMMENT '领取数量',
  `get_date` datetime(6) NOT NULL COMMENT '截至领取时间',
  `isshow` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `coupon_id`(`coupon_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of coupon
-- ----------------------------
INSERT INTO `coupon` VALUES (27, 'f09abec0-4b0e-11ea-b162-3300f5b0be1c', 0, 100.00, 1, 1000.00, '2020-02-09 00:00:00.000000', '2020-02-29 00:00:00.000000', '1', '小米CC9 PRO专用', 100, 1, '2020-02-25 00:00:00.000000', 0);
INSERT INTO `coupon` VALUES (28, '0c367370-4bcf-11ea-a30a-657359835868', 0, 100.00, 1, 1200.00, '2020-02-10 00:00:00.000000', '2020-02-29 00:00:00.000000', '0', '全平台', 200, 2, '2020-02-25 00:00:00.000000', 0);
INSERT INTO `coupon` VALUES (29, '5ad98620-4bcf-11ea-a30a-657359835868', 0, 500.00, 1, 1000.00, '2020-02-10 00:00:00.000000', '2020-02-29 00:00:00.000000', '1', 'REDMI K30专用', 100, 1, '2020-02-25 00:00:00.000000', 0);
INSERT INTO `coupon` VALUES (31, '24b6b330-4bd2-11ea-a6ec-85b70d8de374', 0, 100.00, 1, 1000.00, '2020-02-10 00:00:00.000000', '2020-03-31 00:00:00.000000', '2', '1', 100, 1, '2020-02-29 00:00:00.000000', 0);

-- ----------------------------
-- Table structure for coupon_shop
-- ----------------------------
DROP TABLE IF EXISTS `coupon_shop`;
CREATE TABLE `coupon_shop`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `coupon_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键: 优惠券id',
  `shop_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键：对应商品id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `couponshopcid`(`coupon_id`) USING BTREE,
  INDEX `couponshopsid`(`shop_id`) USING BTREE,
  CONSTRAINT `couponshopsid` FOREIGN KEY (`shop_id`) REFERENCES `shopinfo` (`shop_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of coupon_shop
-- ----------------------------
INSERT INTO `coupon_shop` VALUES (10, 'f09abec0-4b0e-11ea-b162-3300f5b0be1c', '6dd4bba0-441d-11ea-bfbd-812f243dd1f9');
INSERT INTO `coupon_shop` VALUES (11, '5ad98620-4bcf-11ea-a30a-657359835868', '8ab895d0-4750-11ea-9446-3f50e963da89');
INSERT INTO `coupon_shop` VALUES (12, '21398fd0-4bd1-11ea-84ba-0fadeffea047', '6dd4bba0-441d-11ea-bfbd-812f243dd1f9');

-- ----------------------------
-- Table structure for coupon_sort
-- ----------------------------
DROP TABLE IF EXISTS `coupon_sort`;
CREATE TABLE `coupon_sort`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `coupon_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键：优惠券id',
  `sort_id` int(11) NOT NULL COMMENT '外键：分类id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `couponsortcid`(`coupon_id`) USING BTREE,
  INDEX `couponsortsid`(`sort_id`) USING BTREE,
  CONSTRAINT `couponsortsid` FOREIGN KEY (`sort_id`) REFERENCES `sortinfo` (`sortid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of coupon_sort
-- ----------------------------
INSERT INTO `coupon_sort` VALUES (1, '24b6b330-4bd2-11ea-a6ec-85b70d8de374', 1);

-- ----------------------------
-- Table structure for fixitem
-- ----------------------------
DROP TABLE IF EXISTS `fixitem`;
CREATE TABLE `fixitem`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sort_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键: 项目分类id',
  `item_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '项目id',
  `item_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '项目名称',
  `item_des` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '前端显示的说明',
  `item_method` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '更换方法',
  `delete` tinyint(1) NOT NULL DEFAULT 0 COMMENT '删除标记',
  `createTime` datetime(6) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fixitem
-- ----------------------------
INSERT INTO `fixitem` VALUES (2, 'f3c5ce30-44f3-11ea-9ea5-a13afdcd220f', 'dad11300-44f6-11ea-90cf-ab0158509fc3', '外屏更换', '外屏碎（显示正常）', '更换外屏玻璃(质保180天)，严选品质非原厂授权物料', 0, '2020-02-01 21:29:21.000000');
INSERT INTO `fixitem` VALUES (3, 'f3c5ce30-44f3-11ea-9ea5-a13afdcd220f', 'b3a7b970-4508-11ea-a65c-7fb50013d473', '内屏故障', '内屏碎（液晶坏，显示异常，触摸不灵）', '更换总成(质保180天)（旧屏收回）严选品质非原厂授权物料', 0, '2020-02-01 23:37:06.000000');

-- ----------------------------
-- Table structure for fixitemsort
-- ----------------------------
DROP TABLE IF EXISTS `fixitemsort`;
CREATE TABLE `fixitemsort`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sort_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '分类id',
  `sort_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '分类名',
  `delete` tinyint(1) NOT NULL DEFAULT 0 COMMENT '删除标记',
  `createTime` datetime(6) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fixitemsort
-- ----------------------------
INSERT INTO `fixitemsort` VALUES (1, 'f3c5ce30-44f3-11ea-9ea5-a13afdcd220f', '屏幕维修', 0, '2020-02-01 21:08:34.000000');

-- ----------------------------
-- Table structure for fixmodel
-- ----------------------------
DROP TABLE IF EXISTS `fixmodel`;
CREATE TABLE `fixmodel`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `brand_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-品牌id',
  `model_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '机型id',
  `model_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '机型名称',
  `model_img` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '机型图片',
  `delete` tinyint(1) NOT NULL DEFAULT 0 COMMENT '删除标记',
  `createTime` datetime(6) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fbrandid`(`brand_id`) USING BTREE,
  CONSTRAINT `fbrandid` FOREIGN KEY (`brand_id`) REFERENCES `brandinfo` (`brandid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '维修机型' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fixmodel
-- ----------------------------
INSERT INTO `fixmodel` VALUES (2, '1', 'e7762160-458f-11ea-8fd1-91c7136505e4', 'REDMI K30', '/model/20202116435320635.png', 0, '2020-02-02 16:43:53.000000');

-- ----------------------------
-- Table structure for likes
-- ----------------------------
DROP TABLE IF EXISTS `likes`;
CREATE TABLE `likes`  (
  `commentid` int(11) NOT NULL,
  `userid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  INDEX `ccommentid`(`commentid`) USING BTREE,
  INDEX `cuserid`(`userid`) USING BTREE,
  CONSTRAINT `ccommentid` FOREIGN KEY (`commentid`) REFERENCES `comment_info` (`commentid`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `cuserid` FOREIGN KEY (`userid`) REFERENCES `userinfo` (`phone`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of likes
-- ----------------------------
INSERT INTO `likes` VALUES (1, '15359639480');
INSERT INTO `likes` VALUES (1, '18089008889');
INSERT INTO `likes` VALUES (2, '18089008889');

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
INSERT INTO `menu` VALUES (21, '维修操作', NULL, NULL, NULL);
INSERT INTO `menu` VALUES (22, '机型管理', '/fixModelManage', NULL, 21);
INSERT INTO `menu` VALUES (23, '维修项目管理', '/fixItemManage', NULL, 21);
INSERT INTO `menu` VALUES (25, '维修订单核验', '/fixOrder', NULL, 21);
INSERT INTO `menu` VALUES (26, '维修反馈(给客户)', '/feedback', NULL, 21);
INSERT INTO `menu` VALUES (27, '维修类型分类管理', '/fixSortManage', NULL, 21);
INSERT INTO `menu` VALUES (28, '客服', '/chat', NULL, NULL);

-- ----------------------------
-- Table structure for menu_user
-- ----------------------------
DROP TABLE IF EXISTS `menu_user`;
CREATE TABLE `menu_user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleid` int(11) NOT NULL COMMENT '主/外 键：角色id',
  `menuid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键：菜单id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 82 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

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
INSERT INTO `menu_user` VALUES (74, 7, '21');
INSERT INTO `menu_user` VALUES (75, 7, '22');
INSERT INTO `menu_user` VALUES (76, 7, '23');
INSERT INTO `menu_user` VALUES (81, 7, '28');
INSERT INTO `menu_user` VALUES (78, 7, '25');
INSERT INTO `menu_user` VALUES (79, 7, '26');
INSERT INTO `menu_user` VALUES (80, 7, '27');

-- ----------------------------
-- Table structure for model_item
-- ----------------------------
DROP TABLE IF EXISTS `model_item`;
CREATE TABLE `model_item`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `model_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键： 机型id',
  `item_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键： 项目id',
  `price` decimal(10, 2) NOT NULL COMMENT '对应价格',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of model_item
-- ----------------------------
INSERT INTO `model_item` VALUES (3, 'e7762160-458f-11ea-8fd1-91c7136505e4', 'b3a7b970-4508-11ea-a65c-7fb50013d473', 349.00);
INSERT INTO `model_item` VALUES (4, 'e7762160-458f-11ea-8fd1-91c7136505e4', 'dad11300-44f6-11ea-90cf-ab0158509fc3', 249.00);

-- ----------------------------
-- Table structure for order_shop
-- ----------------------------
DROP TABLE IF EXISTS `order_shop`;
CREATE TABLE `order_shop`  (
  `order_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键：订单id',
  `shop_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键: 商品id',
  `sku_id` int(11) NOT NULL COMMENT '外键: sku_stock id',
  `count` bigint(11) NOT NULL COMMENT '数量',
  `price` decimal(10, 2) NOT NULL COMMENT '价格',
  `createTime` datetime(0) NOT NULL COMMENT '添加时间',
  INDEX `osshopid`(`shop_id`) USING BTREE,
  INDEX `osorderid`(`order_id`) USING BTREE,
  INDEX `osskuid`(`sku_id`) USING BTREE,
  CONSTRAINT `osorderid` FOREIGN KEY (`order_id`) REFERENCES `orderinfo` (`order_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `osshopid` FOREIGN KEY (`shop_id`) REFERENCES `shopinfo` (`shop_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `osskuid` FOREIGN KEY (`sku_id`) REFERENCES `sku_stock` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_shop
-- ----------------------------
INSERT INTO `order_shop` VALUES ('0726b970-4bdf-11ea-8d51-418f7a0f19a1', '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 2, 1, 2499.00, '2020-02-10 16:26:25');
INSERT INTO `order_shop` VALUES ('3df09da0-4be3-11ea-ba2b-cdccb05ac571', '468f98e0-4bd3-11ea-a6ec-85b70d8de374', 9, 1, 7199.00, '2020-02-10 16:56:35');
INSERT INTO `order_shop` VALUES ('3df09da0-4be3-11ea-ba2b-cdccb05ac571', '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 2, 1, 2499.00, '2020-02-10 16:56:35');
INSERT INTO `order_shop` VALUES ('3df09da0-4be3-11ea-ba2b-cdccb05ac571', '8ab895d0-4750-11ea-9446-3f50e963da89', 5, 1, 2149.00, '2020-02-10 16:56:35');
INSERT INTO `order_shop` VALUES ('dcd72920-4c7e-11ea-9620-a1766ac73274', '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 2, 1, 2499.00, '2020-02-11 11:30:34');

-- ----------------------------
-- Table structure for orderinfo
-- ----------------------------
DROP TABLE IF EXISTS `orderinfo`;
CREATE TABLE `orderinfo`  (
  `order_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '订单号',
  `order_type` tinyint(1) NOT NULL COMMENT '订单类型，分为1->维修，0->商品交易',
  `order_date` datetime(6) NOT NULL ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '订单日期，时间戳',
  `order_state` tinyint(2) NOT NULL DEFAULT 1 COMMENT '状态，1.代付款，2.待维修，3.正在维修，41.待商家发货，42.待用户发货，5.待收货，6.待评价，7.完成。',
  `order_money` decimal(10, 0) NOT NULL COMMENT '商品总价格',
  `pay_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '支付信息id，可为空，待付款成功后',
  `user_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键-用户id，用户表外键',
  `isshow` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否在前端显示-是否删除，0删1不删',
  `addressId` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '外键-地址id',
  `true_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '实付款',
  PRIMARY KEY (`order_id`) USING BTREE,
  INDEX `pay_id`(`pay_id`) USING BTREE,
  INDEX `ouserid`(`user_id`) USING BTREE,
  INDEX `oaddress`(`addressId`) USING BTREE,
  CONSTRAINT `oaddressid` FOREIGN KEY (`addressId`) REFERENCES `address_info` (`addressid`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `ouserid` FOREIGN KEY (`user_id`) REFERENCES `userinfo` (`phone`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '订单信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orderinfo
-- ----------------------------
INSERT INTO `orderinfo` VALUES ('0726b970-4bdf-11ea-8d51-418f7a0f19a1', 0, '2020-02-10 16:26:25.000000', 1, 2499, NULL, '15359639480', 0, NULL, NULL);
INSERT INTO `orderinfo` VALUES ('3df09da0-4be3-11ea-ba2b-cdccb05ac571', 0, '2020-02-10 16:56:35.000000', 1, 11847, NULL, '15359639480', 0, NULL, NULL);
INSERT INTO `orderinfo` VALUES ('dcd72920-4c7e-11ea-9620-a1766ac73274', 0, '2020-02-11 11:30:34.000000', 1, 2499, NULL, '15359639480', 0, NULL, NULL);

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
INSERT INTO `roleuser` VALUES (1, '1580886692');
INSERT INTO `roleuser` VALUES (7, '1580038654');

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
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of shop_sku_spec
-- ----------------------------
INSERT INTO `shop_sku_spec` VALUES (14, '598ba060-4750-11ea-9446-3f50e963da89', 100.00, 0, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9');
INSERT INTO `shop_sku_spec` VALUES (15, '5986be60-4750-11ea-9446-3f50e963da89', 200.00, 0, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9');
INSERT INTO `shop_sku_spec` VALUES (16, '5986e570-4750-11ea-9446-3f50e963da89', 300.00, 0, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9');
INSERT INTO `shop_sku_spec` VALUES (17, '598b7950-4750-11ea-9446-3f50e963da89', 0.00, 0, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9');
INSERT INTO `shop_sku_spec` VALUES (22, '6d8ced00-482a-11ea-8dfd-c190f54712fe', 0.00, 0, '8ab895d0-4750-11ea-9446-3f50e963da89');
INSERT INTO `shop_sku_spec` VALUES (23, '6d8d3b20-482a-11ea-8dfd-c190f54712fe', 50.00, 0, '8ab895d0-4750-11ea-9446-3f50e963da89');
INSERT INTO `shop_sku_spec` VALUES (24, '6d8cc5f0-482a-11ea-8dfd-c190f54712fe', 300.00, 0, '8ab895d0-4750-11ea-9446-3f50e963da89');
INSERT INTO `shop_sku_spec` VALUES (25, '6d8c9ee0-482a-11ea-8dfd-c190f54712fe', 150.00, 0, '8ab895d0-4750-11ea-9446-3f50e963da89');
INSERT INTO `shop_sku_spec` VALUES (26, '46b7ba50-4bd3-11ea-a6ec-85b70d8de374', 200.00, 0, '468f98e0-4bd3-11ea-a6ec-85b70d8de374');
INSERT INTO `shop_sku_spec` VALUES (27, '46b7e160-4bd3-11ea-a6ec-85b70d8de374', 0.00, 0, '468f98e0-4bd3-11ea-a6ec-85b70d8de374');

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
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of shop_sku_spec_value
-- ----------------------------
INSERT INTO `shop_sku_spec_value` VALUES (14, 'e9fca390-437e-11ea-a8c9-27ce6b8279d2', '598ba060-4750-11ea-9446-3f50e963da89', '新年红', '2020-02-04 21:15:01.000000');
INSERT INTO `shop_sku_spec_value` VALUES (15, 'e19a7d80-437e-11ea-a8c9-27ce6b8279d2', '5986be60-4750-11ea-9446-3f50e963da89', '64G', '2020-02-04 21:15:01.000000');
INSERT INTO `shop_sku_spec_value` VALUES (16, 'e19a7d80-437e-11ea-a8c9-27ce6b8279d2', '5986e570-4750-11ea-9446-3f50e963da89', '128G', '2020-02-04 21:15:01.000000');
INSERT INTO `shop_sku_spec_value` VALUES (17, 'e9fca390-437e-11ea-a8c9-27ce6b8279d2', '598b7950-4750-11ea-9446-3f50e963da89', '幻彩紫', '2020-02-04 21:15:01.000000');
INSERT INTO `shop_sku_spec_value` VALUES (22, 'e9fca390-437e-11ea-a8c9-27ce6b8279d2', '6d8ced00-482a-11ea-8dfd-c190f54712fe', '紫色', '2020-02-05 23:16:05.000000');
INSERT INTO `shop_sku_spec_value` VALUES (23, 'e9fca390-437e-11ea-a8c9-27ce6b8279d2', '6d8d3b20-482a-11ea-8dfd-c190f54712fe', '红色', '2020-02-05 23:16:05.000000');
INSERT INTO `shop_sku_spec_value` VALUES (24, 'e19a7d80-437e-11ea-a8c9-27ce6b8279d2', '6d8cc5f0-482a-11ea-8dfd-c190f54712fe', '128G', '2020-02-05 23:16:05.000000');
INSERT INTO `shop_sku_spec_value` VALUES (25, 'e19a7d80-437e-11ea-a8c9-27ce6b8279d2', '6d8c9ee0-482a-11ea-8dfd-c190f54712fe', '64G', '2020-02-05 23:16:05.000000');
INSERT INTO `shop_sku_spec_value` VALUES (26, 'e19a7d80-437e-11ea-a8c9-27ce6b8279d2', '46b7ba50-4bd3-11ea-a6ec-85b70d8de374', '16G', '2020-02-10 15:02:18.000000');
INSERT INTO `shop_sku_spec_value` VALUES (27, 'e9fca390-437e-11ea-a8c9-27ce6b8279d2', '46b7e160-4bd3-11ea-a6ec-85b70d8de374', '红色', '2020-02-10 15:02:18.000000');

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
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

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
) ENGINE = InnoDB AUTO_INCREMENT = 45 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of shop_spec_value
-- ----------------------------
INSERT INTO `shop_spec_value` VALUES (43, 'f4d065e0-437e-11ea-a8c9-27ce6b8279d2', '4', '2020-02-05 23:16:05.000000', '6d8c50c0-482a-11ea-8dfd-c190f54712fe');
INSERT INTO `shop_spec_value` VALUES (44, 'fd61d950-437e-11ea-a8c9-27ce6b8279d2', 'i7 7700', '2020-02-10 15:02:18.000000', '46b59770-4bd3-11ea-a6ec-85b70d8de374');

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
) ENGINE = InnoDB AUTO_INCREMENT = 45 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of shop_spu_spec
-- ----------------------------
INSERT INTO `shop_spu_spec` VALUES (43, '8ab895d0-4750-11ea-9446-3f50e963da89', 'f4d065e0-437e-11ea-a8c9-27ce6b8279d2', '2020-02-05 23:16:05.000000', '6d8c50c0-482a-11ea-8dfd-c190f54712fe');
INSERT INTO `shop_spu_spec` VALUES (44, '468f98e0-4bd3-11ea-a6ec-85b70d8de374', 'fd61d950-437e-11ea-a8c9-27ce6b8279d2', '2020-02-10 15:02:18.000000', '46b59770-4bd3-11ea-a6ec-85b70d8de374');

-- ----------------------------
-- Table structure for shopcar
-- ----------------------------
DROP TABLE IF EXISTS `shopcar`;
CREATE TABLE `shopcar`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shopid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键： 商品id',
  `sku_id` int(11) NOT NULL COMMENT '外键: 属性id',
  `userid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键: 用户id',
  `count` int(11) NOT NULL COMMENT '件数',
  `price` decimal(10, 2) NOT NULL COMMENT '价格',
  `state` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0->在购物车中，1->已下单，2->已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `scskuid`(`sku_id`) USING BTREE,
  INDEX `scshopid`(`shopid`) USING BTREE,
  INDEX `scuserid`(`userid`) USING BTREE,
  CONSTRAINT `scshopid` FOREIGN KEY (`shopid`) REFERENCES `shopinfo` (`shop_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `scskuid` FOREIGN KEY (`sku_id`) REFERENCES `sku_stock` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `scuserid` FOREIGN KEY (`userid`) REFERENCES `userinfo` (`phone`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of shopcar
-- ----------------------------
INSERT INTO `shopcar` VALUES (19, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 2, '15359639480', 1, 2499.00, 1);
INSERT INTO `shopcar` VALUES (20, '468f98e0-4bd3-11ea-a6ec-85b70d8de374', 9, '15359639480', 1, 7199.00, 1);
INSERT INTO `shopcar` VALUES (21, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 2, '15359639480', 1, 2499.00, 1);
INSERT INTO `shopcar` VALUES (22, '468f98e0-4bd3-11ea-a6ec-85b70d8de374', 9, '15359639480', 1, 7199.00, 1);
INSERT INTO `shopcar` VALUES (23, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 2, '15359639480', 1, 2499.00, 1);
INSERT INTO `shopcar` VALUES (24, '8ab895d0-4750-11ea-9446-3f50e963da89', 5, '15359639480', 1, 2149.00, 1);
INSERT INTO `shopcar` VALUES (25, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 2, '15359639480', 1, 2499.00, 1);

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
) ENGINE = InnoDB AUTO_INCREMENT = 55 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of shopimg
-- ----------------------------
INSERT INTO `shopimg` VALUES (38, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', '/shop/2020232115131686.png', '2020-02-04 21:15:01.000000');
INSERT INTO `shopimg` VALUES (39, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', '/shop/2020232115130682.png', '2020-02-04 21:15:01.000000');
INSERT INTO `shopimg` VALUES (40, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', '/shop/2020232115131043.png', '2020-02-04 21:15:01.000000');
INSERT INTO `shopimg` VALUES (49, '8ab895d0-4750-11ea-9446-3f50e963da89', '/shop/202024231651942.png', '2020-02-05 23:16:05.000000');
INSERT INTO `shopimg` VALUES (50, '8ab895d0-4750-11ea-9446-3f50e963da89', '/shop/2020242316519191.png', '2020-02-05 23:16:05.000000');
INSERT INTO `shopimg` VALUES (51, '8ab895d0-4750-11ea-9446-3f50e963da89', '/shop/2020242316519299.png', '2020-02-05 23:16:05.000000');
INSERT INTO `shopimg` VALUES (52, '8ab895d0-4750-11ea-9446-3f50e963da89', '/shop/2020242316519570.png', '2020-02-05 23:16:05.000000');
INSERT INTO `shopimg` VALUES (53, '468f98e0-4bd3-11ea-a6ec-85b70d8de374', '/shop/2020221521846488.png', '2020-02-10 15:02:18.000000');
INSERT INTO `shopimg` VALUES (54, '468f98e0-4bd3-11ea-a6ec-85b70d8de374', '/shop/2020221521846918.png', '2020-02-10 15:02:18.000000');

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
INSERT INTO `shopinfo` VALUES ('468f98e0-4bd3-11ea-a6ec-85b70d8de374', '小米Pro增强版 2020款 15.6英寸金属轻薄(第十代英特尔酷睿i7-10510U 16G 1TB PCIE SSD MX250 2G独显 100%sRGB 指纹识别 Office) 游戏 灰色', '【11号电脑节抢购价6799元】【Pro旗舰机】【100%sRGB高色域屏幕】【卓越性能调校】全新第十代I7处理器、16G大内存', 2, 6999.00, '1', '2020-02-10 15:02:18.000000', 0, '', 0);
INSERT INTO `shopinfo` VALUES ('6dd4bba0-441d-11ea-bfbd-812f243dd1f9', '小米CC9 Pro 1亿像素 五摄四闪 10倍混合光学变焦 5260mAh 屏下指纹 魔法绿镜 8GB+128GB 游戏智能拍照手机', '【春节好礼带回家！限时白条6期免息，赠1TB小米云空间1年使用权】', 1, 2199.00, '1', '2020-01-31 19:32:57.000000', 0, 'undefined', 0);
INSERT INTO `shopinfo` VALUES ('8ab895d0-4750-11ea-9446-3f50e963da89', 'Redmi K30 5G双模 120Hz流速屏 骁龙765G 30W快充 8GB+128GB 深海微光 游戏智能手机 小米 REDMI', '红米手机', 1, 1999.00, '1', '2020-02-04 21:16:23.000000', 0, 'undefined', 0);

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
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sku_stock
-- ----------------------------
INSERT INTO `sku_stock` VALUES (1, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 2399.00, 100, '{\"内存\":\"64G\",\"颜色\":\"幻彩紫\"}');
INSERT INTO `sku_stock` VALUES (2, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 2499.00, 100, '{\"内存\":\"64G\",\"颜色\":\"新年红\"}');
INSERT INTO `sku_stock` VALUES (3, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 2499.00, 100, '{\"内存\":\"128G\",\"颜色\":\"幻彩紫\"}');
INSERT INTO `sku_stock` VALUES (4, '6dd4bba0-441d-11ea-bfbd-812f243dd1f9', 2599.00, 100, '{\"内存\":\"128G\",\"颜色\":\"新年红\"}');
INSERT INTO `sku_stock` VALUES (5, '8ab895d0-4750-11ea-9446-3f50e963da89', 2149.00, 100, '{\"内存\":\"64G\",\"颜色\":\"紫色\"}');
INSERT INTO `sku_stock` VALUES (6, '8ab895d0-4750-11ea-9446-3f50e963da89', 2199.00, 100, '{\"内存\":\"64G\",\"颜色\":\"红色\"}');
INSERT INTO `sku_stock` VALUES (7, '8ab895d0-4750-11ea-9446-3f50e963da89', 2299.00, 100, '{\"内存\":\"128G\",\"颜色\":\"紫色\"}');
INSERT INTO `sku_stock` VALUES (8, '8ab895d0-4750-11ea-9446-3f50e963da89', 2349.00, 100, '{\"内存\":\"128G\",\"颜色\":\"红色\"}');
INSERT INTO `sku_stock` VALUES (9, '468f98e0-4bd3-11ea-a6ec-85b70d8de374', 7199.00, 100, '{\"内存\":\"16G\",\"颜色\":\"红色\"}');

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
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '商品分类表\r\n' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sortinfo
-- ----------------------------
INSERT INTO `sortinfo` VALUES (1, '手机', 'PHONE', 1, '2020-01-02 21:49:46.717000');
INSERT INTO `sortinfo` VALUES (2, '电脑', 'COMPUTER', 1, '2020-01-28 22:35:12.000000');
INSERT INTO `sortinfo` VALUES (3, '耳机', 'EARPHONE', 1, '2020-02-10 14:59:40.000000');

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
  `coupon_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键:优惠券id',
  `user_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '外键:用户id',
  `get_type` tinyint(1) NOT NULL DEFAULT 1 COMMENT '获取类型：0->后台赠送；1->主动获取',
  `createTime` datetime(6) NOT NULL COMMENT '获取时间',
  `use_status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '使用状态: 0->未使用 1-> 已使用  2-> 已过期',
  `use_time` datetime(6) NULL DEFAULT NULL COMMENT '使用时间',
  `order_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '外键:订单id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `couponcid`(`coupon_id`) USING BTREE,
  INDEX `couserid`(`user_id`) USING BTREE,
  INDEX `couponorderid`(`order_id`) USING BTREE,
  CONSTRAINT `couponorderid` FOREIGN KEY (`order_id`) REFERENCES `orderinfo` (`order_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `couserid` FOREIGN KEY (`user_id`) REFERENCES `userinfo` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of usercoupon
-- ----------------------------
INSERT INTO `usercoupon` VALUES (18, '24b6b330-4bd2-11ea-a6ec-85b70d8de374', '1580886692', 1, '2020-02-10 14:54:27.000000', 0, NULL, NULL);
INSERT INTO `usercoupon` VALUES (19, '0c367370-4bcf-11ea-a30a-657359835868', '1580886692', 1, '2020-02-10 14:58:59.000000', 0, NULL, NULL);

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
INSERT INTO `userinfo` VALUES ('1580038654', 'ke', 1, NULL, NULL, '18089008889', NULL, NULL, 'e10adc3949ba59abbe56e057f20f883e', NULL, 0.00, '2020-01-26 17:55:42.000000', 2, NULL, 0);
INSERT INTO `userinfo` VALUES ('1580886692', 'KESHAOYE', 1, NULL, NULL, '15359639480', NULL, NULL, '4c17db7e2f293c24b34d406ad2012d46', NULL, 0.00, '2020-02-05 15:10:58.000000', 2, NULL, 0);

-- ----------------------------
-- Procedure structure for addshopcar
-- ----------------------------
DROP PROCEDURE IF EXISTS `addshopcar`;
delimiter ;;
CREATE PROCEDURE `addshopcar`(IN shop_id VARCHAR(255),
     IN sku_id INT(11),
     IN user_id VARCHAR(255),
     IN counts INT(11))
begin
    DECLARE price DECIMAL(10,2);
		DECLARE count INT DEFAULT 0;
		select count(*) INTO count from shopcar s where s.userid = user_id and s.shopid = shop_id and s.sku_id = sku_id and s.state = 0;
    select s.price INTO price from sku_stock s,shopinfo si where si.shop_id = shop_id and s.id = sku_id and s.shop_id = si.shop_id;
		IF count > 0 THEN
		UPDATE shopcar s SET s.count = s.count + counts,s.price = s.price + price where userid = user_id and shopid = shop_id and sku_id = sku_id;
		ELSE
    INSERT INTO shopcar(shopid, sku_id, userid, count, price) VALUES(shop_id, sku_id, user_id, counts, price);
		end IF;
    END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for couponshop
-- ----------------------------
DROP PROCEDURE IF EXISTS `couponshop`;
delimiter ;;
CREATE PROCEDURE `couponshop`(IN coupon_id VARCHAR(255),
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
        insert into coupon(coupon_id,amount,per_limit,min_price,start_time,over_time,use_type,note,public_count,get_date) values(coupon_id,amount,per_limit,min_price,start_time,over_time,use_type,note,public_count,get_date);
        insert into coupon_shop(coupon_id,shop_id) VALUES(coupon_id,shop_id);
        END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for couponsort
-- ----------------------------
DROP PROCEDURE IF EXISTS `couponsort`;
delimiter ;;
CREATE PROCEDURE `couponsort`(IN coupon_id VARCHAR(255),
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
        insert into coupon(coupon_id,amount,per_limit,min_price,start_time,over_time,use_type,note,public_count,get_date) values(coupon_id,amount,per_limit,min_price,start_time,over_time,use_type,note,public_count,get_date);
        insert into coupon_sort(coupon_id,sort_id) VALUES(coupon_id,sort_id);
        END
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
-- Procedure structure for pr_convert_dbtab_utf8
-- ----------------------------
DROP PROCEDURE IF EXISTS `pr_convert_dbtab_utf8`;
delimiter ;;
CREATE PROCEDURE `pr_convert_dbtab_utf8`(IN dbName varchar(100))
BEGIN

    declare stop int default 0;

    declare tabCount int default 0;

    declare strSql varchar(1000);

    declare name varchar(100);

    declare cur CURSOR FOR select table_name from information_schema.tables where table_schema=dbName;

    declare CONTINUE HANDLER FOR SQLSTATE '02000' SET stop = null;

    OPEN cur;

    FETCH cur INTO name;

    WHILE ( stop is not null) DO

        set tabCount=tabCount+1;

        set strSql = concat('alter table `',name,'` convert to character SET utf8  COLLATE utf8_general_ci');

        set @sql1 = strSql;

        prepare stmt_p from @sql1;

        execute stmt_p;

        FETCH cur INTO name;

    END WHILE;

    CLOSE cur;

    SELECT concat('table: ', tabCount);

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
    SELECT roleid INTO rid FROM roleuser r where r.userid = userid;
    SELECT * FROM role where id = rid;
    END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for usergetcoupon
-- ----------------------------
DROP PROCEDURE IF EXISTS `usergetcoupon`;
delimiter ;;
CREATE PROCEDURE `usergetcoupon`(IN phone VARCHAR(20),
         IN couponid VARCHAR(255))
BEGIN
        DECLARE userid VARCHAR(255);
        DECLARE rcount INT;
        select u.user_id INTO userid from userinfo u where u.phone = phone;
        SELECT c.receive_count INTO rcount from coupon c where c.coupon_id = couponid;
        UPDATE coupon c set c.receive_count = rcount + 1 where c.coupon_id = couponid;
        INSERT INTO usercoupon(coupon_id,user_id,createTime) VALUES(couponid,userid,NOW());
        END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
