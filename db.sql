CREATE DATABASE IF NOT EXISTS DB_FINDX default character set utf8 COLLATE utf8_general_ci;
USE DB_FINDX;

-- { id: 'eebd85f3a23f79b46aba0cd4589e30f8',
--   name: 'aceway2011',
--   pic: 'http://tp2.sinaimg.cn/2136734945/50/5721915943/1',
--   sex: 0,
--   age: 0,
--   serverInfo: { sgId: 0, startServerId: 1 } }

CREATE TABLE IF NOT EXISTS `t_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) NOT NULL,
  `channel` varchar(16) NOT NULL COMMENT 'Nest, qq, qzone, sinaweibo...',
  `name` varchar(64) NOT NULL COMMENT '帐号名',
  `pic` varchar(128) NOT NULL DEFAULT '无' COMMENT '头像网址',
  `sex` varchar(8) NOT NULL DEFAULT '未知' COMMENT '性别',
  `age` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '年龄',
  `vip` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '0表示不是VIP, 数字表示开通时的金额，单位元',
  `stage` int(10) unsigned NOT NULL DEFAULT 0 COMMENT '已经玩到的最高关卡',
  `reg_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '首次进入时间',
  `login_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '最后一次登录时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`user_id`, `channel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
